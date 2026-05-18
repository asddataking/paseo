"use client";

import { Card } from "@/components/ui/card";
import { CopilotChoices } from "@/components/admin/CopilotChoices";
import { useCopilot } from "@/components/admin/useCopilot";

export function CopilotChat() {
  const { question, options, answer, loading, error, choose, reload } = useCopilot();

  return (
    <Card className="flex h-[min(560px,70vh)] flex-col p-4">
      <p className="mb-3 text-sm text-stone-500">
        Pick A, B, C, or D — one Gemini call per answer (free-tier friendly).
      </p>
      <div className="flex-1 overflow-y-auto">
        <CopilotChoices
          question={question}
          options={options}
          answer={answer}
          loading={loading}
          error={error}
          onChoose={choose}
          onReload={reload}
        />
      </div>
    </Card>
  );
}
