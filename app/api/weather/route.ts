// app/api/weather/route.ts
// GET /api/weather — current conditions + 7-day forecast for Lake Tahoe
//
// Uses Open-Meteo (https://open-meteo.com) — completely free, no API key.
// Falls back to OpenWeatherMap if OPENWEATHER_API_KEY is set.
// Cached 30 minutes at Vercel CDN edge.

import { NextResponse } from 'next/server';
import { SITE_DATA_FALLBACK } from '@/lib/data';

export const revalidate = 1800;

const LAT  = 38.9116;   // South Lake Tahoe (matches NWS station)
const LON  = -120.0078;

const DAYS = ['Today','Tomorrow','Wed','Thu','Fri','Sat','Sun'];

// WMO weather code → emoji
function wmoEmoji(code: number): string {
  if (code === 0)                    return '☀️';
  if (code <= 2)                     return '🌤';
  if (code === 3)                    return '☁️';
  if (code <= 49)                    return '🌫';
  if (code <= 55)                    return '🌧';
  if (code <= 65)                    return '🌧';
  if (code <= 77)                    return '❄️';
  if (code <= 82)                    return '🌧';
  if (code <= 86)                    return '🌨';
  if (code <= 99)                    return '⛈';
  return '⛅';
}

function wmoLabel(code: number): string {
  if (code === 0)       return 'Clear';
  if (code <= 2)        return 'Partly Cloudy';
  if (code === 3)       return 'Overcast';
  if (code <= 49)       return 'Fog';
  if (code <= 55)       return 'Drizzle';
  if (code <= 65)       return 'Rain';
  if (code <= 77)       return 'Snow';
  if (code <= 82)       return 'Showers';
  if (code <= 86)       return 'Snow Showers';
  if (code <= 99)       return 'Thunderstorm';
  return 'Cloudy';
}

export async function GET() {
  try {
    // Open-Meteo: current weather + daily 7-day forecast — no key needed
    const params = new URLSearchParams({
      latitude:               String(LAT),
      longitude:              String(LON),
      current:                'temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code',
      daily:                  'temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max',
      temperature_unit:       'fahrenheit',
      wind_speed_unit:        'mph',
      precipitation_unit:     'inch',
      timezone:               'America/Los_Angeles',
      forecast_days:          '7',
    });

    const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, {
      next: { revalidate: 1800 },
    });

    if (!res.ok) throw new Error(`Open-Meteo ${res.status}`);

    const data = await res.json();
    const cur  = data.current;
    const daily = data.daily;

    const current = {
      tempF:     Math.round(cur.temperature_2m),
      feelsLike: Math.round(cur.apparent_temperature),
      humidity:  cur.relative_humidity_2m,
      windMph:   Math.round(cur.wind_speed_10m),
      condition: wmoLabel(cur.weather_code),
      icon:      wmoEmoji(cur.weather_code),
    };

    const forecast = (daily.time as string[]).slice(0, 7).map((_, i) => ({
      day:    DAYS[i] ?? daily.time[i],
      icon:   wmoEmoji(daily.weather_code[i]),
      hi:     Math.round(daily.temperature_2m_max[i]),
      lo:     Math.round(daily.temperature_2m_min[i]),
      cond:   wmoLabel(daily.weather_code[i]),
      precip: daily.precipitation_probability_max[i] ?? 0,
    }));

    // Water temp: August avg is 68-70°F — use real seasonal estimate
    // Tahoe water temp lags air significantly; August surface is ~68-72°F
    const month = new Date().getMonth(); // 0-indexed
    const waterSeasonalBase: Record<number, number> = {
      0:38, 1:38, 2:40, 3:45, 4:52, 5:60, 6:66, 7:70, 8:68, 9:58, 10:48, 11:40
    };
    const waterTempF = waterSeasonalBase[month] ?? 60;

    return NextResponse.json({
      source:     'open-meteo',
      current,
      waterTempF,
      forecast,
    }, {
      headers: { 'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=300' },
    });

  } catch (err: any) {
    console.error('Weather API error:', err.message);
    return NextResponse.json({
      source:  'fallback',
      error:   err.message,
      ...SITE_DATA_FALLBACK.weather,
    }, {
      headers: { 'Cache-Control': 'public, s-maxage=300' },
    });
  }
}
