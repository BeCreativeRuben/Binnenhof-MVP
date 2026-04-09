"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/components/session/SessionProvider";
import type { Locale } from "@/lib/locales";
import { LOCALE_LABELS, LOCALES } from "@/lib/locales";
import { t, translate } from "@/lib/i18n";
import { Button, ButtonSecondary } from "@/components/ui/Button";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";

export function LoginClient({ locale }: { locale: Locale }) {
  const router = useRouter();
  const { login } = useSession();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-4 pb-4">
      <div className="pt-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t(locale, "login.title")}
        </h1>
        <p className="mt-2 text-sm text-zinc-600">{t(locale, "login.subtitle")}</p>
      </div>

      <Card>
        <CardTitle>{t(locale, "login.language")}</CardTitle>
        <CardDescription>
          {t(locale, "common.optional")} - {translate(locale, "voor ouders wordt dit de vaste taal.")}
        </CardDescription>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {LOCALES.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => router.push(`/${l}/login`)}
              className={`h-12 rounded-2xl border px-3 text-left text-sm font-semibold active:scale-[0.99] ${
                l === locale
                  ? "border-zinc-900 bg-zinc-50"
                  : "border-zinc-200 bg-white hover:bg-zinc-50"
              }`}
            >
              {LOCALE_LABELS[l]}
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <CardTitle>{t(locale, "login.user")}</CardTitle>
        <CardDescription>{translate(locale, "Log in met accountgegevens uit de database.")}</CardDescription>
        <div className="mt-3 flex flex-col gap-2">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={translate(locale, "Gebruikersnaam")}
            className="h-12 rounded-2xl border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-900"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={translate(locale, "Wachtwoord")}
            type="password"
            className="h-12 rounded-2xl border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-900"
          />
        </div>
      </Card>

      <div className="mt-1 flex flex-col gap-2">
        <Button
          type="button"
          onClick={async () => {
            setBusy(true);
            setMessage(null);
            const result = await login({ username, password });
            setBusy(false);
            if (!result.ok) {
              setMessage(result.message);
              return;
            }
            const me = await fetch("/api/auth/me", { credentials: "include" }).then((r) => r.json());
            const role = me?.user?.role;
            if (!role) {
              setMessage(translate(locale, "Kon rol niet laden."));
              return;
            }
            router.push(`/${locale}/${role}`);
          }}
          disabled={busy}
        >
          {busy ? translate(locale, "Bezig...") : t(locale, "login.continue")}
        </Button>
        <ButtonSecondary
          type="button"
          onClick={async () => {
            setBusy(true);
            setMessage(null);
            const res = await fetch("/api/setup", { method: "POST" });
            const data = await res.json();
            setBusy(false);
            if (!res.ok || !data.ok) {
              setMessage(data?.message ?? translate(locale, "Setup mislukt."));
              return;
            }
            setMessage(
              translate(locale, "Setup klaar. Demo-wachtwoord voor alle accounts: Welkom123!"),
            );
          }}
          disabled={busy}
        >
          {translate(locale, "Database setup (demo accounts)")}
        </ButtonSecondary>
        {message && <p className="text-sm text-zinc-600">{message}</p>}
      </div>
    </div>
  );
}

