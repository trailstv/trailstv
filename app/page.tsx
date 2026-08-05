import Image from 'next/image';
import Link from 'next/link';
import { CAMPS_FALLBACK, SITE_DATA_FALLBACK, avSt } from '@/lib/data';

// Image map — filenames exactly as on trailstv.com/assets/
const ACTIVITY_IMAGES: Record<string, { src: string; alt: string }> = {
  camping:  { src: '/assets/activity-camping.jpg',  alt: 'Camping at Lake Tahoe — tent under pine trees with starry sky' },
  hiking:   { src: '/assets/activity-hiking.jpg',   alt: 'Hiking trail in Lake Tahoe with mountain views' },
  mtb:      { src: '/assets/activity-mtb.jpg',      alt: 'Mountain biking singletrack trail in the Sierra Nevada' },
  kayaking: { src: '/assets/activity-kayaking.jpg', alt: 'Kayaking on Lake Tahoe with crystal-clear turquoise water' },
  skiing:   { src: '/assets/activity-skiing.jpg',   alt: 'Skiing powder at Lake Tahoe with mountain views' },
  boating:  { src: '/assets/activity-boating.jpg',  alt: 'Boating on Lake Tahoe in summer sunshine' },
};

export default function HomePage() {
  const d     = SITE_DATA_FALLBACK;
  const camps = CAMPS_FALLBACK;
  const total = camps.reduce((n, c) => n + (avSt(c) !== 'full' ? c.available : 0), 0);

  const topCamps = [...camps]
    .sort((a, b) => (avSt(a) === 'full' ? 1 : -1) - (avSt(b) === 'full' ? 1 : -1))
    .slice(0, 5);

  const activities = [
    {
      id: 'camping', icon: '⛺', title: 'Camping',
      sub: 'Recreation.gov & ReserveCalifornia · Live availability',
      desc: "Over 1,000 campsites ring the basin — from beachfront state parks to secluded USFS sites. We pull live availability from Recreation.gov so you always know what's open before you book.",
      trails: [],
      links: [
        { label: '🏕️ USFS Campgrounds', href: 'https://www.recreation.gov/gateways/2025' },
        { label: '🏕️ CA State Parks',   href: 'https://www.reservecalifornia.com' },
        { label: '🏕️ NV State Parks',   href: 'https://parks.nv.gov/parks/spooner-lake' },
      ],
      cta: 'Find Campsites →', ctaHref: '/campsites',
    },
    {
      id: 'hiking', icon: '🥾', title: 'Hiking',
      sub: '165+ miles of trail · All skill levels',
      desc: "Lake Tahoe is a hiker's paradise with trails ranging from lakeside strolls to demanding alpine ascents. The Tahoe Rim Trail encircles the entire basin at 165 miles while Desolation Wilderness offers 63,000 acres of backcountry.",
      trails: [
        { name: 'Tahoe Rim Trail',       detail: '165 mi · Multi-day' },
        { name: 'Eagle Falls Trail',     detail: '2.3 mi · Moderate' },
        { name: 'Mount Tallac',          detail: '9.4 mi · Strenuous · 9,735 ft' },
        { name: 'Rubicon Trail',         detail: '7.4 mi · Moderate' },
        { name: 'Desolation Wilderness', detail: 'Backcountry · Permit required' },
      ],
      links: [
        { label: '📄 Hiking Mount Tallac',     href: 'https://tahoeoutdoorstv.com/hiking/hiking-mount-tallac/' },
        { label: '📄 Top 10 Tahoe Hikes',      href: 'https://tahoeoutdoorstv.com/lake-tahoe-top-10s/the-top-10-lake-tahoe-hikes/' },
        { label: '📄 Eagle Falls Trail Guide', href: 'https://tahoeoutdoorstv.com/hiking/experience-the-majesty-of-eagle-falls-trail/' },
      ],
      cta: 'View Trail Map →', ctaHref: '/trails',
    },
    {
      id: 'mtb', icon: '🚵', title: 'Mountain Biking',
      sub: 'World-class singletrack · All levels',
      desc: "Lake Tahoe's mountain biking is legendary. The Flume Trail delivers 14.4 miles of Sierra Nevada views perched above the lake. Mr. Toad's Wild Ride offers technical singletrack for experts. Something for every rider.",
      trails: [
        { name: 'Flume Trail',          detail: '14.4 mi · Intermediate–Expert' },
        { name: "Mr Toad's Wild Ride",  detail: '7 mi · Expert · Technical' },
        { name: 'Tahoe Rim Trail MTB',  detail: '165 mi · All levels' },
        { name: 'Corral Trail',         detail: 'Beginner-friendly flow' },
        { name: 'West Shore Bike Path', detail: 'Paved lakeside cruiser' },
      ],
      links: [
        { label: '📄 Flume Trail Guide',  href: 'https://tahoeoutdoorstv.com/mountain-biking/mountain-biking-the-flume-trail/' },
        { label: '📄 Top 10 MTB Trails', href: 'https://tahoeoutdoorstv.com/lake-tahoe-top-10s/top-10-mountain-biking-trails-in-lake-tahoe/' },
        { label: '📄 Rim Trail MTB',     href: 'https://tahoeoutdoorstv.com/mountain-biking/mountain-biking-the-tahoe-rim-trail/' },
      ],
      cta: 'View MTB Trails →', ctaHref: '/trails',
    },
    {
      id: 'kayaking', icon: '🛶', title: 'Kayaking',
      sub: 'Crystal-clear alpine water · 72-mile water trail',
      desc: "Paddle through 70+ feet of visibility on North America's largest alpine lake. The 72-mile Lake Tahoe Water Trail connects hidden coves and beaches accessible only by water. Rentals at 8+ locations around the basin.",
      trails: [
        { name: 'Emerald Bay',                  detail: 'Most scenic paddle · Vikingsholm access' },
        { name: 'Sand Harbor',                  detail: 'Clear kayak tours · East shore' },
        { name: 'Cave Rock',                    detail: 'East shore sea cave exploration' },
        { name: 'Kings Beach to Carnelian Bay', detail: 'North shore paddling route' },
        { name: 'Meeks Bay',                    detail: 'Rentals on-site · West shore' },
      ],
      links: [
        { label: '📄 Top 10 Kayaking Spots', href: 'https://tahoeoutdoorstv.com/lake-tahoe-top-10s/top-10-kayaking-spots-in-lake-tahoe/' },
        { label: '📄 Top 10 Kayak Rentals',  href: 'https://tahoeoutdoorstv.com/lake-tahoe-top-10s/top-10-kayak-rentals-lake-tahoe/' },
        { label: '🗺️ Lake Tahoe Water Trail', href: 'https://laketahoewatertrail.org/' },
      ],
      cta: 'Find Launch Spots →', ctaHref: '/map',
    },
    {
      id: 'skiing', icon: '⛷️', title: 'Skiing & Riding',
      sub: '14 resorts · World-class powder · Dec – Apr',
      desc: "With 14 ski resorts within 60 miles, Lake Tahoe is one of the premier ski destinations in North America. Palisades Tahoe alone spans 6,000+ acres. Heavenly delivers 3,500 acres of terrain with lake views from every run.",
      trails: [
        { name: 'Palisades Tahoe',      detail: '6,000+ acres · Expert terrain' },
        { name: 'Heavenly Mountain',    detail: '3,500 acres · Lake views' },
        { name: 'Northstar California', detail: 'Family-friendly · Village base' },
        { name: 'Sierra-at-Tahoe',      detail: 'South shore · Beginner–Expert' },
        { name: 'Homewood',             detail: 'West shore · Best lake views' },
      ],
      links: [
        { label: '🎿 Palisades Tahoe',      href: 'https://www.palisadestahoe.com/' },
        { label: '🎿 Heavenly Mountain',    href: 'https://www.skiheavenly.com/' },
        { label: '🎿 Northstar California', href: 'https://www.northstarcalifornia.com/' },
      ],
      cta: 'View Ski Guide →', ctaHref: '/activities',
    },
    {
      id: 'boating', icon: '⛵', title: 'Boating',
      sub: '22-mile lake · Marinas · Boat tours · Rentals',
      desc: "Lake Tahoe's 22-mile expanse and 70+ foot visibility make it one of the best boating destinations in the U.S. From renting a pontoon at Zephyr Cove to sunset cruises on the MS Dixie II, the options are endless.",
      trails: [
        { name: 'Zephyr Cove Marina',     detail: 'Rentals · Pontoon · Jet ski · Parasailing' },
        { name: 'MS Dixie II Cruises',    detail: 'Paddlewheel dinner & daytime cruises' },
        { name: 'Tahoe City Marina',      detail: 'North shore · Guided tours' },
        { name: 'Camp Richardson Marina', detail: 'South shore · Boat & SUP rentals' },
        { name: 'Sand Harbor',            detail: 'East shore · Launch · Clear kayak tours' },
      ],
      links: [
        { label: '⛵ Boat Tours Guide',  href: 'https://visitlaketahoe.com/things-to-do/boat-tours/' },
        { label: '⚓ Zephyr Cove Resort', href: 'https://zephyrcove.com/' },
        { label: '🗺️ Water Trail Map',   href: 'https://laketahoewatertrail.org/' },
      ],
      cta: 'Find Marinas →', ctaHref: '/map',
    },
  ];

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="hero-unified">
        {/* Full-bleed hero — priority loads before anything else */}
        <Image
          src="/assets/hero-tahoe.jpg"
          alt="Lake Tahoe's East Shore looking north."
          fill
          priority
          quality={90}
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
        />
        <div className="hero-unified-overlay" />
        <div className="hero-unified-content">
          <div style={{ display:'flex', alignItems:'center', gap:'.6rem', marginBottom:'1rem' }}>
            <svg width="32" height="32" viewBox="0 0 38 38" fill="none">
              <path d="M4 26c3-6 6-10 10-10s5 7 10 7 5-4 8-4" stroke="#4AADBC" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M4 32c3-4.5 6-7.5 10-7.5s5 5.5 10 5.5 5-3.5 8-3.5" stroke="#D4A853" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="19" cy="12" r="4" fill="rgba(74,173,188,.7)"/>
            </svg>
            <span style={{ fontSize:'.58rem', fontWeight:800, letterSpacing:'.2em', textTransform:'uppercase', color:'var(--glacial)' }}>
              TrailsTV · Lake Tahoe Planner
            </span>
          </div>
          <h1 className="htitle">
            Your <span className="ac">Tahoe</span><br/>
            Adventure<br/>
            <span className="go">Starts Here</span>
          </h1>
          <p className="hsub">
            Hiking. Biking. Kayaking. Skiing. Camping. Boating.<br/>
            One basin. Endless adventures — all four seasons.
          </p>
          <div className="chips">
            {['⛺ Camping','🥾 Hiking','🚵 MTB','🛶 Kayaking','⛷️ Skiing','⛵ Boating'].map(c => (
              <Link key={c} href="/activities" className="chip">{c}</Link>
            ))}
          </div>
          <div style={{ display:'flex', gap:'.75rem', flexWrap:'wrap' }}>
            <Link href="/campsites"  className="bp">Find a Campsite →</Link>
            {/* Plan Your Trip button — temporarily hidden */}
            <Link href="/activities" className="bs">Explore Activities ↓</Link>
          </div>
        </div>
      </section>

      {/* ── LIVE CONDITIONS RIBBON ────────────────────────────────────── */}
      <section style={{ background:'rgba(9,20,32,.95)', borderBottom:'1px solid var(--cborder)' }}>
        <div style={{ maxWidth:'var(--page-max)', margin:'0 auto', padding:'.65rem 2rem', display:'flex', gap:'2rem', flexWrap:'wrap', justifyContent:'center', alignItems:'center' }}>
          <span style={{ fontSize:'.58rem', fontWeight:700, letterSpacing:'.15em', textTransform:'uppercase', color:'var(--glacial)', marginRight:'.5rem' }}>
            Live conditions updated daily
          </span>
          {[
            { val:`${d.weather.waterTempF}°F 🌊`,       label:"Water Temp"     },
            { val:`${d.weather.current.tempF}°F ☀️`,    label:"Today's High"   },
            { val:`${total > 0 ? total : '—'} ⛺`,      label:"Campsites Open" },
            { val:`165+ 🥾`,                             label:"Trail Miles"    },
            { val:`${d.ski.resortCount} ⛷️`,            label:"Ski Resorts"    },
            { val:`6,225 ft`,                            label:"Elevation"      },
          ].map(s => (
            <div key={s.label} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'.15rem' }}>
              <span style={{ fontWeight:700, color:'var(--glacial)', fontSize:'.82rem' }}>{s.val}</span>
              <span style={{ color:'var(--granite)', fontSize:'.62rem', textTransform:'uppercase', letterSpacing:'.08em' }}>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── ACTIVITY SECTIONS HEADER ──────────────────────────────────── */}
      <section className="sw" style={{ paddingBottom:'1.5rem' }}>
        <div className="eye">What&apos;s Out There</div>
        <h2 className="stitle">
          Six Ways to<br/>
          <span style={{ color:'var(--glacial)' }}>Experience Tahoe</span>
        </h2>
        <p className="ssub">From alpine powder to crystal-clear water — the basin has it all, every season.</p>
      </section>

      {/* ── SIX ACTIVITY SECTIONS ─────────────────────────────────────── */}
      {activities.map((act, i) => {
        const img      = ACTIVITY_IMAGES[act.id];
        const reverse  = i % 2 !== 0;

        return (
          <section
            key={act.id}
            style={{
              borderTop:  '1px solid var(--cborder)',
              background: i % 2 === 0 ? 'transparent' : 'rgba(9,20,32,.45)',
            }}
          >
            <div
              className="sw"
              style={{
                paddingTop:    '3rem',
                paddingBottom: '3rem',
                display:       'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap:           '3rem',
                alignItems:    'center',
              }}
            >
              {/* Image — order swaps on alternating rows */}
              <div style={{ order: reverse ? 1 : 0 }}>
                <div
                  style={{
                    position:     'relative',
                    borderRadius: 14,
                    overflow:     'hidden',
                    aspectRatio:  '16/9',
                    background:   'rgba(13,27,42,.8)',
                    boxShadow:    '0 8px 32px rgba(0,0,0,.35)',
                  }}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    quality={85}
                    style={{ objectFit:'cover', objectPosition:'center' }}
                    loading={i < 2 ? 'eager' : 'lazy'}
                  />
                  {/* Icon badge over image */}
                  <div style={{
                    position:   'absolute',
                    top:        '1rem',
                    left:       '1rem',
                    background: 'rgba(13,27,42,.75)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: 8,
                    padding:    '.35rem .6rem',
                    fontSize:   '1.2rem',
                    border:     '1px solid rgba(74,173,188,.2)',
                  }}>
                    {act.icon}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div style={{ order: reverse ? 0 : 1 }}>
                <div className="eye">{act.sub}</div>
                <h3 style={{
                  fontFamily:    'var(--fd)',
                  fontSize:      'clamp(1.5rem, 2.5vw, 2.2rem)',
                  fontWeight:    900,
                  lineHeight:    1.1,
                  marginBottom:  '.6rem',
                }}>
                  {act.title}
                </h3>
                <p style={{ fontSize:'.85rem', color:'rgba(242,245,247,.72)', lineHeight:1.75, marginBottom:'1rem' }}>
                  {act.desc}
                </p>

                {/* Trail / location list */}
                {act.trails.length > 0 && (
                  <div style={{ marginBottom:'1rem', borderRadius:8, overflow:'hidden', border:'1px solid var(--cborder)' }}>
                    {act.trails.map((t, ti) => (
                      <div
                        key={t.name}
                        style={{
                          display:         'flex',
                          justifyContent:  'space-between',
                          padding:         '7px 12px',
                          borderBottom:    ti < act.trails.length - 1 ? '1px solid var(--cborder)' : 'none',
                          fontSize:        '.78rem',
                          background:      ti % 2 === 0 ? 'rgba(13,27,42,.5)' : 'rgba(13,27,42,.3)',
                        }}
                      >
                        <span style={{ fontWeight:600 }}>{t.name}</span>
                        <span style={{ color:'var(--granite)' }}>{t.detail}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Resource links */}
                <div style={{ display:'flex', flexWrap:'wrap', gap:'.4rem', marginBottom:'1.25rem' }}>
                  {act.links.map(l => (
                    <a
                      key={l.label}
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize:   '.72rem',
                        padding:    '4px 10px',
                        borderRadius: 6,
                        background: 'rgba(74,173,188,.08)',
                        border:     '1px solid rgba(74,173,188,.18)',
                        color:      'var(--glacial)',
                        textDecoration: 'none',
                        transition: 'all .2s',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {l.label}
                    </a>
                  ))}
                </div>

                <Link href={act.ctaHref} className="bp">{act.cta}</Link>
              </div>
            </div>
          </section>
        );
      })}

      {/* ── CAMPSITE MINI ─────────────────────────────────────────────── */}
      <section style={{ background:'rgba(9,20,32,.8)', borderTop:'1px solid var(--cborder)', borderBottom:'1px solid var(--cborder)' }}>
        <div className="sw" style={{ paddingTop:'2.5rem', paddingBottom:'2.5rem' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:'3rem', alignItems:'center' }}>
            <div>
              <div className="eye">Recreation.gov · Live Availability</div>
              <h2 className="stitle" style={{ fontSize:'clamp(1.4rem,2.5vw,2rem)', marginBottom:'.75rem' }}>
                Find Your Campsite
              </h2>
              <p style={{ color:'var(--granite)', fontSize:'.82rem', lineHeight:1.7, marginBottom:'1.25rem' }}>
                Click any marker to explore campgrounds around Lake Tahoe. Select dates to check real-time availability via the Recreation.gov API.
              </p>
              <Link href="/campsites" className="bp">Search Campsites →</Link>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'.45rem' }}>
              {topCamps.map(c => {
                const st  = avSt(c);
                const cls = st === 'open' ? 'dot-g' : st === 'limited' ? 'dot-y' : 'dot-r';
                const txt = st === 'open' ? `${c.available} open` : st === 'limited' ? `${c.available} left` : 'Full';
                return (
                  <Link
                    key={c.id}
                    href="/campsites"
                    style={{
                      display:        'flex',
                      justifyContent: 'space-between',
                      alignItems:     'center',
                      padding:        '.5rem .85rem',
                      background:     'rgba(13,27,42,.6)',
                      border:         '1px solid var(--cborder)',
                      borderRadius:   8,
                      fontSize:       '.8rem',
                      textDecoration: 'none',
                      color:          'var(--snow)',
                      transition:     'border-color .2s',
                    }}
                  >
                    <span>{c.name.split(' ').slice(0, 4).join(' ')}</span>
                    <span className={cls} style={{ fontWeight:600, flexShrink:0 }}>● {txt}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── 7-DAY FORECAST ────────────────────────────────────────────── */}
      <section className="sw">
        <div className="eye">Weather · Lake Tahoe Basin</div>
        <h2 className="stitle" style={{ fontSize:'clamp(1.2rem,2vw,1.8rem)', marginBottom:'1rem' }}>7-Day Forecast</h2>
        <div style={{ display:'flex', gap:'.65rem', overflowX:'auto', paddingBottom:'.5rem' }}>
          {d.weather.forecast.map(f => (
            <div key={f.day} style={{ background:'rgba(13,27,42,.7)', border:'1px solid var(--cborder)', borderRadius:10, padding:'1rem .85rem', minWidth:90, textAlign:'center', flexShrink:0 }}>
              <div style={{ fontSize:'.68rem', color:'var(--granite)', marginBottom:'.3rem' }}>{f.day}</div>
              <div style={{ fontSize:'1.4rem', marginBottom:'.3rem' }}>{f.icon}</div>
              <div style={{ fontSize:'.76rem', fontWeight:700 }}>
                {f.hi}° <span style={{ color:'var(--granite)', fontWeight:400 }}>{f.lo}°</span>
              </div>
              <div style={{ fontSize:'.64rem', color:'var(--granite)', marginTop:'.15rem' }}>{f.cond}</div>
              {f.precip > 0 && <div style={{ fontSize:'.6rem', color:'var(--glacial)', marginTop:'.2rem' }}>💧 {f.precip}%</div>}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section style={{ background:'linear-gradient(135deg, rgba(74,173,188,.07) 0%, rgba(9,20,32,0) 100%)', borderTop:'1px solid var(--cborder)' }}>
        <div className="sw" style={{ textAlign:'center', paddingTop:'4rem', paddingBottom:'4rem' }}>
          <div className="eye">Get Started — It&apos;s Free</div>
          <h2 className="stitle">Ready to plan your Tahoe adventure?</h2>
          <p className="ssub" style={{ margin:'0 auto 2rem', textAlign:'center' }}>
            Sign up free. Save trips, get live campsite alerts, and unlock personalized guides.
          </p>
          <div style={{ display:'flex', gap:'.75rem', justifyContent:'center', flexWrap:'wrap' }}>
            {/* Plan Your Trip button — temporarily hidden */}
          </div>
        </div>
      </section>
    </>
  );
}
