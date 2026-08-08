// app/api/weather/route.ts
// GET /api/weather — current conditions + 7-day forecast for Lake Tahoe
// Cached 30 min at Vercel CDN edge
//
// ENV: OPENWEATHER_API_KEY
// Free tier: 1,000,000 calls/month
// Sign up: https://openweathermap.org → Free tier, no card needed
//
// Falls back to static data gracefully if key not set

import { NextResponse } from 'next/server';
import { SITE_DATA_FALLBACK } from '@/lib/data';

const LAT  = 39.0968;
const LON  = -120.0324;

export const revalidate = 1800;

const ICON_MAP: Record<string, string> = {
  '01': '☀️', '02': '🌤', '03': '⛅', '04': '☁️',
  '09': '🌧', '10': '🌧', '11': '⛈', '13': '❄️', '50': '🌫',
};
const toEmoji = (code: string) => ICON_MAP[code.slice(0,2)] ?? '⛅';
const DAYS = ['Today','Tomorrow','Wed','Thu','Fri','Sat','Sun'];

export async function GET() {
  const key = process.env.OPENWEATHER_API_KEY;

  if (!key) {
    return NextResponse.json(
      { source: 'fallback', ...SITE_DATA_FALLBACK.weather },
      { headers: { 'Cache-Control': 'public, s-maxage=1800' } }
    );
  }

  try {
    const [cRes, fRes] = await Promise.all([
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&units=imperial&appid=${key}`, { next: { revalidate: 1800 } }),
      fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&units=imperial&cnt=40&appid=${key}`, { next: { revalidate: 1800 } }),
    ]);

    if (!cRes.ok || !fRes.ok) throw new Error(`OWM ${cRes.status}/${fRes.status}`);

    const [cw, fc] = await Promise.all([cRes.json(), fRes.json()]);

    const current = {
      tempF:     Math.round(cw.main.temp),
      feelsLike: Math.round(cw.main.feels_like),
      humidity:  cw.main.humidity,
      windMph:   Math.round(cw.wind.speed),
      condition: cw.weather[0].main,
      icon:      toEmoji(cw.weather[0].icon),
    };

    // Collapse 3-hr slots → daily (noon entry preferred)
    const seen = new Set<string>();
    const forecast: typeof SITE_DATA_FALLBACK.weather.forecast = [];
    for (const entry of fc.list) {
      const d   = new Date(entry.dt * 1000);
      const key = d.toISOString().slice(0,10);
      const hr  = d.getHours();
      if (!seen.has(key) && hr >= 11 && hr <= 14) {
        seen.add(key);
        forecast.push({
          day:    DAYS[forecast.length] ?? d.toLocaleDateString('en',{weekday:'short'}),
          icon:   toEmoji(entry.weather[0].icon),
          hi:     Math.round(entry.main.temp_max),
          lo:     Math.round(entry.main.temp_min),
          cond:   entry.weather[0].main,
          precip: Math.round((entry.pop ?? 0) * 100),
        });
        if (forecast.length >= 7) break;
      }
    }
    while (forecast.length < 7) {
      forecast.push(SITE_DATA_FALLBACK.weather.forecast[forecast.length]);
    }

    // Water temp: Tahoe lags air by ~8–10°F in summer, 2–4°F in winter
    const waterTempF = Math.max(38, Math.min(72, Math.round(current.tempF - 9)));

    return NextResponse.json(
      { source: 'openweathermap', current, waterTempF, forecast },
      { headers: { 'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=300' } }
    );

  } catch (err: any) {
    console.error('Weather API error:', err.message);
    return NextResponse.json(
      { source: 'fallback', error: err.message, ...SITE_DATA_FALLBACK.weather },
      { headers: { 'Cache-Control': 'public, s-maxage=300' } }
    );
  }
}
