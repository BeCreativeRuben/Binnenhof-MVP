"use client";

import { useEffect, useMemo, useState } from "react";
import type { Locale } from "@/lib/locales";
import { t, translate } from "@/lib/i18n";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { Button, ButtonSecondary } from "@/components/ui/Button";
import { useSession } from "@/components/session/SessionProvider";

type Assignment = {
  id: string;
  titleNl: string;
  descriptionNl: string;
  kind: "memory" | "connect" | "reflection";
};

const ASSIGNMENTS: Assignment[] = [
  {
    id: "as-1",
    titleNl: "Memory (prototype)",
    descriptionNl: "Vind twee dezelfde kaartjes. (Nu: snelle demo)",
    kind: "memory",
  },
  {
    id: "as-2",
    titleNl: "Connect the dots (prototype)",
    descriptionNl: "Verbind de punten in de juiste volgorde. (Nu: snelle demo)",
    kind: "connect",
  },
  {
    id: "as-3",
    titleNl: "Hoe voelde je je vandaag?",
    descriptionNl: "Kies een emotie en schrijf 1 zin. (Nu: mock opslag)",
    kind: "reflection",
  },
];

function storageKey(userId: string) {
  return `bh_assignments_v1:${userId}`;
}

export function AssignmentsClient({ locale }: { locale: Locale }) {
  const { user } = useSession();
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [reflection, setReflection] = useState("");
  const [mood, setMood] = useState<"blij" | "ok" | "moeilijk" | "">("");

  const key = useMemo(() => (user ? storageKey(user.id) : null), [user]);

  useEffect(() => {
    if (!key) return;
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) return;
      const parsed = JSON.parse(raw) as {
        done?: Record<string, boolean>;
        reflection?: string;
        mood?: string;
      };
      setDone(parsed.done ?? {});
      setReflection(parsed.reflection ?? "");
      setMood((parsed.mood as any) ?? "");
    } catch {
      // ignore
    }
  }, [key]);

  function persist(next: Partial<{ done: Record<string, boolean>; reflection: string; mood: string }>) {
    if (!key) return;
    try {
      const merged = {
        done,
        reflection,
        mood,
        ...next,
      };
      window.localStorage.setItem(key, JSON.stringify(merged));
    } catch {
      // ignore
    }
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
            <span
              className={`rounded-full border px-2 py-1 text-xs font-semibold ${
                done[a.id] ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-zinc-200 bg-zinc-50 text-zinc-700"
              }`}
            >
              {done[a.id] ? "Bewaard" : "Nog niet"}
            </span>
            <span className="text-xs text-zinc-400">(mock)</span>
          </div>

          {a.kind !== "reflection" ? (
            <div className="mt-3">
              <ButtonSecondary
                type="button"
                onClick={() => {
                  const next = { ...done, [a.id]: true };
                  setDone(next);
                  persist({ done: next });
                }}
              >
                Markeer als gedaan
              </ButtonSecondary>
            </div>
          ) : (
            <div className="mt-3 flex flex-col gap-2">
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "blij", labelNl: "Blij" },
                  { id: "ok", labelNl: "Oké" },
                  { id: "moeilijk", labelNl: "Moeilijk" },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      setMood(m.id as any);
                      persist({ mood: m.id });
                    }}
                    className={`h-12 rounded-2xl border text-sm font-semibold active:scale-[0.99] ${
                      mood === (m.id as any)
                        ? "border-zinc-900 bg-zinc-900 text-white"
                        : "border-zinc-200 bg-white hover:bg-zinc-50"
                    }`}
                  >
                    {translate(locale, m.labelNl)}
                  </button>
                ))}
              </div>
              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder={translate(locale, "Schrijf 1 zin...")}
                className="min-h-24 w-full rounded-2xl border border-zinc-200 bg-white p-3 text-sm shadow-sm outline-none focus:border-zinc-900"
              />
              <Button
                type="button"
                onClick={() => {
                  persist({ reflection });
                  const next = { ...done, [a.id]: true };
                  setDone(next);
                  persist({ done: next });
                }}
              >
                Bewaar
              </Button>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}

