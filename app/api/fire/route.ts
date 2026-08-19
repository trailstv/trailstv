// app/api/fire/route.ts
// GET /api/fire?parkCode=yose
// Pulls fire alerts from NPS API and formats as restriction data

import { NextRequest, NextResponse } from 'next/server';

export const revalidate = 3600;

export async function GET(req: NextRequest) {
  const parkCode = req.nextUrl.searchParams.get('parkCode');
  const key      = process.env.NPS_API_KEY;

  if (!key || !parkCode) {
    return NextResponse.json({ restrictionLevel:'0', activeFires:[], source:'fallback' });
  }

  try {
    const res  = await fetch(
      `https://developer.nps.gov/api/v1/alerts?parkCode=${parkCode}&api_key=${key}&limit=50`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) throw new Error(`NPS ${res.status}`);
    const data   = await res.json();
    const alerts: any[] = data.data ?? [];

    // Determine restriction level from alert categories
    let level = '0';
    const fireAlerts = alerts.filter((a: any) =>
      ['Danger','Closure','Caution'].includes(a.category) &&
      /fire|smoke|burn|campfire/i.test(a.title + ' ' + a.description)
    );

    if (fireAlerts.some((a:any) => a.category === 'Closure')) level = '3';
    else if (fireAlerts.some((a:any) => a.category === 'Danger'))  level = '2';
    else if (fireAlerts.some((a:any) => a.category === 'Caution')) level = '1';

    return NextResponse.json({
      source:           'nps-api',
      restrictionLevel: level,
      details:          fireAlerts[0]?.description ?? null,
      activeFires:      [],
      updatedAt:        new Date().toISOString(),
    }, { headers: { 'Cache-Control':'public,s-maxage=3600,stale-while-revalidate=600' }});
  } catch (err: any) {
    return NextResponse.json({ source:'error', restrictionLevel:'0', activeFires:[], error:err.message });
  }
}
