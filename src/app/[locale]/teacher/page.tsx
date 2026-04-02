import Link from "next/link";
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

      <Card>
        <CardTitle>
          {t(locale, "dashboard.welcome")} – {t(locale, "teacher.title")}
        </CardTitle>
        <CardDescription>
          Overzicht van communicatie, agenda en opvolging (mock data).
        </CardDescription>
      </Card>

      <Card>
        <CardTitle>{t(locale, "dashboard.quickActions")}</CardTitle>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Link
            href={`/${locale}/teacher/messages`}
            className="flex h-14 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-sm font-semibold hover:bg-zinc-50 active:scale-[0.99]"
          >
            {t(locale, "nav.messages")}
          </Link>
          <Link
            href={`/${locale}/teacher/agenda`}
            className="flex h-14 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-sm font-semibold hover:bg-zinc-50 active:scale-[0.99]"
          >
            {t(locale, "nav.agenda")}
          </Link>
          <Link
            href={`/${locale}/teacher/workshops`}
            className="flex h-14 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-sm font-semibold hover:bg-zinc-50 active:scale-[0.99]"
          >
            {t(locale, "nav.workshops")}
          </Link>
          <Link
            href={`/${locale}/teacher/kieswijzer`}
            className="flex h-14 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-sm font-semibold hover:bg-zinc-50 active:scale-[0.99]"
          >
            {t(locale, "nav.kieswijzer")}
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
              href={`/${locale}/teacher/messages/${latest.id}`}
              className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-zinc-900 text-[15px] font-semibold text-white shadow-sm active:scale-[0.99]"
            >
              {t(locale, "messages.title")}
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}

