// app/api/fire/route.ts
// GET /api/fire — fire restrictions for the Lake Tahoe Basin (USFS LTBMU)
// Cached 1 hour. No API key required — public federal data.
//
// Source: USFS Alerts GeoJSON feed
// Falls back to Stage 1 static data if feed unavailable

import { NextResponse } from 'next/server';

export const revalidate = 3600;

// USFS public alerts feed for Lake Tahoe Basin Management Unit
const ALERTS_URL = 'https://www.fs.usda.gov/api/alerts/v1?unit=LTBMU&format=json';

export async function GET() {
  try {
    const res = await fetch(ALERTS_URL, { next: { revalidate: 3600 } });

    if (!res.ok) throw new Error(`USFS alerts ${res.status}`);

    const data = await res.json();
    const alerts: any[] = data.alerts ?? data.data ?? [];

    // Look for fire restriction orders in the alerts
    const fireAlerts = alerts.filter((a: any) => {
      const title = (a.title ?? a.subject ?? '').toLowerCase();
      return title.includes('fire') || title.includes('campfire') || title.includes('restriction');
    });

    let restrictionLevel  = 0;
    let restrictionLabel  = 'No Restrictions';
    let alertActive       = false;
    let alertText         = 'No active fire restrictions in the Lake Tahoe Basin.';

    if (fireAlerts.length > 0) {
      const latest = fireAlerts[0];
      const title  = (latest.title ?? latest.subject ?? '').toLowerCase();

      if (title.includes('stage 2') || title.includes('stage ii')) {
        restrictionLevel = 2;
        restrictionLabel = 'Stage 2';
      } else if (title.includes('stage 1') || title.includes('stage i')) {
        restrictionLevel = 1;
        restrictionLabel = 'Stage 1';
      } else {
        restrictionLevel = 1;
        restrictionLabel = 'Active Restriction';
      }

      alertActive = true;
      alertText   = latest.description ?? latest.body ?? `${restrictionLabel} Fire Restrictions in effect. No campfires outside designated fire rings.`;
      // Trim to readable length
      if (alertText.length > 200) alertText = alertText.slice(0, 197) + '…';
    }

    return NextResponse.json({
      source:           'usfs-ltbmu',
      restrictionLevel,
      restrictionLabel,
      alertActive,
      alertText,
      alertCount:       fireAlerts.length,
      updatedAt:        new Date().toISOString(),
    }, { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600' } });

  } catch (err: any) {
    // USFS feed unavailable — return known current state as fallback
    console.error('Fire API error:', err.message);
    return NextResponse.json({
      source:           'fallback',
      restrictionLevel: 1,
      restrictionLabel: 'Stage 1',
      alertActive:      true,
      alertText:        'Stage 1 Fire Restrictions in effect for the Lake Tahoe Basin. No campfires outside designated fire rings.',
      error:            err.message,
    }, { headers: { 'Cache-Control': 'public, s-maxage=3600' } });
  }
}
