import Link from "next/link";
import { Calendar, MessageSquare, Send, Sparkles, TentTree } from "lucide-react";
import type { Locale } from "@/lib/locales";
import { t, translate } from "@/lib/i18n";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { RequireRole } from "@/components/session/RequireRole";
import { MOCK_THREADS } from "@/lib/mock/messages";

export default async function TeacherDashboard({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const latest = MOCK_THREADS[0];

  return (
    <div className="flex flex-col gap-4">
      <RequireRole locale={locale} role="teacher" />

      <Card className="overflow-hidden border-0 bg-gradient-to-r from-[#4c8eed] to-[#2c66ea] text-white shadow-[0_12px_28px_rgba(44,102,234,0.35)]">
        <h2 className="text-[28px] font-bold leading-tight text-white">
          {t(locale, "dashboard.welcome")} – {t(locale, "teacher.title")}
        </h2>
        <CardDescription className="text-blue-100">
          Overzicht van communicatie, agenda en opvolging (mock data).
        </CardDescription>
      </Card>

      <Card className="border-0 bg-transparent p-0 shadow-none">
        <CardTitle>{t(locale, "dashboard.quickActions")}</CardTitle>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <Link
            href={`/${locale}/teacher/messages`}
            className="group rounded-[22px] border border-[#d6deea] bg-white p-4 shadow-[0_4px_14px_rgba(31,52,88,0.08)]"
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
            href={`/${locale}/teacher/agenda`}
            className="group rounded-[22px] border border-[#d6deea] bg-white p-4 shadow-[0_4px_14px_rgba(31,52,88,0.08)]"
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
            href={`/${locale}/teacher/workshops`}
            className="group rounded-[22px] border border-[#d6deea] bg-white p-4 shadow-[0_4px_14px_rgba(31,52,88,0.08)]"
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
            href={`/${locale}/teacher/kieswijzer`}
            className="group rounded-[22px] border border-[#d6deea] bg-white p-4 shadow-[0_4px_14px_rgba(31,52,88,0.08)]"
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
        <Card className="rounded-[24px]">
          <CardTitle>{t(locale, "dashboard.latest")}</CardTitle>
          <div className="mt-3 rounded-2xl bg-[#f5efe7] p-4">
            <CardDescription className="mt-0 text-base font-semibold text-[#374151]">
              {translate(locale, latest.titleNl)}
            </CardDescription>
            <div className="mt-2 text-sm text-[#4b5563]">
              {translate(locale, latest.messages[0]?.bodyNl ?? "")}
            </div>
          </div>
          <div className="mt-3">
            <Link
              href={`/${locale}/teacher/messages/${latest.id}`}
              className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[#2f3e58] text-[15px] font-semibold text-white shadow-[0_4px_12px_rgba(47,62,88,0.3)] active:scale-[0.99]"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {translate(locale, "Bekijk alle berichten")}
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}

