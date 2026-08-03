// app/api/trailheads/route.ts
// Fetches hiking trailheads from OpenStreetMap via Overpass API.
// No API key required. Results cached 24hrs at the CDN level.
// Falls back to static curated data if Overpass is unavailable.

import { NextResponse } from 'next/server';

export const revalidate = 86400; // cache 24 hours — trailheads don't change daily

// Bounding box for the Lake Tahoe basin
// south, west, north, east
const TAHOE_BBOX = '38.75,-120.25,39.40,-119.85';

const OVERPASS_QUERY = `
[out:json][timeout:25];
(
  node["highway"="trailhead"](${TAHOE_BBOX});
  node["tourism"="trailhead"](${TAHOE_BBOX});
  node["leisure"="nature_reserve"]["access"="yes"](${TAHOE_BBOX});
);
out body;
`;

export async function GET() {
  try {
    const url      = 'https://overpass-api.de/api/interpreter';
    const response = await fetch(url, {
      method:  'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body:    `data=${encodeURIComponent(OVERPASS_QUERY)}`,
      next:    { revalidate: 86400 },
    });

    if (!response.ok) {
      throw new Error(`Overpass returned ${response.status}`);
    }

    const data = await response.json();

    // Normalise OSM nodes into a clean shape
    const trailheads = (data.elements || [])
      .filter((el: any) => el.lat && el.lon && el.tags)
      .map((el: any) => ({
        id:       `osm-${el.id}`,
        name:     el.tags.name || el.tags['name:en'] || 'Unnamed Trailhead',
        lat:      el.lat,
        lng:      el.lon,
        trail:    el.tags['trail_name'] || el.tags['name'] || '',
        surface:  el.tags.surface   || null,
        access:   el.tags.access    || 'yes',
        operator: el.tags.operator  || null,
        website:  el.tags.website   || el.tags['url'] || null,
        fee:      el.tags.fee       || null,
        dogs:     el.tags.dog !== 'no',
        source:   'openstreetmap',
      }));

    return NextResponse.json({
      source:      'overpass-api',
      count:       trailheads.length,
      bbox:        TAHOE_BBOX,
      trailheads,
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
      },
    });

  } catch (err: any) {
    console.error('Overpass API error:', err.message);
    // Return error — client falls back to curated static data
    return NextResponse.json({
      source: 'error',
      error:  err.message,
      trailheads: [],
    }, { status: 502 });
  }
}
