import Link from "next/link";
import type { Locale } from "@/lib/locales";
import { t, translate } from "@/lib/i18n";
import type { MessageThread } from "@/lib/mock/messages";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";

function stableDateTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mi = String(d.getUTCMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${mi} UTC`;
}

export function MessagesList({
  locale,
  basePath,
  threads,
}: {
  locale: Locale;
  basePath: string; // e.g. "/nl/parent"
  threads: MessageThread[];
}) {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {t(locale, "messages.title")}
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          1-op-1, groepsberichten en mededelingen (mock data).
        </p>
      </div>

      {threads.map((thr) => (
        <Link key={thr.id} href={`${basePath}/messages/${thr.id}`}>
          <Card className="hover:bg-zinc-50">
            <CardTitle>{translate(locale, thr.titleNl)}</CardTitle>
            <CardDescription>{translate(locale, thr.participantsNl)}</CardDescription>
            <div className="mt-3 line-clamp-2 text-sm text-zinc-700">
              {translate(locale, thr.messages.at(-1)?.bodyNl ?? "")}
            </div>
            {thr.messages.at(-1)?.context?.label && (
              <div className="mt-3 inline-flex items-center gap-2 text-xs font-medium text-zinc-600">
                <span className="rounded-full border border-zinc-200 bg-white px-2 py-1">
                  {t(locale, "messages.context")}:{" "}
                  {translate(locale, thr.messages.at(-1)?.context?.label ?? "")}
                </span>
                <span className="text-zinc-400">{t(locale, "common.optional")}</span>
              </div>
            )}
          </Card>
        </Link>
      ))}
    </div>
  );
}

export function MessagesThread({
  locale,
  basePath,
  thread,
}: {
  locale: Locale;
  basePath: string;
  thread: MessageThread;
}) {
  return (
    <div className="flex flex-col gap-3 pb-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {translate(locale, thread.titleNl)}
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          {translate(locale, thread.participantsNl)}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {thread.messages.map((m) => (
          <Card key={m.id}>
            <CardTitle>{translate(locale, m.fromName)}</CardTitle>
            <CardDescription>
              {stableDateTime(m.createdAt)}
            </CardDescription>
            {m.context?.label && (
              <div className="mt-3 text-xs font-medium text-zinc-600">
                <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2 py-1">
                  {t(locale, "messages.context")}: {translate(locale, m.context.label)}
                </span>
                <span className="ml-2 text-zinc-400">{t(locale, "common.optional")}</span>
              </div>
            )}
            <div className="mt-3 text-[15px] leading-6 text-zinc-800">
              {translate(locale, m.bodyNl)}
            </div>
            <div className="mt-4 border-t border-zinc-100 pt-3 text-sm text-zinc-600">
              {t(locale, "messages.reply")}:{" "}
              <span className="text-zinc-400">
                (MVP: geen echte communicatie)
              </span>
            </div>
          </Card>
        ))}
      </div>

      <Link
        href={`${basePath}/messages`}
        className="inline-flex h-12 w-full items-center justify-center rounded-2xl border border-zinc-200 bg-white text-[15px] font-semibold text-zinc-900 shadow-sm active:scale-[0.99]"
      >
        {t(locale, "messages.title")}
      </Link>
    </div>
  );
}

