"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CopilotApiPayload, CopilotOption } from "@/lib/copilot/types";

const CLIENT_COOLDOWN_MS = 4000;

export function useCopilot() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<CopilotOption[]>([]);
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastCall = useRef(0);

  const applyPayload = useCallback((data: CopilotApiPayload) => {
    setQuestion(data.question);
    setOptions(data.options);
    if (data.answer) setAnswer(data.answer);
    if (data.rateLimit?.retryAfterSeconds) {
      setError(`Slow down — try again in ${data.rateLimit.retryAfterSeconds}s.`);
    } else {
      setError(null);
    }
  }, []);

  const loadMenu = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/copilot");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to load menu");
      setAnswer(null);
      applyPayload(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load Copilot");
    }
    setLoading(false);
  }, [applyPayload]);

  useEffect(() => {
    loadMenu();
  }, [loadMenu]);

  const choose = useCallback(
    async (option: CopilotOption) => {
      const now = Date.now();
      if (now - lastCall.current < CLIENT_COOLDOWN_MS) {
        setError(`Please wait ${Math.ceil((CLIENT_COOLDOWN_MS - (now - lastCall.current)) / 1000)}s between questions.`);
        return;
      }
      if (loading) return;

      lastCall.current = now;
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/copilot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ choice: option.id, action: option.action }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(
            data.error ??
              data.answer ??
              `Request failed (${res.status})`,
          );
        }
        applyPayload(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong");
      }
      setLoading(false);
    },
    [applyPayload, loading],
  );

  return {
    question,
    options,
    answer,
    loading,
    error,
    choose,
    reload: loadMenu,
  };
}
