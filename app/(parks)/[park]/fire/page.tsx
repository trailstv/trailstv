'use client';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getPark } from '@/lib/parks';

const RESTRICTION_LEVELS: Record<string, { label: string; color: string; desc: string }> = {
  '0': { label:'No Restrictions', color:'#4ABC78', desc:'Campfires permitted where facilities provided. Check local rules.' },
  '1': { label:'Stage 1',         color:'#E0B85C', desc:'No campfires in dispersed areas. Camp stoves with shut-off valve OK.' },
  '2': { label:'Stage 2',         color:'#E05050', desc:'No fires of any kind. No smoking except in enclosed vehicles. High risk.' },
  '3': { label:'Closure',         color:'#8B0000', desc:'Area closed to public entry due to active fire. Check NPS website.' },
};

export default function FirePage() {
  const params = useParams();
  const slug   = typeof params.park === 'string' ? params.park : '';
  const park   = getPark(slug);
  const [fire,    setFire]    = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!park) return;
    fetch(`/api/fire?parkCode=${park.npsCode}`)
      .then(r => r.json())
      .then(d => { setFire(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [slug]);

  if (!park) return <div className="sw"><p>Park not found.</p></div>;

  const level  = fire?.restrictionLevel ?? '0';
  const info   = RESTRICTION_LEVELS[level] ?? RESTRICTION_LEVELS['0'];

  return (
    <div className="sw" style={{ maxWidth:820, paddingBottom:'4rem' }}>
      <div style={{ fontSize:'.74rem', color:'var(--granite)', marginBottom:'.75rem' }}>
        <Link href={`/parks/${slug}`} style={{ color:'var(--glacial)' }}>{park.shortName}</Link>
        {' → '} Fire Conditions
      </div>
      <div className="eye">Fire Conditions · {park.shortName}</div>
      <h1 className="stitle">🔥 Fire Restrictions</h1>
      <p className="ssub">Current fire restriction level and active fire information for {park.shortName}.</p>

      {loading && <div style={{ color:'var(--granite)', marginBottom:'1.5rem' }}>Loading fire data…</div>}

      {/* Restriction level card */}
      <div style={{ background:`rgba(13,27,42,.7)`, border:`2px solid ${info.color}`,
        borderRadius:14, padding:'1.5rem 1.75rem', marginBottom:'1.5rem' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'.75rem' }}>
          <span style={{ background:`${info.color}20`, color:info.color,
            borderRadius:8, padding:'6px 16px', fontSize:'.9rem', fontWeight:800 }}>
            {info.label}
          </span>
          <span style={{ fontSize:'.72rem', color:'var(--granite)' }}>
            {fire?.updatedAt ? `Updated: ${new Date(fire.updatedAt).toLocaleDateString()}` : 'Loaded from NPS'}
          </span>
        </div>
        <p style={{ fontSize:'.88rem', color:'rgba(242,245,247,.8)', lineHeight:1.75 }}>{info.desc}</p>
        {fire?.details && (
          <p style={{ fontSize:'.82rem', color:'rgba(242,245,247,.7)', marginTop:'.75rem', lineHeight:1.7 }}>{fire.details}</p>
        )}
      </div>

      {/* Active fires */}
      {fire?.activeFires?.length > 0 && (
        <section style={{ marginBottom:'2rem' }}>
          <h2 style={{ fontFamily:'var(--fd)', fontSize:'1.1rem', fontWeight:700, marginBottom:'1rem' }}>
            Active Fires ({fire.activeFires.length})
          </h2>
          <div style={{ display:'flex', flexDirection:'column', gap:'.65rem' }}>
            {fire.activeFires.map((f:any, i:number) => (
              <div key={i} style={{ background:'rgba(224,80,80,.07)', border:'1px solid rgba(224,80,80,.2)',
                borderLeft:'4px solid #E05050', borderRadius:10, padding:'1rem 1.1rem' }}>
                <div style={{ fontWeight:700, fontSize:'.88rem', marginBottom:'.3rem' }}>{f.name}</div>
                <div style={{ fontSize:'.78rem', color:'rgba(242,245,247,.7)' }}>
                  {f.acres ? `${f.acres.toLocaleString()} acres` : ''}
                  {f.containment !== undefined ? ` · ${f.containment}% contained` : ''}
                  {f.cause ? ` · Cause: ${f.cause}` : ''}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* General safety */}
      <section style={{ background:'rgba(224,80,80,.05)', border:'1px solid rgba(224,80,80,.15)',
        borderRadius:12, padding:'1.1rem 1.25rem' }}>
        <div style={{ fontWeight:700, fontSize:'.86rem', marginBottom:'.6rem', color:'#E05050' }}>🔥 Fire Safety</div>
        <div style={{ display:'flex', flexDirection:'column', gap:'.4rem' }}>
          {['Always check current restrictions before building any fire','Never leave a fire unattended — drown it until cold','During Stage 1+, use only camp stoves with an on/off valve','Report new fires immediately: 911 or park emergency line'].map(tip => (
            <div key={tip} style={{ fontSize:'.8rem', color:'rgba(242,245,247,.75)', display:'flex', gap:'.5rem' }}>
              <span style={{ color:'#E05050', flexShrink:0 }}>!</span>{tip}
            </div>
          ))}
        </div>
      </section>

      <div style={{ marginTop:'1.5rem', display:'flex', gap:'.75rem', flexWrap:'wrap' }}>
        <a href={`https://www.nps.gov/${park.npsCode}/learn/management/fire.htm`}
          target="_blank" rel="noopener" className="bs">NPS Fire Page →</a>
        <a href="https://www.nifc.gov" target="_blank" rel="noopener" className="bs">National Fire Map →</a>
        <Link href={`/parks/${slug}`} style={{ fontSize:'.82rem', color:'var(--granite)', fontWeight:600, alignSelf:'center' }}>← Park Overview</Link>
      </div>
    </div>
  );
}
