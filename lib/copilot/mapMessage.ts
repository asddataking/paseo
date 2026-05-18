import type { CopilotAction } from "./types";

/** Map free-text admin prompts to a structured Copilot action. */
export function mapMessageToAction(message: string): CopilotAction | null {
  const lower = message.toLowerCase();

  if (
    lower.includes("summarize") ||
    lower.includes("today") ||
    lower.includes("performance") ||
    lower.includes("dashboard")
  ) {
    return "summarizeToday";
  }
  if (
    lower.includes("inactive") ||
    lower.includes("haven't updated") ||
    lower.includes("hasn't updated") ||
    lower.includes("not updated") ||
    lower.includes("contact") ||
    lower.includes("24h") ||
    lower.includes("24 h")
  ) {
    return "suggestBusinessesToContact";
  }
  if (
    lower.includes("business") ||
    lower.includes("list") ||
    lower.includes("network")
  ) {
    return "getBusinesses";
  }
  if (lower.includes("health") || lower.includes("snapshot") || lower.includes("kpi")) {
    return "getDashboardSummary";
  }

  return null;
}
