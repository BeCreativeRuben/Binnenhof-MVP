import type { Locale } from "@/lib/locales";
import { RequireRole } from "@/components/session/RequireRole";
import { getThreadsForRole } from "@/lib/mock/messages";
import { MessagesThread } from "@/components/pages/Messages";

export default async function StudentThread({
  params,
}: {
  params: Promise<{ locale: Locale; threadId: string }>;
}) {
  const { locale, threadId } = await params;
  const basePath = `/${locale}/student`;
  const studentThreads = getThreadsForRole("student");
  const thread = studentThreads.find((t) => t.id === threadId) ?? studentThreads[0];

  return (
    <div className="flex flex-col gap-4">
      <RequireRole locale={locale} role="student" />
      {thread && <MessagesThread locale={locale} basePath={basePath} thread={thread} />}
    </div>
  );
}

