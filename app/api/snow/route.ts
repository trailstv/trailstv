// app/api/snow/route.ts
// GET /api/snow?lat=XX&lon=XX&park=yosemite
// Uses Open-Meteo for snowfall/snowdepth data — free, no key required

import { NextRequest, NextResponse } from 'next/server';

export const revalidate = 21600; // 6 hours

export async function GET(req: NextRequest) {
  const lat  = req.nextUrl.searchParams.get('lat')  ?? '44.428';
  const lon  = req.nextUrl.searchParams.get('lon')  ?? '-110.588';

  try {
    const params = new URLSearchParams({
      latitude:         lat,
      longitude:        lon,
      hourly:           'snow_depth,snowfall',
      daily:            'snowfall_sum',
      temperature_unit: 'fahrenheit',
      timezone:         'auto',
      forecast_days:    '7',
    });
    const res  = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, { next: { revalidate: 21600 } });
    if (!res.ok) throw new Error(`Open-Meteo ${res.status}`);
    const data = await res.json();

    const hourly       = data.hourly;
    const nowIdx       = 0;
    const baseDepthM   = hourly?.snow_depth?.[nowIdx] ?? 0;
    const baseDepthIn  = Math.round(baseDepthM * 39.37);  // m → inches

    const newSnow24    = (data.daily?.snowfall_sum?.[0] ?? 0);
    const newSnow24In  = Math.round(newSnow24 * 0.394); // cm → inches

    const seasonTotal  = (data.daily?.snowfall_sum ?? []).reduce((s:number, v:number) => s + v, 0);
    const seasonTotalIn = Math.round(seasonTotal * 0.394);

    return NextResponse.json({
      source:         'open-meteo',
      baseDepthIn:    baseDepthIn   > 0 ? baseDepthIn   : null,
      newSnow24In:    newSnow24In   > 0 ? newSnow24In   : null,
      seasonTotalIn:  seasonTotalIn > 0 ? seasonTotalIn : null,
      snowpackStatus: baseDepthIn   > 24 ? 'Deep' : baseDepthIn > 6 ? 'Moderate' : baseDepthIn > 0 ? 'Shallow' : 'None',
      updatedAt:      new Date().toISOString(),
    }, { headers: { 'Cache-Control':'public,s-maxage=21600,stale-while-revalidate=3600' }});
  } catch (err: any) {
    return NextResponse.json({ source:'error', error:err.message });
  }
}
