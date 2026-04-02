import type { Locale } from "@/lib/locales";
import { RequireRole } from "@/components/session/RequireRole";
import { MOCK_AGENDA } from "@/lib/mock/agenda";
import { WorkshopsPage } from "@/components/pages/Workshops";

export default async function ParentWorkshops({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return (
    <div className="flex flex-col gap-4">
      <RequireRole locale={locale} role="parent" />
      <WorkshopsPage locale={locale} items={MOCK_AGENDA} />
    </div>
  );
}

