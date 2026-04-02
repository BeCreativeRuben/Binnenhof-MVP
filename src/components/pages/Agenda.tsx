import type { Locale } from "@/lib/locales";
import { t, translate } from "@/lib/i18n";
import type { AgendaItem } from "@/lib/mock/agenda";
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

export function AgendaList({
  locale,
  items,
}: {
  locale: Locale;
  items: AgendaItem[];
}) {
  const sorted = [...items].sort((a, b) => a.startsAt.localeCompare(b.startsAt));

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {t(locale, "agenda.title")}
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          {t(locale, "agenda.upcoming")}
        </p>
      </div>

      {sorted.map((item) => (
        <Card key={item.id}>
          <CardTitle>{translate(locale, item.titleNl)}</CardTitle>
          <CardDescription>
            {stableDateTime(item.startsAt)}
            {item.endsAt ? ` – ${stableDateTime(item.endsAt)}` : ""}
          </CardDescription>
          {item.locationNl && (
            <div className="mt-3 text-sm text-zinc-700">
              📍 {translate(locale, item.locationNl)}
            </div>
          )}
          {item.descriptionNl && (
            <div className="mt-3 text-sm leading-6 text-zinc-700">
              {translate(locale, item.descriptionNl)}
            </div>
          )}
          <div className="mt-3 inline-flex items-center">
            <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs font-semibold text-zinc-700">
              {item.type === "workshop"
                ? t(locale, "nav.workshops")
                : item.type === "student"
                  ? t(locale, "student.title")
                  : "School"}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
}

