import type { Locale } from "@/lib/locales";
import { RequireRole } from "@/components/session/RequireRole";
import { MOCK_AGENDA } from "@/lib/mock/agenda";
import { AgendaList } from "@/components/pages/Agenda";

export default async function TeacherAgenda({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return (
    <div className="flex flex-col gap-4">
      <RequireRole locale={locale} role="teacher" />
      <AgendaList locale={locale} items={MOCK_AGENDA} />
    </div>
  );
}

