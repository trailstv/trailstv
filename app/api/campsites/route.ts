import { NextRequest, NextResponse } from 'next/server';

export const revalidate = 900; // cache 15 min at CDN level

export async function GET(req: NextRequest) {
  const key = process.env.RECGOV_KEY;
  if (!key) return NextResponse.json({ error: 'RECGOV_KEY not set' }, { status: 500 });

  const sp       = req.nextUrl.searchParams;
  const params   = new URLSearchParams({
    latitude:  sp.get('latitude')  ?? '39.0968',
    longitude: sp.get('longitude') ?? '-120.0324',
    radius:    sp.get('radius')    ?? '25',
    limit:     sp.get('limit')     ?? '50',
    activity:  sp.get('activity')  ?? 'CAMPING',
    full:      'true',
  });

  try {
    const upstream = await fetch(`https://ridb.recreation.gov/api/v1/facilities?${params}`, {
      headers: { apikey: key },
      next:    { revalidate: 900 },
    });
    if (!upstream.ok) {
      return NextResponse.json({ error: `Recreation.gov ${upstream.status}` }, { status: upstream.status });
    }
    const data = await upstream.json();
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=60' },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 502 });
  }
}
