"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Role } from "@/components/session/SessionProvider";
import { useSession } from "@/components/session/SessionProvider";
import type { Locale } from "@/lib/locales";
import { t } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";

export function RequireRole({
  locale,
  role,
}: {
  locale: Locale;
  role: Role;
}) {
  const router = useRouter();
  const { user } = useSession();

  useEffect(() => {
    if (!user) return;
    if (user.role !== role) {
      router.replace(`/${locale}/${user.role}`);
    }
  }, [locale, role, router, user]);

  if (!user) {
    return (
      <Card>
        <CardTitle>Demo</CardTitle>
        <CardDescription>
          Je bent niet ingelogd. Ga naar login om een rol te kiezen.
        </CardDescription>
        <div className="mt-3">
          <Button type="button" onClick={() => router.push(`/${locale}/login`)}>
            {t(locale, "login.title")}
          </Button>
        </div>
      </Card>
    );
  }

  if (user.role !== role) return null;
  return null;
}

