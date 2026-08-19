// app/api/campsites/route.ts
// GET /api/campsites?facilityId=XXXXX
// Free key from ridb.recreation.gov

import { NextRequest, NextResponse } from 'next/server';

export const revalidate = 900; // 15 min

export async function GET(req: NextRequest) {
  const facilityId = req.nextUrl.searchParams.get('facilityId');
  const key        = process.env.RECGOV_KEY;

  if (!facilityId) return NextResponse.json({ error:'facilityId required' }, { status:400 });

  if (!key) {
    return NextResponse.json({ source:'no-key', available: null, total: null,
      message:'Set RECGOV_KEY in environment variables — free at ridb.recreation.gov' });
  }

  try {
    const today = new Date().toISOString().split('T')[0];
    const res   = await fetch(
      `https://ridb.recreation.gov/api/v1/facilities/${facilityId}/campsites?apikey=${key}&limit=500`,
      { next: { revalidate: 900 } }
    );
    if (!res.ok) throw new Error(`RIDB ${res.status}`);
    const data     = await res.json();
    const sites    = data.RECDATA ?? [];
    const total    = sites.length;
    const available = sites.filter((s:any) =>
      s.CampsiteReservable === true && s.CampsiteStatus !== 'Closed'
    ).length;

    return NextResponse.json({
      source: 'recreation.gov', facilityId, total, available,
      asOf: today,
    }, { headers: { 'Cache-Control':'public,s-maxage=900,stale-while-revalidate=300' }});
  } catch (err: any) {
    return NextResponse.json({ source:'error', error:err.message, available:null });
  }
}
