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

const MODEL_CANDIDATES = [
  process.env.GEMINI_MODEL,
  "gemini-2.0-flash",
  "gemini-flash-latest",
].filter(Boolean) as string[];

const ACTION_TO_TOOL: Record<CopilotAction, CopilotToolName> = {
  summarizeToday: "summarizeToday",
  suggestBusinessesToContact: "suggestBusinessesToContact",
  getBusinesses: "getBusinesses",
  getDashboardSummary: "getDashboardSummary",
};

const SYSTEM = `You are Paseo Copilot for admins. Be concise.
Given tool data, return JSON only with:
- answer: 2-3 short sentences using ONLY the data (no invented numbers)
- question: one follow-up question
- options: exactly 4 items with id A,B,C,D, short label (under 80 chars), and action (one of: summarizeToday, suggestBusinessesToContact, getBusinesses, getDashboardSummary)`;

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

function isModelError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return /404|not found|invalid model|model.*not/i.test(msg);
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

async function generateWithModel(
  key: string,
  modelName: string,
  prompt: string,
): Promise<string> {
  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: SYSTEM,
    generationConfig: {
      maxOutputTokens: 384,
      temperature: 0.3,
      responseMimeType: "application/json",
    },
  });
  const result = await model.generateContent(prompt);
  return result.response.text();
}

async function synthesizeWithGemini(
  action: CopilotAction,
  toolData: unknown,
): Promise<CopilotApiPayload> {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key) {
    return {
      ...fallbackFromTool(action, toolData),
      answer:
        "Copilot needs GEMINI_API_KEY on the server (Vercel env vars). Data summary:",
      toolUsed: ACTION_TO_TOOL[action],
    };
  }

  const prompt = `Action: ${action}
Data: ${compactToolData(action, toolData)}
Suggest logical next-step options for an admin.`;

  let lastError: unknown = null;

  for (const modelName of MODEL_CANDIDATES) {
    try {
      const text = await generateWithModel(key, modelName, prompt);
      let parsed;
      try {
        parsed = copilotResponseSchema.safeParse(JSON.parse(text));
      } catch {
        parsed = { success: false as const };
      }
      if (parsed.success) {
        return {
          answer: parsed.data.answer,
          question: parsed.data.question,
          options: parsed.data.options,
          toolUsed: ACTION_TO_TOOL[action],
        };
      }
      lastError = new Error("Invalid JSON from Gemini");
    } catch (err) {
      lastError = err;
      if (!isModelError(err)) break;
    }
  }

  if (isQuotaError(lastError)) {
    const payload = fallbackFromTool(action, toolData);
    return {
      ...payload,
      answer: `Gemini quota reached — showing data without AI. ${payload.answer}`,
      rateLimit: { retryAfterSeconds: 60 },
    };
  }

  const payload = fallbackFromTool(action, toolData);
  const hint =
    lastError instanceof Error ? lastError.message.slice(0, 120) : "Unknown error";
  return {
    ...payload,
    answer: `${payload.answer} (AI unavailable: ${hint})`,
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
      answer: `Rate limit reached (free tier). Try again in ${limit.retryAfterSeconds}s. ${payload.answer}`,
      rateLimit: { retryAfterSeconds: limit.retryAfterSeconds },
    };
  }

  const toolData = await runTool(action);
  return synthesizeWithGemini(action, toolData);
}
