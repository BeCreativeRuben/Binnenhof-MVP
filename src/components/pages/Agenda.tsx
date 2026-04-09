"use client";

import { useMemo, useState } from "react";
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
  const sorted = useMemo(
    () => [...items].sort((a, b) => a.startsAt.localeCompare(b.startsAt)),
    [items],
  );

  const firstDate = sorted[0]?.startsAt ? new Date(sorted[0].startsAt) : new Date();
  const [viewYear, setViewYear] = useState(firstDate.getUTCFullYear());
  const [viewMonth, setViewMonth] = useState(firstDate.getUTCMonth());
  const [selectedDayKey, setSelectedDayKey] = useState(
    `${firstDate.getUTCFullYear()}-${String(firstDate.getUTCMonth() + 1).padStart(2, "0")}-${String(firstDate.getUTCDate()).padStart(2, "0")}`,
  );

  function toDayKey(iso: string) {
    const d = new Date(iso);
    return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
  }

  const itemsByDay = useMemo(() => {
    const map = new Map<string, AgendaItem[]>();
    for (const item of sorted) {
      const key = toDayKey(item.startsAt);
      const list = map.get(key) ?? [];
      list.push(item);
      map.set(key, list);
    }
    return map;
  }, [sorted]);

  const selectedItems = itemsByDay.get(selectedDayKey) ?? [];

  const monthStart = new Date(Date.UTC(viewYear, viewMonth, 1));
  const daysInMonth = new Date(Date.UTC(viewYear, viewMonth + 1, 0)).getUTCDate();
  const firstWeekday = (monthStart.getUTCDay() + 6) % 7; // monday=0
  const leadingBlanks = Array.from({ length: firstWeekday }, (_, i) => i);
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const formatLocale =
    locale === "nl"
      ? "nl-BE"
      : locale === "tr"
        ? "tr-TR"
        : locale === "bg"
          ? "bg-BG"
          : locale === "sk"
            ? "sk-SK"
            : locale === "ps"
              ? "ps-AF"
              : locale === "fa"
                ? "fa-AF"
            : "en-GB";
  const monthLabel = new Intl.DateTimeFormat(formatLocale, {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(monthStart);

  const weekdayLabels =
    locale === "nl"
      ? ["ma", "di", "wo", "do", "vr", "za", "zo"]
      : locale === "tr"
        ? ["pt", "sa", "ca", "pe", "cu", "ct", "pa"]
        : locale === "bg"
          ? ["пн", "вт", "ср", "чт", "пт", "сб", "нд"]
          : locale === "sk"
            ? ["po", "ut", "st", "št", "pi", "so", "ne"]
            : locale === "ps" || locale === "fa"
              ? ["د", "س", "چ", "پ", "ج", "ش", "ی"]
        : ["mo", "tu", "we", "th", "fr", "sa", "su"];

  function moveMonth(delta: number) {
    const next = new Date(Date.UTC(viewYear, viewMonth + delta, 1));
    setViewYear(next.getUTCFullYear());
    setViewMonth(next.getUTCMonth());
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className="overflow-hidden border-0 bg-gradient-to-r from-[#4c8eed] to-[#2c66ea] text-white shadow-[0_12px_28px_rgba(44,102,234,0.35)]">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          {t(locale, "agenda.title")}
        </h1>
        <p className="mt-2 text-sm text-blue-100">
          {t(locale, "agenda.upcoming")}
        </p>
      </Card>

      <Card className="bg-[#f8fbff]">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => moveMonth(-1)}
            className="h-10 w-10 rounded-full border border-zinc-200 bg-white text-lg font-semibold"
            aria-label={translate(locale, "Vorige maand")}
          >
            ‹
          </button>
          <div className="text-base font-semibold capitalize">{monthLabel}</div>
          <button
            type="button"
            onClick={() => moveMonth(1)}
            className="h-10 w-10 rounded-full border border-zinc-200 bg-white text-lg font-semibold"
            aria-label={translate(locale, "Volgende maand")}
          >
            ›
          </button>
        </div>

        <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs font-semibold text-zinc-500">
          {weekdayLabels.map((label) => (
            <div key={label} className="py-1">
              {label}
            </div>
          ))}
        </div>

        <div className="mt-1 grid grid-cols-7 gap-1">
          {leadingBlanks.map((b) => (
            <div key={`blank-${b}`} />
          ))}
          {monthDays.map((day) => {
            const key = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const hasItems = (itemsByDay.get(key)?.length ?? 0) > 0;
            const isSelected = selectedDayKey === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedDayKey(key)}
                className={`relative h-12 rounded-2xl border text-sm font-semibold active:scale-[0.98] ${
                  isSelected
                    ? "border-blue-500 bg-blue-500 text-white"
                    : hasItems
                      ? "border-blue-200 bg-blue-50 text-blue-700"
                      : "border-zinc-200 bg-white text-zinc-700"
                }`}
              >
                {day}
                {hasItems && !isSelected && (
                  <span className="absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-blue-500" />
                )}
              </button>
            );
          })}
        </div>
      </Card>

      <Card className="bg-[#f8fbff]">
        <CardTitle>
          {translate(locale, "Items op geselecteerde dag")} ({selectedItems.length})
        </CardTitle>
        {selectedItems.length === 0 && (
          <CardDescription>{translate(locale, "Geen agenda-items op deze dag.")}</CardDescription>
        )}
        <div className="mt-2 flex flex-col gap-2">
          {selectedItems.map((item) => (
            <div key={item.id} className="rounded-2xl border border-zinc-200 bg-white p-3">
              <CardTitle>{translate(locale, item.titleNl)}</CardTitle>
              <CardDescription>
                {stableDateTime(item.startsAt)}
                {item.endsAt ? ` – ${stableDateTime(item.endsAt)}` : ""}
              </CardDescription>
              {item.locationNl && (
                <div className="mt-2 text-sm text-zinc-700">
                  📍 {translate(locale, item.locationNl)}
                </div>
              )}
              {item.descriptionNl && (
                <div className="mt-2 text-sm leading-6 text-zinc-700">
                  {translate(locale, item.descriptionNl)}
                </div>
              )}
              <div className="mt-2 inline-flex items-center">
                <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs font-semibold text-zinc-700">
                  {item.type === "workshop"
                    ? t(locale, "nav.workshops")
                    : item.type === "student"
                      ? t(locale, "student.title")
                      : translate(locale, "School")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="bg-[#f8fbff]">
        <CardDescription>
          {translate(locale, "Tip: tik op een dag om snel alle afspraken te bekijken.")}
        </CardDescription>
      </Card>
    </div>
  );
}

