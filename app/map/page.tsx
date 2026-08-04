'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { AMENITIES_FALLBACK, type Amenity } from '@/lib/data';

const AmenitiesMap = dynamic(() => import('@/components/AmenitiesMap'), {
  ssr: false,
  loading: () => <div className="map-container" style={{ display:'flex', alignItems:'center', justifyContent:'center' }}><div className="spin-wrap"><div className="spinner"/>Loading map…</div></div>,
});

type AType = 'all' | 'bike' | 'sport' | 'camp' | 'grocery' | 'gas' | 'rental';

const TYPE_LABELS: Record<AType, string> = {
  all:'All', bike:'🚵 Bike Shops', sport:'🏪 Outfitters', camp:'⛺ Camp Gear',
  grocery:'🛒 Grocery', gas:'⛽ Gas', rental:'🛶 Rentals',
};

export default function MapPage() {
  const [filter, setFilter] = useState<AType>('all');
  const amenities = AMENITIES_FALLBACK;
  const filtered  = filter === 'all' ? amenities : amenities.filter(a => a.type === filter);

  return (
    <div className="sw">
      <div className="eye">Amenities Map · Lake Tahoe Basin</div>
      <h2 className="stitle">Around the Lake</h2>
      <p className="ssub">Grocery stores, bike shops, outfitters, camp gear, gas, and water sport rentals — all four shores of the basin.</p>

      {/* Filters */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:'.4rem', marginBottom:'1rem' }}>
        {(Object.entries(TYPE_LABELS) as [AType, string][]).map(([t, label]) => (
          <button key={t} className={`mfb${filter===t?' act':''}`} onClick={() => setFilter(t)}>
            {label}
          </button>
        ))}
      </div>

      {/* Map + cards */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:'1rem' }}>
        <AmenitiesMap amenities={filtered} />
        <div style={{ display:'flex', flexDirection:'column', gap:'.5rem', overflowY:'auto', maxHeight:460 }}>
          {filtered.map(a => (
            <div key={a.name} style={{ background:'rgba(13,27,42,.7)', border:'1px solid var(--cborder)', borderRadius:9, padding:'.75rem 1rem', fontSize:'.78rem' }}>
              <div style={{ fontWeight:600, marginBottom:'.2rem' }}>{a.name}</div>
              <div style={{ color:'var(--granite)', fontSize:'.72rem' }}>{a.loc}</div>
              <div style={{ color:'var(--glacial)', fontSize:'.72rem', marginTop:'.15rem' }}>{a.note}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
