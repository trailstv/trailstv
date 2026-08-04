import { NextRequest, NextResponse } from 'next/server';
import { getSql, upsertUser, corsHeaders } from '@/lib/db';

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email');
  if (!email) return NextResponse.json({ error: 'email param required' }, { status: 400 });

  try {
    const sql    = getSql();
    const result = await sql`
      SELECT * FROM onboarding
      WHERE  email = ${email}
      ORDER  BY created_at DESC
      LIMIT  1
    `;
    if (!result.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ profile: result[0] });
  } catch (err: any) {
    console.error('GET /api/onboarding:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  let body: any;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  const p = body.plannerInit || body;
  const { email, name, tier, auth_provider, activities, season,
          stay_type, group, trip_length, campShores, campFeatures } = p;
  if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 });

  try {
    const sql    = getSql();
    const dbUser = await upsertUser(email, name, auth_provider, tier);

    const result = await sql`
      INSERT INTO onboarding
        (email, name, tier, auth_provider, season, stay_type, group_type,
         trip_length, activities, shores, camp_features, raw)
      VALUES
        (${email}, ${name ?? null}, ${tier ?? 'free'}, ${auth_provider ?? 'email'},
         ${season ?? null}, ${stay_type ?? null}, ${group ?? null}, ${trip_length ?? null},
         ${JSON.stringify(activities   ?? [])}::jsonb,
         ${JSON.stringify(campShores   ?? [])}::jsonb,
         ${JSON.stringify(campFeatures ?? [])}::jsonb,
         ${JSON.stringify(body)}::jsonb)
      RETURNING id
    `;

    if (tier && tier !== 'free') {
      await sql`UPDATE users SET tier = ${tier} WHERE email = ${email}`;
    }

    return NextResponse.json({
      success:       true,
      onboarding_id: result[0].id,
      user_id:       dbUser.id,
    }, { status: 201 });

  } catch (err: any) {
    console.error('POST /api/onboarding:', err);
    return NextResponse.json({ error: 'Database error', detail: err.message }, { status: 500 });
  }
}
