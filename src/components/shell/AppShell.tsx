import type { ReactNode } from "react";
import type { Locale } from "@/lib/locales";
import { SessionProvider } from "@/components/session/SessionProvider";
import { ShellClient } from "@/components/shell/ShellClient";

export function AppShell({
  children,
  locale,
}: {
  children: ReactNode;
  locale: Locale;
}) {
  return (
    <SessionProvider>
      <ShellClient locale={locale}>{children}</ShellClient>
    </SessionProvider>
  );
}

