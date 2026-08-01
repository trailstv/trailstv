import { NextRequest, NextResponse } from 'next/server';
import { sql, upsertUser, corsHeaders } from '@/lib/db';

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}

// GET /api/trips?email=user@example.com
export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email');
  if (!email) return NextResponse.json({ error: 'email param required' }, { status: 400 });

  try {
    const result = await sql`
      SELECT
        t.id, t.season, t.group_type, t.trip_length,
        t.activities, t.level, t.shores, t.notes, t.created_at
      FROM trips t
      JOIN users u ON t.user_id = u.id
      WHERE u.email = ${email}
      ORDER BY t.created_at DESC
      LIMIT 50
    `;
    // JSONB columns come back as JS objects already — no JSON.parse needed
    return NextResponse.json({ trips: result.rows });
  } catch (err: any) {
    console.error('GET /api/trips:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/trips
export async function POST(req: NextRequest) {
  let body: any;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  const { user, season, group, length, activities, level, shores, notes } = body;
  if (!user?.email) return NextResponse.json({ error: 'user.email required' }, { status: 400 });

  try {
    const dbUser = await upsertUser(user.email, user.name, user.provider, user.tier);

    const result = await sql`
      INSERT INTO trips
        (user_id, email, season, group_type, trip_length, activities, level, shores, notes)
      VALUES
        (${dbUser.id}, ${user.email},
         ${season   ?? null}, ${group  ?? null}, ${length ?? null},
         ${JSON.stringify(activities ?? [])}::jsonb,
         ${level    ?? null},
         ${JSON.stringify(shores ?? [])}::jsonb,
         ${notes    ?? null})
      RETURNING id
    `;

    return NextResponse.json({
      success: true,
      trip_id: result.rows[0].id,
      user_id: dbUser.id,
      message: 'Trip saved',
    }, { status: 201 });

  } catch (err: any) {
    console.error('POST /api/trips:', err);
    return NextResponse.json({ error: 'Database error', detail: err.message }, { status: 500 });
  }
}
