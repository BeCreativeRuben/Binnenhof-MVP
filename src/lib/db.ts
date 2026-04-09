import { neon } from "@neondatabase/serverless";

let cached: ReturnType<typeof neon> | null = null;

export function getSql() {
  const url = process.env.NEON_DATABASE_URL;
  if (!url) {
    throw new Error("NEON_DATABASE_URL is not set");
  }
  if (!cached) {
    cached = neon(url);
  }
  return cached;
}

export async function ensureSchema() {
  const sql = getSql();

  await sql`
    CREATE TABLE IF NOT EXISTS app_users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      full_name TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('parent', 'teacher', 'student')),
      class_id TEXT,
      teacher_user_id TEXT
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS parent_student_links (
      parent_user_id TEXT NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
      student_user_id TEXT NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
      PRIMARY KEY (parent_user_id, student_user_id)
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS auth_sessions (
      token TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS kieswijzer_submissions (
      id TEXT PRIMARY KEY,
      student_user_id TEXT NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
      submitted_by_user_id TEXT NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
      submitted_role TEXT NOT NULL CHECK (submitted_role IN ('parent', 'teacher', 'student')),
      selected_item_ids JSONB NOT NULL,
      comment TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (student_user_id, submitted_role)
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS game_scores (
      id TEXT PRIMARY KEY,
      game_type TEXT NOT NULL CHECK (game_type IN ('memory', 'connect')),
      student_user_id TEXT NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
      class_id TEXT NOT NULL,
      time_ms INTEGER NOT NULL,
      mistakes INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;
}
