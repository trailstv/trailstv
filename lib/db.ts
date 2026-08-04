// lib/db.ts — Neon serverless Postgres client
//
// @neondatabase/serverless replaces the deprecated @vercel/postgres.
// Uses HTTP transport (no persistent TCP connections) — correct for serverless.
//
// Environment variable: DATABASE_URL
// When you connect a Neon database in the Vercel dashboard, this is
// injected automatically. For local dev, copy it from:
// Vercel Dashboard → Storage → your database → .env.local tab
//
// Postgres SQL dialect:
//   Placeholders : ${value} in tagged template literals
//   Auto-increment: SERIAL
//   JSON columns : JSONB
//   Returning id : RETURNING id

import { neon } from '@neondatabase/serverless';

// Create a sql function bound to the connection string.
// Called once per module load — neon() itself is lightweight.
function getSQL() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL environment variable is not set');
  return neon(url);
}

// Re-usable sql tag — import this in API routes
export function getSql() {
  return getSQL();
}

// ── User type ─────────────────────────────────────────────────────────────────
export interface DbUser {
  id:            number;
  email:         string;
  name:          string;
  auth_provider: string;
  tier:          string;
  created_at:    string;
}

// ── Find or create a user by email ────────────────────────────────────────────
export async function upsertUser(
  email:         string,
  name?:         string | null,
  authProvider?: string | null,
  tier?:         string | null,
): Promise<DbUser> {
  const sql = getSQL();

  const existing = await sql`
    SELECT * FROM users WHERE email = ${email} LIMIT 1
  `;

  if (existing.length > 0) {
    if (name || tier) {
      await sql`
        UPDATE users
        SET
          name       = COALESCE(${name ?? null}, name),
          tier       = COALESCE(${tier ?? null}, tier),
          updated_at = NOW()
        WHERE email  = ${email}
      `;
    }
    return existing[0] as DbUser;
  }

  const created = await sql`
    INSERT INTO users (email, name, auth_provider, tier)
    VALUES (${email}, ${name ?? ''}, ${authProvider ?? 'email'}, ${tier ?? 'free'})
    RETURNING *
  `;
  return created[0] as DbUser;
}

// ── CORS headers ──────────────────────────────────────────────────────────────
export function corsHeaders(methods = 'GET, POST, OPTIONS') {
  return {
    'Content-Type':                 'application/json',
    'Access-Control-Allow-Origin':  process.env.ALLOWED_ORIGIN ?? '*',
    'Access-Control-Allow-Methods': methods,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

// ── Schema ─────────────────────────────────────────────────────────────────────
//
// Run via GET /api/migrate?secret=YOUR_MIGRATE_SECRET
//
// CREATE TABLE IF NOT EXISTS users (
//   id            SERIAL PRIMARY KEY,
//   email         VARCHAR(255) UNIQUE NOT NULL,
//   name          VARCHAR(100),
//   auth_provider VARCHAR(50)  DEFAULT 'email',
//   tier          VARCHAR(20)  DEFAULT 'free',
//   google_id     VARCHAR(100),
//   created_at    TIMESTAMPTZ  DEFAULT NOW(),
//   updated_at    TIMESTAMPTZ  DEFAULT NOW()
// );
//
// CREATE TABLE IF NOT EXISTS trips (
//   id           SERIAL PRIMARY KEY,
//   user_id      INTEGER REFERENCES users(id) ON DELETE SET NULL,
//   email        VARCHAR(255),
//   season       VARCHAR(50),
//   group_type   VARCHAR(50),
//   trip_length  VARCHAR(50),
//   activities   JSONB,
//   level        VARCHAR(50),
//   shores       JSONB,
//   notes        TEXT,
//   created_at   TIMESTAMPTZ DEFAULT NOW()
// );
//
// CREATE TABLE IF NOT EXISTS onboarding (
//   id            SERIAL PRIMARY KEY,
//   email         VARCHAR(255),
//   name          VARCHAR(100),
//   tier          VARCHAR(20)  DEFAULT 'free',
//   auth_provider VARCHAR(50),
//   season        VARCHAR(50),
//   stay_type     VARCHAR(50),
//   group_type    VARCHAR(50),
//   trip_length   VARCHAR(50),
//   activities    JSONB,
//   shores        JSONB,
//   camp_features JSONB,
//   raw           JSONB,
//   created_at    TIMESTAMPTZ DEFAULT NOW()
// );
