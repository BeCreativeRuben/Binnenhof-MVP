import type { Locale } from "@/lib/locales";
import { RequireRole } from "@/components/session/RequireRole";
import { KieswijzerClient } from "@/components/pages/KieswijzerClient";

export default async function TeacherKieswijzer({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return (
    <div className="flex flex-col gap-4">
      <RequireRole locale={locale} role="teacher" />
      <KieswijzerClient locale={locale} />
    </div>
  );
}

