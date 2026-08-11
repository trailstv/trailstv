'use client';
import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ACTIVITY_MAPS, type ActivityPin } from '@/lib/activityLocations';

const ActivityMap = dynamic(() => import('@/components/ActivityMap'), {
  ssr: false,
  loading: () => (
    <div style={{ height:'100%', display:'flex', alignItems:'center', justifyContent:'center',
      background:'rgba(13,27,42,.7)' }}>
      <div className="spin-wrap"><div className="spinner"/>Loading map…</div>
    </div>
  ),
});

const meta = ACTIVITY_MAPS['boating'];

const SHORE_LABELS: Record<string, string> = {
  north:'North Shore', south:'South Shore', east:'East Shore', west:'West Shore',
};

const TYPE_LABELS: Record<string, string> = {
  marina:'⚓ Marinas', launch:'🚤 Boat Ramps', rental:'🛶 Rentals',
};

const stations = [
  {
    name:    'Meyers Station',
    address: '2175 Keetak St, Meyers, CA',
    detail:  'Junction of US-50 & Hwy 89 · South shore · Busiest station',
    hours:   'May 1 – Sep 30 · 8:30am – 5:30pm daily',
    tip:     'Arrive before 10am on weekends. Last inspection starts 4:30pm.',
  },
  {
    name:    'Spooner Summit Station',
    address: 'Junction of US-50 & Hwy 28, Nevada',
    detail:  'East shore · Best if arriving from Reno or Carson City',
    hours:   'May 1 – Sep 30 · 8:30am – 5:30pm daily',
    tip:     'Less crowded than Meyers — good for east shore launches.',
  },
  {
    name:    'Alpine Meadows Station',
    address: 'Hwy 89 at Alpine Meadows Rd, north of Tahoe City',
    detail:  'North shore · Best for north and west shore launches',
    hours:   'May 1 – Sep 30 · 8:30am – 5:30pm daily',
    tip:     'Least crowded of the three. Shortest wait times.',
  },
];

const seals = [
  { color:'#4ABC78', name:'Green Seal', lake:'Fallen Leaf Lake',
    desc:'Required for Fallen Leaf Lake even if you have a current Tahoe seal.' },
  { color:'#E0B85C', name:'Yellow Seal', lake:'Echo Lakes',
    desc:'Required for Echo Lakes. A Tahoe seal does not transfer here.' },
  { color:'#8BB8E8', name:'Intact Seal', lake:'Lake Tahoe — returning boats',
    desc:'An intact seal from your last Tahoe haul-out lets you skip inspection entirely.' },
];

export default function BoatingPage() {
  const [selected,  setSelected]  = useState<ActivityPin | null>(null);
  const [typeFilter,setTypeFilter] = useState<string>('all');
  const [shoreFilter,setShoreFilter] = useState<string>('all');

  const pins = meta.pins;
  const availableTypes  = [...new Set(pins.map(p => p.type))];
  const availableShores = [...new Set(pins.map(p => p.shore))];

  const filtered = pins.filter(p =>
    (typeFilter  === 'all' || p.type  === typeFilter) &&
    (shoreFilter === 'all' || p.shore === shoreFilter)
  );

  // Group sidebar by type
  const grouped: Record<string, ActivityPin[]> = {};
  filtered.forEach(p => {
    if (!grouped[p.type]) grouped[p.type] = [];
    grouped[p.type].push(p);
  });

  return (
    <div className="sw" style={{ paddingBottom:'4rem' }}>

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <div className="eye">Boating · Lake Tahoe Basin</div>
      <h1 className="stitle">Boating on Lake Tahoe</h1>
      <p className="ssub">
        22 miles long, 70+ feet of visibility, marinas on every shore —
        and a mandatory inspection before every launch.
      </p>

      {/* ── FILTERS ────────────────────────────────────────────────────────── */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:'.4rem', marginBottom:'.6rem' }}>
        <button className={`mfb${shoreFilter==='all'?' act':''}`} onClick={() => setShoreFilter('all')}>All Shores</button>
        {availableShores.map(s => (
          <button key={s} className={`mfb${shoreFilter===s?' act':''}`} onClick={() => setShoreFilter(s)}>
            {SHORE_LABELS[s]}
          </button>
        ))}
      </div>
      <div style={{ display:'flex', flexWrap:'wrap', gap:'.4rem', marginBottom:'1.25rem' }}>
        <button className={`mfb${typeFilter==='all'?' act':''}`} onClick={() => setTypeFilter('all')}>All Types</button>
        {availableTypes.map(t => (
          <button key={t} className={`mfb${typeFilter===t?' act':''}`} onClick={() => setTypeFilter(t)}>
            {TYPE_LABELS[t] || t}
          </button>
        ))}
      </div>

      {/* ── MAP + SIDEBAR ──────────────────────────────────────────────────── */}
      <div className="map-split-layout" style={{ marginBottom:'1.5rem' }}>

        {/* Map */}
        <div className="map-pane">
          <ActivityMap
            pins={filtered}
            color={meta.color}
            center={meta.center}
            zoom={meta.zoom}
            selected={selected}
            onSelect={setSelected}
          />
          <div style={{ position:'absolute', bottom:10, left:10, zIndex:500,
            background:'rgba(13,27,42,.88)', border:'1px solid var(--cborder)',
            borderRadius:7, padding:'4px 10px', fontSize:'.72rem', color:'var(--snow)' }}>
            {filtered.length} location{filtered.length !== 1 ? 's' : ''} shown
          </div>
        </div>

        {/* Sidebar */}
        <div className="map-sidebar" style={{ display:'flex', flexDirection:'column', gap:'1rem', overflowY:'auto' }}>
          {Object.keys(grouped).length === 0 && (
            <div style={{ padding:'2rem', color:'var(--granite)', textAlign:'center', fontSize:'.84rem' }}>
              No locations match your filters.
            </div>
          )}
          {Object.entries(grouped).map(([type, gpins]) => (
            <div key={type}>
              <div style={{ fontSize:'.62rem', fontWeight:700, letterSpacing:'.12em',
                textTransform:'uppercase', color:'var(--glacial)', marginBottom:'.5rem', paddingLeft:'.25rem' }}>
                {TYPE_LABELS[type] || type}
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:'.4rem' }}>
                {gpins.map(pin => {
                  const isSel = selected?.id === pin.id;
                  return (
                    <div key={pin.id} onClick={() => setSelected(isSel ? null : pin)}
                      style={{ background: isSel ? `${meta.color}12` : 'rgba(13,27,42,.65)',
                        border: `1px solid ${isSel ? meta.color : 'var(--cborder)'}`,
                        borderRadius:9, padding:'.75rem 1rem', cursor:'pointer', transition:'all .18s' }}>
                      <div style={{ fontWeight:700, fontSize:'.82rem', marginBottom:'.2rem' }}>{pin.name}</div>
                      <div style={{ fontSize:'.7rem', color:'var(--glacial)', marginBottom:'.25rem' }}>
                        {SHORE_LABELS[pin.shore]}{pin.fee ? ` · ${pin.fee}` : ''}
                      </div>
                      <div style={{ fontSize:'.72rem', color:'var(--granite)', lineHeight:1.5 }}>
                        {pin.desc.length > 80 ? pin.desc.slice(0,80)+'…' : pin.desc}
                      </div>
                      {pin.url && (
                        <a href={pin.url} target="_blank" rel="noopener"
                          onClick={e => e.stopPropagation()}
                          style={{ fontSize:'.68rem', color:'var(--glacial)', fontWeight:600, display:'inline-block', marginTop:'.3rem' }}>
                          More info →
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected detail panel */}
      {selected && (
        <div style={{ background:'var(--cbg)', border:`1px solid ${meta.color}`,
          borderRadius:12, padding:'1.25rem 1.5rem', marginBottom:'2rem', animation:'fadeUp .2s ease' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
            <div>
              <div className="eye">{SHORE_LABELS[selected.shore]}</div>
              <h2 style={{ fontFamily:'var(--fd)', fontSize:'1.2rem', fontWeight:700, marginBottom:'.3rem' }}>
                {selected.name}
              </h2>
            </div>
            <button onClick={() => setSelected(null)}
              style={{ background:'none', border:'none', color:'var(--granite)', fontSize:'1.2rem', cursor:'pointer' }}>✕</button>
          </div>
          <p style={{ fontSize:'.84rem', color:'rgba(242,245,247,.75)', lineHeight:1.75, marginBottom:'.75rem' }}>
            {selected.desc}
          </p>
          {selected.fee && <div style={{ fontSize:'.78rem', color:'var(--granite)', marginBottom:'.5rem' }}>💰 {selected.fee}</div>}
          {selected.url && (
            <a href={selected.url} target="_blank" rel="noopener" className="bp" style={{ textDecoration:'none' }}>
              More Info →
            </a>
          )}
        </div>
      )}

      {/* ── INSPECTION GUIDE ───────────────────────────────────────────────── */}
      <section style={{ marginBottom:'3rem' }}>
        <div className="eye">Required for all motorized watercraft</div>
        <h2 style={{ fontFamily:'var(--fd)', fontSize:'1.4rem', fontWeight:800, marginBottom:'.75rem' }}>
          Boat Inspections &amp; AIS Program
        </h2>
        <p style={{ fontSize:'.88rem', lineHeight:1.8, color:'rgba(242,245,247,.78)', marginBottom:'1.25rem' }}>
          <strong style={{ color:'var(--snow)' }}>Every motorized boat must be inspected before launching</strong> on
          Lake Tahoe — including Fallen Leaf Lake, Echo Lake, and Donner Lake. The program prevents
          aquatic invasive species (AIS) like golden mussels, quagga mussels, and zebra mussels from
          entering the lake. In 2026, inspectors intercepted golden mussels at the Meyers station —
          the program works, and it depends on every boater participating.
        </p>

        {/* Decon alert */}
        <div style={{ background:'rgba(224,92,92,.08)', border:'1px solid rgba(224,92,92,.3)',
          borderRadius:12, padding:'1.1rem 1.25rem', marginBottom:'1rem', display:'flex', gap:'1rem' }}>
          <span style={{ fontSize:'1.4rem', flexShrink:0 }}>⚠️</span>
          <div>
            <div style={{ fontWeight:700, marginBottom:'.35rem', color:'var(--snow)', fontSize:'.9rem' }}>
              New since 2025: Mandatory decontamination
            </div>
            <div style={{ fontSize:'.82rem', color:'rgba(242,245,247,.72)', lineHeight:1.75 }}>
              All motorized and trailered watercraft now undergo mandatory decontamination after inspection.
              High-pressure, high-temperature water is used to kill invasive species on hull, bilge, props, and trailer.{' '}
              <strong style={{ color:'var(--snow)' }}>Minimum fee: $30.</strong>{' '}
              Knowingly transporting AIS: minimum $5,000 penalty under TRPA Code 63.4.
            </div>
          </div>
        </div>

        {/* Time alert */}
        <div style={{ background:'rgba(212,168,83,.08)', border:'1px solid rgba(212,168,83,.3)',
          borderRadius:12, padding:'1.1rem 1.25rem', marginBottom:'1.5rem', display:'flex', gap:'1rem' }}>
          <span style={{ fontSize:'1.4rem', flexShrink:0 }}>⏱</span>
          <div>
            <div style={{ fontWeight:700, marginBottom:'.35rem', color:'var(--snow)', fontSize:'.9rem' }}>
              Plan 30–90 minutes at the station
            </div>
            <div style={{ fontSize:'.82rem', color:'rgba(242,245,247,.72)', lineHeight:1.75 }}>
              Inspectors will not begin a new inspection after 4:30pm even if stations are open until 5:30pm.
              If you want to be on the water by 9am on a summer weekend, arrive at the station by 7:30–8am.{' '}
              <strong style={{ color:'#4AADBC' }}>
                Book an appointment at TahoeBoatInspections.com — cuts wait to under 15 minutes.
              </strong>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div style={{ background:'rgba(74,173,188,.06)', border:'1px solid rgba(74,173,188,.18)',
          borderRadius:12, padding:'1.1rem 1.25rem', marginBottom:'1.75rem' }}>
          <div style={{ fontWeight:700, fontSize:'.88rem', marginBottom:'.75rem', color:'var(--glacial)' }}>
            💡 How to save time at the station
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:'.5rem' }}>
            {[
              ['Book online',          'Appointments at TahoeBoatInspections.com — fastest way through'],
              ['Clean, Drain, Dry',    'Do this before arriving — speeds up inspection significantly'],
              ['Remove standing water','Drain bilge, ballast tanks, livewells, and bait buckets completely'],
              ['Clear the hull',       'Remove plants, mud, and debris from hull, motor, and trailer'],
              ['Arrive early',         'Before 10am weekends; before 9am on holiday weekends'],
              ['Use Alpine Meadows',   'Consistently the least crowded of the three stations'],
            ].map(([title, detail]) => (
              <div key={title} style={{ display:'flex', gap:'.5rem', fontSize:'.78rem' }}>
                <span style={{ color:'var(--glacial)', flexShrink:0, fontWeight:700 }}>✓</span>
                <span><strong style={{ color:'var(--snow)' }}>{title}</strong>{' — '}
                  <span style={{ color:'rgba(242,245,247,.65)' }}>{detail}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Station cards */}
        <h3 style={{ fontFamily:'var(--fd)', fontSize:'1.05rem', fontWeight:700, marginBottom:'1rem' }}>
          Three Inspection Stations
        </h3>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(250px,1fr))', gap:'.85rem', marginBottom:'2rem' }}>
          {stations.map(s => (
            <div key={s.name} style={{ background:'rgba(13,27,42,.7)', border:'1px solid var(--cborder)', borderRadius:12, padding:'1rem 1.1rem' }}>
              <div style={{ fontWeight:700, fontSize:'.9rem', marginBottom:'.2rem' }}>{s.name}</div>
              <div style={{ fontSize:'.76rem', color:'var(--glacial)', marginBottom:'.2rem' }}>{s.address}</div>
              <div style={{ fontSize:'.72rem', color:'var(--granite)', marginBottom:'.55rem' }}>{s.detail}</div>
              <div style={{ marginBottom:'.55rem' }}>
                <span style={{ background:'rgba(74,188,120,.1)', color:'#4ABC78', borderRadius:5, padding:'2px 8px', fontSize:'.7rem', fontWeight:600 }}>
                  {s.hours}
                </span>
              </div>
              <div style={{ fontSize:'.72rem', color:'rgba(242,245,247,.6)', lineHeight:1.6 }}>💡 {s.tip}</div>
            </div>
          ))}
        </div>

        {/* Seal guide */}
        <h3 style={{ fontFamily:'var(--fd)', fontSize:'1.05rem', fontWeight:700, marginBottom:'.5rem' }}>
          Understanding Your Inspection Seal
        </h3>
        <p style={{ fontSize:'.84rem', color:'rgba(242,245,247,.72)', lineHeight:1.75, marginBottom:'1rem' }}>
          After inspection your boat receives a seal — a wire with a numbered clip connecting the boat to the trailer.
          Keep it intact. An intact Tahoe seal lets you skip the inspection line on your next launch on Lake Tahoe.
          Different lakes require different colored seals.
        </p>
        <div style={{ display:'flex', flexDirection:'column', gap:'.6rem', marginBottom:'1.75rem' }}>
          {seals.map(s => (
            <div key={s.name} style={{ display:'flex', gap:'1rem', alignItems:'flex-start',
              background:'rgba(13,27,42,.6)', border:`1px solid ${s.color}40`,
              borderLeft:`4px solid ${s.color}`, borderRadius:10, padding:'.9rem 1.1rem' }}>
              <div style={{ width:15, height:15, borderRadius:'50%', background:s.color,
                flexShrink:0, marginTop:3, boxShadow:`0 0 8px ${s.color}55` }}/>
              <div>
                <div style={{ fontWeight:700, fontSize:'.86rem', marginBottom:'.2rem' }}>
                  {s.name} — <span style={{ color:s.color }}>{s.lake}</span>
                </div>
                <div style={{ fontSize:'.78rem', color:'rgba(242,245,247,.7)', lineHeight:1.65 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Non-motorized */}
        <div style={{ background:'rgba(13,27,42,.5)', border:'1px solid var(--cborder)',
          borderRadius:12, padding:'1rem 1.1rem', marginBottom:'1.5rem' }}>
          <div style={{ fontWeight:700, fontSize:'.86rem', marginBottom:'.4rem', color:'var(--snow)' }}>
            🛶 Kayaks, SUPs, and non-motorized watercraft
          </div>
          <div style={{ fontSize:'.8rem', color:'rgba(242,245,247,.7)', lineHeight:1.75 }}>
            Non-motorized craft do not need a station inspection but <strong style={{ color:'var(--snow)' }}>must
            Clean, Drain, and Dry</strong> after every use. Roving inspectors patrol popular launch areas
            including Sand Harbor, Kings Beach, and Pope Beach. Hand-launched electric watercraft (HLEW)
            need an annual AIS sticker — get one at any station after completing a free online training quiz.
          </div>
        </div>

        <div style={{ display:'flex', gap:'.75rem', flexWrap:'wrap' }}>
          <a href="https://tahoeboatinspections.com/appt" target="_blank" rel="noopener" className="bp">
            Book Inspection Appointment →
          </a>
          <a href="https://tahoeboatinspections.com" target="_blank" rel="noopener" className="bs">
            TahoeBoatInspections.com →
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
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(190px,1fr))', gap:'.7rem', marginBottom:'2rem' }}>
          {[
            { icon:'📏', label:'Lake size',       val:'22 miles long · 12 miles wide' },
            { icon:'🔵', label:'Max depth',       val:'1,645 ft — 4th deepest in US' },
            { icon:'🌿', label:'Visibility',      val:'70+ feet in clear conditions' },
            { icon:'🌡️', label:'Water temp',     val:'68–72°F peak summer' },
            { icon:'⚡', label:'Speed limit',     val:'35 mph · 5 mph within 600ft of shore' },
            { icon:'🔕', label:'No-wake zones',   val:'Emerald Bay · All marinas' },
            { icon:'🚤', label:'Public ramps',    val:'7 ramps around the lake' },
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
          <Link href="/activities/fishing" style={{ textDecoration:'none' }} className="bs">Fishing Guide →</Link>
          <Link href="/activities/kayaking" style={{ textDecoration:'none' }} className="bs">Kayaking →</Link>
          <Link href="/campsites" style={{ textDecoration:'none' }} className="bs">Find Campsites →</Link>
        </div>
      </section>
    </div>
  );
}
