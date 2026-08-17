'use client';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { getPark } from '@/lib/parks';
import { ZION_TRAILS } from '@/lib/parks/zion';
import { YELLOWSTONE_TRAILS } from '@/lib/parks/yellowstone';
import { GRAND_CANYON_TRAILS } from '@/lib/parks/grand-canyon';
import { YOSEMITE_TRAILS } from '@/lib/parks/yosemite';
import { GRSM_TRAILS } from '@/lib/parks/great-smoky-mountains';
import type { ParkTrail, ParkPin } from '@/components/ParkMap';

const ParkMap = dynamic(() => import('@/components/ParkMap'), {
  ssr: false,
  loading: () => <div className="map-container" style={{ display:'flex', alignItems:'center', justifyContent:'center' }}><div className="spin-wrap"><div className="spinner"/>Loading map…</div></div>,
});

type Difficulty = 'all' | 'Easy' | 'Moderate' | 'Strenuous' | 'Expert';

const DIFF_COLORS: Record<string, string> = {
  Easy:'#4ABC78', Moderate:'#4AADBC', Strenuous:'#E0B85C', Expert:'#E05050',
};

const PARK_TRAILS: Record<string, ParkTrail[]> = {
  zion:                    ZION_TRAILS,
  yellowstone:             YELLOWSTONE_TRAILS,
  'grand-canyon':          GRAND_CANYON_TRAILS,
  yosemite:                YOSEMITE_TRAILS,
  'great-smoky-mountains': GRSM_TRAILS,
};

export default function ParkTrailsPage() {
  const params    = useParams();
  const slug      = typeof params.park === 'string' ? params.park : '';
  const park      = getPark(slug);
  const [diff,     setDiff]     = useState<Difficulty>('all');
  const [selected, setSelected] = useState<ParkPin | null>(null);

  if (!park) return <div className="sw"><p>Park not found. <Link href="/parks" className="bp">← All Parks</Link></p></div>;

  const allTrails = PARK_TRAILS[slug] ?? [];
  const filtered  = allTrails.filter(t => diff === 'all' || t.difficulty === diff);

  return (
    <div className="sw" style={{ paddingBottom:'4rem' }}>
      <div style={{ fontSize:'.74rem', color:'var(--granite)', marginBottom:'.75rem' }}>
        <Link href="/parks" style={{ color:'var(--glacial)' }}>Parks</Link>
        {' → '}
        <Link href={`/parks/${slug}`} style={{ color:'var(--glacial)' }}>{park.shortName}</Link>
        {' → '} Trails
      </div>
      <div className="eye">Trails · {park.shortName}</div>
      <h1 className="stitle">Trail Map</h1>
      <p className="ssub">{allTrails.length} verified trails — click any pin for details.</p>

      {/* Difficulty legend */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:'.5rem', marginBottom:'1rem' }}>
        {Object.entries(DIFF_COLORS).map(([d, color]) => (
          <span key={d} style={{ display:'flex', alignItems:'center', gap:4, fontSize:'.72rem', fontWeight:600 }}>
            <span style={{ width:10, height:10, borderRadius:'50%', background:color, display:'inline-block' }}/>
            {d}
          </span>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:'.4rem', marginBottom:'1.25rem' }}>
        {(['all','Easy','Moderate','Strenuous','Expert'] as Difficulty[]).map(d => (
          <button key={d} className={`mfb${diff===d?' act':''}`} onClick={() => setDiff(d)}
            style={{ borderColor:d!=='all'&&diff===d?DIFF_COLORS[d]:undefined, color:d!=='all'&&diff===d?DIFF_COLORS[d]:undefined }}>
            {d === 'all' ? 'All Levels' : d}
          </button>
        ))}
      </div>

      {/* Map + sidebar */}
      <div className="map-split-layout" style={{ marginBottom:'1.5rem' }}>
        <div className="map-pane">
          <ParkMap
            pins={filtered}
            mode="trails"
            center={[park.lat, park.lng]}
            zoom={park.zoom}
            selected={selected}
            onSelect={p => setSelected(p as ParkTrail | null)}
            parkColor={park.heroColor}
          />
          <div style={{ position:'absolute', bottom:10, left:10, zIndex:500,
            background:'rgba(13,27,42,.88)', border:'1px solid var(--cborder)',
            borderRadius:7, padding:'4px 10px', fontSize:'.72rem', color:'var(--snow)' }}>
            {filtered.length} trail{filtered.length!==1?'s':''} shown
          </div>
        </div>
        <div className="map-sidebar" style={{ display:'flex', flexDirection:'column', gap:'.4rem', overflowY:'auto' }}>
          {filtered.map(t => {
            const isSel = selected?.id === t.id;
            const color = DIFF_COLORS[t.difficulty] ?? '#8B9EA8';
            return (
              <div key={t.id} onClick={() => setSelected(isSel ? null : t)}
                style={{ background:isSel?`${color}12`:'rgba(13,27,42,.65)',
                  border:`1px solid ${isSel?color:'var(--cborder)'}`,
                  borderRadius:9, padding:'.75rem 1rem', cursor:'pointer', transition:'all .18s' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'.5rem' }}>
                  <div style={{ fontWeight:700, fontSize:'.82rem' }}>{t.name}</div>
                  <span style={{ background:`${color}20`, color, borderRadius:4, padding:'1px 6px', fontSize:'.64rem', fontWeight:700, flexShrink:0 }}>
                    {t.difficulty}
                  </span>
                </div>
                <div style={{ fontSize:'.7rem', color:'var(--granite)', marginTop:'.2rem' }}>
                  {t.distanceMi ? `${t.distanceMi} mi` : ''}
                  {t.elevGainFt ? ` · +${t.elevGainFt.toLocaleString()} ft` : ''}
                </div>
                {t.note && <div style={{ fontSize:'.68rem', color:'#E0B85C', marginTop:'.25rem' }}>⚠ {t.note}</div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected detail panel */}
      {selected && (() => { const sel = selected as ParkTrail; return (
        <div style={{ background:'var(--cbg)', border:`1px solid ${DIFF_COLORS[selected.difficulty]||'var(--cborder)'}`,
          borderRadius:12, padding:'1.25rem 1.5rem', marginBottom:'1.5rem', animation:'fadeUp .2s ease' }}>
          <div style={{ display:'flex', justifyContent:'space-between' }}>
            <div>
              <div className="eye">
                {sel.difficulty}
                {sel.distanceMi ? ` · ${selected.distanceMi} mi RT` : ''}
                {sel.elevGainFt ? ` · +${selected.elevGainFt.toLocaleString()} ft` : ''}
              </div>
              <h2 style={{ fontFamily:'var(--fd)', fontSize:'1.2rem', fontWeight:700, marginBottom:'.4rem' }}>{sel.name}</h2>
            </div>
            <button onClick={() => setSelected(null)} style={{ background:'none', border:'none', color:'var(--granite)', fontSize:'1.2rem', cursor:'pointer' }}>✕</button>
          </div>
          <p style={{ fontSize:'.84rem', color:'rgba(242,245,247,.75)', lineHeight:1.75, marginBottom:'.75rem' }}>{sel.desc}</p>
          {sel.note && (
            <div style={{ background:'rgba(224,184,92,.08)', border:'1px solid rgba(224,184,92,.2)',
              borderRadius:7, padding:'.6rem .85rem', fontSize:'.78rem', color:'#E0B85C', marginBottom:'.75rem' }}>
              ⚠ {sel.note}
            </div>
          )}
          {sel.url && <a href={sel.url} target="_blank" rel="noopener" className="bp" style={{ textDecoration:'none' }}>Permits &amp; Info →</a>}
        </div>
      )}
      <Link href={`/parks/${slug}`} style={{ fontSize:'.82rem', color:'var(--granite)', fontWeight:600 }}>← Back to {park.shortName}</Link>
    </div>
  );
}
