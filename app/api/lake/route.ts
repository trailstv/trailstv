// app/api/lake/route.ts
// GET /api/lake — Lake Tahoe water level from USGS gauge 10337000
// Cached 6 hours. No API key required — public federal data.
//
// USGS gauge at Tahoe City has measured lake level since 1900.
// Current elevation = 6,220.00 ft datum + gage height reading
// Natural rim = 6,223 ft | Legal max = 6,229.1 ft | Record min = 6,220.26 ft (1992)
//
// Source: https://waterservices.usgs.gov/

import { NextResponse } from 'next/server';

export const revalidate = 21600; // 6 hours

const USGS_URL =
  'https://waterservices.usgs.gov/nwis/iv/?sites=10337000&parameterCd=00065&format=json&siteStatus=active';

// Datum offset: USGS gage height + 6,220.00 ft = actual lake elevation
const DATUM = 6220.00;

export async function GET() {
  try {
    const res = await fetch(USGS_URL, { next: { revalidate: 21600 } });
    if (!res.ok) throw new Error(`USGS ${res.status}`);

    const data = await res.json();
    const timeSeries = data.value?.timeSeries?.[0];
    const latest     = timeSeries?.values?.[0]?.value?.[0];

    if (!latest || latest.value === undefined) {
      throw new Error('No USGS data in response');
    }

    const gageHeightFt = parseFloat(latest.value);
    const levelFt      = parseFloat((DATUM + gageHeightFt).toFixed(2));
    const naturalRim   = 6223;
    const legalMax     = 6229.1;

    let levelStatus = 'normal';
    if (levelFt > legalMax - 0.5) levelStatus = 'high';
    else if (levelFt < naturalRim - 1.5) levelStatus = 'low';

    // Clarity is long-term UC Davis average, no live API available
    const clarityFt = 71;

    return NextResponse.json({
      source:      'usgs-10337000',
      levelFt,
      levelStatus,
      gageHeightFt,
      naturalRimFt: naturalRim,
      legalMaxFt:   legalMax,
      clarityFt,
      measuredAt:   latest.dateTime,
      updatedAt:    new Date().toISOString(),
    }, { headers: { 'Cache-Control': 'public, s-maxage=21600, stale-while-revalidate=3600' } });

  } catch (err: any) {
    console.error('Lake level API error:', err.message);
    return NextResponse.json({
      source:      'fallback',
      levelFt:     6222.4,
      levelStatus: 'normal',
      clarityFt:   71,
      error:       err.message,
    }, { headers: { 'Cache-Control': 'public, s-maxage=3600' } });
  }
}
