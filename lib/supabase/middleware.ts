import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_PREFIXES = ["/admin", "/infra", "/app"];
function isProtectedPath(path: string) {
  return PROTECTED_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`));
}

/** Preserve session cookies when returning redirects or rewrites. */
function mergeCookies(from: NextResponse, to: NextResponse) {
  from.cookies.getAll().forEach((cookie) => {
    to.cookies.set(cookie);
  });
  return to;
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // Logged-in users should not stay on login
  if (path === "/login" && user) {
    const dest =
      request.nextUrl.searchParams.get("redirect")?.trim() || "/app";
    const safeDest = dest.startsWith("/") && !dest.startsWith("//") ? dest : "/app";
    const url = request.nextUrl.clone();
    url.pathname = safeDest;
    url.search = "";
    return mergeCookies(supabaseResponse, NextResponse.redirect(url));
  }

  if (!isProtectedPath(path)) {
    return supabaseResponse;
  }

  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", path);
    return mergeCookies(supabaseResponse, NextResponse.redirect(url));
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profile?.role ?? "consumer";

  if (path.startsWith("/admin") && role !== "admin") {
    const url = request.nextUrl.clone();
    url.pathname = "/app";
    url.search = "";
    return mergeCookies(supabaseResponse, NextResponse.redirect(url));
  }

  if (
    path.startsWith("/infra") &&
    role !== "business" &&
    role !== "admin"
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/business";
    url.search = "";
    return mergeCookies(supabaseResponse, NextResponse.redirect(url));
  }

  return supabaseResponse;
}
