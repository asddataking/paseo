import { redirect } from "next/navigation";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect: to } = await searchParams;
  const q = new URLSearchParams({ mode: "signup" });
  if (to) q.set("redirect", to);
  else q.set("redirect", "/app");
  redirect(`/login?${q.toString()}`);
}
