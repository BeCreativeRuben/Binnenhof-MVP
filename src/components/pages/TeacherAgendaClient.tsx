"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Locale } from "@/lib/locales";
import { t } from "@/lib/i18n";
import type { AgendaItem } from "@/lib/mock/agenda";
import { AgendaList } from "@/components/pages/Agenda";
import { Button, ButtonSecondary } from "@/components/ui/Button";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { cn, interactiveHoverClasses } from "@/components/ui/ui";
import { useSession } from "@/components/session/SessionProvider";

export function TeacherAgendaClient({
  locale,
  baseItems,
}: {
  locale: Locale;
  baseItems: AgendaItem[];
}) {
  const { user } = useSession();
  const [teacherItems, setTeacherItems] = useState<AgendaItem[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [savedOk, setSavedOk] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [titleNl, setTitleNl] = useState("");
  const [startsLocal, setStartsLocal] = useState("");
  const [endsLocal, setEndsLocal] = useState("");
  const [locationNl, setLocationNl] = useState("");
  const [descriptionNl, setDescriptionNl] = useState("");
  const [itemType, setItemType] = useState<AgendaItem["type"]>("school");

  const mergedItems = useMemo(() => [...baseItems, ...teacherItems], [baseItems, teacherItems]);

  const refreshTeacherItems = useCallback(async () => {
    try {
      const res = await fetch("/api/agenda/teacher", { credentials: "include" });
      const data = (await res.json()) as { ok?: boolean; items?: AgendaItem[] };
      if (!res.ok || !data.ok) {
        setLoadError(data && typeof data === "object" && "message" in data ? String(data.message) : "load");
        return;
      }
      setTeacherItems(data.items ?? []);
      setLoadError(null);
    } catch {
      setLoadError("network");
    }
  }, []);

  useEffect(() => {
    if (user?.role !== "teacher") return;
    void refreshTeacherItems();
  }, [user?.role, refreshTeacherItems]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!startsLocal) return;
    setBusy(true);
    setSubmitError(null);
    setSavedOk(false);
    const startsAt = new Date(startsLocal).toISOString();
    const endsAt =
      endsLocal.trim() && !Number.isNaN(new Date(endsLocal).getTime())
        ? new Date(endsLocal).toISOString()
        : undefined;
    try {
      const res = await fetch("/api/agenda/teacher", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titleNl: titleNl.trim(),
          startsAt,
          endsAt: endsAt ?? null,
          locationNl: locationNl.trim() || null,
          descriptionNl: descriptionNl.trim() || null,
          type: itemType,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; message?: string; item?: AgendaItem };
      if (!res.ok || !data.ok || !data.item) {
        setSubmitError(data.message ?? "fail");
        setBusy(false);
        return;
      }
      setTeacherItems((prev) => [...prev, data.item!].sort((a, b) => a.startsAt.localeCompare(b.startsAt)));
      setTitleNl("");
      setStartsLocal("");
      setEndsLocal("");
      setLocationNl("");
      setDescriptionNl("");
      setItemType("school");
      setSavedOk(true);
    } catch {
      setSubmitError("network");
    } finally {
      setBusy(false);
    }
  }

  if (user?.role !== "teacher") {
    return <AgendaList locale={locale} items={baseItems} />;
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className="bg-[#f8fbff]">
        <CardTitle>{t(locale, "agenda.teacher.sectionTitle")}</CardTitle>
        <CardDescription>{t(locale, "agenda.teacher.sectionHint")}</CardDescription>

        {loadError && (
          <p className="mt-2 text-xs text-rose-600">
            {t(locale, "agenda.teacher.loadFailed")}
          </p>
        )}

        <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-3">
          <label className="block text-xs font-semibold text-zinc-700">
            {t(locale, "agenda.teacher.fieldTitle")}
            <input
              required
              value={titleNl}
              onChange={(e) => setTitleNl(e.target.value)}
              className="mt-1 w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-zinc-900"
            />
          </label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="block text-xs font-semibold text-zinc-700">
              {t(locale, "agenda.teacher.fieldStartsAt")}
              <input
                type="datetime-local"
                required
                value={startsLocal}
                onChange={(e) => setStartsLocal(e.target.value)}
                className="mt-1 w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-zinc-900"
              />
            </label>
            <label className="block text-xs font-semibold text-zinc-700">
              {t(locale, "agenda.teacher.fieldEndsAt")}
              <input
                type="datetime-local"
                value={endsLocal}
                onChange={(e) => setEndsLocal(e.target.value)}
                className="mt-1 w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-zinc-900"
              />
            </label>
          </div>
          <label className="block text-xs font-semibold text-zinc-700">
            {t(locale, "agenda.teacher.fieldLocation")}
            <input
              value={locationNl}
              onChange={(e) => setLocationNl(e.target.value)}
              className="mt-1 w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-zinc-900"
            />
          </label>
          <label className="block text-xs font-semibold text-zinc-700">
            {t(locale, "agenda.teacher.fieldDescription")}
            <textarea
              value={descriptionNl}
              onChange={(e) => setDescriptionNl(e.target.value)}
              rows={3}
              className="mt-1 w-full resize-y rounded-2xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-zinc-900"
            />
          </label>
          <div>
            <div className="text-xs font-semibold text-zinc-700">{t(locale, "agenda.teacher.fieldType")}</div>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {(
                [
                  ["school", t(locale, "agenda.teacher.typeSchool")] as const,
                  ["workshop", t(locale, "nav.workshops")] as const,
                  ["student", t(locale, "student.title")] as const,
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setItemType(value)}
                  className={cn(
                    interactiveHoverClasses,
                    "h-11 rounded-2xl border text-xs font-semibold active:scale-[0.99]",
                    itemType === value
                      ? "border-zinc-900 bg-zinc-900 text-white hover:brightness-110"
                      : "border-zinc-200 bg-white hover:border-[#c8d7ea]",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={busy}>
              {t(locale, "agenda.teacher.submit")}
            </Button>
            <ButtonSecondary type="button" disabled={busy} onClick={() => void refreshTeacherItems()}>
              {t(locale, "agenda.teacher.refresh")}
            </ButtonSecondary>
          </div>

          {savedOk && <p className="text-xs font-medium text-emerald-700">{t(locale, "agenda.teacher.saved")}</p>}
          {submitError && (
            <p className="text-xs text-rose-600">{t(locale, "agenda.teacher.failed")}</p>
          )}
        </form>
      </Card>

      <AgendaList locale={locale} items={mergedItems} showTeacherBadge />
    </div>
  );
}
