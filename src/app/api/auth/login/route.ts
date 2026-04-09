import { NextResponse } from "next/server";
import { createSession, sessionCookieName, verifyPassword } from "@/lib/auth";
import { ensureSchema, getSql } from "@/lib/db";

export async function POST(req: Request) {
  try {
    await ensureSchema();
    const { username, password } = (await req.json()) as {
      username?: string;
      password?: string;
    };
    if (!username || !password) {
      return NextResponse.json({ ok: false, message: "Missing credentials" }, { status: 400 });
    }

    const sql = getSql();
    const rows = (await sql`
      SELECT id, username, full_name, role, class_id, teacher_user_id, password_hash
      FROM app_users
      WHERE username = ${username}
      LIMIT 1
    `) as Array<{
      id: string;
      username: string;
      full_name: string;
      role: "parent" | "teacher" | "student";
      class_id: string | null;
      teacher_user_id: string | null;
      password_hash: string;
    }>;
    const user = rows[0];
    if (!user) {
      return NextResponse.json({ ok: false, message: "Invalid credentials" }, { status: 401 });
    }
    const valid = await verifyPassword(password, user.password_hash);
    if (!valid) {
      return NextResponse.json({ ok: false, message: "Invalid credentials" }, { status: 401 });
    }

    const token = await createSession(user.id);
    const res = NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        name: user.full_name,
        username: user.username,
        role: user.role,
        classId: user.class_id,
        teacherUserId: user.teacher_user_id,
      },
    });
    res.cookies.set(sessionCookieName(), token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Login failed" },
      { status: 500 },
    );
  }
}
