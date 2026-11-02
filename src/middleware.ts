import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { locales } from "@/lib/i18n";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Site public : "/" redirige vers la langue du navigateur (fr par défaut)
  if (pathname === "/") {
    const accept = request.headers.get("accept-language") ?? "";
    const locale = locales.find((l) => accept.toLowerCase().startsWith(l)) ?? "fr";
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  // Back-office : rafraîchir la session et protéger les pages
  if (!pathname.startsWith("/admin")) return NextResponse.next();

  let response = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (list) => {
          list.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && pathname !== "/admin/login") {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  return response;
}

export const config = {
  matcher: ["/", "/admin/:path*"],
};
