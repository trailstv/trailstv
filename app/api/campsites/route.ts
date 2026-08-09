// app/api/campsites/route.ts
// GET /api/campsites
// Returns live availability for all 14 Tahoe campgrounds.
//
// Uses two Recreation.gov endpoints:
//   RIDB facilities API  — general campground info (no key needed for basic data)
//   Availability API     — requires RECGOV_KEY (free at ridb.recreation.gov)
//
// Falls back to CAMPS_FALLBACK static data if key is missing or API fails.
// Cached 15 minutes at Vercel CDN edge.

import { NextResponse } from 'next/server';
import { CAMPS_FALLBACK } from '@/lib/data';

export const revalidate = 900;

// Recreation.gov facility IDs for all bookable campgrounds in our list.
// First-come / non-RecGov campgrounds are excluded (Lake Forest / TCPUD, Spooner / NV State Parks).
const RECGOV_CAMPGROUNDS: { id: string; facilityId: string | null }[] = [
  { id: 'dlbliss',                facilityId: '637'      },
  { id: 'eaglepoint',             facilityId: '641'      },
  { id: 'sugarpine',              facilityId: '643'      },
  { id: 'williamkent',            facilityId: '232874'   },
  { id: 'meeksbay',               facilityId: '10220612' },
  { id: 'fallenlf',               facilityId: '232769'   },
  { id: 'camprich',               facilityId: '10305470' },
  { id: 'campground-by-the-lake', facilityId: null       },  // City of SLT
  { id: 'nvbeach',                facilityId: '232768'   },
  { id: 'zephyr',                 facilityId: '10300216' },
  { id: 'kaspian',                facilityId: '232875'   },
  { id: 'tahoe-sra',              facilityId: null       },  // ReserveCalifornia
  { id: 'lake-forest',            facilityId: null       },  // TCPUD first-come
  { id: 'spooner',                facilityId: null       },  // NV State Parks
];

// Get today + 1 day window for availability check
function getDateRange() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return {
    startDate: start.toISOString().split('T')[0],
    endDate:   end.toISOString().split('T')[0],
  };
}

export async function GET() {
  const key = process.env.RECGOV_KEY;

  // No key → return fallback with clear source label
  if (!key) {
    return NextResponse.json({
      source: 'fallback',
      message: 'Set RECGOV_KEY in Vercel Environment Variables for live availability',
      camps: CAMPS_FALLBACK,
    }, { headers: { 'Cache-Control': 'public, s-maxage=900' } });
  }

  const { startDate, endDate } = getDateRange();

  // Fetch availability for each Recreation.gov campground in parallel
  const recgovCamps = RECGOV_CAMPGROUNDS.filter(c => c.facilityId && parseInt(c.facilityId) > 0);

  const results = await Promise.allSettled(
    recgovCamps.map(async ({ id, facilityId }) => {
      const url = `https://www.recreation.gov/api/camps/availability/campground/${facilityId}/month?start_date=${startDate}T00:00:00.000Z`;
      const res = await fetch(url, {
        headers: {
          'Cookie': ``,  // RecGov availability doesn't need auth cookie with API key
          'Accept': 'application/json',
        },
        next: { revalidate: 900 },
      });
      if (!res.ok) throw new Error(`${facilityId}: ${res.status}`);
      const data = await res.json();

      // Count available sites for tonight
      const campsites = data.campsites ?? {};
      let available = 0;
      let total = 0;
      for (const site of Object.values(campsites) as any[]) {
        total++;
        const avail = site.availabilities ?? {};
        if (avail[startDate] === 'Available') available++;
      }
      return { id, available, total };
    })
  );

  // Merge live counts into fallback data
  const liveMap: Record<string, { available: number; total: number }> = {};
  for (const result of results) {
    if (result.status === 'fulfilled') {
      const { id, available, total } = result.value;
      liveMap[id] = { available, total };
    }
  }

  const camps = CAMPS_FALLBACK.map(c => {
    const live = liveMap[c.id];
    if (!live) return c; // first-come / non-RecGov — keep fallback
    return {
      ...c,
      available: live.available,
      sites:     live.total || c.sites,
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
  }, { headers: { 'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=60' } });
}
