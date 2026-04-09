import type { Locale } from "@/lib/locales";
import { RequireRole } from "@/components/session/RequireRole";
import { getThreadsForRole } from "@/lib/mock/messages";
import { MessagesThread } from "@/components/pages/Messages";

export default async function TeacherThread({
  params,
}: {
  params: Promise<{ locale: Locale; threadId: string }>;
}) {
  const { locale, threadId } = await params;
  const basePath = `/${locale}/teacher`;
  const teacherThreads = getThreadsForRole("teacher");
  const thread = teacherThreads.find((t) => t.id === threadId) ?? teacherThreads[0];

  return (
    <div className="flex flex-col gap-4">
      <RequireRole locale={locale} role="teacher" />
      {thread && <MessagesThread locale={locale} basePath={basePath} thread={thread} />}
    </div>
  );
}

