import { GoogleGenerativeAI } from "@google/generative-ai";
import { copilotTools, type CopilotToolName } from "./tools";

const SYSTEM = `You are Paseo Copilot, admin mission control assistant.
Be brief (2-4 sentences). Use tools for data — never invent numbers.
Never expose SQL, schema, or internal errors. Suggest clear next actions.
For write operations, describe what you would do and ask for confirmation.`;

export async function runCopilotChat(userMessage: string) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return {
      text: "Copilot needs GEMINI_API_KEY in .env.local. I can still help once that's set.",
      toolUsed: null as string | null,
    };
  }

  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: SYSTEM,
    generationConfig: { maxOutputTokens: 512, temperature: 0.4 },
  });

  const lower = userMessage.toLowerCase();
  let toolUsed: CopilotToolName | null = null;
  let toolResult: unknown = null;

  if (lower.includes("summarize") || lower.includes("today") || lower.includes("performance")) {
    toolUsed = "summarizeToday";
    toolResult = await copilotTools.summarizeToday.execute();
  } else if (lower.includes("inactive") || lower.includes("not updated") || lower.includes("contact")) {
    toolUsed = "suggestBusinessesToContact";
    toolResult = await copilotTools.suggestBusinessesToContact.execute();
  } else if (lower.includes("business")) {
    toolUsed = "getBusinesses";
    toolResult = await copilotTools.getBusinesses.execute();
  } else {
    toolUsed = "getDashboardSummary";
    toolResult = await copilotTools.getDashboardSummary.execute();
  }

  const prompt = `User: ${userMessage}

Tool ${toolUsed} returned:
${JSON.stringify(toolResult).slice(0, 2000)}

Respond helpfully in plain language.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  return { text, toolUsed };
}
