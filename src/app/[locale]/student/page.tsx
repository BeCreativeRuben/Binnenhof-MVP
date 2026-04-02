import Link from "next/link";
import type { Locale } from "@/lib/locales";
import { t } from "@/lib/i18n";
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

      <Card>
        <CardTitle>
          {t(locale, "dashboard.welcome")} – {t(locale, "student.title")}
        </CardTitle>
        <CardDescription>
          Quiz en opdrachtjes helpen ontdekken wat je leuk vindt en waar je goed in bent.
        </CardDescription>
      </Card>

      <Card>
        <CardTitle>{t(locale, "dashboard.quickActions")}</CardTitle>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Link
            href={`/${locale}/student/kieswijzer`}
            className="flex h-14 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-sm font-semibold hover:bg-zinc-50 active:scale-[0.99]"
          >
            {t(locale, "nav.kieswijzer")}
          </Link>
          <Link
            href={`/${locale}/student/opdrachtjes`}
            className="flex h-14 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-sm font-semibold hover:bg-zinc-50 active:scale-[0.99]"
          >
            {t(locale, "nav.assignments")}
          </Link>
          <Link
            href={`/${locale}/student/messages`}
            className="flex h-14 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-sm font-semibold hover:bg-zinc-50 active:scale-[0.99]"
          >
            {t(locale, "nav.messages")}
          </Link>
          <Link
            href={`/${locale}/student/agenda`}
            className="flex h-14 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-sm font-semibold hover:bg-zinc-50 active:scale-[0.99]"
          >
            {t(locale, "nav.agenda")}
          </Link>
        </div>
      </Card>
    </div>
  );
}

