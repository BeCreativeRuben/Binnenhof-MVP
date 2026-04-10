"use client";

import { useMemo, useState } from "react";
import jsPDF from "jspdf";
import type { Locale } from "@/lib/locales";
import { t, translate } from "@/lib/i18n";
import { ITEMS, scoreClusters } from "@/lib/mock/kieswijzer";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { Button, ButtonSecondary } from "@/components/ui/Button";
import { cn } from "@/components/ui/ui";
import { useSession } from "@/components/session/SessionProvider";

function percent(part: number, total: number) {
  if (total <= 0) return 0;
  return Math.round((part / total) * 100);
}

export function KieswijzerClient({ locale }: { locale: Locale }) {
  type PersonRef = { id: string; full_name: string; class_id: string | null };
  type ContextData =
    | { role: "parent"; children: PersonRef[] }
    | { role: "teacher"; students: PersonRef[] }
    | { role: "student"; student: PersonRef }
    | null;
  type Submission = { selected_item_ids: string[]; comment: string | null };
  type RoleName = "parent" | "student" | "teacher";
  type OverviewData = {
    student: PersonRef;
    submissions: Partial<Record<RoleName, Submission | null>>;
    roleScores: Array<{ role: RoleName; results: Array<{ cluster: { id: string; titleNl: string; subtitleNl: string }; score: number }> }>;
  } | null;

  const { user } = useSession();
  const technieken = useMemo(() => ITEMS.filter((i) => i.kind === "techniek"), []);
  const talenten = useMemo(() => ITEMS.filter((i) => i.kind === "talent"), []);
  const [selected, setSelected] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [studentId, setStudentId] = useState<string>("");
  const [context, setContext] = useState<ContextData>(null);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [overview, setOverview] = useState<OverviewData>(null);
  const [teacherMode, setTeacherMode] = useState<"fill" | "overview">("fill");
  const [busy, setBusy] = useState(false);
  const [activeTab, setActiveTab] = useState<"parent" | "student" | "teacher" | "compare">(
    "compare",
  );

  const results = useMemo(() => scoreClusters(selected), [selected]);
  const totalScore = results.reduce((acc, r) => acc + r.score, 0);
  const role = user?.role;

  async function refreshContext() {
    const res = await fetch("/api/kieswijzer/context", { credentials: "include" });
    const data = (await res.json()) as ContextData;
    setContext(data);

    if (data?.role === "student" && data?.student?.id) {
      setStudentId(data.student.id);
    }
    if (data?.role === "parent" && data?.children?.[0]?.id && !studentId) {
      setStudentId(data.children[0].id);
    }
    if (data?.role === "teacher" && data?.students?.[0]?.id && !studentId) {
      setStudentId(data.students[0].id);
    }
  }

  async function refreshSubmission(selectedStudentId: string) {
    if (!selectedStudentId) return;
    const res = await fetch(`/api/kieswijzer/submission?studentId=${selectedStudentId}`, {
      credentials: "include",
    });
    await res.json();
  }

  async function refreshOverview(selectedStudentId: string) {
    if (!selectedStudentId || role !== "teacher") return;
    const res = await fetch(`/api/kieswijzer/overview?studentId=${selectedStudentId}`, {
      credentials: "include",
    });
    const data = (await res.json()) as { ok: boolean } & OverviewData;
    setOverview(data?.ok ? data : null);
  }

  const effectiveStudentId = studentId || (role === "student" ? user?.id ?? "" : "");

  function exportOverviewPdf() {
    if (!overview?.student) return;
    const doc = new jsPDF();
    let y = 16;
    doc.setFontSize(16);
    doc.text("Kieswijzer Overzicht", 14, y);
    y += 8;
    doc.setFontSize(11);
    doc.text(`Leerling: ${overview.student.full_name}`, 14, y);
    y += 6;
    doc.text(`Klas: ${overview.student.class_id ?? "-"}`, 14, y);
    y += 6;
    doc.text(`Datum: ${new Date().toLocaleDateString("nl-BE")}`, 14, y);
    y += 10;

    const roles: Array<"parent" | "student" | "teacher"> = ["parent", "student", "teacher"];
    for (const r of roles) {
      const sub = overview.submissions?.[r];
      doc.setFontSize(12);
      doc.text(
        r === "parent" ? "Ouder/Voogd" : r === "student" ? "Leerling" : "Leerkracht",
        14,
        y,
      );
      y += 6;
      if (!sub) {
        doc.setFontSize(10);
        doc.text("Niet ingevuld", 18, y);
        y += 8;
        continue;
      }
      const roleScore = (overview.roleScores ?? []).find((x) => x.role === r);
      for (const item of roleScore?.results ?? []) {
        doc.setFontSize(10);
        doc.text(`${item.cluster.titleNl}: ${item.score}`, 18, y);
        y += 5;
      }
      doc.text(`Commentaar: ${sub.comment ?? "-"}`, 18, y);
      y += 8;
      if (y > 270) {
        doc.addPage();
        y = 16;
      }
    }
    doc.save(`kieswijzer-${overview.student.full_name}.pdf`);
  }

  return (
    <div className="flex flex-col gap-4 pb-6">
      <Card className="overflow-hidden border-0 bg-gradient-to-r from-[#4c8eed] to-[#2c66ea] text-white shadow-[0_12px_28px_rgba(44,102,234,0.35)]">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          {t(locale, "kieswijzer.title")}
        </h1>
        <p className="mt-2 text-sm text-blue-100">{t(locale, "kieswijzer.subtitle")}</p>
      </Card>

      <Card className="bg-[#f8fbff]">
        <CardDescription>
          <button
            type="button"
            className="underline"
            onClick={async () => {
              await refreshContext();
              const id = studentId || (role === "student" ? user?.id ?? "" : "");
              if (id) {
                await refreshSubmission(id);
                if (role === "teacher") {
                  await refreshOverview(id);
                }
              }
            }}
          >
            {translate(locale, "Gegevens laden/verversen")}
          </button>
        </CardDescription>
      </Card>

      {context?.role === "parent" && (
        <Card className="bg-[#f8fbff]">
          <CardTitle>{translate(locale, "Kind selecteren")}</CardTitle>
          <div className="mt-3 flex flex-col gap-2">
            {context.children?.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={async () => {
                  setStudentId(c.id);
                  await refreshSubmission(c.id);
                }}
                className={`h-11 rounded-2xl border px-3 text-left text-sm font-semibold ${
                  studentId === c.id ? "border-zinc-900 bg-zinc-50" : "border-zinc-200 bg-white"
                }`}
              >
                {c.full_name}
              </button>
            ))}
          </div>
        </Card>
      )}

      {context?.role === "teacher" && (
        <Card className="bg-[#f8fbff]">
          <CardTitle>{translate(locale, "Leerkracht modus")}</CardTitle>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setTeacherMode("fill")}
              className={`h-11 rounded-2xl border text-sm font-semibold ${
                teacherMode === "fill" ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-200 bg-white"
              }`}
            >
              {translate(locale, "Invullen")}
            </button>
            <button
              type="button"
              onClick={() => setTeacherMode("overview")}
              className={`h-11 rounded-2xl border text-sm font-semibold ${
                teacherMode === "overview"
                  ? "border-zinc-900 bg-zinc-900 text-white"
                  : "border-zinc-200 bg-white"
              }`}
            >
              {translate(locale, "Resultaten")}
            </button>
          </div>
        </Card>
      )}

      {context?.role === "teacher" && (
        <Card className="bg-[#f8fbff]">
          <CardTitle>{translate(locale, "Leerling selecteren")}</CardTitle>
          <div className="mt-3 flex flex-col gap-2">
            {context.students?.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={async () => {
                  setStudentId(s.id);
                  await refreshSubmission(s.id);
                  await refreshOverview(s.id);
                }}
                className={`h-11 rounded-2xl border px-3 text-left text-sm font-semibold ${
                  studentId === s.id ? "border-zinc-900 bg-zinc-50" : "border-zinc-200 bg-white"
                }`}
              >
                {s.full_name}
              </button>
            ))}
          </div>
        </Card>
      )}

      {teacherMode === "overview" && context?.role === "teacher" ? (
        <Card className="bg-[#f8fbff]">
          <CardTitle>{translate(locale, "Overzicht leerkracht")}</CardTitle>
          <CardDescription>
            {translate(locale, "Bekijk per partij de input en vergelijk gemiddelde verschillen.")}
          </CardDescription>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {(["compare", "parent", "student", "teacher"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`h-10 rounded-xl border text-xs font-semibold ${
                  activeTab === tab ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-200 bg-white"
                }`}
              >
                {tab === "compare"
                  ? translate(locale, "Vergelijking")
                  : tab === "parent"
                    ? translate(locale, "Ouder/Voogd")
                    : tab === "student"
                      ? translate(locale, "Leerling")
                      : translate(locale, "Leerkracht")}
              </button>
            ))}
          </div>
          <div className="mt-3 rounded-2xl border border-zinc-200 bg-white p-3 text-sm">
            {activeTab === "compare" ? (
              <>
                {(overview?.roleScores ?? []).map((r) => (
                  <div key={r.role} className="mb-3">
                    <div className="font-semibold">
                      {r.role === "parent"
                        ? translate(locale, "Ouder/Voogd")
                        : r.role === "student"
                          ? translate(locale, "Leerling")
                          : translate(locale, "Leerkracht")}
                    </div>
                    {(r.results ?? []).map((entry) => (
                      <div key={entry.cluster.id} className="text-zinc-700">
                        {entry.cluster.titleNl}: {entry.score}
                      </div>
                    ))}
                  </div>
                ))}
              </>
            ) : (
              <div>
                <div>
                  {translate(locale, "Commentaar")}: {overview?.submissions?.[activeTab]?.comment ?? "-"}
                </div>
                <div className="mt-2 text-zinc-700">
                  {translate(locale, "Ingevuld")}: {overview?.submissions?.[activeTab] ? translate(locale, "Ja") : translate(locale, "Nee")}
                </div>
              </div>
            )}
          </div>
          <div className="mt-3">
            <ButtonSecondary type="button" onClick={exportOverviewPdf}>
              {translate(locale, "Export PDF (NL)")}
            </ButtonSecondary>
          </div>
        </Card>
      ) : (
        <>
      <Card className="bg-[#f8fbff]">
        <CardTitle>{translate(locale, "Technieken")}</CardTitle>
        <CardDescription>{translate(locale, "Kies wat je graag doet.")}</CardDescription>
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

      <Card className="bg-[#f8fbff]">
        <CardTitle>{translate(locale, "Talenten")}</CardTitle>
        <CardDescription>{translate(locale, "Kies wat je goed kan.")}</CardDescription>
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
            {translate(locale, "Reset")}
          </ButtonSecondary>
        </div>
        <div className="mt-3">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={translate(locale, "Optioneel commentaar")}
            className="min-h-24 w-full rounded-2xl border border-zinc-200 bg-white p-3 text-sm shadow-sm outline-none focus:border-zinc-900"
          />
        </div>
        <div className="mt-3">
          <Button
            type="button"
            disabled={busy || selected.length === 0 || !effectiveStudentId}
            onClick={async () => {
              setBusy(true);
              setMessage(null);
              const res = await fetch("/api/kieswijzer/submission", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                  studentId: effectiveStudentId,
                  selectedItemIds: selected,
                  comment,
                }),
              });
              const data = await res.json();
              setBusy(false);
              if (!res.ok || !data.ok) {
                setMessage(data?.message ?? translate(locale, "Opslaan mislukt"));
                return;
              }
              setSubmitted(true);
              await refreshSubmission(effectiveStudentId);
            }}
          >
            {translate(locale, "Definitief indienen")}
          </Button>
          {message && <p className="mt-2 text-xs text-zinc-600">{message}</p>}
        </div>
      </Card>

      {submitted && (
        <Card className="bg-[#f8fbff]">
          <CardTitle>{t(locale, "kieswijzer.results")}</CardTitle>
          <CardDescription>
            {translate(locale, "Score op basis van je keuzes. Resultaat wordt pas na definitieve submit getoond.")}
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
          </div>
        </Card>
      )}
      </>
      )}
    </div>
  );
}

