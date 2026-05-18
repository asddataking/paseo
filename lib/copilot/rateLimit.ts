/** In-memory guard for Gemini free-tier RPM (per admin user). Resets on cold start. */
const windows = new Map<string, { count: number; resetAt: number }>();

/** Conservative vs free-tier Flash limits — see https://ai.google.dev/gemini-api/docs/rate-limits */
const MAX_PER_MINUTE = 8;
const WINDOW_MS = 60_000;

export function checkCopilotRateLimit(userId: string): {
  allowed: boolean;
  retryAfterSeconds: number;
} {
  const now = Date.now();
  const entry = windows.get(userId);

  if (!entry || now >= entry.resetAt) {
    windows.set(userId, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (entry.count >= MAX_PER_MINUTE) {
    const retryAfterSeconds = Math.ceil((entry.resetAt - now) / 1000);
    return { allowed: false, retryAfterSeconds };
  }

  entry.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}
