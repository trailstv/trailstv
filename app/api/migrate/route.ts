import { NextRequest, NextResponse } from 'next/server';
import { getSql } from '@/lib/db';

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');
  if (secret !== process.env.MIGRATE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const results: { table: string; status: string }[] = [];
  const sql = getSql();

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id            SERIAL PRIMARY KEY,
        email         VARCHAR(255) UNIQUE NOT NULL,
        name          VARCHAR(100),
        auth_provider VARCHAR(50)   DEFAULT 'email',
        tier          VARCHAR(20)   DEFAULT 'free',
        google_id     VARCHAR(100),
        created_at    TIMESTAMPTZ   DEFAULT NOW(),
        updated_at    TIMESTAMPTZ   DEFAULT NOW()
      )
    `;
    await sql`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_users_tier  ON users(tier)`;
    const uCount = await sql`SELECT COUNT(*)::int AS count FROM users`;
    results.push({ table: 'users', status: `OK — ${uCount[0].count} rows` });

    await sql`
      CREATE TABLE IF NOT EXISTS trips (
        id           SERIAL PRIMARY KEY,
        user_id      INTEGER REFERENCES users(id) ON DELETE SET NULL,
        email        VARCHAR(255),
        season       VARCHAR(50),
        group_type   VARCHAR(50),
        trip_length  VARCHAR(50),
        activities   JSONB,
        level        VARCHAR(50),
        shores       JSONB,
        notes        TEXT,
        created_at   TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    await sql`CREATE INDEX IF NOT EXISTS idx_trips_email      ON trips(email)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_trips_created_at ON trips(created_at DESC)`;
    const tCount = await sql`SELECT COUNT(*)::int AS count FROM trips`;
    results.push({ table: 'trips', status: `OK — ${tCount[0].count} rows` });

    await sql`
      CREATE TABLE IF NOT EXISTS onboarding (
        id            SERIAL PRIMARY KEY,
        email         VARCHAR(255),
        name          VARCHAR(100),
        tier          VARCHAR(20)  DEFAULT 'free',
        auth_provider VARCHAR(50),
        season        VARCHAR(50),
        stay_type     VARCHAR(50),
        group_type    VARCHAR(50),
        trip_length   VARCHAR(50),
        activities    JSONB,
        shores        JSONB,
        camp_features JSONB,
        raw           JSONB,
        created_at    TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    await sql`CREATE INDEX IF NOT EXISTS idx_onboarding_email ON onboarding(email)`;
    const oCount = await sql`SELECT COUNT(*)::int AS count FROM onboarding`;
    results.push({ table: 'onboarding', status: `OK — ${oCount[0].count} rows` });

    return NextResponse.json({ success: true, message: 'All tables ready ✓', tables: results });

  } catch (err: any) {
    console.error('Migration error:', err);
    return NextResponse.json({ success: false, error: err.message, tables: results }, { status: 500 });
  }
}
