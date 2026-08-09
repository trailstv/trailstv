'use client';
import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ACTIVITY_MAPS, type ActivityPin, type PinType } from '@/lib/activityLocations';

const ActivityMap = dynamic(() => import('@/components/ActivityMap'), {
  ssr: false,
  loading: () => (
    <div style={{ height:520, display:'flex', alignItems:'center', justifyContent:'center',
      background:'rgba(13,27,42,.7)', borderRadius:12, border:'1px solid var(--cborder)' }}>
      <div className="spin-wrap"><div className="spinner"/>Loading map…</div>
    </div>
  ),
});

// Pin type labels and icons for filter bar
const TYPE_META: Record<PinType, { label: string; icon: string }> = {
  trailhead: { label:'Trailheads',  icon:'▲' },
  launch:    { label:'Launch Spots',icon:'◆' },
  rental:    { label:'Rentals',     icon:'●' },
  resort:    { label:'Resorts',     icon:'★' },
  beach:     { label:'Beaches',     icon:'◉' },
  marina:    { label:'Marinas',     icon:'⚓' },
  campsite:  { label:'Campsites',   icon:'⛺' },
  spot:      { label:'Spots',       icon:'●' },
  viewpoint: { label:'Viewpoints',  icon:'◉' },
};

const SHORE_LABELS: Record<string, string> = {
  north: 'North Shore', south: 'South Shore',
  west:  'West Shore',  east:  'East Shore',
};

export default function ActivityPage() {
  const params     = useParams();
  const activityId = typeof params.activity === 'string' ? params.activity : '';
  const meta       = ACTIVITY_MAPS[activityId];

  const [selectedPin, setSelectedPin] = useState<ActivityPin | null>(null);
  const [shoreFilter, setShoreFilter] = useState<string>('all');
  const [typeFilter,  setTypeFilter]  = useState<string>('all');
  const [search,      setSearch]      = useState('');

  if (!meta) {
    return (
      <div className="sw" style={{ textAlign:'center', paddingTop:'4rem' }}>
        <div style={{ fontSize:'2rem', marginBottom:'1rem' }}>🏔️</div>
        <h2 className="stitle">Activity not found</h2>
        <p className="ssub">That activity doesn&apos;t exist or hasn&apos;t been set up yet.</p>
        <Link href="/activities" className="bp" style={{ marginTop:'1rem', display:'inline-block' }}>
          ← Back to Activities
        </Link>
      </div>
    );
  }

  // Derive available filter options from actual pins
  const availableTypes  = useMemo(() =>
    [...new Set(meta.pins.map(p => p.type))], [meta]);
  const availableShores = useMemo(() =>
    [...new Set(meta.pins.map(p => p.shore))], [meta]);

  const filteredPins = useMemo(() => meta.pins.filter(p => {
    if (shoreFilter !== 'all' && p.shore !== shoreFilter) return false;
    if (typeFilter  !== 'all' && p.type  !== typeFilter)  return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) &&
        !p.desc.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [meta, shoreFilter, typeFilter, search]);

  // Group sidebar pins by type for cleaner display
  const groupedPins = useMemo(() => {
    const groups: Record<string, ActivityPin[]> = {};
    filteredPins.forEach(p => {
      if (!groups[p.type]) groups[p.type] = [];
      groups[p.type].push(p);
    });
    return groups;
  }, [filteredPins]);

  return (
    <div className="sw" style={{ paddingBottom:'4rem' }}>

      {/* ── Breadcrumb ── */}
      <div style={{ fontSize:'.74rem', color:'var(--granite)', marginBottom:'1rem' }}>
        <Link href="/activities" style={{ color:'var(--glacial)' }}>Activities</Link>
        {' → '}{meta.label}
      </div>

      {/* ── Header ── */}
      <div className="eye">{meta.label} · Lake Tahoe Basin</div>
      <h1 className="stitle">
        <span style={{ marginRight:'.5rem' }}>{meta.icon}</span>
        {meta.label}
      </h1>
      <p className="ssub">{meta.desc}</p>

      {/* ── Filters ── */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:'.4rem', marginBottom:'.6rem' }}>
        <input
          className="fc"
          style={{ maxWidth:200 }}
          type="text"
          placeholder={`Search ${meta.label.toLowerCase()}…`}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {/* Shore filters */}
        <button
          className={`mfb${shoreFilter==='all'?' act':''}`}
          onClick={() => setShoreFilter('all')}
        >All Shores</button>
        {availableShores.map(s => (
          <button
            key={s}
            className={`mfb${shoreFilter===s?' act':''}`}
            onClick={() => setShoreFilter(s)}
          >{SHORE_LABELS[s] || s}</button>
        ))}
      </div>

      {/* Type filters — only show types that exist for this activity */}
      {availableTypes.length > 1 && (
        <div style={{ display:'flex', flexWrap:'wrap', gap:'.4rem', marginBottom:'1.25rem' }}>
          <button
            className={`mfb${typeFilter==='all'?' act':''}`}
            onClick={() => setTypeFilter('all')}
          >All Types</button>
          {availableTypes.map(t => (
            <button
              key={t}
              className={`mfb${typeFilter===t?' act':''}`}
              onClick={() => setTypeFilter(t)}
            >{TYPE_META[t]?.icon} {TYPE_META[t]?.label || t}</button>
          ))}
        </div>
      )}

      {/* ── Map + Sidebar ── */}
      <div className="map-tab-bar">
        {['Map','List'].map(tab => (
          <button key={tab} className={`map-tab${(tab==='List'?selectedPin!=null:selectedPin==null)||true?' map-tab-active':''}`}
            onClick={() => {}} style={{ display:'none' }}>{tab}</button>
        ))}
      </div>
      <div className="map-split-layout" style={{ marginBottom:'1.5rem' }}>

        {/* Map */}
        <div className="map-pane" style={{ border:'1px solid var(--cborder)', borderRadius:12, overflow:'hidden', position:'relative' }}>
          <ActivityMap
            pins={filteredPins}
            color={meta.color}
            center={meta.center}
            zoom={meta.zoom}
            selected={selectedPin}
            onSelect={setSelectedPin}
          />
          {/* Pin count overlay */}
          <div style={{
            position:'absolute', bottom:10, left:10, zIndex:500,
            background:'rgba(13,27,42,.88)', border:'1px solid var(--cborder)',
            borderRadius:7, padding:'4px 10px', fontSize:'.72rem', color:'var(--snow)',
          }}>
            {filteredPins.length} location{filteredPins.length !== 1 ? 's' : ''} shown
          </div>
        </div>

        {/* Sidebar — grouped by type */}
        <div className="map-sidebar" style={{ overflowY:'auto', display:'flex', flexDirection:'column', gap:'1rem' }}>
          {Object.keys(groupedPins).length === 0 && (
            <div style={{ padding:'2rem', color:'var(--granite)', fontSize:'.84rem', textAlign:'center' }}>
              No locations match your filters.
            </div>
          )}

          {Object.entries(groupedPins).map(([type, pins]) => (
            <div key={type}>
              {/* Type group header */}
              <div style={{ fontSize:'.62rem', fontWeight:700, letterSpacing:'.12em',
                textTransform:'uppercase', color:'var(--glacial)',
                marginBottom:'.5rem', paddingLeft:'.25rem' }}>
                {TYPE_META[type as PinType]?.icon} {TYPE_META[type as PinType]?.label || type}
              </div>

              <div style={{ display:'flex', flexDirection:'column', gap:'.4rem' }}>
                {pins.map(pin => {
                  const isSel = selectedPin?.id === pin.id;
                  return (
                    <div
                      key={pin.id}
                      onClick={() => setSelectedPin(isSel ? null : pin)}
                      style={{
                        background:   isSel ? `${meta.color}12` : 'rgba(13,27,42,.65)',
                        border:       `1px solid ${isSel ? meta.color : 'var(--cborder)'}`,
                        borderRadius: 9,
                        padding:      '.75rem 1rem',
                        cursor:       'pointer',
                        transition:   'all .18s',
                      }}
                    >
                      <div style={{ fontWeight:700, fontSize:'.82rem', marginBottom:'.2rem' }}>
                        {pin.name}
                      </div>
                      <div style={{ fontSize:'.68rem', color:'var(--glacial)', marginBottom:'.25rem' }}>
                        {SHORE_LABELS[pin.shore]}
                        {pin.difficulty ? ` · ${pin.difficulty}` : ''}
                        {pin.fee        ? ` · ${pin.fee}`        : ''}
                      </div>
                      <div style={{ fontSize:'.72rem', color:'var(--granite)', lineHeight:1.55 }}>
                        {pin.desc.length > 90 ? pin.desc.slice(0,90) + '…' : pin.desc}
                      </div>
                      {pin.note && (
                        <div style={{ fontSize:'.67rem', color:'#E0B85C', marginTop:'.3rem' }}>
                          ⚠ {pin.note}
                        </div>
                      )}
                      {pin.url && (
                        <a
                          href={pin.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          style={{ fontSize:'.68rem', color:'var(--glacial)', fontWeight:600, display:'inline-block', marginTop:'.3rem' }}
                        >
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

      {/* ── Selected Pin Detail Panel ── */}
      {selectedPin && (
        <div style={{
          background:'var(--cbg)', border:`1px solid ${meta.color}`,
          borderRadius:12, padding:'1.5rem', marginBottom:'1.5rem',
          animation:'fadeUp .2s ease',
        }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
            <div>
              <div className="eye">{SHORE_LABELS[selectedPin.shore]} · {TYPE_META[selectedPin.type]?.label}</div>
              <h2 style={{ fontFamily:'var(--fd)', fontSize:'1.3rem', fontWeight:700, marginBottom:'.35rem' }}>
                {selectedPin.name}
              </h2>
            </div>
            <button
              onClick={() => setSelectedPin(null)}
              style={{ background:'none', border:'none', color:'var(--granite)', fontSize:'1.2rem', cursor:'pointer' }}
            >✕</button>
          </div>

          {/* Detail chips */}
          <div style={{ display:'flex', gap:'.4rem', flexWrap:'wrap', marginBottom:'.85rem' }}>
            {selectedPin.difficulty && (
              <span style={{ background:`${meta.color}18`, color:meta.color, borderRadius:5,
                padding:'2px 9px', fontSize:'.72rem', fontWeight:700 }}>
                {selectedPin.difficulty}
              </span>
            )}
            {selectedPin.fee && (
              <span className="camp-chip">💰 {selectedPin.fee}</span>
            )}
            <span className="camp-chip">
              {SHORE_LABELS[selectedPin.shore]}
            </span>
          </div>

          <p style={{ fontSize:'.84rem', color:'rgba(242,245,247,.78)', lineHeight:1.75, marginBottom:'.85rem' }}>
            {selectedPin.desc}
          </p>

          {selectedPin.note && (
            <div style={{ background:'rgba(224,184,92,.08)', border:'1px solid rgba(224,184,92,.25)',
              borderRadius:7, padding:'.6rem .85rem', fontSize:'.78rem', color:'#E0B85C', marginBottom:'.85rem' }}>
              ⚠ {selectedPin.note}
            </div>
          )}

          <div style={{ display:'flex', gap:'.75rem', flexWrap:'wrap' }}>
            {selectedPin.url && (
              <a href={selectedPin.url} target="_blank" rel="noopener noreferrer"
                className="bp" style={{ textDecoration:'none' }}>
                More Info →
              </a>
            )}
            <Link href="/campsites" className="bs">Find Campsites Nearby →</Link>
          </div>
        </div>
      )}

      {/* ── Back link ── */}
      <Link href="/activities" style={{ fontSize:'.82rem', color:'var(--granite)', fontWeight:600 }}>
        ← All Activities
      </Link>
    </div>
  );
}
