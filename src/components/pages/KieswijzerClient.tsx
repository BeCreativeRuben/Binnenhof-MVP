"use client";

import { useMemo, useState } from "react";
import type { Locale } from "@/lib/locales";
import { t, translate } from "@/lib/i18n";
import { ITEMS, scoreClusters } from "@/lib/mock/kieswijzer";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { ButtonSecondary } from "@/components/ui/Button";
import { cn } from "@/components/ui/ui";

function percent(part: number, total: number) {
  if (total <= 0) return 0;
  return Math.round((part / total) * 100);
}

export function KieswijzerClient({ locale }: { locale: Locale }) {
  const technieken = useMemo(() => ITEMS.filter((i) => i.kind === "techniek"), []);
  const talenten = useMemo(() => ITEMS.filter((i) => i.kind === "talent"), []);
  const [selected, setSelected] = useState<string[]>([]);

  const results = useMemo(() => scoreClusters(selected), [selected]);
  const totalScore = results.reduce((acc, r) => acc + r.score, 0);

  return (
    <div className="flex flex-col gap-3 pb-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {t(locale, "kieswijzer.title")}
        </h1>
        <p className="mt-2 text-sm text-zinc-600">{t(locale, "kieswijzer.subtitle")}</p>
      </div>

      <Card>
        <CardTitle>Technieken</CardTitle>
        <CardDescription>Kies wat je graag doet.</CardDescription>
        <div className="mt-3 flex flex-wrap gap-2">
          {technieken.map((item) => {
            const on = selected.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  setSelected((prev) =>
                    prev.includes(item.id) ? prev.filter((x) => x !== item.id) : [...prev, item.id],
                  )
                }
                className={cn(
                  "rounded-full border px-3 py-2 text-sm font-semibold active:scale-[0.99]",
                  on
                    ? "border-zinc-900 bg-zinc-900 text-white"
                    : "border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50",
                )}
              >
                {translate(locale, item.labelNl)}
              </button>
            );
          })}
        </div>
      </Card>

      <Card>
        <CardTitle>Talenten</CardTitle>
        <CardDescription>Kies wat je goed kan.</CardDescription>
        <div className="mt-3 flex flex-wrap gap-2">
          {talenten.map((item) => {
            const on = selected.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  setSelected((prev) =>
                    prev.includes(item.id) ? prev.filter((x) => x !== item.id) : [...prev, item.id],
                  )
                }
                className={cn(
                  "rounded-full border px-3 py-2 text-sm font-semibold active:scale-[0.99]",
                  on
                    ? "border-zinc-900 bg-zinc-900 text-white"
                    : "border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50",
                )}
              >
                {translate(locale, item.labelNl)}
              </button>
            );
          })}
        </div>
        <div className="mt-3">
          <ButtonSecondary type="button" onClick={() => setSelected([])}>
            Reset
          </ButtonSecondary>
        </div>
      </Card>

      <Card>
        <CardTitle>{t(locale, "kieswijzer.results")}</CardTitle>
        <CardDescription>
          Score op basis van je keuzes. (Prototype – later verfijnen met meer bronnen.)
        </CardDescription>

        <div className="mt-4 flex flex-col gap-3">
          {results.map((r) => (
            <div key={r.cluster.id} className="rounded-2xl border border-zinc-200 bg-white p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">
                    {translate(locale, r.cluster.titleNl)}
                  </div>
                  <div className="mt-1 text-xs text-zinc-600">
                    {translate(locale, r.cluster.subtitleNl)}
                  </div>
                </div>
                <div className="shrink-0 rounded-full border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs font-semibold">
                  {r.score} • {percent(r.score, totalScore)}%
                </div>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-100">
                <div
                  className="h-full rounded-full bg-zinc-900"
                  style={{ width: `${percent(r.score, Math.max(totalScore, 1))}%` }}
                />
              </div>
            </div>
          ))}
          {selected.length === 0 && (
            <div className="text-sm text-zinc-600">
              Kies enkele technieken/talenten om je ranglijst te zien.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

