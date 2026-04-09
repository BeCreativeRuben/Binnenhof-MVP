import { randomUUID } from "node:crypto";
import type { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { ensureSchema, getSql } from "@/lib/db";

const SESSION_COOKIE = "bh_session_token";

export type DbUser = {
  id: string;
  username: string;
  full_name: string;
  role: "parent" | "teacher" | "student";
  class_id: string | null;
  teacher_user_id: string | null;
};

export function sessionCookieName() {
  return SESSION_COOKIE;
}

export async function createPasswordHash(plain: string) {
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}

export async function createSession(userId: string) {
  const sql = getSql();
  const token = randomUUID();
  await sql`
    INSERT INTO auth_sessions (token, user_id)
    VALUES (${token}, ${userId})
  `;
  return token;
}

export async function deleteSession(token: string) {
  const sql = getSql();
  await sql`DELETE FROM auth_sessions WHERE token = ${token}`;
}

export async function getSessionUserByToken(token: string | null | undefined) {
  if (!token) return null;
  await ensureSchema();
  const sql = getSql();
  const rows = (await sql`
    SELECT u.id, u.username, u.full_name, u.role, u.class_id, u.teacher_user_id
    FROM auth_sessions s
    INNER JOIN app_users u ON u.id = s.user_id
    WHERE s.token = ${token}
    LIMIT 1
  `) as DbUser[];
  return rows[0] ?? null;
}

export async function getSessionUserFromRequest(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  return getSessionUserByToken(token);
}
