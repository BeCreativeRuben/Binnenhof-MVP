import type { Locale } from "@/lib/locales";
import { RequireRole } from "@/components/session/RequireRole";
import { MOCK_AGENDA } from "@/lib/mock/agenda";
import { TeacherAgendaClient } from "@/components/pages/TeacherAgendaClient";

export default async function TeacherAgenda({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return (
    <div className="flex flex-col gap-4">
      <RequireRole locale={locale} role="teacher" />
      <TeacherAgendaClient locale={locale} baseItems={MOCK_AGENDA} />
    </div>
  );
}

