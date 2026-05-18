"use client";

import type { CopilotOption } from "@/lib/copilot/types";

type Props = {
  question: string;
  options: CopilotOption[];
  answer: string | null;
  loading: boolean;
  error: string | null;
  onChoose: (option: CopilotOption) => void;
  onReload?: () => void;
  compact?: boolean;
};

export function CopilotChoices({
  question,
  options,
  answer,
  loading,
  error,
  onChoose,
  onReload,
  compact = false,
}: Props) {
  return (
    <div className="space-y-3">
      {answer && (
        <p
          className={`rounded-xl bg-white/80 text-stone-700 ${compact ? "p-2.5 text-xs" : "p-3 text-sm"}`}
        >
          {answer}
        </p>
      )}

      <p className={`font-medium text-stone-800 ${compact ? "text-xs" : "text-sm"}`}>
        {question}
      </p>

      {error && <p className="text-xs text-amber-800">{error}</p>}

      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((opt) => (
          <button
            key={`${opt.id}-${opt.action}`}
            type="button"
            disabled={loading}
            onClick={() => onChoose(opt)}
            className={`flex items-start gap-2 rounded-xl border border-violet-100 bg-white text-left shadow-sm transition hover:border-violet-300 disabled:opacity-50 ${compact ? "px-2.5 py-2" : "px-3 py-2.5"}`}
          >
            <span
              className={`flex shrink-0 items-center justify-center rounded-lg bg-violet-100 font-semibold text-violet-700 ${compact ? "h-6 w-6 text-xs" : "h-7 w-7 text-sm"}`}
            >
              {opt.id}
            </span>
            <span
              className={`text-stone-700 ${compact ? "text-[11px] leading-snug" : "text-xs leading-snug"}`}
            >
              {opt.label}
            </span>
          </button>
        ))}
      </div>

      {onReload && (
        <button
          type="button"
          onClick={onReload}
          disabled={loading}
          className="text-xs text-violet-600 underline disabled:opacity-50"
        >
          Back to main menu
        </button>
      )}

      {loading && <p className="text-xs text-stone-500">Thinking… (1 API call)</p>}
    </div>
  );
}
