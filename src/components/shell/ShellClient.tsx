"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Calendar,
  ChevronLeft,
  Languages,
  LogOut,
  MessageSquare,
  Send,
  Sparkles,
  TentTree,
  UserRound,
} from "lucide-react";
import type { ReactNode } from "react";
import { cn, interactiveHoverClasses } from "@/components/ui/ui";
import { LOCALE_FLAGS, LOCALE_LABELS, LOCALES, type Locale } from "@/lib/locales";
import { t } from "@/lib/i18n";
import { useSession } from "@/components/session/SessionProvider";

function replaceLocale(pathname: string, nextLocale: Locale) {
  const parts = pathname.split("/");
  // ['', locale, ...rest]
  if (parts.length >= 2) parts[1] = nextLocale;
  return parts.join("/") || `/${nextLocale}`;
}

/**
 * Voorspelbare “omhoog” in de app-structuur (niet browser history).
 * /{locale}/{role} → geen niveau hoger (null).
 * /{locale}/{role}/messages → naar start (role hub).
 * /{locale}/{role}/messages/[id] → naar berichtenlijst.
 */
function computeBackHref(
  pathname: string | undefined,
  locale: Locale,
  role: "parent" | "teacher" | "student" | undefined,
): string | null {
  if (!pathname || !role) return null;
  const normalized = pathname.replace(/\/+$/, "") || "/";
  const base = `/${locale}/${role}`;
  if (!normalized.startsWith(base)) return base;
  if (normalized.length <= base.length) return null;
  const remainder = normalized.slice(base.length + 1);
  const segs = remainder.split("/").filter(Boolean);
  if (segs.length <= 1) return base;
  return `${base}/${segs.slice(0, -1).join("/")}`;
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

  const backHref = computeBackHref(pathname, locale, user?.role);

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
          { href: `${roleBase}/`, label: t(locale, "nav.dashboard"), icon: UserRound },
          { href: `${roleBase}/messages`, label: t(locale, "nav.messages"), icon: MessageSquare },
          { href: `${roleBase}/agenda`, label: t(locale, "nav.agenda"), icon: Calendar },
          { href: `${roleBase}/kieswijzer`, label: t(locale, "nav.kieswijzer"), icon: Send },
          {
            href: `${roleBase}/opdrachtjes`,
            label: t(locale, "nav.assignments"),
            icon: Sparkles,
          },
        ]
      : user
        ? [
            { href: `${roleBase}/`, label: t(locale, "nav.dashboard"), icon: UserRound },
            { href: `${roleBase}/messages`, label: t(locale, "nav.messages"), icon: MessageSquare },
            { href: `${roleBase}/agenda`, label: t(locale, "nav.agenda"), icon: Calendar },
            { href: `${roleBase}/workshops`, label: t(locale, "nav.workshops"), icon: TentTree },
            { href: `${roleBase}/kieswijzer`, label: t(locale, "nav.kieswijzer"), icon: Send },
          ]
        : [];

  return (
    <div className="min-h-dvh flex flex-col bg-[#eff2f7] text-[#273247]">
      <header className="sticky top-0 z-40 border-b border-[#cfd8e6] bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-md items-center gap-2 px-4 py-3">
          {showNav &&
            (backHref ? (
              <button
                type="button"
                onClick={() => router.push(backHref)}
                className={cn(
                  interactiveHoverClasses,
                  "inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d2dbea] bg-white shadow-[0_2px_8px_rgba(31,52,88,0.1)] active:scale-[0.98]",
                )}
                aria-label={t(locale, "common.back")}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            ) : (
              <div className="h-10 w-10 shrink-0" aria-hidden />
            ))}

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
              <span
                className={cn(
                  interactiveHoverClasses,
                  "inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#d2dbea] bg-white shadow-[0_2px_8px_rgba(31,52,88,0.1)] active:scale-[0.98]",
                )}
              >
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
                    onClick={() => router.replace(replaceLocale(pathname ?? `/${locale}/login`, l))}
                    className={cn(
                      interactiveHoverClasses,
                      "flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm hover:bg-zinc-50",
                      l === locale && "bg-zinc-50 font-semibold",
                    )}
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <span className="shrink-0 text-base leading-none" aria-hidden>
                        {LOCALE_FLAGS[l]}
                      </span>
                      <span className="truncate text-left">{LOCALE_LABELS[l]}</span>
                    </span>
                    {l === locale && (
                      <span className="shrink-0 text-xs text-zinc-500">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </details>

          {user && (
            <button
              type="button"
              onClick={async () => {
                await logout();
                router.push(`/${locale}/login`);
              }}
              className={cn(
                interactiveHoverClasses,
                "inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d2dbea] bg-white shadow-[0_2px_8px_rgba(31,52,88,0.1)] active:scale-[0.98]",
              )}
              aria-label={t(locale, "common.logout")}
            >
              <LogOut className="h-5 w-5" />
            </button>
          )}
        </div>
      </header>

      <main className="mx-auto w-full max-w-md flex-1 px-4 py-4">{children}</main>

      {showNav && user && (
        <nav className="sticky bottom-0 z-40 border-t border-[#cfd8e6] bg-white/95 backdrop-blur">
          <div className="mx-auto grid w-full max-w-md grid-cols-5 gap-1 px-2 py-2">
            {navItems.map((item) => {
              const active =
                pathname === item.href ||
                (item.href.endsWith("/") && pathname === item.href.slice(0, -1)) ||
                pathname?.startsWith(item.href + "/");
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    interactiveHoverClasses,
                    "flex h-14 flex-col items-center justify-center rounded-2xl px-1 text-center text-[11px] font-semibold",
                    active
                      ? "bg-[#4a90e2] text-white shadow-[0_4px_12px_rgba(74,144,226,0.35)] hover:brightness-110"
                      : "text-[#4f5f7d] hover:bg-[#f1f5fb]",
                  )}
                >
                  <Icon className="mb-1 h-4 w-4" />
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

