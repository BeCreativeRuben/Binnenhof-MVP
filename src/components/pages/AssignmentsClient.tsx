"use client";

import { useMemo, useState } from "react";
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

type LeaderboardEntry = { rank: number; initials: string; timeMs: number; mistakes: number };

const MEMORY_ICONS = ["🍎", "🚲", "🐶", "🌟", "🎵", "⚽", "📚", "🎨"];

function shuffle<T>(arr: T[]) {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function formatMs(ms: number) {
  return `${(ms / 1000).toFixed(1)}s`;
}

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
  const [leaderboards, setLeaderboards] = useState<Record<"memory" | "connect", LeaderboardEntry[]>>({
    memory: [],
    connect: [],
  });
  const [lastTimes, setLastTimes] = useState<Record<"memory" | "connect", number | null>>({
    memory: null,
    connect: null,
  });

  // Memory game state
  const [memoryDeck, setMemoryDeck] = useState<string[]>([]);
  const [memoryFlipped, setMemoryFlipped] = useState<number[]>([]);
  const [memoryMatched, setMemoryMatched] = useState<number[]>([]);
  const [memoryLocked, setMemoryLocked] = useState(false);

  // Connect-the-dots state
  const baseDots = useMemo(
    () => [
      { id: 1, x: 26, y: 84 },
      { id: 2, x: 58, y: 24 },
      { id: 3, x: 108, y: 20 },
      { id: 4, x: 144, y: 70 },
      { id: 5, x: 128, y: 132 },
      { id: 6, x: 78, y: 152 },
      { id: 7, x: 34, y: 126 },
    ],
    [],
  );
  const [connectPath, setConnectPath] = useState<number[]>([]);

  const memoryCompleted = memoryDeck.length > 0 && memoryMatched.length === memoryDeck.length;
  const connectCompleted = connectPath.length === baseDots.length;

  async function saveScore(gameType: "memory" | "connect", timeMs: number, totalMistakes: number) {
    setBusy(gameType);
    const res = await fetch("/api/games/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        gameType,
        timeMs,
        mistakes: totalMistakes,
      }),
    });
    setBusy(null);
    if (res.ok) {
      await refreshLeaderboard(gameType);
    }
  }

  function startMemory() {
    const cards = shuffle([...MEMORY_ICONS, ...MEMORY_ICONS]);
    setMemoryDeck(cards);
    setMemoryFlipped([]);
    setMemoryMatched([]);
    setMemoryLocked(false);
    setMistakes((prev) => ({ ...prev, memory: 0 }));
    setLastTimes((prev) => ({ ...prev, memory: null }));
    setStartAt((prev) => ({ ...prev, memory: Date.now() }));
  }

  function clickMemoryCard(index: number) {
    if (memoryLocked || memoryMatched.includes(index) || memoryFlipped.includes(index) || memoryCompleted) {
      return;
    }
    const nextFlipped = [...memoryFlipped, index];
    setMemoryFlipped(nextFlipped);
    if (nextFlipped.length < 2) return;

    const [a, b] = nextFlipped;
    if (memoryDeck[a] === memoryDeck[b]) {
      setMemoryMatched((prev) => [...prev, a, b]);
      setMemoryFlipped([]);
      const willComplete = memoryMatched.length + 2 === memoryDeck.length;
      if (willComplete && startAt.memory) {
        setLastTimes((prev) => ({ ...prev, memory: Date.now() - startAt.memory! }));
      }
      return;
    }

    setMistakes((prev) => ({ ...prev, memory: prev.memory + 1 }));
    setMemoryLocked(true);
    window.setTimeout(() => {
      setMemoryFlipped([]);
      setMemoryLocked(false);
    }, 650);
  }

  function startConnect() {
    setConnectPath([]);
    setMistakes((prev) => ({ ...prev, connect: 0 }));
    setLastTimes((prev) => ({ ...prev, connect: null }));
    setStartAt((prev) => ({ ...prev, connect: Date.now() }));
  }

  function clickDot(dotId: number) {
    if (!startAt.connect || connectCompleted) return;
    const expected = connectPath.length + 1;
    if (dotId === expected) {
      const nextPath = [...connectPath, dotId];
      setConnectPath(nextPath);
      if (nextPath.length === baseDots.length && startAt.connect) {
        setLastTimes((prev) => ({ ...prev, connect: Date.now() - startAt.connect! }));
      }
      return;
    }
    setMistakes((prev) => ({ ...prev, connect: prev.connect + 1 }));
  }

  async function refreshLeaderboard(gameType: "memory" | "connect") {
    const res = await fetch(`/api/games/leaderboard?gameType=${gameType}`, {
      credentials: "include",
    });
    const data = await res.json();
    setLeaderboards((prev) => ({ ...prev, [gameType]: data?.leaderboard ?? [] }));
  }

  return (
    <div className="flex flex-col gap-4 pb-6">
      <Card className="overflow-hidden border-0 bg-gradient-to-r from-[#4c8eed] to-[#2c66ea] text-white shadow-[0_12px_28px_rgba(44,102,234,0.35)]">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          {t(locale, "student.assignments.title")}
        </h1>
        <p className="mt-2 text-sm text-blue-100">
          {t(locale, "student.assignments.subtitle")}
        </p>
      </Card>

      {ASSIGNMENTS.map((a) => (
        <Card key={a.id} className="bg-[#f8fbff]">
          <CardTitle>{translate(locale, a.titleNl)}</CardTitle>
          <CardDescription>{translate(locale, a.descriptionNl)}</CardDescription>

          {a.kind === "memory" && (
            <div className="mt-3">
              {memoryDeck.length === 0 ? (
                <ButtonSecondary type="button" onClick={startMemory}>
                  {translate(locale, "Start spel")}
                </ButtonSecondary>
              ) : (
                <div className="grid grid-cols-4 gap-2">
                  {memoryDeck.map((icon, idx) => {
                    const visible = memoryFlipped.includes(idx) || memoryMatched.includes(idx);
                    return (
                      <button
                        key={`mem-${idx}`}
                        type="button"
                        onClick={() => clickMemoryCard(idx)}
                        className={`aspect-square rounded-2xl border text-2xl ${
                          visible
                            ? "border-blue-300 bg-blue-50"
                            : "border-[#d6deea] bg-white hover:bg-[#f8fbff]"
                        }`}
                      >
                        {visible ? icon : "?"}
                      </button>
                    );
                  })}
                </div>
              )}
              <div className="mt-2 text-xs text-zinc-600">
                {translate(locale, "fouten")}: {mistakes.memory}
              </div>
              {memoryCompleted && lastTimes.memory !== null && (
                <div className="mt-2 flex gap-2">
                  <div className="rounded-xl bg-emerald-50 px-2 py-1 text-xs text-emerald-800">
                    {translate(locale, "Score")}: {formatMs(lastTimes.memory)}
                  </div>
                  <Button
                    type="button"
                    disabled={busy === "memory"}
                    onClick={() => void saveScore("memory", lastTimes.memory!, mistakes.memory)}
                  >
                    {translate(locale, "Stop & score opslaan")}
                  </Button>
                </div>
              )}
            </div>
          )}

          {a.kind === "connect" && (
            <div className="mt-3">
              {!startAt.connect ? (
                <ButtonSecondary type="button" onClick={startConnect}>
                  {translate(locale, "Start spel")}
                </ButtonSecondary>
              ) : (
                <div className="rounded-2xl border border-[#d6deea] bg-white p-2">
                  <svg viewBox="0 0 170 170" className="h-[240px] w-full">
                    {connectPath.slice(1).map((id, idx) => {
                      const from = baseDots.find((d) => d.id === connectPath[idx])!;
                      const to = baseDots.find((d) => d.id === id)!;
                      return (
                        <line
                          key={`line-${from.id}-${to.id}`}
                          x1={from.x}
                          y1={from.y}
                          x2={to.x}
                          y2={to.y}
                          stroke="#2563eb"
                          strokeWidth="4"
                          strokeLinecap="round"
                        />
                      );
                    })}
                    {baseDots.map((dot) => {
                      const reached = connectPath.includes(dot.id);
                      const expected = connectPath.length + 1 === dot.id;
                      return (
                        <g key={dot.id} onClick={() => clickDot(dot.id)} className="cursor-pointer">
                          <circle
                            cx={dot.x}
                            cy={dot.y}
                            r="13"
                            fill={reached ? "#22c55e" : expected ? "#3b82f6" : "#e2e8f0"}
                          />
                          <text
                            x={dot.x}
                            y={dot.y + 4}
                            textAnchor="middle"
                            fontSize="10"
                            fill={reached || expected ? "#fff" : "#334155"}
                            fontWeight="700"
                          >
                            {dot.id}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              )}
              <div className="mt-2 text-xs text-zinc-600">
                {translate(locale, "fouten")}: {mistakes.connect}
              </div>
              {connectCompleted && lastTimes.connect !== null && (
                <div className="mt-2 flex gap-2">
                  <div className="rounded-xl bg-emerald-50 px-2 py-1 text-xs text-emerald-800">
                    {translate(locale, "Score")}: {formatMs(lastTimes.connect)}
                  </div>
                  <Button
                    type="button"
                    disabled={busy === "connect"}
                    onClick={() => void saveScore("connect", lastTimes.connect!, mistakes.connect)}
                  >
                    {translate(locale, "Stop & score opslaan")}
                  </Button>
                </div>
              )}
            </div>
          )}

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

          <div className="mt-3 rounded-2xl border border-[#d6deea] bg-white p-2 text-xs">
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
        </Card>
      ))}
    </div>
  );
}

