import Link from 'next/link';
import { CAMPS_FALLBACK, ACTS_FALLBACK, SITE_DATA_FALLBACK, avSt } from '@/lib/data';

// This is a Server Component — data is fetched at build/request time
export default function HomePage() {
  const d      = SITE_DATA_FALLBACK;
  const camps  = CAMPS_FALLBACK;
  const acts   = ACTS_FALLBACK;
  const total  = camps.reduce((n, c) => n + (avSt(c) !== 'full' ? c.available : 0), 0);

  const stats = [
    { val: `${d.weather.current.tempF}°F`,  label: 'Air Temp',         icon: '🌡️' },
    { val: `${d.weather.waterTempF}°F`,     label: 'Water Temp',       icon: '💧' },
    { val: `${total} ⛺`,                   label: 'Campsites Open',   icon: null },
    { val: `165+ 🥾`,                       label: 'Trail Miles',      icon: null },
    { val: `${d.ski.resortCount} ⛷️`,      label: 'Ski Resorts',      icon: null },
    { val: `${d.lake.levelFt.toLocaleString()} ft`, label: 'Elevation', icon: null },
  ];

  const topCamps = [...camps]
    .sort((a, b) => (avSt(a) === 'full' ? 1 : -1) - (avSt(b) === 'full' ? 1 : -1))
    .slice(0, 5);

  const activityBlocks = [
    { icon:'🥾', title:'Hiking',          img:'activity-hiking.jpg',   desc:'Tahoe Rim Trail, Desolation Wilderness — 165+ miles of Sierra singletrack.' },
    { icon:'🚵', title:'Mountain Biking', img:'activity-mtb.jpg',      desc:'Flume Trail, Mr. Toad\'s — world-class descents all four seasons.' },
    { icon:'🛶', title:'Kayaking',        img:'activity-kayaking.jpg', desc:'Paddle Emerald Bay at dawn. Crystal-clear water, 70+ ft of visibility.' },
    { icon:'⛷️', title:'Skiing',         img:'activity-skiing.jpg',   desc:'14 resorts, 450+ inches of annual snowfall. Palisades. Heavenly. Northstar.' },
    { icon:'🏊', title:'Swimming',        img:'activity-swimming.jpg', desc:'Sand Harbor, Kings Beach, D.L. Bliss — the cleanest alpine lake in America.' },
    { icon:'⛵', title:'Boating',         img:'activity-boating.jpg',  desc:'Marinas on every shore. Rentals, charters, and the MS Dixie II paddlewheeler.' },
  ];

  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="hero-unified">
        {/* Next.js Image — optimized, lazy-decoded, served via /api/image */}
        <img
          src="/assets/hero-tahoe.jpg"
          alt="Lake Tahoe East Shore looking north — aerial view"
          className="hero-bg-photo"
          fetchPriority="high"
          decoding="async"
          onError={(e) => {
            // If image missing, hide it so CSS gradient fallback shows
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        <div className="hero-unified-overlay"/>
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
            {['⛺ Camping','🥾 Hiking','🛶 Kayaking','⛷️ Skiing','🚵 MTB','🏊 Swimming','⛵ Boating'].map(c => (
              <Link key={c} href="/activities" className="chip">{c}</Link>
            ))}
          </div>

          <div style={{ display:'flex', gap:'.75rem', flexWrap:'wrap' }}>
            <Link href="/campsites" className="bp">Find Campsites →</Link>
            <Link href="/plan" className="bs">Plan Your Trip</Link>
          </div>
        </div>
      </section>

      {/* ── STAT RIBBON ───────────────────────────────────────────────── */}
      <section style={{ background:'rgba(9,20,32,.9)', borderBottom:'1px solid var(--cborder)' }}>
        <div style={{ maxWidth:'var(--page-max)', margin:'0 auto', padding:'.85rem 2rem', display:'flex', gap:'2rem', flexWrap:'wrap', justifyContent:'center' }}>
          {stats.map(s => (
            <div key={s.label} style={{ display:'flex', alignItems:'center', gap:'.45rem', fontSize:'.76rem' }}>
              <span style={{ fontWeight:700, color:'var(--glacial)' }}>{s.val}</span>
              <span style={{ color:'var(--granite)' }}>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── ACTIVITY BLOCKS ───────────────────────────────────────────── */}
      <section className="sw">
        <div className="eye">What&apos;s Out There</div>
        <h2 className="stitle">Explore the Basin</h2>
        <p className="ssub">Six world-class outdoor pursuits. One extraordinary lake. Every season brings something new.</p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:'1.25rem' }}>
          {activityBlocks.map(a => (
            <Link key={a.title} href="/activities" style={{ textDecoration:'none' }}>
              <div className="card" style={{ overflow:'hidden', padding:0 }}>
                <div style={{ height:180, position:'relative', background:'rgba(13,27,42,.8)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'3rem', overflow:'hidden' }}>
                  {/* Real activity images from /public/assets/ */}
                  <img
                    src={`/assets/${a.img}`}
                    alt={`${a.title} at Lake Tahoe`}
                    style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', objectPosition:'center', transition:'transform .4s ease' }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    onMouseOver={(e) => { (e.target as HTMLImageElement).style.transform = 'scale(1.04)'; }}
                    onMouseOut={(e)  => { (e.target as HTMLImageElement).style.transform = 'scale(1)'; }}
                  />
                  {/* Emoji fallback shown if image missing */}
                  <span style={{ position:'relative', zIndex:1, textShadow:'0 2px 8px rgba(0,0,0,.5)' }}>{a.icon}</span>
                </div>
                <div style={{ padding:'1.25rem' }}>
                  <div style={{ fontFamily:'var(--fd)', fontSize:'1.1rem', fontWeight:700, marginBottom:'.35rem' }}>{a.title}</div>
                  <div style={{ fontSize:'.78rem', color:'var(--granite)', lineHeight:1.6 }}>{a.desc}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── CAMPSITE MINI ─────────────────────────────────────────────── */}
      <section style={{ background:'rgba(9,20,32,.6)', borderTop:'1px solid var(--cborder)', borderBottom:'1px solid var(--cborder)' }}>
        <div className="sw" style={{ paddingTop:'2.5rem', paddingBottom:'2.5rem' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'3rem', alignItems:'center' }}>
            <div>
              <div className="eye">Live Availability</div>
              <h2 className="stitle" style={{ fontSize:'clamp(1.4rem,2.5vw,2rem)' }}>Campsite Status</h2>
              <p style={{ color:'var(--granite)', fontSize:'.82rem', lineHeight:1.7, marginBottom:'1.25rem' }}>
                10 verified campgrounds around Lake Tahoe. Book direct — no middleman.
              </p>
              <Link href="/campsites" className="bp">View All Campsites →</Link>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'.5rem' }}>
              {topCamps.map(c => {
                const st  = avSt(c);
                const cls = st === 'open' ? 'dot-g' : st === 'limited' ? 'dot-y' : 'dot-r';
                const txt = st === 'open' ? `${c.available} open` : st === 'limited' ? `${c.available} left` : 'Full';
                return (
                  <div key={c.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'.5rem .75rem', background:'rgba(13,27,42,.5)', borderRadius:8, fontSize:'.8rem' }}>
                    <span>{c.name.split(' ').slice(0,4).join(' ')}</span>
                    <span className={cls} style={{ fontWeight:600 }}>● {txt}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── 7-DAY FORECAST ────────────────────────────────────────────── */}
      <section className="sw">
        <div className="eye">Weather</div>
        <h2 className="stitle" style={{ fontSize:'clamp(1.4rem,2.5vw,2rem)' }}>7-Day Forecast</h2>
        <div style={{ display:'flex', gap:'.75rem', overflowX:'auto', paddingBottom:'.5rem', marginTop:'1rem' }}>
          {d.weather.forecast.map(f => (
            <div key={f.day} style={{ background:'rgba(13,27,42,.7)', border:'1px solid var(--cborder)', borderRadius:10, padding:'1rem .85rem', minWidth:90, textAlign:'center', flexShrink:0 }}>
              <div style={{ fontSize:'.68rem', color:'var(--granite)', marginBottom:'.35rem' }}>{f.day}</div>
              <div style={{ fontSize:'1.4rem', marginBottom:'.35rem' }}>{f.icon}</div>
              <div style={{ fontSize:'.76rem', fontWeight:700, marginBottom:'.15rem' }}>{f.hi}° <span style={{ color:'var(--granite)', fontWeight:400 }}>{f.lo}°</span></div>
              <div style={{ fontSize:'.64rem', color:'var(--granite)' }}>{f.cond}</div>
              {f.precip > 0 && <div style={{ fontSize:'.6rem', color:'var(--glacial)', marginTop:'.2rem' }}>💧 {f.precip}%</div>}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section style={{ background:'linear-gradient(135deg, rgba(74,173,188,.08) 0%, rgba(9,20,32,0) 100%)', borderTop:'1px solid var(--cborder)' }}>
        <div className="sw" style={{ textAlign:'center', paddingTop:'4rem', paddingBottom:'4rem' }}>
          <div className="eye">Get Started — It&apos;s Free</div>
          <h2 className="stitle">Ready to plan your Tahoe adventure?</h2>
          <p className="ssub" style={{ margin:'0 auto 2rem', textAlign:'center' }}>
            Sign up free. Save trips, get live campsite alerts, and unlock personalized guides.
          </p>
          <div style={{ display:'flex', gap:'.75rem', justifyContent:'center', flexWrap:'wrap' }}>
            <Link href="/plan" className="bp">Plan Your Trip →</Link>
            <Link href="/pricing" className="bs">See Plans</Link>
          </div>
        </div>
      </section>
    </>
  );
}
