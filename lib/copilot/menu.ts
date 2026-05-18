import type { CopilotAction, CopilotApiPayload, CopilotOption } from "./types";

/** Root menu — served without calling Gemini (saves free-tier quota). */
export const ROOT_MENU: CopilotApiPayload = {
  question: "What would you like to check?",
  options: [
    {
      id: "A",
      label: "Today's performance (members, signals, redemptions)",
      action: "summarizeToday",
    },
    {
      id: "B",
      label: "Businesses that haven't updated in 24 hours",
      action: "suggestBusinessesToContact",
    },
    {
      id: "C",
      label: "List active businesses",
      action: "getBusinesses",
    },
    {
      id: "D",
      label: "Quick network health snapshot",
      action: "getDashboardSummary",
    },
  ],
};

export function findOptionByChoice(
  options: CopilotOption[],
  choice: string,
): CopilotOption | undefined {
  const id = choice.trim().toUpperCase();
  if (!["A", "B", "C", "D"].includes(id)) return undefined;
  return options.find((o) => o.id === id);
}

export function isCopilotAction(value: string): value is CopilotAction {
  return (
    value === "summarizeToday" ||
    value === "suggestBusinessesToContact" ||
    value === "getBusinesses" ||
    value === "getDashboardSummary"
  );
}
