import type { Locale } from "@/lib/locales";
import { RequireRole } from "@/components/session/RequireRole";
import { MOCK_THREADS } from "@/lib/mock/messages";
import { MessagesList } from "@/components/pages/Messages";
import { TeacherComposeMock } from "@/components/pages/TeacherComposeMock";

export default async function TeacherMessages({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const basePath = `/${locale}/teacher`;
  return (
    <div className="flex flex-col gap-4">
      <RequireRole locale={locale} role="teacher" />
      <TeacherComposeMock locale={locale} />
      <MessagesList locale={locale} basePath={basePath} threads={MOCK_THREADS} />
    </div>
  );
}

