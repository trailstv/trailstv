import Link from 'next/link';
import { getPark } from '@/lib/parks';

// Lake Tahoe hub — points to the existing Tahoe sections
// rather than duplicating the data that already lives in the main site

export const metadata = { title: 'Lake Tahoe — TrailsTV' };

const SECTIONS = [
  { href:'/activities', icon:'🎯', label:'Activities',   desc:'Hiking, MTB, climbing, boating, fishing, skiing, and more — 13 activity maps' },
  { href:'/trails',     icon:'🥾', label:'Trails',       desc:'33 trailheads across all four shores, difficulty ratings and distances' },
  { href:'/campsites',  icon:'⛺', label:'Camping',       desc:'14 campgrounds with live Recreation.gov availability' },
  { href:'/map',        icon:'🗺️', label:'Amenities',    desc:'34 amenity locations — grocery, gas, bike shops, gear, rentals' },
  { href:'/activities/boating', icon:'🚤', label:'Boating & Inspections', desc:'Marinas, ramps, and mandatory AIS inspection guide' },
];

export default function LakeTahoeParkPage() {
  const park = getPark('lake-tahoe')!;

  return (
    <div>
      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="hero-unified" style={{ minHeight:'60vh' }}>
        <div className="hero-unified-overlay" style={{ background:'linear-gradient(135deg,rgba(9,20,32,.92) 0%,rgba(9,20,32,.5) 100%)' }}/>
        <div className="hero-unified-content" style={{ paddingTop:'3rem', paddingBottom:'3rem' }}>
          <div style={{ fontSize:'.62rem', fontWeight:700, letterSpacing:'.18em',
            textTransform:'uppercase', color:park.heroColor, marginBottom:'.5rem' }}>
            {park.state} · Est. {park.established}
          </div>
          <h1 style={{ fontFamily:'var(--fd)', fontSize:'clamp(1.8rem,4vw,3.2rem)',
            fontWeight:900, lineHeight:1.05, marginBottom:'.6rem' }}>
            {park.shortName}
          </h1>
          <p style={{ fontSize:'.92rem', color:'rgba(242,245,247,.75)', maxWidth:560,
            lineHeight:1.75, marginBottom:'1.25rem' }}>
            {park.tagline}
          </p>
          <div style={{ display:'flex', gap:'1.5rem', flexWrap:'wrap', marginBottom:'1.5rem' }}>
            {([
              [park.annualVisits, 'Annual visits'],
              ['72 mi shoreline', 'Lake size'],
              ['6,229 ft', 'Elevation'],
              ['Free entry', 'Admission'],
            ] as [string,string][]).map(([val, label]) => (
              <div key={label}>
                <div style={{ fontWeight:700, fontSize:'.9rem', color:park.heroColor }}>{val}</div>
                <div style={{ fontSize:'.64rem', color:'var(--granite)', textTransform:'uppercase', letterSpacing:'.08em' }}>{label}</div>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', gap:'.75rem', flexWrap:'wrap' }}>
            <Link href="/trails" className="bp">Trail Map →</Link>
            <Link href="/campsites" className="bs">Campsites →</Link>
            <Link href="/activities/boating" className="bs">Boating →</Link>
          </div>
        </div>
      </section>

      {/* ── HIGHLIGHTS ───────────────────────────────────────────────── */}
      <section className="sw" style={{ paddingBottom:'2rem' }}>
        <div className="eye">Signature experiences</div>
        <h2 style={{ fontFamily:'var(--fd)', fontSize:'1.4rem', fontWeight:700, marginBottom:'1rem' }}>
          Why people come to Lake Tahoe
        </h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:'.6rem', marginBottom:'2rem' }}>
          {park.highlights.map(h => (
            <div key={h} style={{ display:'flex', gap:'.5rem', fontSize:'.82rem',
              background:'rgba(13,27,42,.6)', border:'1px solid var(--cborder)',
              borderRadius:9, padding:'.7rem .9rem', alignItems:'flex-start' }}>
              <span style={{ color:park.heroColor, fontWeight:700, flexShrink:0 }}>→</span>
              {h}
            </div>
          ))}
        </div>
        <div style={{ background:'rgba(224,184,92,.05)', border:'1px solid rgba(224,184,92,.2)',
          borderRadius:12, padding:'1.1rem 1.25rem' }}>
          <div style={{ fontWeight:700, fontSize:'.86rem', marginBottom:'.6rem', color:'#E0B85C' }}>
            ⚠ Before you go — know this
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:'.4rem' }}>
            {park.warnings.map(w => (
              <div key={w} style={{ fontSize:'.8rem', color:'rgba(242,245,247,.72)', display:'flex', gap:'.5rem' }}>
                <span style={{ color:'#E0B85C', flexShrink:0 }}>!</span>{w}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION GRID ─────────────────────────────────────────────── */}
      <section style={{ background:'rgba(9,20,32,.4)', borderTop:'1px solid var(--cborder)' }}>
        <div className="sw" style={{ paddingTop:'2rem', paddingBottom:'3rem' }}>
          <div className="eye">Full planning guides</div>
          <h2 style={{ fontFamily:'var(--fd)', fontSize:'1.3rem', fontWeight:700, marginBottom:'1rem' }}>
            Explore Lake Tahoe
          </h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:'1rem' }}>
            {SECTIONS.map(s => (
              <Link key={s.href} href={s.href} style={{ textDecoration:'none', color:'inherit' }}>
                <div className="act-card" style={{ cursor:'pointer' }}>
                  <div style={{ fontSize:'1.6rem', marginBottom:'.5rem' }}>{s.icon}</div>
                  <div style={{ fontWeight:700, fontSize:'.95rem', marginBottom:'.3rem' }}>{s.label}</div>
                  <div style={{ fontSize:'.76rem', color:'var(--granite)', lineHeight:1.6 }}>{s.desc}</div>
                  <div style={{ marginTop:'.6rem', fontSize:'.74rem', color:park.heroColor, fontWeight:600 }}>Explore →</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── SEASONS ──────────────────────────────────────────────────── */}
      <section className="sw" style={{ paddingTop:'2rem', paddingBottom:'3rem' }}>
        <div className="eye">When to visit</div>
        <h2 style={{ fontFamily:'var(--fd)', fontSize:'1.2rem', fontWeight:700, marginBottom:'1rem' }}>
          Lake Tahoe by Season
        </h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:'.75rem', marginBottom:'1.5rem' }}>
          {park.seasons.map(s => (
            <div key={s.name} style={{ background:'rgba(13,27,42,.6)', border:'1px solid var(--cborder)',
              borderRadius:10, padding:'1rem 1.1rem' }}>
              <div style={{ fontWeight:700, fontSize:'.84rem', color:park.heroColor, marginBottom:'.35rem' }}>{s.name}</div>
              <div style={{ fontSize:'.78rem', color:'rgba(242,245,247,.7)', lineHeight:1.65 }}>{s.desc}</div>
            </div>
          ))}
        </div>
        <div style={{ display:'flex', gap:'.75rem', flexWrap:'wrap' }}>
          <Link href="/" className="bs">Tahoe Home →</Link>
          <Link href="/parks" style={{ fontSize:'.82rem', color:'var(--granite)', fontWeight:600, alignSelf:'center' }}>← All Parks</Link>
        </div>
      </section>
    </div>
  );
}
