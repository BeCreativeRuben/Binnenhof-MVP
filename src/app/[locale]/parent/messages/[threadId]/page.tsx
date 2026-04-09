import type { Locale } from "@/lib/locales";
import { RequireRole } from "@/components/session/RequireRole";
import { getThreadsForRole } from "@/lib/mock/messages";
import { MessagesThread } from "@/components/pages/Messages";

export default async function ParentThread({
  params,
}: {
  params: Promise<{ locale: Locale; threadId: string }>;
}) {
  const { locale, threadId } = await params;
  const basePath = `/${locale}/parent`;
  const parentThreads = getThreadsForRole("parent");
  const thread = parentThreads.find((t) => t.id === threadId) ?? parentThreads[0];

  return (
    <div className="flex flex-col gap-4">
      <RequireRole locale={locale} role="parent" />
      {thread && <MessagesThread locale={locale} basePath={basePath} thread={thread} />}
    </div>
  );
}

