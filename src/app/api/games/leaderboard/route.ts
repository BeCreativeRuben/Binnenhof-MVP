import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionUserFromRequest } from "@/lib/auth";
import { ensureSchema, getSql } from "@/lib/db";

function toInitials(name: string) {
  const clean = name.replace(/[^a-zA-Z ]/g, "").trim();
  if (!clean) return "AAA";
  const parts = clean.split(/\s+/).filter(Boolean);
  const letters = parts.map((p) => p[0]?.toUpperCase() ?? "").join("");
  return (letters + "XXX").slice(0, 3);
}

export async function GET(req: NextRequest) {
  await ensureSchema();
  const user = await getSessionUserFromRequest(req);
  if (!user) return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  const gameType = req.nextUrl.searchParams.get("gameType");
  if (gameType !== "memory" && gameType !== "connect") {
    return NextResponse.json({ ok: false, message: "Invalid game type" }, { status: 400 });
  }

  let classId = user.class_id;
  if (!classId && user.role === "teacher") {
    classId = user.class_id;
  }
  if (!classId && user.role === "parent") {
    const sql = getSql();
    const linked = (await sql`
      SELECT s.class_id
      FROM parent_student_links l
      INNER JOIN app_users s ON s.id = l.student_user_id
      WHERE l.parent_user_id = ${user.id}
      LIMIT 1
    `) as { class_id: string | null }[];
    classId = linked[0]?.class_id ?? null;
  }
  if (!classId) return NextResponse.json({ ok: true, leaderboard: [] });

  const sql = getSql();
  const rows = (await sql`
    SELECT 
      g.student_user_id,
      u.full_name,
      MIN(g.time_ms) AS best_time_ms,
      MIN(g.mistakes) AS best_mistakes
    FROM game_scores g
    INNER JOIN app_users u ON u.id = g.student_user_id
    WHERE g.class_id = ${classId} AND g.game_type = ${gameType}
    GROUP BY g.student_user_id, u.full_name
    ORDER BY MIN(g.time_ms) ASC, MIN(g.mistakes) ASC
    LIMIT 20
  `) as { student_user_id: string; full_name: string; best_time_ms: number; best_mistakes: number }[];

  return NextResponse.json({
    ok: true,
    leaderboard: rows.map((row, idx) => ({
      rank: idx + 1,
      initials: toInitials(row.full_name),
      timeMs: Number(row.best_time_ms),
      mistakes: Number(row.best_mistakes),
    })),
  });
}
