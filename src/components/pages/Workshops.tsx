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
    ? `${translate(locale, "Uitnodiging")}: ${translate(locale, first.titleNl)}`
    : `${translate(locale, "Uitnodiging")}: ${translate(locale, "workshop")}`;
  const bodyNl = first
    ? `${translate(locale, "Beste ouder/voogd")},\n\n${translate(locale, "Je bent welkom op onze workshop.")}\n\n${translate(locale, "Wanneer")}: ${stableDateTime(first.startsAt)}\n${translate(locale, "Waar")}: ${translate(locale, first.locationNl ?? "IVIO Binnenhof")}\n\n${translate(locale, "Inschrijven is optioneel.")}\n\n${translate(locale, "Met vriendelijke groeten")},\nIVIO Binnenhof`
    : `${translate(locale, "Beste ouder/voogd")},\n\n...`;

  return (
    <div className="flex flex-col gap-4">
      <Card className="overflow-hidden border-0 bg-gradient-to-r from-[#4c8eed] to-[#2c66ea] text-white shadow-[0_12px_28px_rgba(44,102,234,0.35)]">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          {t(locale, "workshops.title")}
        </h1>
        <p className="mt-2 text-sm text-blue-100">
          {translate(locale, "Overzicht + e-mail preview (prototype).")}
        </p>
      </Card>

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

      <Card className="bg-[#f8fbff]">
        <CardTitle>{t(locale, "workshops.emailPreview")}</CardTitle>
        <CardDescription>
          {translate(locale, "Automatisch vertaald voor deze taal (MVP zonder externe service).")}
        </CardDescription>

        <div className="mt-3 rounded-2xl border border-[#d6deea] bg-white p-3 text-sm">
          <div className="flex flex-col gap-2">
            <div>
              <div className="text-xs font-semibold text-zinc-600">{translate(locale, "Aan")}</div>
              <div className="font-medium">ouder@example.com</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-zinc-600">{translate(locale, "Onderwerp")}</div>
              <div className="font-medium">{subjectNl}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-zinc-600">{translate(locale, "Bericht")}</div>
              <pre className="mt-1 whitespace-pre-wrap font-sans text-sm leading-6 text-zinc-800">
                {bodyNl}
              </pre>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

