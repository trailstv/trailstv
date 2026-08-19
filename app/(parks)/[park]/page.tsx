import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPark } from '@/lib/parks';
import { ACTIVITIES } from '@/lib/activities';

export function generateMetadata({ params }: { params: { park: string } }) {
  const park = getPark(params.park);
  if (!park) return {};
  return { title: park.shortName };
}

const SECTIONS = [
  { slug:'trails',      icon:'🥾', label:'Hiking Trails',    desc:'Trailheads, distances, elevation, and permit requirements' },
  { slug:'mtb',         icon:'🚵', label:'Mountain Biking',   desc:'MTB-legal routes, flow trails, and bike-friendly paths' },
  { slug:'camping',     icon:'⛺', label:'Camping',           desc:'All campgrounds with live Recreation.gov availability' },
  { slug:'kayaking',    icon:'🛶', label:'Kayaking',          desc:'Put-ins, flatwater, and whitewater routes' },
  { slug:'boating',     icon:'🚤', label:'Boating',           desc:'Boat ramps, marinas, and on-water regulations' },
  { slug:'climbing',    icon:'🧗', label:'Rock Climbing',     desc:'Sport, trad, bouldering areas and gear shops' },
  { slug:'backpacking', icon:'🌲', label:'Backpacking',       desc:'Wilderness routes, permits, and backcountry camps' },
  { slug:'swimming',    icon:'🏊', label:'Swimming',          desc:'Swimming holes, beaches, and water conditions' },
  { slug:'wildlife',    icon:'🦅', label:'Wildlife Viewing',  desc:'Prime spots, best times, and species guides' },
  { slug:'fire',        icon:'🔥', label:'Fire Conditions',   desc:'Live fire restrictions and active fire perimeters' },
  { slug:'snow',        icon:'❄️', label:'Snow & Skiing',     desc:'Snow depth, ski areas, and backcountry conditions' },
  { slug:'conditions',  icon:'🌡️', label:'Live Conditions',  desc:'Current weather, NPS alerts, and road status' },
];

export default function ParkPage({ params }: { params: { park: string } }) {
  const park = getPark(params.park);
  if (!park) notFound();

  const parkActivities = ACTIVITIES.filter(a => park.activities.includes(a.slug));

  return (
    <div>
      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section className="hero-unified" style={{ minHeight:'65vh' }}>
        <div className="hero-unified-overlay" style={{ background:'linear-gradient(135deg,rgba(9,20,32,.92) 0%,rgba(9,20,32,.5) 100%)' }}/>
        <div className="hero-unified-content" style={{ paddingTop:'3rem', paddingBottom:'3rem', position:'relative', zIndex:2 }}>
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
          {/* Stats row */}
          <div style={{ display:'flex', gap:'1.5rem', flexWrap:'wrap', marginBottom:'1.5rem' }}>
            {([
              [park.annualVisits + ' visits/yr',  'Visitors'],
              [park.acreage + ' acres',            'Area'],
              [park.elevationFt.high.toLocaleString() + ' ft', 'High Point'],
              [park.entranceFee.startsWith('Free') ? 'Free' : park.entranceFee.split('/')[0], 'Entrance'],
            ] as [string,string][]).map(([val, label]) => (
              <div key={label}>
                <div style={{ fontWeight:700, fontSize:'.9rem', color:park.heroColor }}>{val}</div>
                <div style={{ fontSize:'.64rem', color:'var(--granite)', textTransform:'uppercase', letterSpacing:'.06em' }}>{label}</div>
              </div>
            ))}
          </div>
          {/* Activity icons */}
          <div style={{ display:'flex', flexWrap:'wrap', gap:'.4rem', marginBottom:'1.5rem' }}>
            {parkActivities.map(a => (
              <Link key={a.slug} href={`/parks/${park.slug}/${a.slug}`}
                style={{ display:'flex', alignItems:'center', gap:'.3rem',
                  background:'rgba(13,27,42,.7)', border:'1px solid var(--cborder)',
                  borderRadius:20, padding:'4px 12px', fontSize:'.72rem', fontWeight:600,
                  color:'var(--granite)', textDecoration:'none', transition:'all .18s' }}>
                {a.icon} {a.name}
              </Link>
            ))}
          </div>
          <div style={{ display:'flex', gap:'.75rem', flexWrap:'wrap' }}>
            <Link href={`/parks/${park.slug}/trails`} className="bp">View Trail Map →</Link>
            <Link href={`/parks/${park.slug}/camping`} className="bs">Campgrounds →</Link>
            <Link href={`/parks/${park.slug}/conditions`} className="bs">Live Conditions →</Link>
          </div>
        </div>
      </section>

      {/* ── HIGHLIGHTS ────────────────────────────────────────────── */}
      <section className="sw" style={{ paddingBottom:'1.5rem' }}>
        <div className="eye">Why people come here</div>
        <h2 style={{ fontFamily:'var(--fd)', fontSize:'1.4rem', fontWeight:700, marginBottom:'1rem' }}>
          Signature Experiences
        </h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:'.6rem', marginBottom:'2rem' }}>
          {park.highlights.map(h => (
            <div key={h} style={{ display:'flex', gap:'.5rem', fontSize:'.82rem',
              background:'rgba(13,27,42,.6)', border:'1px solid var(--cborder)',
              borderRadius:9, padding:'.7rem .9rem', alignItems:'flex-start' }}>
              <span style={{ color:park.heroColor, fontWeight:700, flexShrink:0 }}>→</span>{h}
            </div>
          ))}
        </div>
        <div style={{ background:'rgba(224,184,92,.05)', border:'1px solid rgba(224,184,92,.2)',
          borderRadius:12, padding:'1.1rem 1.25rem' }}>
          <div style={{ fontWeight:700, fontSize:'.86rem', marginBottom:'.5rem', color:'#E0B85C' }}>
            ⚠ Before you go
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:'.35rem' }}>
            {park.warnings.map(w => (
              <div key={w} style={{ fontSize:'.8rem', color:'rgba(242,245,247,.72)', display:'flex', gap:'.5rem' }}>
                <span style={{ color:'#E0B85C', flexShrink:0 }}>!</span>{w}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION GRID ──────────────────────────────────────────── */}
      <section style={{ background:'rgba(9,20,32,.4)', borderTop:'1px solid var(--cborder)' }}>
        <div className="sw" style={{ paddingTop:'2rem', paddingBottom:'3rem' }}>
          <div className="eye">Everything you need to plan</div>
          <h2 style={{ fontFamily:'var(--fd)', fontSize:'1.3rem', fontWeight:700, marginBottom:'1rem' }}>
            Explore {park.shortName}
          </h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:'.85rem' }}>
            {SECTIONS.map(s => (
              <Link key={s.slug} href={`/parks/${park.slug}/${s.slug}`}
                style={{ textDecoration:'none', color:'inherit' }}>
                <div className="act-card" style={{ cursor:'pointer' }}>
                  <div style={{ fontSize:'1.5rem', marginBottom:'.45rem' }}>{s.icon}</div>
                  <div style={{ fontWeight:700, fontSize:'.88rem', marginBottom:'.25rem' }}>{s.label}</div>
                  <div style={{ fontSize:'.72rem', color:'var(--granite)', lineHeight:1.55 }}>{s.desc}</div>
                  <div style={{ marginTop:'.55rem', fontSize:'.7rem', color:park.heroColor, fontWeight:600 }}>
                    Explore →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── SEASONS ───────────────────────────────────────────────── */}
      <section className="sw" style={{ paddingTop:'2rem', paddingBottom:'3rem' }}>
        <div className="eye">When to visit</div>
        <h2 style={{ fontFamily:'var(--fd)', fontSize:'1.2rem', fontWeight:700, marginBottom:'1rem' }}>
          {park.shortName} by Season
        </h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:'.75rem', marginBottom:'1.5rem' }}>
          {park.seasons.map(s => (
            <div key={s.name} style={{ background:'rgba(13,27,42,.6)', border:'1px solid var(--cborder)',
              borderRadius:10, padding:'1rem 1.1rem' }}>
              <div style={{ fontWeight:700, fontSize:'.84rem', color:park.heroColor, marginBottom:'.3rem' }}>{s.name}</div>
              <div style={{ fontSize:'.78rem', color:'rgba(242,245,247,.7)', lineHeight:1.65 }}>{s.desc}</div>
            </div>
          ))}
        </div>
        <div style={{ display:'flex', gap:'.75rem', flexWrap:'wrap' }}>
          <Link href={`/parks/${park.slug}/conditions`} className="bs">Live Conditions →</Link>
          <Link href={`/parks/${park.slug}/permits`} className="bs">Permit Guide →</Link>
          <a href={park.website} target="_blank" rel="noopener" className="bs">NPS.gov →</a>
        </div>
      </section>
    </div>
  );
}
