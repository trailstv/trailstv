// app/api/snow/route.ts
// GET /api/snow — snow depth and ski resort status for the Tahoe basin
// Cached 6 hours. No API key required — NRCS SNOTEL public data.
//
// SNOTEL sites used:
//   1049:NV  — Mt. Rose (8,260 ft)      — East shore / Diamond Peak area
//   778:CA   — Rubicon #2 (8,750 ft)    — West shore / Desolation Wilderness
//   734:CA   — Tahoe City Cross (6,900 ft) — North shore baseline
//   602:CA   — Donner Summit (6,900 ft) — North shore / I-80 corridor
//
// WTEQ = snow water equivalent (in), SNWD = snow depth (in)
//
// Source: https://wcc.sc.egov.usda.gov/reportGenerator/

import { NextResponse } from 'next/server';

export const revalidate = 21600;

// Lightweight CSV report — one row per site
const SNOTEL_URL =
  'https://wcc.sc.egov.usda.gov/reportGenerator/view_csv/customMultiTimeSeriesGroupByStationReport/daily/start_of_period/' +
  '1049:NV:SNTL%7C778:CA:SNTL%7C734:CA:SNTL%7C602:CA:SNTL%7Cid=%22%22%7Cname/' +
  '0,0/SNWD::value,WTEQ::value';

const RESORT_SITES = [
  { name: 'Palisades Tahoe',   site: '778:CA:SNTL' },
  { name: 'Mt. Rose',          site: '1049:NV:SNTL' },
  { name: 'Northstar / Donner',site: '602:CA:SNTL' },
  { name: 'South Shore',       site: '734:CA:SNTL' },
];

function parseSnotel(csv: string) {
  const lines  = csv.split('\n').filter(l => l && !l.startsWith('#'));
  const header = lines[0]?.split(',') ?? [];
  return lines.slice(1).map(line => {
    const vals = line.split(',');
    const row: Record<string, string> = {};
    header.forEach((h, i) => { row[h.trim()] = (vals[i] ?? '').trim(); });
    return row;
  });
}

export async function GET() {
  try {
    const res = await fetch(SNOTEL_URL, { next: { revalidate: 21600 } });
    if (!res.ok) throw new Error(`SNOTEL ${res.status}`);

    const csv  = await res.text();
    const rows = parseSnotel(csv);

    // Average snow depth across all sites
    const depths   = rows
      .map(r => parseFloat(Object.values(r).find((v, i) => i === 1) ?? '0'))
      .filter(v => !isNaN(v) && v >= 0);
    const avgDepth = depths.length ? Math.round(depths.reduce((a,b)=>a+b,0) / depths.length) : 0;

    const season      = avgDepth > 12 ? 'open' : 'off';
    const openResorts = season === 'open' ? Math.min(10, Math.ceil(avgDepth / 8)) : 0;

    return NextResponse.json({
      source:        'nrcs-snotel',
      season,
      baseDepthIn:   avgDepth,
      newSnow48hrIn: 0, // SNOTEL daily doesn't give 48hr delta cleanly
      resortCount:   14,
      openResorts,
      updatedAt:     new Date().toISOString(),
    }, { headers: { 'Cache-Control': 'public, s-maxage=21600, stale-while-revalidate=3600' } });

  } catch (err: any) {
    console.error('Snow API error:', err.message);
    return NextResponse.json({
      source:        'fallback',
      season:        'off',
      baseDepthIn:   0,
      newSnow48hrIn: 0,
      resortCount:   14,
      openResorts:   0,
      error:         err.message,
    }, { headers: { 'Cache-Control': 'public, s-maxage=3600' } });
  }
}
