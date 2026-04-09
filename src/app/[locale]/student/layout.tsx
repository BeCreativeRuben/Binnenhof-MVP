import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSessionUserByToken, sessionCookieName } from "@/lib/auth";

export default async function StudentRoleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookieName())?.value;
  const user = await getSessionUserByToken(token);

  if (!user) {
    redirect(`/${locale}/login`);
  }
  if (user.role !== "student") {
    redirect(`/${locale}/${user.role}`);
  }

  return <>{children}</>;
}
