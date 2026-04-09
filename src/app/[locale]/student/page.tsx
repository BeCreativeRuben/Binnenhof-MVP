import Link from "next/link";
import { Calendar, MessageSquare, Send, Sparkles } from "lucide-react";
import type { Locale } from "@/lib/locales";
import { t, translate } from "@/lib/i18n";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { RequireRole } from "@/components/session/RequireRole";

export default async function StudentDashboard({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  return (
    <div className="flex flex-col gap-4">
      <RequireRole locale={locale} role="student" />

      <Card className="overflow-hidden border-0 bg-gradient-to-r from-[#4c8eed] to-[#2c66ea] text-white shadow-[0_12px_28px_rgba(44,102,234,0.35)]">
        <h2 className="text-[28px] font-bold leading-tight text-white">
          {t(locale, "dashboard.welcome")} – {t(locale, "student.title")}
        </h2>
        <CardDescription className="text-blue-100">
          Quiz en opdrachtjes helpen ontdekken wat je leuk vindt en waar je goed in bent.
        </CardDescription>
      </Card>

      <Card className="border-0 bg-transparent p-0 shadow-none">
        <CardTitle>{t(locale, "dashboard.quickActions")}</CardTitle>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <Link
            href={`/${locale}/student/kieswijzer`}
            className="rounded-[22px] border border-[#d6deea] bg-white p-4 shadow-[0_4px_14px_rgba(31,52,88,0.08)]"
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
          <Link
            href={`/${locale}/student/opdrachtjes`}
            className="rounded-[22px] border border-[#d6deea] bg-white p-4 shadow-[0_4px_14px_rgba(31,52,88,0.08)]"
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#8b5cf6] text-white">
                <Sparkles className="h-5 w-5" />
              </span>
              <div>
                <div className="font-bold text-[#273247]">{t(locale, "nav.assignments")}</div>
                <div className="text-xs text-[#65728a]">{translate(locale, "Speel en scoor punten")}</div>
              </div>
            </div>
          </Link>
          <Link
            href={`/${locale}/student/messages`}
            className="rounded-[22px] border border-[#d6deea] bg-white p-4 shadow-[0_4px_14px_rgba(31,52,88,0.08)]"
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
            href={`/${locale}/student/agenda`}
            className="rounded-[22px] border border-[#d6deea] bg-white p-4 shadow-[0_4px_14px_rgba(31,52,88,0.08)]"
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
        </div>
      </Card>
    </div>
  );
}

