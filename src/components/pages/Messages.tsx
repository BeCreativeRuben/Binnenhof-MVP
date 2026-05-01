import Link from "next/link";
import type { Locale } from "@/lib/locales";
import { t, translate } from "@/lib/i18n";
import type { BriefBlock, MessageThread } from "@/lib/mock/messages";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { cn, interactiveHoverClasses } from "@/components/ui/ui";

function BriefBlockRenderer({ block: b, locale }: { block: BriefBlock; locale: Locale }) {
  switch (b.type) {
    case "h2":
      return (
        <h2 className="text-base font-bold leading-snug tracking-tight text-[#273247]">
          {translate(locale, b.textNl)}
        </h2>
      );
    case "p":
      return (
        <p className="text-sm leading-relaxed text-zinc-800">{translate(locale, b.textNl)}</p>
      );
    case "facts":
      return (
        <dl className="grid gap-2 rounded-2xl border border-[#d6deea] bg-[#f6f9ff] p-3 text-sm">
          {b.items.map((row) => (
            <div key={row.labelNl} className="grid gap-0.5 sm:grid-cols-[minmax(0,8rem)_1fr] sm:gap-3">
              <dt className="font-semibold text-[#475569]">{translate(locale, row.labelNl)}</dt>
              <dd className="text-zinc-800">{translate(locale, row.valueNl)}</dd>
            </div>
          ))}
        </dl>
      );
    case "callout":
      return (
        <div className="rounded-2xl border-l-4 border-[#4a78b8] bg-[#eef4fc] px-3 py-2.5 text-sm leading-relaxed text-[#273247]">
          {translate(locale, b.textNl)}
        </div>
      );
    case "signature":
      return (
        <div className="space-y-1 border-t border-zinc-200 pt-4 text-sm text-zinc-600">
          {b.linesNl.map((line, lineIdx) => (
            <div key={lineIdx}>{translate(locale, line)}</div>
          ))}
        </div>
      );
    case "details":
      return (
        <details className="group rounded-2xl border border-zinc-200 bg-white shadow-sm open:bg-zinc-50/70">
          <summary className="cursor-pointer select-none px-3 py-2.5 text-sm font-semibold text-zinc-800 marker:text-[#355a9a] [&::-webkit-details-marker]:mr-2">
            {translate(locale, b.summaryNl)}
          </summary>
          <div className="space-y-3 border-t border-zinc-200 px-3 py-3">
            {b.children.map((child, j) => (
              <BriefBlockRenderer key={`${child.type}-${j}`} block={child} locale={locale} />
            ))}
          </div>
        </details>
      );
    default: {
      return b satisfies never;
    }
  }
}

function StructuredBrief({
  locale,
  blocks,
}: {
  locale: Locale;
  blocks: BriefBlock[];
}) {
  return (
    <article className="mt-3 space-y-4">
      {blocks.map((block, idx) => (
        <BriefBlockRenderer key={`${idx}-${block.type}`} block={block} locale={locale} />
      ))}
    </article>
  );
}

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
    <div className="flex flex-col gap-4">
      <Card className="overflow-hidden border-0 bg-gradient-to-r from-[#4c8eed] to-[#2c66ea] text-white shadow-[0_12px_28px_rgba(44,102,234,0.35)]">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          {t(locale, "messages.title")}
        </h1>
        <p className="mt-2 text-sm text-blue-100">
          {translate(locale, "1-op-1, groepsberichten en mededelingen (mock data).")}
        </p>
      </Card>

      {threads.map((thr) => (
        <Link key={thr.id} href={`${basePath}/messages/${thr.id}`} className="block rounded-[22px]">
          <Card
            className={cn(interactiveHoverClasses, "hover:border-[#c8d7ea] hover:bg-[#f8fbff]")}
          >
            <CardTitle>{translate(locale, thr.titleNl)}</CardTitle>
            <CardDescription>{translate(locale, thr.participantsNl)}</CardDescription>
            <div className="mt-3 line-clamp-2 text-sm text-zinc-700">
              {translate(
                locale,
                thr.listSnippetNl ??
                  thr.messages.at(-1)?.bodyNl ??
                  "",
              )}
            </div>
            {thr.messages.at(-1)?.context?.label && (
              <div className="mt-3 inline-flex items-center gap-2 text-xs font-medium text-[#5f6c84]">
                <span className="rounded-full border border-[#d6deea] bg-[#f6f9ff] px-2 py-1">
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
    <div className="flex flex-col gap-4 pb-6">
      <Card className="overflow-hidden border-0 bg-gradient-to-r from-[#4c8eed] to-[#2c66ea] text-white shadow-[0_12px_28px_rgba(44,102,234,0.35)]">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          {translate(locale, thread.titleNl)}
        </h1>
        <p className="mt-2 text-sm text-blue-100">
          {translate(locale, thread.participantsNl)}
        </p>
      </Card>

      <div className="flex flex-col gap-2">
        {thread.messages.map((m) => (
          <Card key={m.id}>
            <CardTitle>{translate(locale, m.fromName)}</CardTitle>
            <CardDescription>
              {stableDateTime(m.createdAt)}
            </CardDescription>
            {m.context?.label && (
              <div className="mt-3 text-xs font-medium text-zinc-600">
                <span className="rounded-full border border-[#d6deea] bg-[#f6f9ff] px-2 py-1">
                  {t(locale, "messages.context")}: {translate(locale, m.context.label)}
                </span>
                <span className="ml-2 text-zinc-400">{t(locale, "common.optional")}</span>
              </div>
            )}
            {m.briefBlocks && m.briefBlocks.length > 0 ? (
              <StructuredBrief locale={locale} blocks={m.briefBlocks} />
            ) : m.bodyNl ? (
              <div className="mt-3 text-[15px] leading-6 text-zinc-800">
                {translate(locale, m.bodyNl)}
              </div>
            ) : null}
            <div className="mt-4 border-t border-zinc-100 pt-3 text-sm text-zinc-600">
              {t(locale, "messages.reply")}:{" "}
              <span className="text-zinc-400">
                {translate(locale, "(MVP: geen echte communicatie)")}
              </span>
            </div>
          </Card>
        ))}
      </div>

      <Link
        href={`${basePath}/messages`}
        className={cn(
          interactiveHoverClasses,
          "inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[#2f4a78] text-[15px] font-semibold text-white shadow-[0_4px_12px_rgba(47,74,120,0.35)] active:scale-[0.99]",
        )}
      >
        {translate(locale, "Terug naar berichten")}
      </Link>
    </div>
  );
}

