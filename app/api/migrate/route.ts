// app/api/migrate/route.ts
// GET /api/migrate?secret=YOUR_MIGRATE_SECRET
// Creates the three database tables — run once after deploy

import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');
  if (secret !== process.env.MIGRATE_SECRET) {
    return NextResponse.json({ error:'Unauthorized' }, { status:401 });
  }

  const { neon } = await import('@neondatabase/serverless');
  const sql = neon(process.env.DATABASE_URL!);

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id              SERIAL PRIMARY KEY,
        email           TEXT UNIQUE NOT NULL,
        name            TEXT,
        tier            TEXT DEFAULT 'free' CHECK (tier IN ('free','explorer','local')),
        stripe_customer TEXT,
        stripe_sub      TEXT,
        created_at      TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS saved_trips (
        id         SERIAL PRIMARY KEY,
        user_id    INT REFERENCES users(id) ON DELETE CASCADE,
        park_slug  TEXT NOT NULL,
        name       TEXT NOT NULL,
        data       JSONB DEFAULT '{}',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS alert_subs (
        id          SERIAL PRIMARY KEY,
        user_id     INT REFERENCES users(id) ON DELETE CASCADE,
        park_slug   TEXT NOT NULL,
        facility_id TEXT,
        dates       TEXT[],
        active      BOOLEAN DEFAULT TRUE,
        created_at  TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    return NextResponse.json({ ok:true, message:'Tables created: users, saved_trips, alert_subs' });
  } catch (err: any) {
    return NextResponse.json({ ok:false, error:err.message }, { status:500 });
  }
}
