// app/api/nps/route.ts
// GET /api/nps?parkCode=yose&type=alerts|campgrounds|parks
// Free NPS API key: https://www.nps.gov/subjects/developer/get-started.htm

import { NextRequest, NextResponse } from 'next/server';

export const revalidate = 3600;

const NPS_BASE = 'https://developer.nps.gov/api/v1';

export async function GET(req: NextRequest) {
  const parkCode = req.nextUrl.searchParams.get('parkCode');
  const type     = req.nextUrl.searchParams.get('type') ?? 'alerts';
  const key      = process.env.NPS_API_KEY;

  if (!key) {
    return NextResponse.json({
      alerts: [], campgrounds: [], data: [],
      message: 'NPS_API_KEY not set. Get a free key at https://www.nps.gov/subjects/developer/get-started.htm',
    });
  }

  const endpoint = type === 'alerts'       ? 'alerts'       :
                   type === 'campgrounds'   ? 'campgrounds'  :
                   type === 'visitorcenters'? 'visitorcenters': 'parks';

  const url = `${NPS_BASE}/${endpoint}?parkCode=${parkCode}&api_key=${key}&limit=50`;

  try {
    const res  = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`NPS API ${res.status}`);
    const data = await res.json();

    if (type === 'alerts') {
      return NextResponse.json({ source:'nps-api', alerts: data.data ?? [] },
        { headers: { 'Cache-Control':'public,s-maxage=3600,stale-while-revalidate=600' }});
    }
    return NextResponse.json({ source:'nps-api', data: data.data ?? [], total: data.total },
      { headers: { 'Cache-Control':'public,s-maxage=3600,stale-while-revalidate=600' }});
  } catch (err: any) {
    return NextResponse.json({ source:'error', alerts:[], data:[], error: err.message });
  }
}
