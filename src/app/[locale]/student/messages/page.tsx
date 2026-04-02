import type { Locale } from "@/lib/locales";
import { RequireRole } from "@/components/session/RequireRole";
import { MOCK_THREADS } from "@/lib/mock/messages";
import { MessagesList } from "@/components/pages/Messages";

export default async function StudentMessages({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const basePath = `/${locale}/student`;
  return (
    <div className="flex flex-col gap-4">
      <RequireRole locale={locale} role="student" />
      <MessagesList locale={locale} basePath={basePath} threads={MOCK_THREADS} />
    </div>
  );
}

