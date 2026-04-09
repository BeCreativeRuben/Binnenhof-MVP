import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { createPasswordHash } from "@/lib/auth";
import { ensureSchema, getSql } from "@/lib/db";

export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { ok: false, message: "Setup endpoint is disabled in production." },
      { status: 403 },
    );
  }
  try {
    await ensureSchema();
    const sql = getSql();

    const basePasswordHash = await createPasswordHash("Welkom123!");

    await sql`
      INSERT INTO app_users (id, username, password_hash, full_name, role, class_id, teacher_user_id)
      VALUES
        ('t-1', 'teacher.desmet', ${basePasswordHash}, 'Mevr. De Smet', 'teacher', 'klas-a', NULL),
        ('t-2', 'teacher.vdbroeck', ${basePasswordHash}, 'Dhr. Van den Broeck', 'teacher', 'klas-b', NULL),
        ('s-1', 'student.noah', ${basePasswordHash}, 'Noah', 'student', 'klas-a', 't-1'),
        ('s-2', 'student.mila', ${basePasswordHash}, 'Mila', 'student', 'klas-a', 't-1'),
        ('s-3', 'student.yusuf', ${basePasswordHash}, 'Yusuf', 'student', 'klas-b', 't-2'),
        ('p-1', 'parent.aylin', ${basePasswordHash}, 'Aylin Demir', 'parent', NULL, NULL),
        ('p-2', 'parent.maria', ${basePasswordHash}, 'Maria Ivanova', 'parent', NULL, NULL),
        ('p-3', 'parent.sarah', ${basePasswordHash}, 'Sarah Smith', 'parent', NULL, NULL)
      ON CONFLICT (id) DO NOTHING
    `;

    await sql`
      INSERT INTO parent_student_links (parent_user_id, student_user_id)
      VALUES
        ('p-1', 's-1'),
        ('p-2', 's-2'),
        ('p-3', 's-1'),
        ('p-3', 's-3')
      ON CONFLICT (parent_user_id, student_user_id) DO NOTHING
    `;

    return NextResponse.json({
      ok: true,
      seededPassword: "Welkom123!",
      runId: randomUUID(),
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Setup failed" },
      { status: 500 },
    );
  }
}
