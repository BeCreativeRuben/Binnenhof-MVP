import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionUserFromRequest } from "@/lib/auth";
import { ensureSchema } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    await ensureSchema();
    const user = await getSessionUserFromRequest(req);
    if (!user) return NextResponse.json({ ok: true, user: null });
    return NextResponse.json({
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
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Me failed" },
      { status: 500 },
    );
  }
}
