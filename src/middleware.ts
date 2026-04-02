import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { DEFAULT_LOCALE, isLocale } from "@/lib/locales";

const LOCALE_COOKIE = "bh_locale";

function getLocaleFromPath(pathname: string): string | null {
  const [, maybeLocale] = pathname.split("/");
  return maybeLocale ?? null;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip Next internals + static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const pathLocale = getLocaleFromPath(pathname);
  if (pathLocale && isLocale(pathLocale)) {
    // Keep cookie in sync with current locale
    const res = NextResponse.next();
    res.cookies.set(LOCALE_COOKIE, pathLocale, { path: "/" });
    return res;
  }

  const cookieLocale = req.cookies.get(LOCALE_COOKIE)?.value;
  const locale = cookieLocale && isLocale(cookieLocale) ? cookieLocale : DEFAULT_LOCALE;

  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!api).*)"],
};

