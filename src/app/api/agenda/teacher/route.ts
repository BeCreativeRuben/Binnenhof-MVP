import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionUserFromRequest } from "@/lib/auth";
import { ensureSchema, getSql } from "@/lib/db";

const ITEM_TYPES = ["school", "workshop", "student"] as const;
type ItemType = (typeof ITEM_TYPES)[number];

function isItemType(v: unknown): v is ItemType {
  return typeof v === "string" && ITEM_TYPES.includes(v as ItemType);
}

export async function GET(req: NextRequest) {
  try {
    await ensureSchema();
    const user = await getSessionUserFromRequest(req);
    if (!user) return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    if (user.role !== "teacher") {
      return NextResponse.json({ ok: false, message: "Forbidden" }, { status: 403 });
    }

    const sql = getSql();
    const rows = (await sql`
      SELECT id, title_nl, starts_at, ends_at, location_nl, description_nl, item_type
      FROM teacher_agenda_items
      WHERE teacher_user_id = ${user.id}
      ORDER BY starts_at ASC
    `) as {
      id: string;
      title_nl: string;
      starts_at: string;
      ends_at: string | null;
      location_nl: string | null;
      description_nl: string | null;
      item_type: ItemType;
    }[];

    const items = rows.map((r) => ({
      id: r.id,
      titleNl: r.title_nl,
      startsAt: r.starts_at,
      endsAt: r.ends_at ?? undefined,
      locationNl: r.location_nl ?? undefined,
      descriptionNl: r.description_nl ?? undefined,
      type: r.item_type,
      teacherCreated: true as const,
    }));

    return NextResponse.json({ ok: true, items });
  } catch (e) {
    return NextResponse.json(
      { ok: false, message: e instanceof Error ? e.message : "Failed" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureSchema();
    const user = await getSessionUserFromRequest(req);
    if (!user) return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    if (user.role !== "teacher") {
      return NextResponse.json({ ok: false, message: "Forbidden" }, { status: 403 });
    }

    const body = (await req.json()) as {
      titleNl?: string;
      startsAt?: string;
      endsAt?: string | null;
      locationNl?: string | null;
      descriptionNl?: string | null;
      type?: unknown;
    };

    const titleNl = typeof body.titleNl === "string" ? body.titleNl.trim() : "";
    const startsAt = typeof body.startsAt === "string" ? body.startsAt.trim() : "";
    if (!titleNl || !startsAt) {
      return NextResponse.json({ ok: false, message: "Missing titleNl or startsAt" }, { status: 400 });
    }
    const startMs = Date.parse(startsAt);
    if (Number.isNaN(startMs)) {
      return NextResponse.json({ ok: false, message: "Invalid startsAt" }, { status: 400 });
    }

    let endsAtIso: string | null = null;
    if (body.endsAt && typeof body.endsAt === "string" && body.endsAt.trim()) {
      const endMs = Date.parse(body.endsAt.trim());
      if (Number.isNaN(endMs)) {
        return NextResponse.json({ ok: false, message: "Invalid endsAt" }, { status: 400 });
      }
      endsAtIso = new Date(endMs).toISOString();
    }

    const itemType = isItemType(body.type) ? body.type : "school";
    const locationNl =
      typeof body.locationNl === "string" && body.locationNl.trim() ? body.locationNl.trim() : null;
    const descriptionNl =
      typeof body.descriptionNl === "string" && body.descriptionNl.trim()
        ? body.descriptionNl.trim()
        : null;

    const id = randomUUID();
    const sql = getSql();
    await sql`
      INSERT INTO teacher_agenda_items (
        id, teacher_user_id, title_nl, starts_at, ends_at, location_nl, description_nl, item_type
      )
      VALUES (
        ${id},
        ${user.id},
        ${titleNl},
        ${new Date(startMs).toISOString()},
        ${endsAtIso},
        ${locationNl},
        ${descriptionNl},
        ${itemType}
      )
    `;

    return NextResponse.json({
      ok: true,
      item: {
        id,
        titleNl,
        startsAt: new Date(startMs).toISOString(),
        endsAt: endsAtIso ?? undefined,
        locationNl: locationNl ?? undefined,
        descriptionNl: descriptionNl ?? undefined,
        type: itemType,
        teacherCreated: true,
      },
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, message: e instanceof Error ? e.message : "Failed" },
      { status: 500 },
    );
  }
}
