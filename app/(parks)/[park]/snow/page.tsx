'use client';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getPark } from '@/lib/parks';

// Parks with ski areas
const PARK_SKI: Record<string, { name: string; url: string; vertical?: number; runs?: number }[]> = {
  yosemite:         [{ name:'Badger Pass Ski Area', url:'https://www.travelyosemite.com/winter/badger-pass/', vertical:800, runs:10 }],
  yellowstone:      [{ name:'Backcountry Ski Access (guided)', url:'https://www.nps.gov/yell/planyourvisit/winteractivities.htm' }],
  'rocky-mountain': [{ name:'Hidden Valley (historic)', url:'https://www.nps.gov/romo/planyourvisit/winteractivities.htm' }],
  'great-smoky-mountains': [],
  olympic:          [{ name:'Hurricane Ridge Winter Recreation', url:'https://www.nps.gov/olym/planyourvisit/hurricane-ridge-in-winter.htm' }],
  'mount-rainier':  [{ name:'Paradise Snowplay & Skiing', url:'https://www.nps.gov/mora/planyourvisit/paradise-winter.htm', vertical:1000 }],
  'crater-lake':    [{ name:'Rim Village Snowshoeing & Nordic', url:'https://www.nps.gov/crla/planyourvisit/winter.htm' }],
  'bryce-canyon':   [{ name:'Rim Trail Snowshoeing', url:'https://www.nps.gov/brca/planyourvisit/winter.htm' }],
  glacier:          [{ name:'Apgar/Lake McDonald Nordic', url:'https://www.nps.gov/glac/planyourvisit/winter-activities.htm' }],
  shenandoah:       [{ name:'Skyline Drive Snowshoeing', url:'https://www.nps.gov/shen/planyourvisit/winter.htm' }],
  sequoia:          [{ name:'Wolverton Snowplay Area', url:'https://www.nps.gov/seki/planyourvisit/winter-activities.htm', vertical:600, runs:5 }],
};

export default function SnowPage() {
  const params = useParams();
  const slug   = typeof params.park === 'string' ? params.park : '';
  const park   = getPark(slug);
  const [snow,    setSnow]    = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!park) return;
    fetch(`/api/snow?lat=${park.lat}&lon=${park.lng}&park=${slug}`)
      .then(r => r.json())
      .then(d => { setSnow(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [slug]);

  if (!park) return <div className="sw"><p>Park not found.</p></div>;

  const skiAreas = PARK_SKI[slug] ?? [];

  return (
    <div className="sw" style={{ maxWidth:820, paddingBottom:'4rem' }}>
      <div style={{ fontSize:'.74rem', color:'var(--granite)', marginBottom:'.75rem' }}>
        <Link href={`/parks/${slug}`} style={{ color:'var(--glacial)' }}>{park.shortName}</Link>
        {' → '} Snow & Skiing
      </div>
      <div className="eye">Snow & Skiing · {park.shortName}</div>
      <h1 className="stitle">❄️ Snow & Ski Conditions</h1>
      <p className="ssub">Current snowpack, ski area status, and winter recreation for {park.shortName}.</p>

      {loading && <div style={{ color:'var(--granite)', marginBottom:'1.5rem' }}>Loading snow data…</div>}

      {/* Snow depth grid */}
      {snow && (
        <section style={{ marginBottom:'2rem' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:'.75rem', marginBottom:'1.25rem' }}>
            {([
              ['Base Depth',   snow.baseDepthIn ? `${snow.baseDepthIn}"` : '—'],
              ['New 24hr',     snow.newSnow24In ? `${snow.newSnow24In}"` : '—'],
              ['Season Total', snow.seasonTotalIn ? `${snow.seasonTotalIn}"` : '—'],
              ['Snowpack',     snow.snowpackStatus ?? 'See NPS'],
            ] as [string,string][]).map(([label, val]) => (
              <div key={label} style={{ background:'rgba(13,27,42,.6)', border:'1px solid var(--cborder)', borderRadius:9, padding:'.85rem 1rem' }}>
                <div style={{ fontSize:'.64rem', color:'var(--granite)', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:'.2rem' }}>{label}</div>
                <div style={{ fontWeight:700, fontSize:'1.1rem', color:'#8BB8E8' }}>{val}</div>
              </div>
            ))}
          </div>
          {snow.updatedAt && (
            <div style={{ fontSize:'.7rem', color:'var(--granite)' }}>
              Data from: {snow.source ?? 'NPS / NOAA'} · Updated: {new Date(snow.updatedAt).toLocaleDateString()}
            </div>
          )}
        </section>
      )}

      {/* Ski areas */}
      {skiAreas.length > 0 && (
        <section style={{ marginBottom:'2rem' }}>
          <h2 style={{ fontFamily:'var(--fd)', fontSize:'1.1rem', fontWeight:700, marginBottom:'1rem' }}>
            ⛷️ Ski Areas &amp; Winter Recreation
          </h2>
          <div style={{ display:'flex', flexDirection:'column', gap:'.75rem' }}>
            {skiAreas.map(s => (
              <div key={s.name} style={{ background:'rgba(13,27,42,.65)', border:'1px solid var(--cborder)',
                borderRadius:12, padding:'1.1rem 1.25rem' }}>
                <div style={{ fontWeight:700, fontSize:'.92rem', marginBottom:'.4rem' }}>{s.name}</div>
                {(s.vertical || s.runs) && (
                  <div style={{ fontSize:'.76rem', color:'var(--granite)', marginBottom:'.5rem' }}>
                    {s.vertical ? `${s.vertical} ft vertical` : ''}
                    {s.vertical && s.runs ? ' · ' : ''}
                    {s.runs ? `${s.runs} runs` : ''}
                  </div>
                )}
                <a href={s.url} target="_blank" rel="noopener" className="bs" style={{ textDecoration:'none', fontSize:'.8rem', padding:'6px 14px' }}>
                  Current Conditions →
                </a>
              </div>
            ))}
          </div>
        </section>
      )}

      {skiAreas.length === 0 && (
        <div style={{ background:'rgba(13,27,42,.5)', border:'1px solid var(--cborder)', borderRadius:12, padding:'1.5rem', textAlign:'center', marginBottom:'2rem' }}>
          <div style={{ fontSize:'.88rem', color:'var(--granite)', lineHeight:1.7 }}>
            No designated ski areas in {park.shortName}. Check the NPS website for winter recreation options including snowshoeing and cross-country skiing.
          </div>
          <a href={`https://www.nps.gov/${park.npsCode}/planyourvisit/winter.htm`}
            target="_blank" rel="noopener" className="bs" style={{ display:'inline-block', marginTop:'1rem', textDecoration:'none' }}>
            NPS Winter Activities →
          </a>
        </div>
      )}

      {/* Nearby resorts note */}
      <section style={{ background:'rgba(74,173,188,.05)', border:'1px solid rgba(74,173,188,.15)',
        borderRadius:12, padding:'1.1rem 1.25rem' }}>
        <div style={{ fontWeight:700, fontSize:'.86rem', marginBottom:'.5rem', color:'var(--glacial)' }}>
          💡 Nearby Ski Resorts
        </div>
        <div style={{ fontSize:'.8rem', color:'rgba(242,245,247,.7)', lineHeight:1.75 }}>
          Most national parks are within driving distance of commercial ski resorts.
          Check OpenSnow, Ski Magazine, or OnTheSnow for detailed resort conditions near {park.shortName}.
        </div>
      </section>

      <div style={{ marginTop:'1.5rem', display:'flex', gap:'.75rem', flexWrap:'wrap' }}>
        <Link href={`/parks/${slug}/conditions`} className="bs">Live Weather →</Link>
        <Link href={`/parks/${slug}`} style={{ fontSize:'.82rem', color:'var(--granite)', fontWeight:600, alignSelf:'center' }}>← Park Overview</Link>
      </div>
    </div>
  );
}
