import Link from 'next/link';

export const metadata = { title: 'Boating — TrailsTV' };

export default function BoatingPage() {
  const stations = [
    {
      name:    'Meyers Station',
      address: '2175 Keetak St, Meyers, CA',
      detail:  'Junction of US-50 & Hwy 89 · South shore · Busiest station',
      hours:   'May 1 – Sep 30 · 8:30am – 5:30pm daily',
      tip:     'Arrive before 10am on weekends. Last inspection starts 4:30pm. Busiest on summer holiday weekends.',
    },
    {
      name:    'Spooner Summit Station',
      address: 'Junction of US-50 & Hwy 28, Nevada',
      detail:  'East shore · Best if arriving from Reno or Carson City',
      hours:   'May 1 – Sep 30 · 8:30am – 5:30pm daily',
      tip:     'Less crowded than Meyers. Convenient for east shore launches at Nevada Beach or Zephyr Cove.',
    },
    {
      name:    'Alpine Meadows Station',
      address: 'Hwy 89 at Alpine Meadows Rd, north of Tahoe City',
      detail:  'North shore · On Hwy 89 heading south from Truckee',
      hours:   'May 1 – Sep 30 · 8:30am – 5:30pm daily',
      tip:     'Least crowded of the three. Best choice for north shore or west shore launches.',
    },
  ];

  const seals = [
    {
      color: '#4ABC78',
      name:  'Green Seal',
      lake:  'Fallen Leaf Lake',
      desc:  'Required specifically for Fallen Leaf Lake. A current Lake Tahoe inspection seal does not transfer to Fallen Leaf — you need a dedicated green seal for that body of water.',
    },
    {
      color: '#E0B85C',
      name:  'Yellow Seal',
      lake:  'Echo Lakes',
      desc:  'Required specifically for Echo Lakes. Same rule as Fallen Leaf — a Tahoe seal is not valid here. Get a yellow seal at any station if you plan to launch at Echo Lakes.',
    },
    {
      color: '#8BB8E8',
      name:  'Blue / Silver Seal (intact)',
      lake:  'Lake Tahoe — returning boats',
      desc:  'If your boat has an intact seal from the last time it was hauled out of Lake Tahoe — a wire with a numbered clip connecting the boat to the trailer — you can skip inspection entirely and go straight to your launch site on Lake Tahoe.',
    },
  ];

  return (
    <div className="sw" style={{ maxWidth: 860, paddingBottom: '4rem' }}>

      <div className="eye">Boating · Lake Tahoe Basin</div>
      <h1 className="stitle">Boating on Lake Tahoe</h1>
      <p className="ssub">
        22 miles long, 70+ feet of visibility, and marinas on every shore —
        but every motorized boat must clear an inspection before launching.
        Read what to expect below so you don't lose your morning to the line.
      </p>

      <div style={{ display:'flex', gap:'.75rem', flexWrap:'wrap', marginBottom:'3rem' }}>
        <a href="https://tahoeboatinspections.com/appt" target="_blank" rel="noopener" className="bp">
          Book Inspection Appointment →
        </a>
        <Link href="/activities/boating" style={{ textDecoration:'none' }} className="bs">View Marina & Ramp Map →</Link>
      </div>

      {/* ── INSPECTION SECTION ─────────────────────────────────────────────── */}
      <section style={{ marginBottom:'3rem' }}>
        <div className="eye">Mandatory for all motorized watercraft</div>
        <h2 style={{ fontFamily:'var(--fd)', fontSize:'1.5rem', fontWeight:800, marginBottom:'.75rem' }}>
          Boat Inspections &amp; AIS Program
        </h2>
        <p style={{ fontSize:'.88rem', lineHeight:1.8, color:'rgba(242,245,247,.78)', marginBottom:'1.5rem' }}>
          <strong style={{ color:'var(--snow)' }}>Every motorized boat must be inspected before launching</strong> on
          Lake Tahoe — including Fallen Leaf Lake, Echo Lake, and Donner Lake. This is mandatory under
          TRPA Code of Ordinances. The program prevents aquatic invasive species (AIS) like golden mussels,
          quagga mussels, and zebra mussels from entering the lake. In 2026, inspectors intercepted golden
          mussels at the Meyers station — the program is actively working, and it depends on every boater
          participating.
        </p>

        {/* Mandatory decontamination alert */}
        <div style={{ background:'rgba(224,92,92,.08)', border:'1px solid rgba(224,92,92,.3)', borderRadius:12, padding:'1.1rem 1.25rem', marginBottom:'1rem', display:'flex', gap:'1rem', alignItems:'flex-start' }}>
          <span style={{ fontSize:'1.5rem', flexShrink:0 }}>⚠️</span>
          <div>
            <div style={{ fontWeight:700, marginBottom:'.35rem', color:'var(--snow)', fontSize:'.9rem' }}>
              New since 2025: Mandatory decontamination for all motorized watercraft
            </div>
            <div style={{ fontSize:'.82rem', color:'rgba(242,245,247,.72)', lineHeight:1.75 }}>
              All motorized and trailered watercraft now undergo mandatory decontamination after inspection —
              not just an inspection sticker. Decontamination uses high-pressure, high-temperature water to kill
              invasive species on the hull, bilge, props, and trailer.{' '}
              <strong style={{ color:'var(--snow)' }}>Minimum fee: $30.</strong>{' '}
              Knowingly transporting AIS is illegal — minimum $5,000 penalty under TRPA Code 63.4.
            </div>
          </div>
        </div>

        {/* Time warning */}
        <div style={{ background:'rgba(212,168,83,.08)', border:'1px solid rgba(212,168,83,.3)', borderRadius:12, padding:'1.1rem 1.25rem', marginBottom:'2rem', display:'flex', gap:'1rem', alignItems:'flex-start' }}>
          <span style={{ fontSize:'1.5rem', flexShrink:0 }}>⏱</span>
          <div>
            <div style={{ fontWeight:700, marginBottom:'.35rem', color:'var(--snow)', fontSize:'.9rem' }}>
              Plan 30–90 minutes at the station
            </div>
            <div style={{ fontSize:'.82rem', color:'rgba(242,245,247,.72)', lineHeight:1.75 }}>
              With mandatory decontamination, wait times on summer weekends can reach 60–90 minutes at Meyers.
              Inspectors will not begin a new inspection after 4:30pm even if the station is open until 5:30pm.
              If you want to be on the water by 9am, you need to be at the station by 7:30–8am.{' '}
              <strong style={{ color:'#4AADBC' }}>
                Book an appointment at TahoeBoatInspections.com — it can cut your wait to under 15 minutes.
              </strong>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div style={{ background:'rgba(74,173,188,.06)', border:'1px solid rgba(74,173,188,.18)', borderRadius:12, padding:'1.1rem 1.25rem', marginBottom:'2rem' }}>
          <div style={{ fontWeight:700, fontSize:'.88rem', marginBottom:'.75rem', color:'var(--glacial)' }}>
            💡 How to save time at the station
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:'.5rem' }}>
            {[
              ['Book online', 'Appointments at TahoeBoatInspections.com — fastest way through'],
              ['Clean, Drain, Dry', 'Do this before arriving — it speeds up the inspection significantly'],
              ['Remove standing water', 'Drain bilge, ballast tanks, livewells, and bait buckets completely'],
              ['Clear the hull', 'Remove aquatic plants, mud, and debris from hull, motor, and trailer'],
              ['Arrive early', 'Before 10am on weekends; before 9am on holiday weekends'],
              ['Use Alpine Meadows', 'Consistently the least crowded of the three stations'],
            ].map(([title, detail]) => (
              <div key={title} style={{ display:'flex', gap:'.5rem', fontSize:'.78rem' }}>
                <span style={{ color:'var(--glacial)', flexShrink:0, fontWeight:700 }}>✓</span>
                <span><strong style={{ color:'var(--snow)' }}>{title}</strong> — <span style={{ color:'rgba(242,245,247,.65)' }}>{detail}</span></span>
              </div>
            ))}
          </div>
        </div>

        {/* Station cards */}
        <h3 style={{ fontFamily:'var(--fd)', fontSize:'1.1rem', fontWeight:700, marginBottom:'1rem' }}>
          Three Inspection Stations
        </h3>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(255px,1fr))', gap:'1rem', marginBottom:'2.5rem' }}>
          {stations.map(s => (
            <div key={s.name} style={{ background:'rgba(13,27,42,.7)', border:'1px solid var(--cborder)', borderRadius:12, padding:'1.1rem 1.25rem' }}>
              <div style={{ fontWeight:700, fontSize:'.92rem', marginBottom:'.25rem' }}>{s.name}</div>
              <div style={{ fontSize:'.78rem', color:'var(--glacial)', marginBottom:'.2rem' }}>{s.address}</div>
              <div style={{ fontSize:'.74rem', color:'var(--granite)', marginBottom:'.6rem' }}>{s.detail}</div>
              <div style={{ marginBottom:'.6rem' }}>
                <span style={{ background:'rgba(74,188,120,.1)', color:'#4ABC78', borderRadius:5, padding:'2px 9px', fontSize:'.72rem', fontWeight:600 }}>
                  {s.hours}
                </span>
              </div>
              <div style={{ fontSize:'.74rem', color:'rgba(242,245,247,.6)', lineHeight:1.65 }}>
                💡 {s.tip}
              </div>
            </div>
          ))}
        </div>

        {/* Seal guide */}
        <h3 style={{ fontFamily:'var(--fd)', fontSize:'1.1rem', fontWeight:700, marginBottom:'.5rem' }}>
          Understanding Your Inspection Seal
        </h3>
        <p style={{ fontSize:'.84rem', color:'rgba(242,245,247,.72)', lineHeight:1.75, marginBottom:'1rem' }}>
          After inspection, your boat receives a <strong style={{ color:'var(--snow)' }}>seal</strong> — a wire
          with a numbered clip that connects the boat to the trailer. Keep it intact. A boat with an intact
          Tahoe seal from the last haul-out can go straight to any Lake Tahoe launch site without stopping.
          Different lakes require different colored seals.
        </p>
        <div style={{ display:'flex', flexDirection:'column', gap:'.65rem', marginBottom:'2rem' }}>
          {seals.map(s => (
            <div key={s.name} style={{ display:'flex', gap:'1rem', alignItems:'flex-start', background:'rgba(13,27,42,.6)', border:`1px solid ${s.color}40`, borderLeft:`4px solid ${s.color}`, borderRadius:10, padding:'1rem 1.1rem' }}>
              <div style={{ width:16, height:16, borderRadius:'50%', background:s.color, flexShrink:0, marginTop:3, boxShadow:`0 0 8px ${s.color}55` }}/>
              <div>
                <div style={{ fontWeight:700, fontSize:'.86rem', marginBottom:'.2rem' }}>
                  {s.name} — <span style={{ color: s.color }}>{s.lake}</span>
                </div>
                <div style={{ fontSize:'.78rem', color:'rgba(242,245,247,.7)', lineHeight:1.65 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Non-motorized */}
        <div style={{ background:'rgba(13,27,42,.5)', border:'1px solid var(--cborder)', borderRadius:12, padding:'1.1rem 1.25rem', marginBottom:'2rem' }}>
          <div style={{ fontWeight:700, fontSize:'.86rem', marginBottom:'.4rem', color:'var(--snow)' }}>
            🛶 Kayaks, SUPs, and non-motorized watercraft
          </div>
          <div style={{ fontSize:'.8rem', color:'rgba(242,245,247,.7)', lineHeight:1.75 }}>
            Non-motorized craft do not need a station inspection but <strong style={{ color:'var(--snow)' }}>must
            Clean, Drain, and Dry</strong> after every use. Roving non-motorized inspectors patrol
            popular launch areas including Sand Harbor, Kings Beach, and Pope Beach.
            Hand-launched electric watercraft (HLEW) require an annual AIS Program sticker — get one
            at any inspection station after completing a free online training quiz at TahoeBoatInspections.com.
          </div>
        </div>

        <div style={{ display:'flex', gap:'.75rem', flexWrap:'wrap' }}>
          <a href="https://tahoeboatinspections.com" target="_blank" rel="noopener" className="bp">
            TahoeBoatInspections.com →
          </a>
          <a href="https://tahoeboatinspections.com/appt" target="_blank" rel="noopener" className="bs">
            Book Appointment →
          </a>
          <a href="https://www.trpa.gov" target="_blank" rel="noopener" className="bs">
            TRPA Info →
          </a>
        </div>
      </section>

      {/* ── QUICK FACTS ─────────────────────────────────────────────────────── */}
      <section>
        <h2 style={{ fontFamily:'var(--fd)', fontSize:'1.3rem', fontWeight:800, marginBottom:'1rem' }}>
          Boating Quick Facts
        </h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(195px,1fr))', gap:'.75rem', marginBottom:'2rem' }}>
          {[
            { icon:'📏', label:'Lake size',      val:'22 miles long · 12 miles wide' },
            { icon:'🔵', label:'Max depth',      val:'1,645 ft — 4th deepest in US' },
            { icon:'🌿', label:'Visibility',     val:'70+ feet in clear conditions' },
            { icon:'🌡️', label:'Water temp',    val:'68–72°F peak summer' },
            { icon:'⚡', label:'Speed limit',    val:'35 mph · 5 mph within 600ft of shore' },
            { icon:'🔕', label:'No-wake zones',  val:'Emerald Bay · All marinas' },
            { icon:'🚤', label:'Public ramps',   val:'7 ramps around the lake' },
            { icon:'🎣', label:'Fishing license', val:'Required · CA or NV by location' },
          ].map(f => (
            <div key={f.label} style={{ background:'rgba(13,27,42,.6)', border:'1px solid var(--cborder)', borderRadius:10, padding:'.85rem 1rem' }}>
              <div style={{ fontSize:'1.1rem', marginBottom:'.3rem' }}>{f.icon}</div>
              <div style={{ fontSize:'.65rem', color:'var(--granite)', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:'.2rem' }}>{f.label}</div>
              <div style={{ fontSize:'.8rem', fontWeight:600 }}>{f.val}</div>
            </div>
          ))}
        </div>

        <div style={{ display:'flex', gap:'.75rem', flexWrap:'wrap' }}>
          <Link href="/activities/boating" style={{ textDecoration:'none' }} className="bp">Marina &amp; Ramp Map →</Link>
          <Link href="/activities/fishing" style={{ textDecoration:'none' }} className="bs">Fishing Guide →</Link>
          <Link href="/activities/kayaking" style={{ textDecoration:'none' }} className="bs">Kayaking →</Link>
        </div>
      </section>
    </div>
  );
}
