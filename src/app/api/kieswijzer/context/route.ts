import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionUserFromRequest } from "@/lib/auth";
import { ensureSchema, getSql } from "@/lib/db";

export async function GET(req: NextRequest) {
  await ensureSchema();
  const user = await getSessionUserFromRequest(req);
  if (!user) return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  const sql = getSql();

  if (user.role === "parent") {
    const children = (await sql`
      SELECT s.id, s.full_name, s.class_id
      FROM parent_student_links l
      INNER JOIN app_users s ON s.id = l.student_user_id
      WHERE l.parent_user_id = ${user.id}
      ORDER BY s.full_name
    `) as { id: string; full_name: string; class_id: string | null }[];
    return NextResponse.json({ ok: true, role: user.role, children });
  }

  if (user.role === "teacher") {
    const students = (await sql`
      SELECT id, full_name, class_id
      FROM app_users
      WHERE role = 'student' AND teacher_user_id = ${user.id}
      ORDER BY full_name
    `) as { id: string; full_name: string; class_id: string | null }[];
    return NextResponse.json({ ok: true, role: user.role, students });
  }

  return NextResponse.json({
    ok: true,
    role: user.role,
    student: { id: user.id, full_name: user.full_name, class_id: user.class_id },
  });
}
