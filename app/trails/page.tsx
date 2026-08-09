'use client';
import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  ALL_TRAILHEADS, byShore, type Trailhead,
  type Difficulty, type Shore,
  DIFFICULTY_COLOR, DIFFICULTY_LABEL,
} from '@/lib/trailheads';

const TrailheadMap = dynamic(() => import('@/components/TrailheadMap'), {
  ssr:     false,
  loading: () => (
    <div style={{ height:'100%', display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(13,27,42,.8)', borderRadius:12 }}>
      <div className="spin-wrap"><div className="spinner"/>Loading topo map…</div>
    </div>
  ),
});

const SHORES:      Array<{ val: Shore | 'all'; label: string }> = [
  { val:'all',   label:'All Shores' },
  { val:'north', label:'North Shore' },
  { val:'south', label:'South Shore' },
  { val:'west',  label:'West Shore' },
  { val:'east',  label:'East Shore' },
];
const DIFFICULTIES: Array<{ val: Difficulty | 'all'; label: string }> = [
  { val:'all',      label:'All Levels' },
  { val:'easy',     label:'Easy' },
  { val:'moderate', label:'Moderate' },
  { val:'strenuous',label:'Strenuous' },
  { val:'expert',   label:'Expert' },
];
const USES = [
  { val:'all',       label:'All Uses' },
  { val:'hiking',    label:'🥾 Hiking' },
  { val:'mtb',       label:'🚵 MTB' },
  { val:'equestrian',label:'🐴 Equestrian' },
];

export default function TrailsPage() {
  const [shore,      setShore]      = useState<Shore | 'all'>('all');
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('all');
  const [use,        setUse]        = useState('all');
  const [search,     setSearch]     = useState('');
  const [selected,   setSelected]   = useState<Trailhead | null>(null);
  const [showList,   setShowList]   = useState(true);

  const filtered = useMemo(() => {
    return ALL_TRAILHEADS
      .filter(t => shore      === 'all' || t.shore === shore)
      .filter(t => difficulty === 'all' || t.difficulty === difficulty)
      .filter(t => use        === 'all' || t.use.includes(use as any))
      .filter(t => !search || t.name.toLowerCase().includes(search.toLowerCase())
                           || t.trail.toLowerCase().includes(search.toLowerCase()));
  }, [shore, difficulty, use, search]);

  return (
    <div className="sw" style={{ paddingTop:'2rem', paddingBottom:'4rem' }}>
      {/* Header */}
      <div className="eye">Hiking Trailheads · Lake Tahoe Basin</div>
      <h1 className="stitle">Trailhead Map</h1>
      <p className="ssub">
        {ALL_TRAILHEADS.length} verified trailheads around the basin — from lakeside strolls
        to summit ascents. Topo map powered by OpenStreetMap.
      </p>

      {/* Difficulty legend */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:'.5rem', marginBottom:'1.25rem' }}>
        {Object.entries(DIFFICULTY_COLOR).map(([d, color]) => (
          <span key={d} style={{ display:'flex', alignItems:'center', gap:5, fontSize:'.72rem', fontWeight:600 }}>
            <span style={{ width:10, height:10, borderRadius:'50%', background:color, display:'inline-block' }}/>
            {DIFFICULTY_LABEL[d as Difficulty]}
          </span>
        ))}
        <span style={{ fontSize:'.72rem', color:'var(--granite)', marginLeft:'auto' }}>
          ▲ = trailhead marker shape
        </span>
      </div>

      {/* Filters */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:'.5rem', marginBottom:'1rem' }}>
        <input
          className="fc"
          style={{ maxWidth:220 }}
          type="text"
          placeholder="Search trailheads…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {SHORES.map(s => (
          <button key={s.val} className={`mfb${shore===s.val?' act':''}`} onClick={() => setShore(s.val)}>
            {s.label}
          </button>
        ))}
      </div>
      <div style={{ display:'flex', flexWrap:'wrap', gap:'.5rem', marginBottom:'1.25rem' }}>
        {DIFFICULTIES.map(d => (
          <button key={d.val} className={`mfb${difficulty===d.val?' act':''}`} onClick={() => setDifficulty(d.val)}
            style={{ borderColor: d.val !== 'all' && difficulty === d.val ? DIFFICULTY_COLOR[d.val as Difficulty] : undefined,
                     color:       d.val !== 'all' && difficulty === d.val ? DIFFICULTY_COLOR[d.val as Difficulty] : undefined }}>
            {d.label}
          </button>
        ))}
        {USES.map(u => (
          <button key={u.val} className={`mfb${use===u.val?' act':''}`} onClick={() => setUse(u.val)}>
            {u.label}
          </button>
        ))}
      </div>

      {/* Map + list layout — tab toggle on mobile, side-by-side on desktop */}
      <div className="map-tab-bar">
        {['Map','List'].map(tab => (
          <button key={tab} className={`map-tab${showList===(tab==='List')?' map-tab-active':''}`}
            onClick={() => setShowList(tab==='List')}>
            {tab==='Map' ? '🗺 Map' : '☰ List'} {tab==='Map' ? `(${filtered.length})` : ''}
          </button>
        ))}
      </div>

      <div className="map-split-layout" style={{ marginBottom:'1.5rem' }}>

        {/* Map */}
        <div className={`map-pane${showList?' map-pane-hidden':''}`} style={{ position:'relative' }}>
          <TrailheadMap
            trailheads={filtered}
            selected={selected}
            onSelect={setSelected}
          />
          <div style={{
            position:'absolute', bottom:10, left:10, zIndex:500,
            background:'rgba(13,27,42,.85)', border:'1px solid var(--cborder)',
            borderRadius:7, padding:'4px 10px', fontSize:'.72rem', color:'var(--snow)',
          }}>
            {filtered.length} trailhead{filtered.length !== 1 ? 's' : ''} shown
          </div>
        </div>

        {/* Sidebar list */}
        {showList && (
          <div style={{ height:560, overflowY:'auto', display:'flex', flexDirection:'column', gap:'.6rem' }}>
            {filtered.length === 0 && (
              <div style={{ padding:'2rem', color:'var(--granite)', fontSize:'.84rem', textAlign:'center' }}>
                No trailheads match your filters.
              </div>
            )}
            {filtered.map(t => {
              const color   = DIFFICULTY_COLOR[t.difficulty];
              const label   = DIFFICULTY_LABEL[t.difficulty];
              const isSel   = selected?.id === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelected(isSel ? null : t)}
                  style={{
                    background:   isSel ? 'rgba(74,173,188,.1)' : 'rgba(13,27,42,.65)',
                    border:       `1px solid ${isSel ? 'var(--glacial)' : 'var(--cborder)'}`,
                    borderRadius: 10,
                    padding:      '.85rem 1rem',
                    cursor:       'pointer',
                    transition:   'all .18s',
                  }}
                >
                  {/* Top row */}
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'.3rem' }}>
                    <div style={{ fontWeight:700, fontSize:'.85rem', flex:1, paddingRight:8 }}>{t.name}</div>
                    <span style={{ background:`${color}20`, color, borderRadius:5, padding:'1px 7px', fontSize:'.64rem', fontWeight:700, flexShrink:0 }}>
                      {label}
                    </span>
                  </div>

                  {/* Trail name */}
                  <div style={{ fontSize:'.74rem', color:'var(--glacial)', marginBottom:'.3rem' }}>{t.trail}</div>

                  {/* Stats */}
                  <div style={{ display:'flex', gap:'.75rem', fontSize:'.72rem', color:'var(--granite)', marginBottom:'.35rem', flexWrap:'wrap' }}>
                    {t.distanceMi > 0 && <span>📏 {t.distanceMi} mi RT</span>}
                    {t.elevGainFt > 0 && <span>⬆️ +{t.elevGainFt.toLocaleString()} ft</span>}
                    <span>📅 {t.season}</span>
                    {t.permit && <span style={{ color:'#E0B85C' }}>⚠ Permit</span>}
                  </div>

                  {/* Chips */}
                  <div style={{ display:'flex', gap:'.3rem', flexWrap:'wrap', marginBottom:'.4rem' }}>
                    {t.highlights.slice(0,2).map(h => (
                      <span key={h} style={{ background:'rgba(74,173,188,.07)', border:'1px solid rgba(74,173,188,.15)', color:'var(--glacial)', borderRadius:5, padding:'1px 7px', fontSize:'.62rem' }}>
                        {h}
                      </span>
                    ))}
                    <span style={{ fontSize:'.64rem', color:'var(--granite)', padding:'1px 0' }}>
                      {t.shore.charAt(0).toUpperCase() + t.shore.slice(1)} Shore
                    </span>
                  </div>

                  {/* Dogs + more link */}
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <span style={{ fontSize:'.67rem', color: t.dogs ? '#4ABC78' : 'var(--granite)' }}>
                      {t.dogs ? '🐕 Dogs OK' : '🚫 No dogs'}
                    </span>
                    <a
                      href={t.moreInfoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      style={{ fontSize:'.68rem', color:'var(--glacial)', fontWeight:600 }}
                    >
                      More info →
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Selected detail panel */}
      {selected && (
        <div style={{
          background:'var(--cbg)', border:'1px solid var(--glacial)',
          borderRadius:12, padding:'1.5rem', marginBottom:'1.5rem',
          animation:'fadeUp .25s ease',
        }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1rem' }}>
            <div>
              <div className="eye">{selected.shore.charAt(0).toUpperCase() + selected.shore.slice(1)} Shore · {selected.season}</div>
              <h2 style={{ fontFamily:'var(--fd)', fontSize:'1.4rem', fontWeight:700, marginBottom:'.25rem' }}>{selected.name}</h2>
              <div style={{ color:'var(--glacial)', fontSize:'.84rem', marginBottom:'.5rem' }}>{selected.trail}</div>
            </div>
            <button onClick={() => setSelected(null)} style={{ background:'none', border:'none', color:'var(--granite)', fontSize:'1.2rem', cursor:'pointer', padding:'0 4px' }}>✕</button>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(140px,1fr))', gap:'.6rem', marginBottom:'1rem' }}>
            {[
              ['Difficulty',    DIFFICULTY_LABEL[selected.difficulty]],
              ['Distance',      selected.distanceMi > 0 ? `${selected.distanceMi} mi RT` : 'Variable'],
              ['Elev. Gain',    selected.elevGainFt > 0 ? `+${selected.elevGainFt.toLocaleString()} ft` : '—'],
              ['Max Elevation', selected.elevMaxFt > 0  ? `${selected.elevMaxFt.toLocaleString()} ft` : '—'],
              ['Season',        selected.season],
              ['Parking',       selected.parking],
              ['Dogs',          selected.dogs ? 'Allowed' : 'Not allowed'],
              ['Permit',        selected.permit ? 'Required' : 'Not required'],
            ].map(([k, v]) => (
              <div key={k} style={{ background:'rgba(13,27,42,.5)', borderRadius:8, padding:'.65rem .75rem' }}>
                <div style={{ fontSize:'.62rem', color:'var(--granite)', marginBottom:'.2rem', fontWeight:600, textTransform:'uppercase', letterSpacing:'.08em' }}>{k}</div>
                <div style={{ fontSize:'.8rem', fontWeight:600 }}>{v}</div>
              </div>
            ))}
          </div>

          <p style={{ fontSize:'.82rem', color:'rgba(242,245,247,.75)', lineHeight:1.7, marginBottom:'1rem' }}>{selected.desc}</p>

          <div style={{ display:'flex', flexWrap:'wrap', gap:'.4rem', marginBottom:'1rem' }}>
            {selected.highlights.map(h => (
              <span key={h} className="camp-chip">{h}</span>
            ))}
          </div>

          <div style={{ display:'flex', gap:'.75rem', flexWrap:'wrap' }}>
            <a href={selected.moreInfoUrl} target="_blank" rel="noopener noreferrer" className="bp" style={{ textDecoration:'none' }}>
              Trail Info &amp; Maps →
            </a>
            <Link href="/plan" className="bs">Add to My Trip →</Link>
          </div>
        </div>
      )}

      {/* Stats ribbon */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1rem', marginTop:'1rem' }}>
        {[
          [String(20 + 13), 'Verified Trailheads'],
          ['165',  'Tahoe Rim Trail Miles'],
          ['63K',  'Desolation Wilderness Acres'],
          ['4',    'Shores Covered'],
        ].map(([val, label]) => (
          <div key={label} style={{ background:'rgba(13,27,42,.6)', border:'1px solid var(--cborder)', borderRadius:10, padding:'1rem', textAlign:'center' }}>
            <div style={{ fontFamily:'var(--fd)', fontSize:'1.6rem', fontWeight:900, color:'var(--glacial)' }}>{val}</div>
            <div style={{ fontSize:'.72rem', color:'var(--granite)', marginTop:'.2rem' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Data attribution */}
      <div style={{ marginTop:'1.5rem', fontSize:'.68rem', color:'rgba(139,158,168,.5)', lineHeight:1.7 }}>
        Trailhead data: TrailsTV curated dataset · Topo tiles: © <a href="https://opentopomap.org" target="_blank" rel="noopener" style={{ color:'inherit' }}>OpenTopoMap</a> · Map data: © <a href="https://openstreetmap.org" target="_blank" rel="noopener" style={{ color:'inherit' }}>OpenStreetMap</a> contributors (ODbL)
      </div>
    </div>
  );
}
