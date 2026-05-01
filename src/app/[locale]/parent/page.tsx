import Link from "next/link";
import { Calendar, MessageSquare, Send, TentTree } from "lucide-react";
import type { Locale } from "@/lib/locales";
import { t } from "@/lib/i18n";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { RequireRole } from "@/components/session/RequireRole";
import { translate } from "@/lib/i18n";
import { MOCK_THREADS } from "@/lib/mock/messages";
import { cn, interactiveHoverClasses } from "@/components/ui/ui";

export default async function ParentDashboard({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  const latest = MOCK_THREADS[0];

  return (
    <div className="flex flex-col gap-4">
      <RequireRole locale={locale} role="parent" />

      <Card className="overflow-hidden border-0 bg-gradient-to-r from-[#4c8eed] to-[#2c66ea] text-white shadow-[0_12px_28px_rgba(44,102,234,0.35)]">
        <h2 className="text-[28px] font-bold leading-tight text-white">
          {t(locale, "dashboard.welcome")} – {t(locale, "parent.title")}
        </h2>
        <CardDescription className="text-blue-100">
          Snelle toegang tot updates, berichten en workshops.
        </CardDescription>
      </Card>

      <Card className="border-0 bg-transparent p-0 shadow-none">
        <CardTitle>{t(locale, "dashboard.quickActions")}</CardTitle>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <Link
            href={`/${locale}/parent/messages`}
            className={cn(
              interactiveHoverClasses,
              "rounded-[22px] border border-[#d6deea] bg-white p-4 shadow-[0_4px_14px_rgba(31,52,88,0.08)] hover:border-[#c8d7ea]",
            )}
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#4a90e2] text-white">
                <MessageSquare className="h-5 w-5" />
              </span>
              <div>
                <div className="font-bold text-[#273247]">{t(locale, "nav.messages")}</div>
                <div className="text-xs text-[#65728a]">{translate(locale, "Lees je berichten")}</div>
              </div>
            </div>
          </Link>
          <Link
            href={`/${locale}/parent/agenda`}
            className={cn(
              interactiveHoverClasses,
              "rounded-[22px] border border-[#d6deea] bg-white p-4 shadow-[0_4px_14px_rgba(31,52,88,0.08)] hover:border-[#c8d7ea]",
            )}
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#22c55e] text-white">
                <Calendar className="h-5 w-5" />
              </span>
              <div>
                <div className="font-bold text-[#273247]">{t(locale, "nav.agenda")}</div>
                <div className="text-xs text-[#65728a]">{translate(locale, "Bekijk je afspraken")}</div>
              </div>
            </div>
          </Link>
          <Link
            href={`/${locale}/parent/workshops`}
            className={cn(
              interactiveHoverClasses,
              "rounded-[22px] border border-[#d6deea] bg-white p-4 shadow-[0_4px_14px_rgba(31,52,88,0.08)] hover:border-[#c8d7ea]",
            )}
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#a855f7] text-white">
                <TentTree className="h-5 w-5" />
              </span>
              <div>
                <div className="font-bold text-[#273247]">{t(locale, "nav.workshops")}</div>
                <div className="text-xs text-[#65728a]">{translate(locale, "Doe mee met workshops")}</div>
              </div>
            </div>
          </Link>
          <Link
            href={`/${locale}/parent/kieswijzer`}
            className={cn(
              interactiveHoverClasses,
              "rounded-[22px] border border-[#d6deea] bg-white p-4 shadow-[0_4px_14px_rgba(31,52,88,0.08)] hover:border-[#c8d7ea]",
            )}
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f97316] text-white">
                <Send className="h-5 w-5" />
              </span>
              <div>
                <div className="font-bold text-[#273247]">{t(locale, "nav.kieswijzer")}</div>
                <div className="text-xs text-[#65728a]">{translate(locale, "Krijg hulp bij kiezen")}</div>
              </div>
            </div>
          </Link>
        </div>
      </Card>

      {latest && (
        <Card>
          <CardTitle>{t(locale, "dashboard.latest")}</CardTitle>
          <CardDescription className="mt-2">
            {translate(locale, latest.titleNl)}
          </CardDescription>
          <div className="mt-3 text-sm text-zinc-700">
            {translate(locale, latest.messages[0]?.bodyNl ?? "")}
          </div>
          <div className="mt-3">
            <Link
              href={`/${locale}/parent/messages/${latest.id}`}
              className={cn(
                interactiveHoverClasses,
                "inline-flex h-12 w-full items-center justify-center rounded-2xl bg-zinc-900 text-[15px] font-semibold text-white shadow-sm active:scale-[0.99]",
              )}
            >
              {t(locale, "messages.title")}
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}

