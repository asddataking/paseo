"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const SUGGESTIONS = [
  "Summarize today's performance",
  "Which businesses have not updated in 24 hours?",
  "Show me active businesses",
  "What should I do tomorrow?",
];

export function CopilotChat() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    setLoading(true);
    setMessages((m) => [...m, { role: "user", content: text }]);
    setInput("");

    try {
      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Request failed");
      setMessages((m) => [...m, { role: "assistant", content: data.text }]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: e instanceof Error ? e.message : "Something went wrong.",
        },
      ]);
    }
    setLoading(false);
  }

  return (
    <Card className="flex h-[min(560px,70vh)] flex-col">
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 && (
          <p className="text-sm text-stone-500">
            Ask about network health, inactive businesses, or today&apos;s ops.
          </p>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`rounded-xl px-3 py-2 text-sm ${
              m.role === "user"
                ? "ml-8 bg-[var(--accent-gold)]/20"
                : "mr-8 bg-[var(--sand)]/50"
            }`}
          >
            {m.content}
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 border-t border-[var(--sand)] p-3">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => send(s)}
            className="rounded-full bg-[var(--sand)]/60 px-3 py-1 text-xs text-stone-700 hover:bg-[var(--sand)]"
          >
            {s}
          </button>
        ))}
      </div>
      <form
        className="flex gap-2 border-t border-[var(--sand)] p-3"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Copilot…"
          className="flex-1 rounded-xl border border-[var(--sand)] px-3 py-2 text-sm"
        />
        <Button type="submit" disabled={loading} size="sm">
          {loading ? "…" : "Send"}
        </Button>
      </form>
    </Card>
  );
}
