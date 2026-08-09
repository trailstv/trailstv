'use client';
import { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { AMENITIES_FALLBACK, type Amenity } from '@/lib/data';

const AmenitiesMap = dynamic(() => import('@/components/AmenitiesMap'), {
  ssr: false,
  loading: () => <div className="map-container" style={{ display:'flex', alignItems:'center', justifyContent:'center' }}><div className="spin-wrap"><div className="spinner"/>Loading map…</div></div>,
});

type AType = 'all' | 'bike' | 'sport' | 'camp' | 'grocery' | 'gas' | 'rental';

const TYPE_LABELS: Record<AType, string> = {
  all:     'All',
  bike:    '🚵 Bike Shops',
  sport:   '🏪 Outfitters',
  camp:    '⛺ Camp Gear',
  grocery: '🛒 Grocery',
  gas:     '⛽ Gas',
  rental:  '🛶 Rentals',
};

const TYPE_COLORS: Record<string, string> = {
  bike:'#4AADBC', sport:'#D4A853', camp:'#4ABC78',
  grocery:'#E07070', gas:'#8B9EA8', rental:'#A78BFA',
};

export default function MapPage() {
  const [filter,   setFilter]   = useState<AType>('all');
  const [selected, setSelected] = useState<Amenity | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const cardRefs   = useRef<Record<string, HTMLDivElement | null>>({});

  const amenities = AMENITIES_FALLBACK;
  const filtered  = filter === 'all' ? amenities : amenities.filter(a => a.type === filter);

  function handleMapSelect(a: Amenity | null) {
    setSelected(a);
    // Scroll the sidebar card into view
    if (a && cardRefs.current[a.name]) {
      cardRefs.current[a.name]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  function handleCardClick(a: Amenity) {
    setSelected(prev => prev?.name === a.name ? null : a);
  }

  return (
    <div className="sw">
      <div className="eye">Amenities Map · Lake Tahoe Basin</div>
      <h2 className="stitle">Around the Lake</h2>
      <p className="ssub">Grocery stores, bike shops, outfitters, camp gear, gas, and water sport rentals — all four shores of the basin.</p>

      {/* Filters */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:'.4rem', marginBottom:'1rem' }}>
        {(Object.entries(TYPE_LABELS) as [AType, string][]).map(([t, label]) => (
          <button key={t} className={`mfb${filter===t?' act':''}`}
            onClick={() => { setFilter(t); setSelected(null); }}>
            {label}
          </button>
        ))}
      </div>

      {/* Map + sidebar */}
      <div className="map-split-layout">

        {/* Map */}
        <div className="map-pane">
          <AmenitiesMap
            amenities={filtered}
            selected={selected}
            onSelect={handleMapSelect}
          />
        </div>

        {/* Sidebar list */}
        <div
          ref={sidebarRef}
          className="map-sidebar"
          style={{ display:'flex', flexDirection:'column', gap:'.4rem', overflowY:'auto' }}
        >
          {filtered.map(a => {
            const isSel  = selected?.name === a.name;
            const color  = TYPE_COLORS[a.type] || '#8B9EA8';
            return (
              <div
                key={a.name}
                ref={el => { cardRefs.current[a.name] = el; }}
                onClick={() => handleCardClick(a)}
                style={{
                  background:   isSel ? `${color}12` : 'rgba(13,27,42,.7)',
                  border:       `1px solid ${isSel ? color : 'var(--cborder)'}`,
                  borderLeft:   `3px solid ${color}`,
                  borderRadius: 9,
                  padding:      '.7rem .9rem',
                  fontSize:     '.78rem',
                  cursor:       'pointer',
                  transition:   'all .18s',
                }}
              >
                <div style={{ fontWeight: 700, marginBottom:'.15rem', color: isSel ? color : 'var(--snow)' }}>
                  {a.name}
                </div>
                <div style={{ color:'var(--granite)', fontSize:'.7rem' }}>{a.loc}</div>
                <div style={{ color:'var(--glacial)', fontSize:'.7rem', marginTop:'.15rem' }}>{a.note}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected detail panel */}
      {selected && (
        <div style={{
          marginTop: '1rem',
          background: 'var(--cbg)',
          border: `1px solid ${TYPE_COLORS[selected.type] || 'var(--cborder)'}`,
          borderRadius: 12,
          padding: '1.25rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '1rem',
          animation: 'fadeUp .2s ease',
        }}>
          <div>
            <div className="eye">{TYPE_LABELS[selected.type as AType] ?? selected.type} · {selected.loc}</div>
            <div style={{ fontFamily:'var(--fd)', fontSize:'1.1rem', fontWeight:700, marginBottom:'.3rem' }}>{selected.name}</div>
            <div style={{ fontSize:'.82rem', color:'var(--granite)' }}>{selected.note}</div>
          </div>
          <button onClick={() => setSelected(null)}
            style={{ background:'none', border:'none', color:'var(--granite)', fontSize:'1.2rem', cursor:'pointer', flexShrink:0 }}>
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
