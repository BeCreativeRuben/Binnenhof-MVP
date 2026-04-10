import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionUserFromRequest } from "@/lib/auth";
import { ensureSchema, getSql } from "@/lib/db";

export async function GET(req: NextRequest) {
  await ensureSchema();
  const user = await getSessionUserFromRequest(req);
  if (!user) return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  const studentId = req.nextUrl.searchParams.get("studentId");
  if (!studentId) return NextResponse.json({ ok: false, message: "Missing studentId" }, { status: 400 });

  const sql = getSql();
  const rows = (await sql`
    SELECT submitted_role, selected_item_ids, comment
    FROM kieswijzer_submissions
    WHERE student_user_id = ${studentId}
  `) as { submitted_role: "parent" | "teacher" | "student"; selected_item_ids: string[]; comment: string | null }[];

  return NextResponse.json({
    ok: true,
    submissions: rows,
    doneRoles: rows.map((r) => r.submitted_role),
  });
}

export async function POST(req: NextRequest) {
  await ensureSchema();
  const user = await getSessionUserFromRequest(req);
  if (!user) return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  const payload = (await req.json()) as {
    studentId?: string;
    selectedItemIds?: string[];
    comment?: string;
  };
  if (!payload.studentId || !Array.isArray(payload.selectedItemIds)) {
    return NextResponse.json({ ok: false, message: "Invalid payload" }, { status: 400 });
  }
  const sql = getSql();

  if (user.role === "parent") {
    const links = (await sql`
      SELECT 1 as ok
      FROM parent_student_links
      WHERE parent_user_id = ${user.id} AND student_user_id = ${payload.studentId}
      LIMIT 1
    `) as { ok: number }[];
    if (!links[0]) {
      return NextResponse.json({ ok: false, message: "No access to student" }, { status: 403 });
    }
  }

  if (user.role === "teacher") {
    const owns = (await sql`
      SELECT 1 as ok
      FROM app_users
      WHERE id = ${payload.studentId} AND teacher_user_id = ${user.id}
      LIMIT 1
    `) as { ok: number }[];
    if (!owns[0]) {
      return NextResponse.json({ ok: false, message: "No access to student" }, { status: 403 });
    }
  }

  if (user.role === "student" && payload.studentId !== user.id) {
    return NextResponse.json({ ok: false, message: "No access to student" }, { status: 403 });
  }

  const existing = (await sql`
    SELECT id
    FROM kieswijzer_submissions
    WHERE student_user_id = ${payload.studentId} AND submitted_role = ${user.role}
    LIMIT 1
  `) as { id: string }[];

  if (existing[0]) {
    await sql`
      UPDATE kieswijzer_submissions
      SET submitted_by_user_id = ${user.id},
          selected_item_ids = ${JSON.stringify(payload.selectedItemIds)},
          comment = ${payload.comment ?? null}
      WHERE id = ${existing[0].id}
    `;
  } else {
    await sql`
      INSERT INTO kieswijzer_submissions (id, student_user_id, submitted_by_user_id, submitted_role, selected_item_ids, comment)
      VALUES (${randomUUID()}, ${payload.studentId}, ${user.id}, ${user.role}, ${JSON.stringify(payload.selectedItemIds)}, ${payload.comment ?? null})
    `;
  }

  return NextResponse.json({ ok: true });
}
