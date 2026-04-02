import type { ReactNode } from "react";
import { isLocale, type Locale } from "@/lib/locales";
import { AppShell } from "@/components/shell/AppShell";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeRaw } = await params;
  const locale: Locale = isLocale(localeRaw) ? localeRaw : "nl";

  return <AppShell locale={locale}>{children}</AppShell>;
}

