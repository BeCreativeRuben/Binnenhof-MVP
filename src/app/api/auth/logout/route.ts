import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { deleteSession, sessionCookieName } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const token = req.cookies.get(sessionCookieName())?.value;
  if (token) {
    await deleteSession(token);
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(sessionCookieName(), "", {
    path: "/",
    maxAge: 0,
  });
  return res;
}
