import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionUserFromRequest } from "@/lib/auth";
import { ensureSchema, getSql } from "@/lib/db";

export async function POST(req: NextRequest) {
  await ensureSchema();
  const user = await getSessionUserFromRequest(req);
  if (!user || user.role !== "student") {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }
  const payload = (await req.json()) as {
    gameType?: "memory" | "connect";
    timeMs?: number;
    mistakes?: number;
  };
  if (!payload.gameType || typeof payload.timeMs !== "number") {
    return NextResponse.json({ ok: false, message: "Invalid payload" }, { status: 400 });
  }
  if (!user.class_id) {
    return NextResponse.json({ ok: false, message: "No class linked" }, { status: 400 });
  }
  const sql = getSql();
  await sql`
    INSERT INTO game_scores (id, game_type, student_user_id, class_id, time_ms, mistakes)
    VALUES (${randomUUID()}, ${payload.gameType}, ${user.id}, ${user.class_id}, ${payload.timeMs}, ${payload.mistakes ?? 0})
  `;
  return NextResponse.json({ ok: true });
}
