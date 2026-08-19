import { NextRequest, NextResponse } from 'next/server';

export const revalidate = 1800;

const DAYS = ['Today','Tomorrow','Wed','Thu','Fri','Sat','Sun'];

function wmoEmoji(code: number) {
  if (code === 0)  return '☀️';
  if (code <= 2)   return '🌤';
  if (code === 3)  return '☁️';
  if (code <= 49)  return '🌫';
  if (code <= 65)  return '🌧';
  if (code <= 77)  return '❄️';
  if (code <= 82)  return '🌦';
  if (code <= 86)  return '🌨';
  if (code <= 99)  return '⛈';
  return '⛅';
}
function wmoLabel(code: number) {
  if (code === 0)  return 'Clear';
  if (code <= 2)   return 'Partly Cloudy';
  if (code === 3)  return 'Overcast';
  if (code <= 49)  return 'Fog';
  if (code <= 65)  return 'Rain';
  if (code <= 77)  return 'Snow';
  if (code <= 82)  return 'Showers';
  if (code <= 86)  return 'Snow Showers';
  if (code <= 99)  return 'Thunderstorm';
  return 'Cloudy';
}

export async function GET(req: NextRequest) {
  const lat = req.nextUrl.searchParams.get('lat') ?? '44.428';
  const lon = req.nextUrl.searchParams.get('lon') ?? '-110.588';

  try {
    const params = new URLSearchParams({
      latitude:         lat,
      longitude:        lon,
      current:          'temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code',
      daily:            'temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max',
      temperature_unit: 'fahrenheit',
      wind_speed_unit:  'mph',
      timezone:         'auto',
      forecast_days:    '7',
    });
    const res  = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, { next: { revalidate: 1800 } });
    if (!res.ok) throw new Error(`Open-Meteo ${res.status}`);
    const data  = await res.json();
    const cur   = data.current;
    const daily = data.daily;

    return NextResponse.json({
      source:  'open-meteo',
      current: {
        tempF:     Math.round(cur.temperature_2m),
        feelsLike: Math.round(cur.apparent_temperature),
        humidity:  cur.relative_humidity_2m,
        windMph:   Math.round(cur.wind_speed_10m),
        condition: wmoLabel(cur.weather_code),
        icon:      wmoEmoji(cur.weather_code),
      },
      forecast: (daily.time as string[]).slice(0,7).map((_: string, i: number) => ({
        day:    DAYS[i] ?? daily.time[i],
        icon:   wmoEmoji(daily.weather_code[i]),
        hi:     Math.round(daily.temperature_2m_max[i]),
        lo:     Math.round(daily.temperature_2m_min[i]),
        cond:   wmoLabel(daily.weather_code[i]),
        precip: daily.precipitation_probability_max[i] ?? 0,
      })),
    }, { headers: { 'Cache-Control':'public,s-maxage=1800,stale-while-revalidate=300' }});
  } catch (err: any) {
    return NextResponse.json({ source:'error', error: err.message }, { status:502 });
  }
}
