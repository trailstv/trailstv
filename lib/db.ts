// lib/db.ts — Vercel Postgres client
//
// Uses @vercel/postgres which reads POSTGRES_URL (or POSTGRES_URL_NON_POOLING)
// automatically from environment. On Vercel this is injected when you link a
// Postgres database in the dashboard. For local dev, add POSTGRES_URL to .env.local
//
// SQL dialect: PostgreSQL
//   - Placeholders: $1, $2, $3  (NOT ?)
//   - Auto-increment: SERIAL or GENERATED ALWAYS AS IDENTITY
//   - JSON columns: JSONB
//   - Returning inserted id: RETURNING id

import { sql } from '@vercel/postgres';

export interface DbUser {
  id:            number;
  email:         string;
  name:          string;
  auth_provider: string;
  tier:          string;
  created_at:    string;
}

// ── Schema (run once via /api/migrate or Vercel dashboard SQL editor) ────────
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

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Find or create a user by email. Returns the user row. */
export async function upsertUser(
  email:        string,
  name?:        string | null,
  authProvider?: string | null,
  tier?:        string | null,
): Promise<DbUser> {
  // Try to find existing user
  const existing = await sql<DbUser>`
    SELECT * FROM users WHERE email = ${email} LIMIT 1
  `;

  if (existing.rows.length > 0) {
    // Update name / tier if new values provided
    if (name || tier) {
      await sql`
        UPDATE users
        SET
          name       = COALESCE(${name ?? null}, name),
          tier       = COALESCE(${tier ?? null}, tier),
          updated_at = NOW()
        WHERE email = ${email}
      `;
    }
    return existing.rows[0];
  }

  // Create new user
  const result = await sql<DbUser>`
    INSERT INTO users (email, name, auth_provider, tier)
    VALUES (${email}, ${name ?? ''}, ${authProvider ?? 'email'}, ${tier ?? 'free'})
    RETURNING *
  `;
  return result.rows[0];
}

/** Standard CORS response headers */
export function corsHeaders(methods = 'GET, POST, OPTIONS') {
  return {
    'Content-Type':                 'application/json',
    'Access-Control-Allow-Origin':  process.env.ALLOWED_ORIGIN ?? '*',
    'Access-Control-Allow-Methods': methods,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

// Re-export sql so API routes can use it directly
export { sql };
