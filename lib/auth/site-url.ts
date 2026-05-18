/** Canonical app URL for auth redirects (Vercel, local, or explicit env). */
export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

export function getAuthCallbackUrl(redirectPath = "/app"): string {
  const base = getSiteUrl();
  const next = redirectPath.startsWith("/") ? redirectPath : `/${redirectPath}`;
  return `${base}/auth/callback?next=${encodeURIComponent(next)}`;
}
