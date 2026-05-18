import { GoogleGenerativeAI } from "@google/generative-ai";
import { copilotTools, type CopilotToolName } from "./tools";
import {
  copilotResponseSchema,
  type CopilotAction,
  type CopilotApiPayload,
  type CopilotOption,
} from "./types";
import { ROOT_MENU, isCopilotAction } from "./menu";
import { checkCopilotRateLimit } from "./rateLimit";

const MODEL = process.env.GEMINI_MODEL ?? "gemini-3-flash-preview";

const ACTION_TO_TOOL: Record<CopilotAction, CopilotToolName> = {
  summarizeToday: "summarizeToday",
  suggestBusinessesToContact: "suggestBusinessesToContact",
  getBusinesses: "getBusinesses",
  getDashboardSummary: "getDashboardSummary",
};

const SYSTEM = `You are Paseo Copilot for admins. Free-tier mode: be extremely concise.
Given tool data, return JSON with:
- answer: 2-3 short sentences using ONLY the data (no invented numbers)
- question: one follow-up question
- options: exactly 4 items with id A,B,C,D, short label (under 80 chars), and action (one of: summarizeToday, suggestBusinessesToContact, getBusinesses, getDashboardSummary)
Never mention SQL, schemas, or API keys.`;

function compactToolData(action: CopilotAction, data: unknown): string {
  const raw = JSON.stringify(data);
  return raw.length > 1200 ? `${raw.slice(0, 1200)}…` : raw;
}

async function runTool(action: CopilotAction): Promise<unknown> {
  const tool = ACTION_TO_TOOL[action];
  return copilotTools[tool].execute();
}

function isQuotaError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return /429|RESOURCE_EXHAUSTED|quota|rate limit/i.test(msg);
}

function fallbackFromTool(action: CopilotAction, data: unknown): CopilotApiPayload {
  const options: CopilotOption[] = ROOT_MENU.options.map((o) => ({ ...o }));
  let answer = "Here's what I found in your data.";

  if (action === "summarizeToday" || action === "getDashboardSummary") {
    const d = data as {
      members?: number;
      activeBusinesses?: number;
      signalsToday?: number;
      redemptionsToday?: number;
    };
    answer = `Members: ${d.members ?? 0}. Active businesses: ${d.activeBusinesses ?? 0}. Signals today: ${d.signalsToday ?? 0}. Redemptions today: ${d.redemptionsToday ?? 0}.`;
  } else if (action === "suggestBusinessesToContact") {
    const list = data as { name: string }[];
    answer =
      list.length === 0
        ? "All active businesses have updated recently."
        : `${list.length} need a nudge: ${list
            .slice(0, 5)
            .map((b) => b.name)
            .join(", ")}${list.length > 5 ? "…" : ""}.`;
  } else if (action === "getBusinesses") {
    const list = data as { name: string }[];
    answer =
      list.length === 0
        ? "No businesses yet — create one in Admin → Businesses."
        : `${list.length} business(es): ${list.map((b) => b.name).join(", ")}.`;
  }

  return {
    answer,
    question: "What would you like to check next?",
    options,
    toolUsed: ACTION_TO_TOOL[action],
  };
}

async function synthesizeWithGemini(
  action: CopilotAction,
  toolData: unknown,
): Promise<CopilotApiPayload> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return {
      ...fallbackFromTool(action, toolData),
      answer:
        "Set GEMINI_API_KEY in .env.local to enable AI phrasing. Showing data-only summary:",
      toolUsed: ACTION_TO_TOOL[action],
    };
  }

  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({
    model: MODEL,
    systemInstruction: SYSTEM,
    generationConfig: {
      maxOutputTokens: 384,
      temperature: 0.3,
      responseMimeType: "application/json",
    },
  });

  const prompt = `Action: ${action}
Data: ${compactToolData(action, toolData)}
Suggest logical next-step options for an admin.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const parsed = copilotResponseSchema.safeParse(JSON.parse(text));

  if (!parsed.success) {
    return fallbackFromTool(action, toolData);
  }

  return {
    answer: parsed.data.answer,
    question: parsed.data.question,
    options: parsed.data.options,
    toolUsed: ACTION_TO_TOOL[action],
  };
}

export function getCopilotRootMenu(): CopilotApiPayload {
  return { ...ROOT_MENU, toolUsed: null };
}

export async function runCopilotChoice(
  userId: string,
  action: string,
): Promise<CopilotApiPayload> {
  if (!isCopilotAction(action)) {
    return {
      answer: "Unknown action. Pick A, B, C, or D from the menu.",
      question: ROOT_MENU.question,
      options: ROOT_MENU.options,
      toolUsed: null,
    };
  }

  const limit = checkCopilotRateLimit(userId);
  if (!limit.allowed) {
    const toolData = await runTool(action);
    const payload = fallbackFromTool(action, toolData);
    return {
      ...payload,
      answer: `Rate limit reached (free tier). Try again in ${limit.retryAfterSeconds}s. Data summary: ${payload.answer}`,
      rateLimit: { retryAfterSeconds: limit.retryAfterSeconds },
    };
  }

  const toolData = await runTool(action);

  try {
    return await synthesizeWithGemini(action, toolData);
  } catch (err) {
    if (isQuotaError(err)) {
      const payload = fallbackFromTool(action, toolData);
      return {
        ...payload,
        answer: `Gemini quota reached — showing data without AI. ${payload.answer}`,
        rateLimit: { retryAfterSeconds: 60 },
      };
    }
    throw err;
  }
}
