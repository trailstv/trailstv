'use client';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getPark } from '@/lib/parks';

const ALERT_COLORS: Record<string, string> = {
  Danger:'#E05050', Closure:'#E05050', Caution:'#E0B85C', Information:'#4AADBC',
};

export default function ParkConditionsPage() {
  const params  = useParams();
  const slug    = typeof params.park === 'string' ? params.park : '';
  const park    = getPark(slug);
  const [weather, setWeather] = useState<any>(null);
  const [alerts,  setAlerts]  = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!park) return;
    Promise.allSettled([
      fetch(`/api/weather?lat=${park.lat}&lon=${park.lng}`).then(r => r.json()),
      fetch(`/api/nps/alerts?parkCode=${park.npsCode}`).then(r => r.json()),
    ]).then(([wr, ar]) => {
      if (wr.status === 'fulfilled') setWeather(wr.value);
      if (ar.status === 'fulfilled') setAlerts(ar.value.alerts ?? []);
      setLoading(false);
    });
  }, [slug]);

  if (!park) return <div className="sw"><p>Park not found. <Link href="/parks" className="bp">← All Parks</Link></p></div>;

  return (
    <div className="sw" style={{ maxWidth:800, paddingBottom:'4rem' }}>
      <div style={{ fontSize:'.74rem', color:'var(--granite)', marginBottom:'.75rem' }}>
        <Link href="/parks" style={{ color:'var(--glacial)' }}>Parks</Link>
        {' → '}
        <Link href={`/parks/${slug}`} style={{ color:'var(--glacial)' }}>{park.shortName}</Link>
        {' → '} Conditions
      </div>
      <div className="eye">Conditions · {park.shortName}</div>
      <h1 className="stitle">Current Conditions</h1>
      <p className="ssub">Live weather and NPS alerts for {park.shortName}.</p>

      {loading && <div style={{ color:'var(--granite)', fontSize:'.84rem', margin:'1rem 0' }}>Loading live data…</div>}

      {/* NPS Alerts */}
      {alerts.length > 0 && (
        <section style={{ marginBottom:'2rem' }}>
          <h2 style={{ fontFamily:'var(--fd)', fontSize:'1.1rem', fontWeight:700, marginBottom:'1rem' }}>
            🚨 NPS Alerts ({alerts.length})
          </h2>
          <div style={{ display:'flex', flexDirection:'column', gap:'.65rem' }}>
            {alerts.map((a: any) => {
              const color = ALERT_COLORS[a.category] ?? '#8B9EA8';
              return (
                <div key={a.id} style={{ background:'rgba(13,27,42,.65)', border:`1px solid ${color}40`,
                  borderLeft:`4px solid ${color}`, borderRadius:10, padding:'1rem 1.1rem' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', gap:'1rem', marginBottom:'.3rem' }}>
                    <div style={{ fontWeight:700, fontSize:'.88rem' }}>{a.title}</div>
                    <span style={{ background:`${color}20`, color, borderRadius:4, padding:'1px 7px', fontSize:'.68rem', fontWeight:700, flexShrink:0 }}>{a.category}</span>
                  </div>
                  <div style={{ fontSize:'.78rem', color:'rgba(242,245,247,.7)', lineHeight:1.65 }}>{a.description}</div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {!loading && alerts.length === 0 && (
        <div style={{ background:'rgba(74,188,120,.07)', border:'1px solid rgba(74,188,120,.2)',
          borderRadius:10, padding:'.85rem 1.1rem', marginBottom:'2rem', fontSize:'.82rem', color:'#4ABC78' }}>
          ✓ No active NPS alerts for {park.shortName}
        </div>
      )}

      {/* Weather */}
      {weather?.current && (
        <section style={{ marginBottom:'2rem' }}>
          <h2 style={{ fontFamily:'var(--fd)', fontSize:'1.1rem', fontWeight:700, marginBottom:'1rem' }}>
            {weather.current.icon} Current Weather
          </h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))', gap:'.65rem', marginBottom:'1.25rem' }}>
            {([
              ['Temperature', weather.current.tempF + '°F'],
              ['Feels Like',  weather.current.feelsLike + '°F'],
              ['Condition',   weather.current.condition],
              ['Humidity',    weather.current.humidity + '%'],
              ['Wind',        weather.current.windMph + ' mph'],
            ] as [string,string][]).map(([label, val]) => (
              <div key={label} style={{ background:'rgba(13,27,42,.6)', border:'1px solid var(--cborder)', borderRadius:9, padding:'.7rem .85rem' }}>
                <div style={{ fontSize:'.64rem', color:'var(--granite)', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:'.2rem' }}>{label}</div>
                <div style={{ fontWeight:700, fontSize:'.9rem' }}>{val}</div>
              </div>
            ))}
          </div>
          {weather.forecast && (
            <div style={{ display:'flex', gap:'.65rem', overflowX:'auto', paddingBottom:'.5rem' }}>
              {weather.forecast.map((f: any, i: number) => (
                <div key={i} style={{ background:'rgba(13,27,42,.7)', border:'1px solid var(--cborder)',
                  borderRadius:10, padding:'1rem .85rem', minWidth:90, textAlign:'center', flexShrink:0 }}>
                  <div style={{ fontSize:'.68rem', color:'var(--granite)', marginBottom:'.3rem' }}>{f.day}</div>
                  <div style={{ fontSize:'1.4rem', marginBottom:'.3rem' }}>{f.icon}</div>
                  <div style={{ fontSize:'.76rem', fontWeight:700 }}>{f.hi}° <span style={{ color:'var(--granite)', fontWeight:400 }}>{f.lo}°</span></div>
                  <div style={{ fontSize:'.64rem', color:'var(--granite)', marginTop:'.15rem' }}>{f.cond}</div>
                  {f.precip > 0 && <div style={{ fontSize:'.6rem', color:'var(--glacial)', marginTop:'.2rem' }}>💧 {f.precip}%</div>}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Safety reminders */}
      <section>
        <h2 style={{ fontFamily:'var(--fd)', fontSize:'1.1rem', fontWeight:700, marginBottom:'.75rem' }}>⚠ Safety Reminders</h2>
        <div style={{ display:'flex', flexDirection:'column', gap:'.5rem' }}>
          {park.warnings.map(w => (
            <div key={w} style={{ display:'flex', gap:'.75rem', fontSize:'.82rem', color:'rgba(242,245,247,.75)',
              background:'rgba(13,27,42,.5)', border:'1px solid var(--cborder)', borderRadius:9, padding:'.7rem 1rem' }}>
              <span style={{ color:'#E0B85C', flexShrink:0 }}>!</span>{w}
            </div>
          ))}
        </div>
      </section>

      <div style={{ marginTop:'1.5rem', display:'flex', gap:'.75rem', flexWrap:'wrap' }}>
        <a href={`https://www.nps.gov/${park.npsCode}/planyourvisit/conditions.htm`} target="_blank" rel="noopener" className="bs">Full NPS Conditions →</a>
        <Link href={`/parks/${slug}`} style={{ fontSize:'.82rem', color:'var(--granite)', fontWeight:600, alignSelf:'center' }}>← Back to {park.shortName}</Link>
      </div>
    </div>
  );
}
