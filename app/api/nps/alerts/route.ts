// app/api/nps/alerts/route.ts
// GET /api/nps/alerts?parkCode=grca
// Proxies NPS Data API alerts — keeps NPS_API_KEY server-side
// Cached 1 hour. Get a free key at nps.gov/subjects/developer/get-started.htm

import { NextRequest, NextResponse } from 'next/server';

export const revalidate = 3600;

export async function GET(req: NextRequest) {
  const parkCode = req.nextUrl.searchParams.get('parkCode');
  const key      = process.env.NPS_API_KEY;

  if (!parkCode) {
    return NextResponse.json({ alerts: [] });
  }

  if (!key) {
    return NextResponse.json({
      alerts:  [],
      message: 'Set NPS_API_KEY in Vercel environment variables — free at nps.gov/subjects/developer/get-started.htm',
    });
  }

  try {
    const res = await fetch(
      `https://developer.nps.gov/api/v1/alerts?parkCode=${parkCode}&api_key=${key}&limit=20`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) throw new Error(`NPS API ${res.status}`);
    const data = await res.json();
    return NextResponse.json({
      source: 'nps-api',
      alerts: data.data ?? [],
    }, { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600' } });
  } catch (err: any) {
    return NextResponse.json({ source:'error', alerts:[], error: err.message });
  }
}
