"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DEMO_USERS } from "@/lib/mock/users";
import type { Role } from "@/components/session/SessionProvider";
import { useSession } from "@/components/session/SessionProvider";
import type { Locale } from "@/lib/locales";
import { LOCALE_LABELS, LOCALES } from "@/lib/locales";
import { t } from "@/lib/i18n";
import { Button, ButtonSecondary } from "@/components/ui/Button";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";

export function LoginClient({ locale }: { locale: Locale }) {
  const router = useRouter();
  const { login } = useSession();

  const [role, setRole] = useState<Role>("parent");
  const users = useMemo(() => DEMO_USERS[role], [role]);
  const [userId, setUserId] = useState(users[0]?.id ?? "");

  if (!users.some((u) => u.id === userId) && users[0]) setUserId(users[0].id);
  const selectedUser = users.find((u) => u.id === userId) ?? users[0];

  return (
    <div className="flex flex-col gap-4 pb-4">
      <div className="pt-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t(locale, "login.title")}
        </h1>
        <p className="mt-2 text-sm text-zinc-600">{t(locale, "login.subtitle")}</p>
      </div>

      <Card>
        <CardTitle>{t(locale, "login.role")}</CardTitle>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {(["parent", "teacher", "student"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`h-12 rounded-2xl border px-2 text-sm font-semibold active:scale-[0.99] ${
                role === r
                  ? "border-zinc-900 bg-zinc-900 text-white"
                  : "border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50"
              }`}
              aria-pressed={role === r}
            >
              {r === "parent"
                ? t(locale, "parent.title")
                : r === "teacher"
                  ? t(locale, "teacher.title")
                  : t(locale, "student.title")}
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <CardTitle>{t(locale, "login.language")}</CardTitle>
        <CardDescription>
          {t(locale, "common.optional")} – voor ouders wordt dit de vaste taal.
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
        <CardDescription>Demo accounts met mock data.</CardDescription>
        <div className="mt-3 flex flex-col gap-2">
          {users.map((u) => (
            <button
              key={u.id}
              type="button"
              onClick={() => setUserId(u.id)}
              className={`flex h-12 items-center justify-between rounded-2xl border px-4 text-sm font-semibold active:scale-[0.99] ${
                u.id === userId
                  ? "border-zinc-900 bg-zinc-50"
                  : "border-zinc-200 bg-white hover:bg-zinc-50"
              }`}
            >
              <span className="truncate">{u.name}</span>
              {u.id === userId && <span className="text-xs text-zinc-500">✓</span>}
            </button>
          ))}
        </div>
      </Card>

      <div className="mt-1 flex flex-col gap-2">
        <Button
          type="button"
          onClick={() => {
            if (!selectedUser) return;
            login({ id: selectedUser.id, name: selectedUser.name, role });
            router.push(`/${locale}/${role}`);
          }}
        >
          {t(locale, "login.continue")}
        </Button>
        <ButtonSecondary type="button" onClick={() => router.push(`/${locale}/parent`)}>
          Quick demo (ouder dashboard)
        </ButtonSecondary>
      </div>
    </div>
  );
}

