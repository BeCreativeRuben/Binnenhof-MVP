import type { Locale } from "@/lib/locales";
import { RequireRole } from "@/components/session/RequireRole";
import { getThreadsForRole } from "@/lib/mock/messages";
import { MessagesList } from "@/components/pages/Messages";

export default async function ParentMessages({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const basePath = `/${locale}/parent`;
  const parentThreads = getThreadsForRole("parent");
  return (
    <div className="flex flex-col gap-4">
      <RequireRole locale={locale} role="parent" />
      <MessagesList locale={locale} basePath={basePath} threads={parentThreads} />
    </div>
  );
}

