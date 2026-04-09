import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionUserFromRequest } from "@/lib/auth";
import { ensureSchema, getSql } from "@/lib/db";
import { scoreClusters } from "@/lib/mock/kieswijzer";

type Role = "parent" | "teacher" | "student";

export async function GET(req: NextRequest) {
  await ensureSchema();
  const user = await getSessionUserFromRequest(req);
  if (!user || user.role !== "teacher") {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }
  const studentId = req.nextUrl.searchParams.get("studentId");
  if (!studentId) return NextResponse.json({ ok: false, message: "Missing studentId" }, { status: 400 });

  const sql = getSql();
  const allowed = (await sql`
    SELECT 1 as ok
    FROM app_users
    WHERE id = ${studentId} AND teacher_user_id = ${user.id}
    LIMIT 1
  `) as { ok: number }[];
  if (!allowed[0]) {
    return NextResponse.json({ ok: false, message: "No access to student" }, { status: 403 });
  }

  const studentRows = (await sql`
    SELECT id, full_name, class_id
    FROM app_users
    WHERE id = ${studentId}
    LIMIT 1
  `) as { id: string; full_name: string; class_id: string | null }[];
  const student = studentRows[0];
  if (!student) return NextResponse.json({ ok: false, message: "Student not found" }, { status: 404 });

  const submissions = (await sql`
    SELECT submitted_role, selected_item_ids, comment, created_at
    FROM kieswijzer_submissions
    WHERE student_user_id = ${studentId}
  `) as { submitted_role: Role; selected_item_ids: string[]; comment: string | null; created_at: string }[];

  const byRole = {
    parent: submissions.find((s) => s.submitted_role === "parent") ?? null,
    student: submissions.find((s) => s.submitted_role === "student") ?? null,
    teacher: submissions.find((s) => s.submitted_role === "teacher") ?? null,
  };

  const roleScores = (["parent", "student", "teacher"] as Role[]).map((role) => ({
    role,
    results: byRole[role] ? scoreClusters(byRole[role].selected_item_ids) : [],
  }));

  return NextResponse.json({
    ok: true,
    student,
    submissions: byRole,
    roleScores,
    complete: Boolean(byRole.parent && byRole.student && byRole.teacher),
  });
}
