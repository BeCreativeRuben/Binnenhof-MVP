"use client";

import { useState } from "react";
import type { Locale } from "@/lib/locales";
import { t, translate } from "@/lib/i18n";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { Button, ButtonSecondary } from "@/components/ui/Button";

const ASSIGNMENTS = [
  {
    id: "as-1",
    titleNl: "Memory",
    descriptionNl: "Klik start en stop wanneer je klaar bent. Snelste tijd wint.",
    kind: "memory",
  },
  {
    id: "as-2",
    titleNl: "Connect the dots",
    descriptionNl: "Klik start en stop wanneer je klaar bent. Minste fouten wint bij gelijke tijd.",
    kind: "connect",
  },
] as const;

export function AssignmentsClient({ locale }: { locale: Locale }) {
  const [busy, setBusy] = useState<string | null>(null);
  const [startAt, setStartAt] = useState<Record<"memory" | "connect", number | null>>({
    memory: null,
    connect: null,
  });
  const [mistakes, setMistakes] = useState<Record<"memory" | "connect", number>>({
    memory: 0,
    connect: 0,
  });
  type LeaderboardEntry = { rank: number; initials: string; timeMs: number; mistakes: number };
  const [leaderboards, setLeaderboards] = useState<Record<"memory" | "connect", LeaderboardEntry[]>>({
    memory: [],
    connect: [],
  });

  async function refreshLeaderboard(gameType: "memory" | "connect") {
    const res = await fetch(`/api/games/leaderboard?gameType=${gameType}`, {
      credentials: "include",
    });
    const data = await res.json();
    setLeaderboards((prev) => ({ ...prev, [gameType]: data?.leaderboard ?? [] }));
  }

  return (
    <div className="flex flex-col gap-3 pb-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {t(locale, "student.assignments.title")}
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          {t(locale, "student.assignments.subtitle")}
        </p>
      </div>

      {ASSIGNMENTS.map((a) => (
        <Card key={a.id}>
          <CardTitle>{translate(locale, a.titleNl)}</CardTitle>
          <CardDescription>{translate(locale, a.descriptionNl)}</CardDescription>

          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-zinc-500">
              {translate(locale, "Per klas leaderboard (initialen)")}
            </span>
            <button
              type="button"
              className="text-xs underline"
              onClick={() => void refreshLeaderboard(a.kind)}
            >
              {translate(locale, "Vernieuwen")}
            </button>
          </div>

          <div className="mt-3 flex flex-col gap-2">
            {startAt[a.kind] ? (
              <Button
                type="button"
                disabled={busy === a.kind}
                onClick={async () => {
                  if (!startAt[a.kind]) return;
                  setBusy(a.kind);
                  const timeMs = Date.now() - startAt[a.kind]!;
                  const res = await fetch("/api/games/score", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({
                      gameType: a.kind,
                      timeMs,
                      mistakes: mistakes[a.kind],
                    }),
                  });
                  setBusy(null);
                  if (res.ok) {
                    setStartAt((prev) => ({ ...prev, [a.kind]: null }));
                    setMistakes((prev) => ({ ...prev, [a.kind]: 0 }));
                    await refreshLeaderboard(a.kind);
                  }
                }}
              >
                {translate(locale, "Stop & score opslaan")}
              </Button>
            ) : (
              <ButtonSecondary
                type="button"
                onClick={() => {
                  setStartAt((prev) => ({ ...prev, [a.kind]: Date.now() }));
                }}
              >
                {translate(locale, "Start spel")}
              </ButtonSecondary>
            )}
            {startAt[a.kind] && (
              <ButtonSecondary
                type="button"
                onClick={() => {
                  setMistakes((prev) => ({ ...prev, [a.kind]: prev[a.kind] + 1 }));
                }}
              >
                +1 {translate(locale, "fouten")} ({mistakes[a.kind]})
              </ButtonSecondary>
            )}
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-2 text-xs">
              {(leaderboards[a.kind] ?? []).length === 0 && (
                <div>{translate(locale, "Nog geen scores.")}</div>
              )}
              {(leaderboards[a.kind] as LeaderboardEntry[]).map((row) => (
                <div key={`${a.kind}-${row.rank}-${row.initials}`} className="flex justify-between">
                  <span>
                    #{row.rank} {row.initials}
                  </span>
                  <span>
                    {Math.round(row.timeMs / 1000)}s • {translate(locale, "fouten")} {row.mistakes}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

