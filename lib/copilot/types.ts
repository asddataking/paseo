import { z } from "zod";

export const copilotChoiceIds = ["A", "B", "C", "D"] as const;
export type CopilotChoiceId = (typeof copilotChoiceIds)[number];

export const copilotActions = [
  "summarizeToday",
  "suggestBusinessesToContact",
  "getBusinesses",
  "getDashboardSummary",
] as const;
export type CopilotAction = (typeof copilotActions)[number];

export const copilotOptionSchema = z.object({
  id: z.enum(["A", "B", "C", "D"]),
  label: z.string().max(120),
  action: z.enum(copilotActions),
});

export const copilotResponseSchema = z.object({
  answer: z.string().max(600),
  question: z.string().max(200),
  options: z.array(copilotOptionSchema).length(4),
});

export type CopilotOption = z.infer<typeof copilotOptionSchema>;
export type CopilotResponse = z.infer<typeof copilotResponseSchema>;

export type CopilotApiPayload = {
  question: string;
  options: CopilotOption[];
  answer?: string;
  toolUsed?: string | null;
  rateLimit?: { retryAfterSeconds: number };
};
