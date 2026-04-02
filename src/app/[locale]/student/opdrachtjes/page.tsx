import type { Locale } from "@/lib/locales";
import { RequireRole } from "@/components/session/RequireRole";
import { AssignmentsClient } from "@/components/pages/AssignmentsClient";

export default async function StudentOpdrachtjes({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return (
    <div className="flex flex-col gap-4">
      <RequireRole locale={locale} role="student" />
      <AssignmentsClient locale={locale} />
    </div>
  );
}

