"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") ?? "/app";
  const authError = params.get("error");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">(
    params.get("mode") === "signup" ? "signup" : "login",
  );
  const [error, setError] = useState<string | null>(authError);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);

    const supabase = createClient();
    const safeRedirect =
      redirect.startsWith("/") && !redirect.startsWith("//") ? redirect : "/app";

    if (mode === "signup") {
      const { data, error: err } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: email.split("@")[0] ?? "Member" },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(safeRedirect)}`,
        },
      });

      if (err) {
        setError(err.message);
      } else if (data.session) {
        router.refresh();
        router.push(safeRedirect);
      } else {
        setInfo(
          "Account created. Check your email for a confirmation link, then sign in.",
        );
        setMode("login");
      }
    } else {
      const { error: err } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (err) {
        setError(err.message);
      } else {
        const {
          data: { user: signedIn },
        } = await supabase.auth.getUser();
        let dest = safeRedirect;
        if (signedIn && safeRedirect === "/app") {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", signedIn.id)
            .maybeSingle();
          if (profile?.role === "admin") dest = "/admin";
        }
        router.refresh();
        router.push(dest);
      }
    }

    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4">
      <Card className="w-full max-w-md">
        <p className="text-sm font-medium text-[var(--accent-gold)]">Paseo</p>
        <h1 className="mt-2 text-2xl font-semibold">
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mt-1 text-sm text-stone-600">
          Life, without the friction.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="email"
            name="email"
            autoComplete="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-[var(--sand)] bg-white px-4 py-3"
            required
          />
          <input
            type="password"
            name="password"
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            placeholder="Password (6+ characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-[var(--sand)] bg-white px-4 py-3"
            minLength={6}
            required
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          {info && <p className="text-sm text-emerald-700">{info}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "…" : mode === "login" ? "Sign in" : "Create account"}
          </Button>
        </form>

        <button
          type="button"
          className="mt-4 text-sm text-stone-600 underline"
          onClick={() => {
            setMode(mode === "login" ? "signup" : "login");
            setError(null);
            setInfo(null);
          }}
        >
          {mode === "login"
            ? "New here? Create an account"
            : "Already have an account? Sign in"}
        </button>

        <Link href="/" className="mt-6 block text-center text-sm text-stone-500">
          ← Back home
        </Link>
      </Card>
    </div>
  );
}
