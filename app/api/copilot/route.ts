import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getProfileRole } from "@/lib/auth/profile";
import { getCopilotRootMenu, runCopilotChoice } from "@/lib/copilot/gemini";
import { findOptionByChoice, ROOT_MENU } from "@/lib/copilot/menu";
import { mapMessageToAction } from "@/lib/copilot/mapMessage";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const role = await getProfileRole(user.id, supabase);
  if (role !== "admin") {
    return { error: NextResponse.json({ error: "Admin only" }, { status: 403 }) };
  }

  return { supabase, user };
}

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  return NextResponse.json(getCopilotRootMenu());
}

export async function POST(req: Request) {
  try {
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

    if (!action && body.message?.trim()) {
      action = mapMessageToAction(body.message) ?? undefined;
    }

    if (!action?.trim()) {
      if (body.message?.trim()) {
        return NextResponse.json({
          answer:
            "I didn't recognize that — pick A, B, C, or D, or try “summarize today” or “inactive businesses”.",
          ...getCopilotRootMenu(),
          toolUsed: null,
        });
      }
      return NextResponse.json({ error: "action or choice required" }, { status: 400 });
    }

    await supabase.from("copilot_messages").insert({
      user_id: user.id,
      role: "user",
      content: body.message ?? (body.choice ? `Choice ${body.choice}: ${action}` : action),
    });

    const payload = await runCopilotChoice(user.id, action);

    await supabase.from("copilot_messages").insert({
      user_id: user.id,
      role: "assistant",
      content: payload.answer ?? "",
      tool_calls: payload.toolUsed ? { tool: payload.toolUsed } : null,
    });

    return NextResponse.json(payload);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Copilot failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
