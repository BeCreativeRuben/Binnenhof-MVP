"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft, Languages, LogOut } from "lucide-react";
import type { ReactNode } from "react";
import { LOCALE_LABELS, LOCALES, type Locale } from "@/lib/locales";
import { t } from "@/lib/i18n";
import { useSession } from "@/components/session/SessionProvider";

function replaceLocale(pathname: string, nextLocale: Locale) {
  const parts = pathname.split("/");
  // ['', locale, ...rest]
  if (parts.length >= 2) parts[1] = nextLocale;
  return parts.join("/") || `/${nextLocale}`;
}

export function ShellClient({
  children,
  locale,
}: {
  children: ReactNode;
  locale: Locale;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useSession();

  const isLogin = pathname?.endsWith("/login");
  const showNav = !isLogin;

  const backHref = pathname?.includes("/messages/")
    ? pathname.replace(/\/messages\/[^/]+$/, "/messages")
    : pathname?.includes("/agenda/")
      ? pathname.replace(/\/agenda\/[^/]+$/, "/agenda")
      : null;

  const roleBase =
    user?.role === "parent"
      ? `/${locale}/parent`
      : user?.role === "teacher"
        ? `/${locale}/teacher`
        : user?.role === "student"
          ? `/${locale}/student`
          : null;

  const navItems =
    user?.role === "student"
      ? [
          { href: `${roleBase}/`, label: t(locale, "nav.dashboard") },
          { href: `${roleBase}/messages`, label: t(locale, "nav.messages") },
          { href: `${roleBase}/agenda`, label: t(locale, "nav.agenda") },
          { href: `${roleBase}/kieswijzer`, label: t(locale, "nav.kieswijzer") },
          {
            href: `${roleBase}/opdrachtjes`,
            label: t(locale, "nav.assignments"),
          },
        ]
      : user
        ? [
            { href: `${roleBase}/`, label: t(locale, "nav.dashboard") },
            { href: `${roleBase}/messages`, label: t(locale, "nav.messages") },
            { href: `${roleBase}/agenda`, label: t(locale, "nav.agenda") },
            { href: `${roleBase}/workshops`, label: t(locale, "nav.workshops") },
            { href: `${roleBase}/kieswijzer`, label: t(locale, "nav.kieswijzer") },
          ]
        : [];

  return (
    <div className="min-h-dvh flex flex-col bg-zinc-50 text-zinc-950">
      <header className="sticky top-0 z-40 border-b border-zinc-200/70 bg-white/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-md items-center gap-2 px-4 py-3">
          {showNav && (
            <button
              type="button"
              onClick={() => (backHref ? router.push(backHref) : router.back())}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white shadow-sm active:scale-[0.98]"
              aria-label={t(locale, "common.back")}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}

          <div className="min-w-0 flex-1">
            <div className="truncate text-[15px] font-semibold">
              {t(locale, "app.name")}
            </div>
            {user && (
              <div className="truncate text-xs text-zinc-600">
                {user.name} •{" "}
                {user.role === "parent"
                  ? t(locale, "parent.title")
                  : user.role === "teacher"
                    ? t(locale, "teacher.title")
                    : t(locale, "student.title")}
              </div>
            )}
          </div>

          <details className="relative">
            <summary className="list-none">
              <span className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-zinc-200 bg-white shadow-sm active:scale-[0.98]">
                <Languages className="h-5 w-5" />
              </span>
            </summary>
            <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-lg">
              <div className="px-3 py-2 text-xs font-medium text-zinc-600">
                {t(locale, "login.language")}
              </div>
              <div className="max-h-72 overflow-auto p-1">
                {LOCALES.map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => router.push(replaceLocale(pathname ?? `/${locale}/login`, l))}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm hover:bg-zinc-50 ${
                      l === locale ? "bg-zinc-50 font-semibold" : ""
                    }`}
                  >
                    <span>{LOCALE_LABELS[l]}</span>
                    {l === locale && <span className="text-xs text-zinc-500">✓</span>}
                  </button>
                ))}
              </div>
            </div>
          </details>

          {user && (
            <button
              type="button"
              onClick={() => {
                logout();
                router.push(`/${locale}/login`);
              }}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white shadow-sm active:scale-[0.98]"
              aria-label={t(locale, "common.logout")}
            >
              <LogOut className="h-5 w-5" />
            </button>
          )}
        </div>
      </header>

      <main className="mx-auto w-full max-w-md flex-1 px-4 py-4">{children}</main>

      {showNav && user && (
        <nav className="sticky bottom-0 z-40 border-t border-zinc-200/70 bg-white/90 backdrop-blur">
          <div className="mx-auto grid w-full max-w-md grid-cols-5 gap-1 px-2 py-2">
            {navItems.map((item) => {
              const active =
                pathname === item.href ||
                (item.href.endsWith("/") && pathname === item.href.slice(0, -1)) ||
                pathname?.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex h-11 items-center justify-center rounded-xl px-2 text-center text-[12px] font-medium ${
                    active ? "bg-zinc-900 text-white" : "text-zinc-700 hover:bg-zinc-50"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}

