import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { runCopilotChat } from "@/lib/copilot/gemini";

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  const { message } = (await req.json()) as { message?: string };
  if (!message?.trim()) {
    return NextResponse.json({ error: "Message required" }, { status: 400 });
  }

  await supabase.from("copilot_messages").insert({
    user_id: user.id,
    role: "user",
    content: message,
  });

  const { text, toolUsed } = await runCopilotChat(message);

  await supabase.from("copilot_messages").insert({
    user_id: user.id,
    role: "assistant",
    content: text,
    tool_calls: toolUsed ? { tool: toolUsed } : null,
  });

  return NextResponse.json({ text, toolUsed });
}
