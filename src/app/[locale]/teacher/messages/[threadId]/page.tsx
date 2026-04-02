import type { Locale } from "@/lib/locales";
import { RequireRole } from "@/components/session/RequireRole";
import { MOCK_THREADS } from "@/lib/mock/messages";
import { MessagesThread } from "@/components/pages/Messages";

export default async function TeacherThread({
  params,
}: {
  params: Promise<{ locale: Locale; threadId: string }>;
}) {
  const { locale, threadId } = await params;
  const basePath = `/${locale}/teacher`;
  const thread = MOCK_THREADS.find((t) => t.id === threadId) ?? MOCK_THREADS[0];

  return (
    <div className="flex flex-col gap-4">
      <RequireRole locale={locale} role="teacher" />
      {thread && <MessagesThread locale={locale} basePath={basePath} thread={thread} />}
    </div>
  );
}

