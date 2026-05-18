"use client";

import { Sparkles } from "lucide-react";
import { CopilotChoices } from "@/components/admin/CopilotChoices";
import { useCopilot } from "@/components/admin/useCopilot";

export function AdminCopilotPanel({ compact = false }: { compact?: boolean }) {
  const { question, options, answer, loading, error, choose, reload } = useCopilot();

  return (
    <div className="rounded-2xl border border-violet-200/60 bg-gradient-to-b from-violet-50/80 to-white p-4 shadow-[var(--card-shadow)]">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
          <Sparkles className="h-4 w-4" />
        </span>
        <div>
          <h2 className="text-base font-semibold">Paseo Copilot</h2>
          <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-medium text-violet-700">
            Gemini 3 Flash · Q&A
          </span>
        </div>
      </div>

      <CopilotChoices
        question={question}
        options={options}
        answer={answer}
        loading={loading}
        error={error}
        onChoose={choose}
        onReload={reload}
        compact={compact}
      />
    </div>
  );
}
