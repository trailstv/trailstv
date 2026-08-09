// app/api/campsites/route.ts
// Returns live availability for Recreation.gov Tahoe campgrounds.
// Uses the undocumented but widely-used availability endpoint.
// Campgrounds on ReserveCalifornia, TCPUD, NV State Parks use fallback.
// Cached 15 minutes at Vercel CDN edge.
//
// ENV: RECGOV_KEY — free at ridb.recreation.gov

import { NextResponse } from 'next/server';
import { CAMPS_FALLBACK } from '@/lib/data';

export const revalidate = 900;

// Recreation.gov campground IDs only — excludes ReserveCalifornia & other systems
const REC_GOV_IDS: Record<string, string> = {
  'williamkent':  '232874',
  'meeksbay':     '10220612',
  'fallenlf':     '232769',
  'camprich':     '10305470',
  'nvbeach':      '232768',
  'zephyr':       '10300216',
  'kaspian':      '232875',
};

export async function GET() {
  const key = process.env.RECGOV_KEY;

  if (!key) {
    return NextResponse.json({
      source:  'fallback',
      message: 'Set RECGOV_KEY in Vercel Environment Variables for live availability',
      camps:   CAMPS_FALLBACK,
    }, { headers: { 'Cache-Control': 'public, s-maxage=900' } });
  }

  // Use first of current month — required by the availability endpoint
  const now   = new Date();
  const start = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2,'0')}-01T00:00:00.000Z`;

  // Today's date key as used in the availabilities object
  const todayKey = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}T00:00:00Z`;

  const entries = Object.entries(REC_GOV_IDS);

  const results = await Promise.allSettled(
    entries.map(async ([campId, facilityId]) => {
      const url = `https://www.recreation.gov/api/camps/availability/campground/${facilityId}/month?start_date=${start}`;
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'TrailsTV-Tahoe-Planner/1.0',
          'Accept':     'application/json',
        },
        next: { revalidate: 900 },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status} for ${facilityId}`);

      const data = await res.json();
      const campsites = data.campsites ?? {};

      let available = 0;
      let total     = 0;

      for (const site of Object.values(campsites) as any[]) {
        total++;
        const avail = site.availabilities ?? {};
        // Check today's key — Recreation.gov uses full ISO datetime keys
        if (avail[todayKey] === 'Available') available++;
      }

      return { campId, available, total };
    })
  );

  // Build live availability map
  const liveMap: Record<string, { available: number; total: number }> = {};
  const errors: string[] = [];

  for (let i = 0; i < results.length; i++) {
    const r = results[i];
    if (r.status === 'fulfilled') {
      const { campId, available, total } = r.value;
      liveMap[campId] = { available, total };
    } else {
      errors.push(`${entries[i][0]}: ${r.reason?.message ?? 'unknown error'}`);
    }
  }

  // Merge live counts into camp data
  const camps = CAMPS_FALLBACK.map(c => {
    const live = liveMap[c.id];
    if (!live) return { ...c }; // not on RecGov — keep fallback as-is
    return {
      ...c,
      available: live.available,
      sites:     live.total  || c.sites,
      full:      live.available === 0,
      limited:   live.available > 0 && live.available <= 5,
    };
  });

  const totalAvailable = camps.reduce((n, c) => n + c.available, 0);

  return NextResponse.json({
    source:         'recreation.gov',
    totalAvailable,
    camps,
    fetchedAt:      new Date().toISOString(),
    ...(errors.length ? { errors } : {}),
  }, { headers: { 'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=60' } });
}
