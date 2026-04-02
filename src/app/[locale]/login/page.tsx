import type { Locale } from "@/lib/locales";
import { LoginClient } from "@/components/pages/LoginClient";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return <LoginClient locale={locale} />;
}

