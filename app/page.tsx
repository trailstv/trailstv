import Link from 'next/link';
import HeroSlideshowClient from '@/components/HeroSlideshowClient';
import { PARK_LIST, PARK_REGIONS } from '@/lib/parks';
import { ACTIVITIES } from '@/lib/activities';

export default function HomePage() {
  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="hero-unified" style={{ position:'relative', minHeight:'92vh' }}>
        <HeroSlideshowClient/>
        <div className="hero-unified-content" style={{ position:'relative', zIndex:5 }}>
          <div className="eye">TrailsTV · National Parks Planner</div>
          <h1 className="htitle">
            America&apos;s Parks.<br/>
            <span className="ac">Every Trail. Every Camp.</span>
          </h1>
          <p className="hsub">
            Hiking, MTB, camping, kayaking, climbing, wildlife, fire conditions, and ski reports
            for every national park in the continental US — all in one place.
          </p>
          <div style={{ display:'flex', gap:'.75rem', flexWrap:'wrap', marginBottom:'2rem' }}>
            <Link href="#parks" className="bp">Choose a Park →</Link>
            <Link href="/pricing" className="bs">See Plans</Link>
          </div>
          {/* Activity pill row */}
          <div style={{ display:'flex', flexWrap:'wrap', gap:'.5rem' }}>
            {ACTIVITIES.map(a => (
              <span key={a.slug} style={{ background:'rgba(13,27,42,.7)', border:'1px solid var(--cborder)',
                borderRadius:20, padding:'4px 12px', fontSize:'.72rem', fontWeight:600, color:'var(--granite)' }}>
                {a.icon} {a.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARK PICKER ───────────────────────────────────────────────── */}
      <section id="parks" className="sw" style={{ paddingTop:'3rem', paddingBottom:'3rem' }}>
        <div className="eye">18 parks · 4 regions</div>
        <h2 className="stitle">Choose a Park</h2>
        <p className="ssub">
          Every park includes trail maps, campground availability, fire restrictions, snow reports,
          and live NPS alerts.
        </p>

        {Object.entries(PARK_REGIONS).map(([region, slugs]) => {
          const parks = slugs.map(s => PARK_LIST.find(p => p.slug === s)!).filter(Boolean);
          return (
            <div key={region} style={{ marginBottom:'2.5rem' }}>
              <div style={{ fontSize:'.68rem', fontWeight:700, letterSpacing:'.14em',
                textTransform:'uppercase', color:'var(--glacial)', marginBottom:'1rem' }}>
                {region}
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'1rem' }}>
                {parks.map(park => (
                  <Link key={park.slug} href={`/parks/${park.slug}`} style={{ textDecoration:'none', color:'inherit' }}>
                    <div className="act-card" style={{ padding:0, overflow:'hidden' }}>
                      <div style={{ height:5, background:park.heroColor }}/>
                      <div style={{ padding:'1.1rem 1.25rem' }}>
                        <div style={{ fontSize:'.62rem', fontWeight:700, letterSpacing:'.1em',
                          textTransform:'uppercase', color:park.heroColor, marginBottom:'.3rem' }}>
                          {park.state}
                        </div>
                        <h3 style={{ fontFamily:'var(--fd)', fontSize:'1rem', fontWeight:800, marginBottom:'.35rem' }}>
                          {park.shortName}
                        </h3>
                        <p style={{ fontSize:'.74rem', color:'var(--granite)', lineHeight:1.6, marginBottom:'.75rem' }}>
                          {park.tagline.slice(0, 80)}{park.tagline.length > 80 ? '…' : ''}
                        </p>
                        {/* Activity icons */}
                        <div style={{ display:'flex', flexWrap:'wrap', gap:3 }}>
                          {park.activities.slice(0,8).map(slug => {
                            const act = ACTIVITIES.find(a => a.slug === slug);
                            return act ? (
                              <span key={slug} title={act.name}
                                style={{ fontSize:'.85rem', lineHeight:1 }}>
                                {act.icon}
                              </span>
                            ) : null;
                          })}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* ── DATA SOURCES STRIP ────────────────────────────────────────── */}
      <section style={{ background:'rgba(9,20,32,.6)', borderTop:'1px solid var(--cborder)', borderBottom:'1px solid var(--cborder)' }}>
        <div className="sw" style={{ padding:'1.5rem 2rem' }}>
          <div style={{ display:'flex', flexWrap:'wrap', gap:'2rem', justifyContent:'center' }}>
            {[
              ['NPS Data API',    'Park alerts, closures & conditions'],
              ['Recreation.gov',  'Live campsite availability'],
              ['Open-Meteo',      '7-day weather forecast'],
              ['OpenStreetMap',   'All trail & map data'],
              ['USFS / NIFC',     'Fire restrictions & perimeters'],
            ].map(([source, desc]) => (
              <div key={source} style={{ textAlign:'center' }}>
                <div style={{ fontSize:'.72rem', fontWeight:700, color:'var(--glacial)' }}>{source}</div>
                <div style={{ fontSize:'.66rem', color:'var(--granite)' }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PAYWALL CTA ───────────────────────────────────────────────── */}
      <section className="sw" style={{ paddingTop:'3rem', paddingBottom:'4rem' }}>
        <div style={{ background:'rgba(74,173,188,.06)', border:'1px solid rgba(74,173,188,.2)',
          borderRadius:18, padding:'2.5rem 2rem', textAlign:'center', maxWidth:700, margin:'0 auto' }}>
          <div className="eye">Everything included free</div>
          <h2 style={{ fontFamily:'var(--fd)', fontSize:'clamp(1.4rem,3vw,2rem)', fontWeight:900, marginBottom:'.75rem' }}>
            All maps and conditions are free — forever
          </h2>
          <p style={{ fontSize:'.88rem', color:'var(--granite)', lineHeight:1.75, marginBottom:'1.5rem' }}>
            Every trail map, campground location, weather forecast, fire alert, and snow report is free.
            Upgrade for live campsite availability, opening alerts, and offline maps.
          </p>
          <div style={{ display:'flex', gap:'.75rem', justifyContent:'center', flexWrap:'wrap' }}>
            <Link href="/pricing" className="bp">See Pricing →</Link>
            <Link href="/parks/yellowstone" className="bs">Try a Park</Link>
          </div>
        </div>
      </section>
    </>
  );
}
