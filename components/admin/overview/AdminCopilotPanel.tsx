"use client";

import { Sparkles, Send } from "lucide-react";
import { useState } from "react";

const PROMPTS = [
  "Summarize today's performance",
  "Which businesses haven't updated in 24h?",
  "Show me top opportunities tonight",
  "Draft a push notification for low-wait family activities",
];

export function AdminCopilotPanel({ compact = false }: { compact?: boolean }) {
  const [input, setInput] = useState("");
  const [reply, setReply] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    setLoading(true);
    setReply(null);
    try {
      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      setReply(data.text ?? data.error ?? "No response");
    } catch {
      setReply("Could not reach Copilot. Check GEMINI_API_KEY and admin login.");
    }
    setLoading(false);
    setInput("");
  }

  return (
    <div className="rounded-2xl border border-violet-200/60 bg-gradient-to-b from-violet-50/80 to-white p-4 shadow-[var(--card-shadow)]">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
          <Sparkles className="h-4 w-4" />
        </span>
        <div>
          <h2 className="text-base font-semibold">Paseo Copilot</h2>
          <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-medium text-violet-700">
            Beta
          </span>
        </div>
      </div>

      <div className={`mt-3 flex flex-wrap gap-2 ${compact ? "" : ""}`}>
        {PROMPTS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => send(p)}
            className="rounded-full border border-violet-100 bg-white px-3 py-1.5 text-left text-xs text-stone-700 shadow-sm hover:border-violet-200"
          >
            {p}
          </button>
        ))}
      </div>

      {reply && (
        <p className="mt-3 rounded-xl bg-white/80 p-3 text-sm text-stone-700">{reply}</p>
      )}

      <form
        className="mt-4 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Copilot anything…"
          className="flex-1 rounded-xl border border-violet-100 bg-white px-3 py-2.5 text-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
