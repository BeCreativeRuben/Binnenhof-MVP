"use client";

import { createPortal } from "react-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Maximize2, X } from "lucide-react";
import type { Locale } from "@/lib/locales";
import { t, translate } from "@/lib/i18n";
import type { WordExplanationCard } from "@/lib/mock/flashcards-woordverklaring";
import { WORD_EXPLANATION_FLASHCARDS } from "@/lib/mock/flashcards-woordverklaring";
import { REFLECTIE_VRAGEN, findReflectQuestion } from "@/lib/mock/flashcards-reflectie";
import { buildMemoriespelDeck } from "@/lib/mock/memoriespel";
import type { MemoriespelTile } from "@/lib/mock/memoriespel";
import { ITEMS, type KieswijzerClusterId } from "@/lib/mock/kieswijzer";
import {
  OPLEIDING_OPTIES,
  getItemCorrectCluster,
  itemKindNl,
  itemLabelNl,
} from "@/lib/mock/talent-opleiding-match";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { Button, ButtonSecondary } from "@/components/ui/Button";
import { cn, interactiveHoverClasses } from "@/components/ui/ui";

const EDUCATION_ROUND_LEN = 8;
const REFLECT_ROUND_LEN = 12;

type GameKind =
  | "memory"
  | "connect"
  | "flashcards"
  | "flashcards_reflect"
  | "word_memory"
  | "education_match";

const ASSIGNMENTS = [
  {
    id: "as-1",
    titleNl: "Memory",
    descriptionNl: "Klik start en stop wanneer je klaar bent. Snelste tijd wint.",
    kind: "memory" as const,
  },
  {
    id: "as-4",
    titleNl: "Memoriespel",
    descriptionNl:
      "Draai twee kaarten om. Elk begrip hoort bij één voorbeeldzin. Zo snel mogelijk alle paren vinden!",
    kind: "word_memory" as const,
  },
  {
    id: "as-2",
    titleNl: "Connect the dots",
    descriptionNl: "Klik start en stop wanneer je klaar bent. Minste fouten wint bij gelijke tijd.",
    kind: "connect" as const,
  },
  {
    id: "as-3",
    titleNl: "Woordflash",
    descriptionNl:
      "Woordquiz óf reflectie (ja/nee-streak uit hetzelfde materiaal). Kies eerst een modus, dan start!",
    kind: "flashcards" as const,
  },
  {
    id: "as-5",
    titleNl: "Talent & techniek → opleiding",
    descriptionNl:
      "Lees elk talent of elke techniek en klik de juiste opleiding: organisatie & logistiek, logistiek onderhoud of horeca.",
    kind: "education_match" as const,
  },
] satisfies ReadonlyArray<{ id: string; titleNl: string; descriptionNl: string; kind: GameKind }>;

/** Maps API game types to assignment card ids (flashcards + reflect share one card). */
const FOCUS_ASSIGNMENT_ID: Record<GameKind, string> = {
  memory: "as-1",
  connect: "as-2",
  flashcards: "as-3",
  flashcards_reflect: "as-3",
  word_memory: "as-4",
  education_match: "as-5",
};

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

function buildQuizOptions(card: WordExplanationCard, all: WordExplanationCard[]) {
  const wrongPool = shuffle(all.filter((c) => c.id !== card.id).map((c) => c.term));
  return shuffle([card.term, ...wrongPool.slice(0, 3)]);
}

export function AssignmentsClient({ locale }: { locale: Locale }) {
  const [focusAssignmentId, setFocusAssignmentId] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [startAt, setStartAt] = useState<Record<"memory" | "connect" | "word_memory", number | null>>({
    memory: null,
    connect: null,
    word_memory: null,
  });
  const [mistakes, setMistakes] = useState<Record<"memory" | "connect" | "word_memory", number>>({
    memory: 0,
    connect: 0,
    word_memory: 0,
  });
  const [leaderboards, setLeaderboards] = useState<Record<GameKind, LeaderboardEntry[]>>({
    memory: [],
    connect: [],
    flashcards: [],
    flashcards_reflect: [],
    word_memory: [],
    education_match: [],
  });
  const [lastTimes, setLastTimes] = useState<Record<"memory" | "connect" | "word_memory", number | null>>({
    memory: null,
    connect: null,
    word_memory: null,
  });

  // Memory game state
  const [memoryDeck, setMemoryDeck] = useState<string[]>([]);
  const [memoryFlipped, setMemoryFlipped] = useState<number[]>([]);
  const [memoryMatched, setMemoryMatched] = useState<number[]>([]);
  const [memoryLocked, setMemoryLocked] = useState(false);

  const [wmDeck, setWmDeck] = useState<MemoriespelTile[]>([]);
  const [wmFlipped, setWmFlipped] = useState<number[]>([]);
  const [wmMatched, setWmMatched] = useState<number[]>([]);
  const [wmLocked, setWmLocked] = useState(false);

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

  const [fcDeckIds, setFcDeckIds] = useState<string[]>([]);
  const [fcIndex, setFcIndex] = useState(0);
  const [fcMistakes, setFcMistakes] = useState(0);
  const [fcStartAt, setFcStartAt] = useState<number | null>(null);
  const [fcLastMs, setFcLastMs] = useState<number | null>(null);
  const [fcFinished, setFcFinished] = useState(false);
  const [fcRevealed, setFcRevealed] = useState(false);
  const [fcPick, setFcPick] = useState<string | null>(null);
  const [fcMode, setFcMode] = useState<"quiz" | "reflect">("quiz");
  const [frIds, setFrIds] = useState<string[]>([]);
  const [frIndex, setFrIndex] = useState(0);
  const [frStreak, setFrStreak] = useState(0);
  const [frFinished, setFrFinished] = useState(false);
  const [frStartAt, setFrStartAt] = useState<number | null>(null);
  const [frLastMs, setFrLastMs] = useState<number | null>(null);
  const [frPulse, setFrPulse] = useState<"ja" | "nee" | null>(null);

  const fcCurrentCard = useMemo(() => {
    const id = fcDeckIds[fcIndex];
    return WORD_EXPLANATION_FLASHCARDS.find((c) => c.id === id);
  }, [fcDeckIds, fcIndex]);

  const fcChoiceOrder = useMemo(() => {
    if (!fcCurrentCard) return [];
    return buildQuizOptions(fcCurrentCard, WORD_EXPLANATION_FLASHCARDS);
  }, [fcCurrentCard]);

  const frCurrent = useMemo(
    () => (frIds.length > 0 ? findReflectQuestion(frIds[frIndex]) : undefined),
    [frIds, frIndex],
  );

  const wordflashIdle =
    fcDeckIds.length === 0 &&
    !fcFinished &&
    frIds.length === 0 &&
    !frFinished;

  const [eoItemIds, setEoItemIds] = useState<string[]>([]);
  const [eoIdx, setEoIdx] = useState(0);
  const [eoMistakes, setEoMistakes] = useState(0);
  const [eoStartAt, setEoStartAt] = useState<number | null>(null);
  const [eoLastMs, setEoLastMs] = useState<number | null>(null);
  const [eoFinished, setEoFinished] = useState(false);
  const [eoWrongFlash, setEoWrongFlash] = useState<KieswijzerClusterId | null>(null);

  const eoOptionOrder = useMemo(() => shuffle([...OPLEIDING_OPTIES]), [eoIdx]);

  const closeGameFocus = useCallback(() => {
    setFocusAssignmentId(null);
  }, []);

  useEffect(() => {
    if (!focusAssignmentId) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [focusAssignmentId]);

  useEffect(() => {
    if (!focusAssignmentId) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeGameFocus();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [focusAssignmentId, closeGameFocus]);

  const memoryCompleted = memoryDeck.length > 0 && memoryMatched.length === memoryDeck.length;
  const wmCompleted = wmDeck.length > 0 && wmMatched.length === wmDeck.length;
  const connectCompleted = connectPath.length === baseDots.length;

  async function saveScore(gameType: GameKind, timeMs: number, totalMistakes: number) {
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
    setFocusAssignmentId(FOCUS_ASSIGNMENT_ID.memory);
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

  function startWordMemory() {
    setWmDeck(buildMemoriespelDeck(8));
    setWmFlipped([]);
    setWmMatched([]);
    setWmLocked(false);
    setMistakes((prev) => ({ ...prev, word_memory: 0 }));
    setLastTimes((prev) => ({ ...prev, word_memory: null }));
    setStartAt((prev) => ({ ...prev, word_memory: Date.now() }));
    setFocusAssignmentId(FOCUS_ASSIGNMENT_ID.word_memory);
  }

  function clickWordMemoryCard(index: number) {
    if (wmLocked || wmMatched.includes(index) || wmFlipped.includes(index) || wmCompleted) {
      return;
    }
    const nextFlipped = [...wmFlipped, index];
    setWmFlipped(nextFlipped);
    if (nextFlipped.length < 2) return;

    const [a, b] = nextFlipped;
    const match = wmDeck[a]?.pairId === wmDeck[b]?.pairId;
    if (match) {
      setWmMatched((prev) => [...prev, a, b]);
      setWmFlipped([]);
      const willComplete = wmMatched.length + 2 === wmDeck.length;
      if (willComplete && startAt.word_memory) {
        setLastTimes((prev) => ({ ...prev, word_memory: Date.now() - startAt.word_memory! }));
      }
      return;
    }

    setMistakes((prev) => ({ ...prev, word_memory: prev.word_memory + 1 }));
    setWmLocked(true);
    window.setTimeout(() => {
      setWmFlipped([]);
      setWmLocked(false);
    }, 850);
  }

  function startConnect() {
    setConnectPath([]);
    setMistakes((prev) => ({ ...prev, connect: 0 }));
    setLastTimes((prev) => ({ ...prev, connect: null }));
    setStartAt((prev) => ({ ...prev, connect: Date.now() }));
    setFocusAssignmentId(FOCUS_ASSIGNMENT_ID.connect);
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

  function resetReflectOnly() {
    setFrIds([]);
    setFrIndex(0);
    setFrStreak(0);
    setFrFinished(false);
    setFrLastMs(null);
    setFrStartAt(null);
    setFrPulse(null);
  }

  function startFlashcardsQuiz() {
    resetReflectOnly();
    const order = shuffle(WORD_EXPLANATION_FLASHCARDS.map((c) => c.id));
    setFcDeckIds(order);
    setFcIndex(0);
    setFcMistakes(0);
    setFcLastMs(null);
    setFcFinished(false);
    setFcRevealed(false);
    setFcPick(null);
    // eslint-disable-next-line react-hooks/purity -- timer start; runs in click handler only
    setFcStartAt(Date.now());
    setFocusAssignmentId(FOCUS_ASSIGNMENT_ID.flashcards);
  }

  function startFlashcardsReflect() {
    setFcDeckIds([]);
    setFcIndex(0);
    setFcMistakes(0);
    setFcLastMs(null);
    setFcFinished(false);
    setFcRevealed(false);
    setFcPick(null);
    setFcStartAt(null);
    const ids = shuffle(REFLECTIE_VRAGEN.map((q) => q.id)).slice(
      0,
      Math.min(REFLECT_ROUND_LEN, REFLECTIE_VRAGEN.length),
    );
    setFrIds(ids);
    setFrIndex(0);
    setFrStreak(0);
    setFrFinished(false);
    setFrLastMs(null);
    setFrPulse(null);
    // eslint-disable-next-line react-hooks/purity -- timer start; runs in click handler only
    setFrStartAt(Date.now());
    setFocusAssignmentId(FOCUS_ASSIGNMENT_ID.flashcards_reflect);
  }

  function answerReflect(choice: "ja" | "nee") {
    if (frFinished || frPulse !== null || !frStartAt || frIds.length === 0) return;
    setFrPulse(choice);
    window.setTimeout(() => setFrPulse(null), 240);
    setFrStreak((s) => s + 1);
    const isLast = frIndex + 1 >= frIds.length;
    if (isLast) {
      setFrLastMs(Date.now() - frStartAt);
      setFrFinished(true);
      return;
    }
    setFrIndex((i) => i + 1);
  }

  function pickFlashOption(label: string) {
    if (fcFinished || fcRevealed || !fcStartAt || !fcCurrentCard) return;
    setFcPick(label);
    setFcRevealed(true);
    if (label !== fcCurrentCard.term) setFcMistakes((n) => n + 1);
  }

  function nextFlashcards() {
    if (!fcRevealed || fcFinished) return;
    if (fcIndex + 1 >= fcDeckIds.length) {
      setFcLastMs(Date.now() - fcStartAt!);
      setFcFinished(true);
      setFcRevealed(false);
      setFcPick(null);
      return;
    }
    setFcIndex((i) => i + 1);
    setFcRevealed(false);
    setFcPick(null);
  }

  function startEducationMatch() {
    const ids = shuffle(ITEMS.map((i) => i.id)).slice(
      0,
      Math.min(EDUCATION_ROUND_LEN, ITEMS.length),
    );
    setEoItemIds(ids);
    setEoIdx(0);
    setEoMistakes(0);
    setEoLastMs(null);
    setEoFinished(false);
    setEoWrongFlash(null);
    setEoStartAt(Date.now());
    setFocusAssignmentId(FOCUS_ASSIGNMENT_ID.education_match);
  }

  function pickEducation(cluster: KieswijzerClusterId) {
    const id = eoItemIds[eoIdx];
    if (!id || eoFinished || !eoStartAt) return;
    const ok = getItemCorrectCluster(id);
    if (!ok || cluster !== ok) {
      setEoMistakes((n) => n + 1);
      setEoWrongFlash(cluster);
      window.setTimeout(() => setEoWrongFlash(null), 550);
      return;
    }
    if (eoIdx + 1 >= eoItemIds.length) {
      // eslint-disable-next-line react-hooks/purity -- elapsed time in click handler
      setEoLastMs(Date.now() - eoStartAt);
      setEoFinished(true);
      return;
    }
    setEoIdx((i) => i + 1);
  }

  async function refreshLeaderboard(gameType: GameKind) {
    const res = await fetch(`/api/games/leaderboard?gameType=${gameType}`, {
      credentials: "include",
    });
    const data = await res.json();
    setLeaderboards((prev) => ({ ...prev, [gameType]: data?.leaderboard ?? [] }));
  }

  function renderMemoryBlock(large: boolean) {
    return (
      <div className="mt-3">
        {memoryDeck.length === 0 ? (
          <ButtonSecondary type="button" onClick={startMemory}>
            {translate(locale, "Start spel")}
          </ButtonSecondary>
        ) : (
          <div
            className={cn(
              "grid grid-cols-4",
              large ? "mx-auto w-full max-w-[22rem] gap-2 sm:max-w-[26rem] sm:gap-3" : "gap-2",
            )}
          >
            {memoryDeck.map((icon, idx) => {
              const visible = memoryFlipped.includes(idx) || memoryMatched.includes(idx);
              return (
                <button
                  key={`mem-${idx}`}
                  type="button"
                  onClick={() => clickMemoryCard(idx)}
                  className={cn(
                    interactiveHoverClasses,
                    large
                      ? "aspect-square flex items-center justify-center rounded-2xl border text-3xl active:scale-[0.98] sm:text-4xl"
                      : "aspect-square rounded-2xl border text-2xl active:scale-[0.98]",
                    visible
                      ? "border-blue-300 bg-blue-50"
                      : "border-[#d6deea] bg-white hover:bg-[#f8fbff] hover:border-[#c8d7ea]",
                  )}
                >
                  {visible ? icon : "?"}
                </button>
              );
            })}
          </div>
        )}
        <div className={cn("mt-2 text-zinc-600", large ? "text-sm" : "text-xs")}>
          {translate(locale, "fouten")}: {mistakes.memory}
        </div>
        {memoryCompleted && lastTimes.memory !== null && (
          <div className={cn("mt-2 flex flex-wrap gap-2", large && "gap-3")}>
            <div
              className={cn(
                "rounded-xl bg-emerald-50 px-2 py-1 text-emerald-800",
                large && "px-4 py-2 text-base",
              )}
            >
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
    );
  }

  function renderWordMemoryBlock(large: boolean) {
    return (
      <div className="mt-3">
        {wmDeck.length === 0 ? (
          <ButtonSecondary type="button" onClick={startWordMemory}>
            {translate(locale, "Start spel")}
          </ButtonSecondary>
        ) : (
          <div
            className={cn(
              "grid grid-cols-4",
              large ? "mx-auto max-w-3xl gap-3 sm:gap-4" : "gap-2",
            )}
          >
            {wmDeck.map((tile, idx) => {
              const visible = wmFlipped.includes(idx) || wmMatched.includes(idx);
              const matched = wmMatched.includes(idx);
              return (
                <button
                  key={`wm-${tile.pairId}-${idx}`}
                  type="button"
                  onClick={() => clickWordMemoryCard(idx)}
                  className={[
                    interactiveHoverClasses,
                    large
                      ? "flex min-h-[6.5rem] items-center justify-center rounded-2xl border px-2 py-3 text-left text-xs font-semibold leading-snug active:scale-[0.98] sm:min-h-[7rem] sm:text-sm"
                      : "flex min-h-[5.25rem] items-center justify-center rounded-2xl border px-2 py-2 text-left text-[11px] font-semibold leading-snug active:scale-[0.98]",
                    matched
                      ? "border-teal-400 bg-teal-50 text-teal-900"
                      : visible
                        ? "border-indigo-300 bg-gradient-to-br from-indigo-50 to-sky-50 text-zinc-900"
                        : "border-[#d6deea] bg-gradient-to-br from-slate-100 to-white text-zinc-400",
                  ].join(" ")}
                >
                  {!visible ? (
                    <span
                      className={cn(
                        "flex items-center justify-center rounded-xl bg-[#4a78b8]/15 text-[#355a9a] shadow-inner",
                        large ? "h-14 w-14 text-3xl" : "h-11 w-11 text-xl",
                      )}
                    >
                      ?
                    </span>
                  ) : (
                    <span className="max-h-[6.5rem] w-full overflow-y-auto text-center sm:max-h-[8rem]">
                      {tile.face}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
        <p className={cn("mt-2 text-zinc-500", large ? "text-xs" : "text-[11px]")}>
          {translate(locale, "Tip: elk begrip past bij juist één beschrijving.")}
        </p>
        <div className={cn("mt-1 text-zinc-600", large ? "text-sm" : "text-xs")}>
          {translate(locale, "fouten")}: {mistakes.word_memory}
        </div>
        {wmCompleted && lastTimes.word_memory !== null ? (
          <div className="mt-2 flex flex-wrap gap-2">
            <div
              className={cn(
                "rounded-xl bg-emerald-50 px-2 py-1 text-xs text-emerald-800",
                large && "px-4 py-2 text-base",
              )}
            >
              {translate(locale, "Score")}: {formatMs(lastTimes.word_memory)}
            </div>
            <Button
              type="button"
              disabled={busy === "word_memory"}
              onClick={() => void saveScore("word_memory", lastTimes.word_memory!, mistakes.word_memory)}
            >
              {translate(locale, "Stop & score opslaan")}
            </Button>
          </div>
        ) : null}
      </div>
    );
  }

  function renderConnectBlock(large: boolean) {
    return (
      <div className="mt-3">
        {!startAt.connect ? (
          <ButtonSecondary type="button" onClick={startConnect}>
            {translate(locale, "Start spel")}
          </ButtonSecondary>
        ) : (
          <div className="rounded-2xl border border-[#d6deea] bg-white p-2">
            <svg
              viewBox="0 0 170 170"
              className={cn("w-full", large ? "h-[min(58vh,480px)] max-h-[480px]" : "h-[240px]")}
            >
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
                      r={large ? "16" : "13"}
                      fill={reached ? "#22c55e" : expected ? "#3b82f6" : "#e2e8f0"}
                    />
                    <text
                      x={dot.x}
                      y={dot.y + (large ? 5 : 4)}
                      textAnchor="middle"
                      fontSize={large ? "12" : "10"}
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
        <div className={cn("mt-2 text-zinc-600", large ? "text-sm" : "text-xs")}>
          {translate(locale, "fouten")}: {mistakes.connect}
        </div>
        {connectCompleted && lastTimes.connect !== null && (
          <div className="mt-2 flex flex-wrap gap-2">
            <div
              className={cn(
                "rounded-xl bg-emerald-50 px-2 py-1 text-xs text-emerald-800",
                large && "px-4 py-2 text-base",
              )}
            >
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
    );
  }

  function renderFlashcardsBlock(large: boolean) {
    const pad = large ? "px-6 py-8" : "px-4 py-5";
    const titleSm = large ? "text-xs sm:text-sm" : "text-[11px]";
    const body = large ? "text-base sm:text-lg" : "text-sm";
    const optBtn = large
      ? "rounded-2xl border border-violet-200 bg-white px-3 py-5 text-center text-sm font-semibold sm:text-base"
      : "rounded-2xl border border-violet-200 bg-white px-2 py-3 text-center text-xs font-semibold";
    const reflQ = large ? "text-base sm:text-lg" : "text-sm";
    const reflBtn = large ? "h-16 text-lg sm:h-[4.25rem]" : "h-14 text-base";

    return (
      <div className="mt-3">
        {wordflashIdle ? (
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFcMode("quiz")}
                className={cn(
                  interactiveHoverClasses,
                  large ? "h-14 rounded-2xl border text-sm font-semibold" : "h-11 rounded-2xl border text-xs font-semibold",
                  "active:scale-[0.99]",
                  fcMode === "quiz"
                    ? "border-violet-700 bg-violet-700 text-white hover:brightness-110"
                    : "border-violet-200 bg-white text-zinc-800 hover:border-violet-300",
                )}
              >
                {translate(locale, "Woordquiz")}
              </button>
              <button
                type="button"
                onClick={() => setFcMode("reflect")}
                className={cn(
                  interactiveHoverClasses,
                  large ? "h-14 rounded-2xl border text-sm font-semibold" : "h-11 rounded-2xl border text-xs font-semibold",
                  "active:scale-[0.99]",
                  fcMode === "reflect"
                    ? "border-cyan-700 bg-cyan-700 text-white hover:brightness-110"
                    : "border-cyan-200 bg-white text-zinc-800 hover:border-cyan-300",
                )}
              >
                {translate(locale, "Reflectie")}
              </button>
            </div>
            <p className={cn("leading-snug text-zinc-600", large ? "text-sm" : "text-[11px]")}>
              {fcMode === "quiz"
                ? translate(locale, "Kies het juiste begrip bij elke situatie.")
                : translate(
                    locale,
                    "Ja of nee — er is geen fout antwoord; je bouwt een serie voor zelfinzicht.",
                  )}
            </p>
            <ButtonSecondary
              type="button"
              onClick={() => (fcMode === "quiz" ? startFlashcardsQuiz() : startFlashcardsReflect())}
            >
              {translate(locale, "Start spel")}
            </ButtonSecondary>
          </div>
        ) : null}

        {fcDeckIds.length > 0 && !fcFinished && fcCurrentCard ? (
          <div className="space-y-3">
            <div
              className={cn(
                "flex items-center justify-between gap-2 font-semibold text-zinc-600",
                large ? "text-sm" : "text-xs",
              )}
            >
              <span className="rounded-full bg-violet-100 px-3 py-1 text-violet-800">
                {translate(locale, "Kaart")} {fcIndex + 1}/{fcDeckIds.length}
              </span>
              <span>
                {translate(locale, "fouten")}: {fcMistakes}
              </span>
            </div>

            <div
              className={[
                "relative overflow-hidden rounded-3xl border-2 bg-gradient-to-br shadow-[0_14px_40px_rgba(109,40,217,0.18)] transition-all duration-500",
                pad,
                fcRevealed && fcPick === fcCurrentCard.term
                  ? "border-emerald-400 from-emerald-50 to-teal-50"
                  : fcRevealed
                    ? "border-rose-300 from-rose-50 to-orange-50"
                    : "border-violet-200 from-white to-violet-50",
              ].join(" ")}
            >
              <div
                className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-violet-200/50 blur-2xl"
                aria-hidden
              />
              <p className={cn("font-bold uppercase tracking-wider text-violet-700", titleSm)}>
                {translate(locale, "Welk woord hoort hierbij?")}
              </p>
              <p className={cn("mt-2 font-medium leading-snug text-zinc-900", body)}>{fcCurrentCard.scenario}</p>

              {!fcRevealed ? (
                <div className={cn("mt-4 grid grid-cols-2", large ? "gap-3" : "gap-2")}>
                  {fcChoiceOrder.map((choice, idx) => (
                    <button
                      key={`${fcIndex}-${idx}-${choice}`}
                      type="button"
                      onClick={() => pickFlashOption(choice)}
                      className={cn(
                        interactiveHoverClasses,
                        optBtn,
                        "text-zinc-800 shadow-sm hover:border-violet-400 hover:bg-violet-50 active:scale-[0.98]",
                      )}
                    >
                      {choice}
                    </button>
                  ))}
                </div>
              ) : (
                <div
                  className={cn(
                    "mt-4 rounded-2xl border border-white/70 bg-white/90 text-zinc-800 shadow-inner",
                    large ? "p-4 text-sm sm:text-base" : "p-3 text-xs",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                        fcPick === fcCurrentCard.term ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"
                      }`}
                    >
                      {fcPick === fcCurrentCard.term
                        ? translate(locale, "Goed!")
                        : translate(locale, "Bijna — lees hieronder")}
                    </span>
                    <span className="font-bold text-violet-800">{fcCurrentCard.term}</span>
                  </div>
                  <p className="mt-2 leading-relaxed">{fcCurrentCard.definition}</p>
                  <ButtonSecondary type="button" className="mt-3 w-full" onClick={nextFlashcards}>
                    {fcIndex + 1 >= fcDeckIds.length
                      ? translate(locale, "Afronden")
                      : translate(locale, "Volgende kaart")}
                  </ButtonSecondary>
                </div>
              )}
            </div>
          </div>
        ) : null}

        {frIds.length > 0 && !frFinished && frCurrent ? (
          <div className="space-y-3">
            <div
              className={cn(
                "flex items-center justify-between gap-2 font-semibold text-zinc-600",
                large ? "text-sm" : "text-xs",
              )}
            >
              <span className="rounded-full bg-cyan-100 px-3 py-1 text-cyan-900">
                {translate(locale, "Reflectie")} {frIndex + 1}/{frIds.length}
              </span>
              <span className="rounded-full bg-orange-100 px-3 py-1 font-bold text-orange-900">
                {translate(locale, "Serie")} 🔥 {frStreak}
              </span>
            </div>

            <div className="relative overflow-hidden rounded-3xl border-2 border-cyan-200 bg-gradient-to-br from-cyan-50 via-sky-50 to-indigo-50 px-4 py-5 shadow-[0_14px_40px_rgba(8,145,178,0.2)] sm:px-6 sm:py-7">
              <div
                className="pointer-events-none absolute -right-6 top-8 h-24 w-24 rounded-full bg-cyan-300/35 blur-2xl"
                aria-hidden
              />
              <p className={cn("font-bold uppercase tracking-wider text-cyan-900", titleSm)}>
                {translate(locale, "Voelt dit bij jou?")}
              </p>
              <p className={cn("mt-3 font-semibold leading-snug text-zinc-900", reflQ)}>
                {translate(locale, frCurrent.textNl)}
              </p>

              <div className={cn("mt-5 grid grid-cols-2", large ? "gap-4" : "gap-3")}>
                <button
                  type="button"
                  onClick={() => answerReflect("ja")}
                  disabled={frPulse !== null}
                  className={[
                    interactiveHoverClasses,
                    "rounded-2xl border-2 border-white/80 bg-white/90 font-bold text-emerald-800 shadow-md hover:bg-emerald-50 active:scale-[0.98] disabled:opacity-60",
                    reflBtn,
                    frPulse === "ja" ? "ring-2 ring-emerald-500" : "",
                  ].join(" ")}
                >
                  {translate(locale, "Ja")}
                </button>
                <button
                  type="button"
                  onClick={() => answerReflect("nee")}
                  disabled={frPulse !== null}
                  className={[
                    interactiveHoverClasses,
                    "rounded-2xl border-2 border-white/80 bg-white/90 font-bold text-rose-800 shadow-md hover:bg-rose-50 active:scale-[0.98] disabled:opacity-60",
                    reflBtn,
                    frPulse === "nee" ? "ring-2 ring-rose-500" : "",
                  ].join(" ")}
                >
                  {translate(locale, "Nee")}
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {fcFinished && fcLastMs !== null ? (
          <div
            className={cn(
              "mt-3 flex flex-col gap-3",
              large && "mx-auto w-full max-w-xl min-h-[52vh] justify-center",
            )}
          >
            <div
              className={cn(
                "rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-900",
                large ? "px-5 py-4 text-base" : "px-4 py-3 text-sm",
              )}
            >
              <div className="font-bold">{translate(locale, "Proficiat! Deck klaar.")}</div>
              <div className={cn("mt-1", large ? "text-sm" : "text-xs")}>
                {translate(locale, "Score")}: {formatMs(fcLastMs)} •{" "}
                <span className="font-semibold">{fcMistakes}</span> {translate(locale, "fouten")}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                disabled={busy === "flashcards"}
                onClick={() => void saveScore("flashcards", fcLastMs!, fcMistakes)}
              >
                {translate(locale, "Stop & score opslaan")}
              </Button>
              <ButtonSecondary
                type="button"
                onClick={() => {
                  if (large) closeGameFocus();
                  setFcFinished(false);
                  setFcDeckIds([]);
                  setFcIndex(0);
                  setFcPick(null);
                  setFcRevealed(false);
                  setFcLastMs(null);
                  setFcStartAt(null);
                  setFcMistakes(0);
                  resetReflectOnly();
                }}
              >
                {translate(locale, "Terug")}
              </ButtonSecondary>
              <ButtonSecondary type="button" onClick={() => startFlashcardsQuiz()}>
                {translate(locale, "Opnieuw spelen")}
              </ButtonSecondary>
            </div>
          </div>
        ) : null}

        {frFinished && frLastMs !== null ? (
          <div
            className={cn(
              "mt-3 flex flex-col gap-3",
              large && "mx-auto w-full max-w-xl min-h-[52vh] justify-center",
            )}
          >
            <div
              className={cn(
                "rounded-2xl border border-cyan-200 bg-cyan-50 text-cyan-950",
                large ? "px-5 py-4 text-base" : "px-4 py-3 text-sm",
              )}
            >
              <div className="font-bold">{translate(locale, "Reflectieronde af!")}</div>
              <div className={cn("mt-1", large ? "text-sm" : "text-xs")}>
                {translate(locale, "Serie voltooid")}: <span className="font-semibold">{frIds.length}</span> •{" "}
                {translate(locale, "tijd")}: {formatMs(frLastMs)}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                disabled={busy === "flashcards_reflect"}
                onClick={() => void saveScore("flashcards_reflect", frLastMs!, 0)}
              >
                {translate(locale, "Score opslaan")}
              </Button>
              <ButtonSecondary
                type="button"
                onClick={() => {
                  if (large) closeGameFocus();
                  setFcFinished(false);
                  setFcDeckIds([]);
                  setFcIndex(0);
                  setFcPick(null);
                  setFcRevealed(false);
                  setFcLastMs(null);
                  setFcStartAt(null);
                  setFcMistakes(0);
                  resetReflectOnly();
                }}
              >
                {translate(locale, "Terug")}
              </ButtonSecondary>
              <ButtonSecondary type="button" onClick={() => startFlashcardsReflect()}>
                {translate(locale, "Opnieuw spelen")}
              </ButtonSecondary>
            </div>
          </div>
        ) : null}

        {!large && renderFlashcardsLeaderboards()}
      </div>
    );
  }

  function renderEducationBlock(large: boolean) {
    return (
      <div className="mt-3">
        {eoItemIds.length === 0 && !eoFinished ? (
          <ButtonSecondary type="button" onClick={startEducationMatch}>
            {translate(locale, "Start spel")}
          </ButtonSecondary>
        ) : null}

        {eoItemIds.length > 0 && !eoFinished ? (
          <div className="space-y-3">
            <div
              className={cn(
                "flex items-center justify-between gap-2 font-semibold text-zinc-600",
                large ? "text-sm" : "text-xs",
              )}
            >
              <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-900">
                {translate(locale, "Vraag")} {eoIdx + 1}/{eoItemIds.length}
              </span>
              <span>
                {translate(locale, "fouten")}: {eoMistakes}
              </span>
            </div>

            <div
              className={cn(
                "relative overflow-hidden rounded-3xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 shadow-[0_14px_36px_rgba(217,119,6,0.2)]",
                large ? "px-6 py-8 sm:max-w-2xl" : "px-4 py-5",
              )}
            >
              <div className="pointer-events-none absolute -left-10 top-10 h-32 w-32 rounded-full bg-amber-200/40 blur-3xl" />
              <p
                className={cn(
                  "font-bold uppercase tracking-wide text-amber-800",
                  large ? "text-xs sm:text-sm" : "text-[11px]",
                )}
              >
                {translate(locale, "Welke opleiding past hier het best bij?")}
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                    itemKindNl(eoItemIds[eoIdx]) === "techniek"
                      ? "bg-[#355a9a] text-white"
                      : "bg-purple-600 text-white"
                  }`}
                >
                  {itemKindNl(eoItemIds[eoIdx]) === "techniek"
                    ? translate(locale, "Techniek")
                    : translate(locale, "Talent")}
                </span>
              </div>
              <p
                className={cn(
                  "mt-3 font-semibold leading-snug text-zinc-900",
                  large ? "text-lg sm:text-xl" : "text-base",
                )}
              >
                {translate(locale, itemLabelNl(eoItemIds[eoIdx]))}
              </p>

              <div className={cn("mt-5 flex flex-col", large ? "gap-3" : "gap-2")}>
                {eoOptionOrder.map((opt) => (
                  <button
                    key={opt.cluster}
                    type="button"
                    onClick={() => pickEducation(opt.cluster)}
                    className={[
                      interactiveHoverClasses,
                      "rounded-2xl border text-left font-semibold shadow-sm active:scale-[0.99]",
                      large ? "border-white/80 bg-white/90 px-5 py-4 text-base" : "border-white/80 bg-white/90 px-4 py-3 text-sm",
                      "text-zinc-900 hover:bg-white",
                      eoWrongFlash === opt.cluster ? "border-rose-400 ring-2 ring-rose-300" : "",
                    ].join(" ")}
                  >
                    {translate(locale, opt.labelNl)}
                  </button>
                ))}
              </div>
            </div>

            <p className={cn("text-zinc-500", large ? "text-xs sm:text-sm" : "text-[11px]")}>
              {translate(
                locale,
                "Komt niet overeen met je docent? In dit prototype gebruiken we de categorieën van de kieswijzer onder deze drie opleidingen.",
              )}
            </p>
          </div>
        ) : null}

        {eoFinished && eoLastMs !== null ? (
          <div
            className={cn(
              "mt-3 flex flex-col gap-3",
              large && "mx-auto w-full max-w-xl min-h-[52vh] justify-center",
            )}
          >
            <div
              className={cn(
                "rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-900",
                large ? "px-5 py-4 text-base" : "px-4 py-3 text-sm",
              )}
            >
              <div className="font-bold">{translate(locale, "Ronde af!")}</div>
              <div className={cn("mt-1", large ? "text-sm" : "text-xs")}>
                {translate(locale, "Score")}: {formatMs(eoLastMs)} •{" "}
                <span className="font-semibold">{eoMistakes}</span> {translate(locale, "fouten")}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                disabled={busy === "education_match"}
                onClick={() => void saveScore("education_match", eoLastMs!, eoMistakes)}
              >
                {translate(locale, "Stop & score opslaan")}
              </Button>
              <ButtonSecondary
                type="button"
                onClick={() => {
                  if (large) closeGameFocus();
                  setEoFinished(false);
                  setEoItemIds([]);
                  setEoIdx(0);
                  setEoMistakes(0);
                  setEoLastMs(null);
                  setEoStartAt(null);
                  setEoWrongFlash(null);
                }}
              >
                {translate(locale, "Terug")}
              </ButtonSecondary>
              <ButtonSecondary type="button" onClick={startEducationMatch}>
                {translate(locale, "Opnieuw spelen")}
              </ButtonSecondary>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  function renderFlashcardsLeaderboards() {
    return (
      <div className="mt-4 space-y-2 border-t border-zinc-200 pt-3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500">
          <span className="font-semibold text-zinc-700">{translate(locale, "Woordquiz")}</span>
          <button
            type="button"
            className="underline transition-opacity duration-200 motion-reduce:transition-none hover:opacity-75"
            onClick={() => void refreshLeaderboard("flashcards")}
          >
            {translate(locale, "Vernieuwen")}
          </button>
        </div>
        <div className="rounded-2xl border border-[#d6deea] bg-white p-2 text-xs">
          {(leaderboards.flashcards ?? []).length === 0 && (
            <div>{translate(locale, "Nog geen scores.")}</div>
          )}
          {(leaderboards.flashcards as LeaderboardEntry[]).map((row) => (
            <div key={`fc-${row.rank}-${row.initials}`} className="flex justify-between">
              <span>
                #{row.rank} {row.initials}
              </span>
              <span>
                {Math.round(row.timeMs / 1000)}s • {translate(locale, "fouten")} {row.mistakes}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500">
          <span className="font-semibold text-zinc-700">{translate(locale, "Reflectie")}</span>
          <button
            type="button"
            className="underline transition-opacity duration-200 motion-reduce:transition-none hover:opacity-75"
            onClick={() => void refreshLeaderboard("flashcards_reflect")}
          >
            {translate(locale, "Vernieuwen")}
          </button>
        </div>
        <div className="rounded-2xl border border-[#d6deea] bg-white p-2 text-xs">
          {(leaderboards.flashcards_reflect ?? []).length === 0 && (
            <div>{translate(locale, "Nog geen scores.")}</div>
          )}
          {(leaderboards.flashcards_reflect as LeaderboardEntry[]).map((row) => (
            <div key={`fcr-${row.rank}-${row.initials}`} className="flex justify-between">
              <span>
                #{row.rank} {row.initials}
              </span>
              <span>{Math.round(row.timeMs / 1000)}s</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const focusOverlayAssignment = focusAssignmentId
    ? ASSIGNMENTS.find((x) => x.id === focusAssignmentId)
    : null;
  const focusKind = focusOverlayAssignment?.kind;
  const focusPortal =
    typeof document !== "undefined" &&
    focusAssignmentId &&
    focusKind &&
    createPortal(
      <div
        className="fixed inset-0 z-[100] flex flex-col bg-[#0f172a]/65 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="game-focus-title"
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 bg-[#1e293b]/95 px-4 py-3 text-white">
          <div className="min-w-0">
            <p id="game-focus-title" className="truncate text-sm font-bold sm:text-base">
              {focusOverlayAssignment ? translate(locale, focusOverlayAssignment.titleNl) : ""}
            </p>
            <p className="mt-0.5 flex items-center gap-1.5 truncate text-[11px] text-slate-300">
              <Maximize2 className="h-3.5 w-3.5 shrink-0 opacity-80" aria-hidden />
              {translate(locale, "Focus op het spel")}
            </p>
          </div>
          <button
            type="button"
            onClick={closeGameFocus}
            className={cn(
              interactiveHoverClasses,
              "inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/20",
            )}
          >
            <X className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">{t(locale, "common.back")}</span>
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 sm:py-6">
          <Card className="mx-auto max-w-3xl border-[#d6deea] bg-[#f8fbff] shadow-xl sm:max-w-4xl">
            {focusKind === "memory" && renderMemoryBlock(true)}
            {focusKind === "word_memory" && renderWordMemoryBlock(true)}
            {focusKind === "connect" && renderConnectBlock(true)}
            {focusKind === "flashcards" && renderFlashcardsBlock(true)}
            {focusKind === "education_match" && renderEducationBlock(true)}
          </Card>
        </div>
      </div>,
      document.body,
    );

  return (
    <div className="flex flex-col gap-4 pb-6">
      {focusPortal}
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

          {a.kind === "memory" && focusAssignmentId !== a.id && renderMemoryBlock(false)}

          {a.kind === "word_memory" && focusAssignmentId !== a.id && renderWordMemoryBlock(false)}

          {a.kind === "connect" && focusAssignmentId !== a.id && renderConnectBlock(false)}

          {a.kind === "flashcards" && focusAssignmentId !== a.id && renderFlashcardsBlock(false)}

          {a.kind === "education_match" && focusAssignmentId !== a.id && renderEducationBlock(false)}

          {a.kind !== "flashcards" ? (
            <>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-zinc-500">
                  {translate(locale, "Per klas leaderboard (initialen)")}
                </span>
                <button
                  type="button"
                  className="text-xs underline transition-opacity duration-200 motion-reduce:transition-none hover:opacity-75"
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
                      {Math.round(row.timeMs / 1000)}s • {translate(locale, "fouten")}{" "}
                      {row.mistakes}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : null}
        </Card>
      ))}

      {focusAssignmentId === "as-3" && (
        <Card className="bg-[#f8fbff]">
          <CardTitle>{translate(locale, "Woordflash")}</CardTitle>
          <CardDescription>
            {translate(
              locale,
              "Woordquiz óf reflectie (ja/nee-streak uit hetzelfde materiaal). Kies eerst een modus, dan start!",
            )}
          </CardDescription>
          {renderFlashcardsLeaderboards()}
        </Card>
      )}
    </div>
  );
}

