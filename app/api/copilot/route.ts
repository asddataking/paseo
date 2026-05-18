import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCopilotRootMenu, runCopilotChoice } from "@/lib/copilot/gemini";
import { findOptionByChoice, ROOT_MENU } from "@/lib/copilot/menu";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return { error: NextResponse.json({ error: "Admin only" }, { status: 403 }) };
  }

  return { supabase, user };
}

/** Root A/B/C/D menu — no Gemini call (free-tier friendly). */
export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  return NextResponse.json(getCopilotRootMenu());
}

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;
  const { supabase, user } = auth;

  const body = (await req.json()) as {
    action?: string;
    choice?: string;
    message?: string;
  };

  let action = body.action;

  if (!action && body.choice) {
    const fromRoot = findOptionByChoice(ROOT_MENU.options, body.choice);
    action = fromRoot?.action;
  }

  if (!action?.trim()) {
    if (body.message?.trim()) {
      return NextResponse.json({
        answer:
          "Copilot uses multiple-choice to save API quota. Pick A, B, C, or D below.",
        ...getCopilotRootMenu(),
        toolUsed: null,
      });
    }
    return NextResponse.json({ error: "action or choice required" }, { status: 400 });
  }

  await supabase.from("copilot_messages").insert({
    user_id: user.id,
    role: "user",
    content: body.choice ? `Choice ${body.choice}: ${action}` : action,
  });

  const payload = await runCopilotChoice(user.id, action);

  await supabase.from("copilot_messages").insert({
    user_id: user.id,
    role: "assistant",
    content: payload.answer ?? "",
    tool_calls: payload.toolUsed ? { tool: payload.toolUsed } : null,
  });

  return NextResponse.json(payload);
}
