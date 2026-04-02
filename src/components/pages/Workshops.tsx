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

export function WorkshopsPage({
  locale,
  items,
}: {
  locale: Locale;
  items: AgendaItem[];
}) {
  const workshops = items.filter((i) => i.type === "workshop");

  const first = workshops[0];
  const subjectNl = first
    ? `Uitnodiging: ${first.titleNl}`
    : "Uitnodiging: workshop";
  const bodyNl = first
    ? `Beste ouder/voogd,\n\nJe bent welkom op onze workshop.\n\nWanneer: ${stableDateTime(first.startsAt)}\nWaar: ${first.locationNl ?? "IVIO Binnenhof"}\n\nInschrijven is optioneel.\n\nMet vriendelijke groeten,\nIVIO Binnenhof`
    : "Beste ouder/voogd,\n\n...";

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {t(locale, "workshops.title")}
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          Overzicht + e-mail preview (prototype).
        </p>
      </div>

      {workshops.map((w) => (
        <Card key={w.id}>
          <CardTitle>{translate(locale, w.titleNl)}</CardTitle>
          <CardDescription>{stableDateTime(w.startsAt)}</CardDescription>
          {w.descriptionNl && (
            <div className="mt-3 text-sm leading-6 text-zinc-700">
              {translate(locale, w.descriptionNl)}
            </div>
          )}
        </Card>
      ))}

      <Card>
        <CardTitle>{t(locale, "workshops.emailPreview")}</CardTitle>
        <CardDescription>
          Automatisch vertaald voor deze taal (MVP zonder externe service).
        </CardDescription>

        <div className="mt-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-3 text-sm">
          <div className="flex flex-col gap-2">
            <div>
              <div className="text-xs font-semibold text-zinc-600">Aan</div>
              <div className="font-medium">ouder@example.com</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-zinc-600">Onderwerp</div>
              <div className="font-medium">{translate(locale, subjectNl)}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-zinc-600">Bericht</div>
              <pre className="mt-1 whitespace-pre-wrap font-sans text-sm leading-6 text-zinc-800">
                {translate(locale, bodyNl)}
              </pre>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

