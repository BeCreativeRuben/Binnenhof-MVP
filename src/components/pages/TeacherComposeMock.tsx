"use client";

import { useMemo, useState } from "react";
import type { Locale } from "@/lib/locales";
import { translate } from "@/lib/i18n";
import { DEMO_USERS } from "@/lib/mock/users";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { Button, ButtonSecondary } from "@/components/ui/Button";

type ComposeMode = "group" | "specific";

export function TeacherComposeMock({ locale }: { locale: Locale }) {
  const [mode, setMode] = useState<ComposeMode>("group");
  const [selectedParentIds, setSelectedParentIds] = useState<string[]>([]);
  const [context, setContext] = useState("");
  const [body, setBody] = useState("");
  const [sent, setSent] = useState(false);

  const parents = DEMO_USERS.parent;
  const recipients = useMemo(
    () =>
      mode === "group"
        ? parents
        : parents.filter((p) => selectedParentIds.includes(p.id)),
    [mode, parents, selectedParentIds],
  );

  function toggleParent(parentId: string) {
    setSelectedParentIds((prev) =>
      prev.includes(parentId)
        ? prev.filter((x) => x !== parentId)
        : [...prev, parentId],
    );
  }

  return (
    <Card className="bg-[#f8fbff]">
      <CardTitle>{translate(locale, "Bericht opmaken (demo)")}</CardTitle>
      <CardDescription>
        {translate(locale, "Mockup voor groepsbericht of bericht naar specifieke ouders/voogden.")}
      </CardDescription>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setMode("group")}
          className={`h-12 rounded-2xl border px-3 text-sm font-semibold ${
            mode === "group"
              ? "border-blue-500 bg-blue-500 text-white"
              : "border-[#d6deea] bg-white text-zinc-900 hover:bg-[#f8fbff]"
          }`}
        >
          {translate(locale, "Groepsbericht")}
        </button>
        <button
          type="button"
          onClick={() => setMode("specific")}
          className={`h-12 rounded-2xl border px-3 text-sm font-semibold ${
            mode === "specific"
              ? "border-blue-500 bg-blue-500 text-white"
              : "border-[#d6deea] bg-white text-zinc-900 hover:bg-[#f8fbff]"
          }`}
        >
          {translate(locale, "Specifieke ouder(s)")}
        </button>
      </div>

      {mode === "specific" && (
        <div className="mt-3 flex flex-col gap-2">
          {parents.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => toggleParent(p.id)}
              className={`flex min-h-12 items-center justify-between rounded-2xl border px-3 text-left text-sm font-semibold ${
                selectedParentIds.includes(p.id)
                  ? "border-blue-500 bg-blue-50"
                  : "border-[#d6deea] bg-white hover:bg-[#f8fbff]"
              }`}
            >
              <span>{p.name}</span>
              <span className="text-xs font-medium text-zinc-500">
                {p.languagePreference?.toUpperCase() ?? "NL"}
              </span>
            </button>
          ))}
        </div>
      )}

      <div className="mt-3 space-y-2">
        <input
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder={translate(locale, "Context (optioneel): bv. Rekenen, Stage, Workshop")}
          className="h-12 w-full rounded-2xl border border-[#d6deea] bg-white px-3 text-sm outline-none focus:border-blue-500"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={translate(locale, "Schrijf je bericht...")}
          className="min-h-24 w-full rounded-2xl border border-[#d6deea] bg-white p-3 text-sm outline-none focus:border-blue-500"
        />
      </div>

      <div className="mt-3 flex gap-2">
        <Button
          type="button"
          onClick={() => setSent(true)}
          disabled={mode === "specific" && recipients.length === 0}
        >
          {translate(locale, "Verzenden (mock)")}
        </Button>
        <ButtonSecondary
          type="button"
          onClick={() => {
            setBody("");
            setContext("");
            setSent(false);
            setSelectedParentIds([]);
            setMode("group");
          }}
        >
          {translate(locale, "Reset")}
        </ButtonSecondary>
      </div>

      <div className="mt-4 rounded-2xl border border-[#d6deea] bg-white p-3">
        <div className="text-xs font-semibold text-zinc-600">{translate(locale, "Preview")}</div>
        <div className="mt-2 text-sm text-zinc-700">
          {translate(locale, "Aan")}:{" "}
          {recipients.length > 0
            ? recipients.map((r) => r.name).join(", ")
            : translate(locale, "geen ontvangers")}
        </div>
        {context && (
          <div className="mt-1 text-sm text-zinc-700">
            {translate(locale, "Context")}: {context}
          </div>
        )}
        <div className="mt-2 rounded-xl border border-zinc-200 bg-white p-2 text-sm leading-6 text-zinc-800">
          {body || translate(locale, "Nog geen bericht.")}
        </div>
        <div className="mt-2 text-xs text-zinc-500">
          {translate(locale, "Auto-vertaling simulatie")}: {body ? translate(locale, body) : "—"}
        </div>
        {sent && (
          <div className="mt-2 text-xs font-semibold text-emerald-700">
            {translate(locale, "Bericht opgeslagen als demo-item (geen echte verzending in MVP).")}
          </div>
        )}
      </div>
    </Card>
  );
}

