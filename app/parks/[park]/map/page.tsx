'use client';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { getPark } from '@/lib/parks';
import { ZION_AMENITIES } from '@/lib/parks/zion';
import { YELLOWSTONE_AMENITIES } from '@/lib/parks/yellowstone';
import { GRAND_CANYON_AMENITIES } from '@/lib/parks/grand-canyon';
import { YOSEMITE_AMENITIES } from '@/lib/parks/yosemite';
import { GRSM_AMENITIES } from '@/lib/parks/great-smoky-mountains';
import type { ParkAmenity, ParkPin } from '@/components/ParkMap';

const ParkMap = dynamic(() => import('@/components/ParkMap'), {
  ssr: false,
  loading: () => <div className="map-container" style={{ display:'flex', alignItems:'center', justifyContent:'center' }}><div className="spin-wrap"><div className="spinner"/>Loading map…</div></div>,
});

const PARK_AMENITIES: Record<string, ParkAmenity[]> = {
  zion:                    ZION_AMENITIES,
  yellowstone:             YELLOWSTONE_AMENITIES,
  'grand-canyon':          GRAND_CANYON_AMENITIES,
  yosemite:                YOSEMITE_AMENITIES,
  'great-smoky-mountains': GRSM_AMENITIES,
};

const TYPE_LABELS: Record<string, string> = {
  viewpoint:'🗺 Visitor Centers', spot:'🏨 Lodging', rental:'🧗 Gear & Rentals', marina:'⚓ Marinas',
};

export default function ParkMapPage() {
  const params = useParams();
  const slug   = typeof params.park === 'string' ? params.park : '';
  const park   = getPark(slug);
  const pins   = PARK_AMENITIES[slug] ?? [];
  const [selected, setSelected] = useState<ParkPin | null>(null);
  const [filter,   setFilter]   = useState('all');

  if (!park) return <div className="sw"><p>Park not found. <Link href="/parks" className="bp">← All Parks</Link></p></div>;

  const types    = [...new Set(pins.map(p => p.type))];
  const filtered = filter === 'all' ? pins : pins.filter(p => p.type === filter);

  return (
    <div className="sw" style={{ paddingBottom:'4rem' }}>
      <div style={{ fontSize:'.74rem', color:'var(--granite)', marginBottom:'.75rem' }}>
        <Link href="/parks" style={{ color:'var(--glacial)' }}>Parks</Link>
        {' → '}
        <Link href={`/parks/${slug}`} style={{ color:'var(--glacial)' }}>{park.shortName}</Link>
        {' → '} Amenities
      </div>
      <div className="eye">Amenities · {park.shortName}</div>
      <h1 className="stitle">Visitor Centers, Lodging &amp; Gear</h1>
      <p className="ssub">{pins.length} key locations — click any pin for details.</p>

      <div style={{ display:'flex', flexWrap:'wrap', gap:'.4rem', marginBottom:'1.25rem' }}>
        <button className={`mfb${filter==='all'?' act':''}`} onClick={() => setFilter('all')}>All</button>
        {types.map(t => (
          <button key={t} className={`mfb${filter===t?' act':''}`} onClick={() => setFilter(t)}>
            {TYPE_LABELS[t] || t}
          </button>
        ))}
      </div>

      <div className="map-split-layout" style={{ marginBottom:'1.5rem' }}>
        <div className="map-pane">
          <ParkMap
            pins={filtered}
            mode="amenities"
            center={[park.lat, park.lng]}
            zoom={park.zoom}
            selected={selected}
            onSelect={p => setSelected(p as ParkAmenity | null)}
            parkColor={park.heroColor}
          />
        </div>
        <div className="map-sidebar" style={{ display:'flex', flexDirection:'column', gap:'.4rem', overflowY:'auto' }}>
          {filtered.map(pin => {
            const isSel = selected?.id === pin.id;
            return (
              <div key={pin.id} onClick={() => setSelected(isSel ? null : pin)}
                style={{ background:isSel?`${park.heroColor}12`:'rgba(13,27,42,.65)',
                  border:`1px solid ${isSel?park.heroColor:'var(--cborder)'}`,
                  borderRadius:9, padding:'.75rem 1rem', cursor:'pointer', transition:'all .18s' }}>
                <div style={{ fontWeight:700, fontSize:'.82rem', marginBottom:'.2rem' }}>{pin.name}</div>
                <div style={{ fontSize:'.72rem', color:'var(--granite)', lineHeight:1.5 }}>
                  {pin.desc.length > 80 ? pin.desc.slice(0, 80) + '…' : pin.desc}
                </div>
                {pin.url && (
                  <a href={pin.url} target="_blank" rel="noopener" onClick={e => e.stopPropagation()}
                    style={{ fontSize:'.68rem', color:'var(--glacial)', fontWeight:600, display:'inline-block', marginTop:'.3rem' }}>
                    More info →
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {selected && (() => { const sel = selected as ParkAmenity; return (
        <div style={{ background:'var(--cbg)', border:`1px solid ${park.heroColor}`, borderRadius:12,
          padding:'1.25rem 1.5rem', marginBottom:'1.5rem', animation:'fadeUp .2s ease' }}>
          <div style={{ display:'flex', justifyContent:'space-between' }}>
            <h2 style={{ fontFamily:'var(--fd)', fontSize:'1.1rem', fontWeight:700 }}>{sel.name}</h2>
            <button onClick={() => setSelected(null)} style={{ background:'none', border:'none', color:'var(--granite)', fontSize:'1.2rem', cursor:'pointer' }}>✕</button>
          </div>
          <p style={{ fontSize:'.84rem', color:'rgba(242,245,247,.75)', lineHeight:1.75, marginBottom:'.75rem', marginTop:'.4rem' }}>{sel.desc}</p>
          {sel.url && <a href={sel.url} target="_blank" rel="noopener" className="bp" style={{ textDecoration:'none' }}>More Info →</a>}
        </div>
        );})()}
      <Link href={`/parks/${slug}`} style={{ fontSize:'.82rem', color:'var(--granite)', fontWeight:600 }}>← Back to {park.shortName}</Link>
    </div>
  );
}
