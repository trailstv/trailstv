'use client';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { getPark } from '@/lib/parks';
import { ZION_CAMPGROUNDS } from '@/lib/parks/zion';
import { LAKE_TAHOE_CAMPGROUNDS } from '@/lib/parks/lake-tahoe';
import { YELLOWSTONE_CAMPGROUNDS } from '@/lib/parks/yellowstone';
import { GRAND_CANYON_CAMPGROUNDS } from '@/lib/parks/grand-canyon';
import { YOSEMITE_CAMPGROUNDS } from '@/lib/parks/yosemite';
import { GRSM_CAMPGROUNDS } from '@/lib/parks/great-smoky-mountains';
import { TAHOE_CAMPGROUNDS } from '@/lib/parks/lake-tahoe';
import { TAHOE_CAMPGROUNDS } from '@/lib/parks/lake-tahoe';
import type { ParkCampsite, ParkPin } from '@/components/ParkMap';

const ParkMap = dynamic(() => import('@/components/ParkMap'), {
  ssr: false,
  loading: () => <div className="map-container" style={{ display:'flex', alignItems:'center', justifyContent:'center' }}><div className="spin-wrap"><div className="spinner"/>Loading map…</div></div>,
});

const PARK_CAMPS: Record<string, ParkCampsite[]> = {
  'lake-tahoe':            LAKE_TAHOE_CAMPGROUNDS,
  zion:                    ZION_CAMPGROUNDS,
  yellowstone:             YELLOWSTONE_CAMPGROUNDS,
  'grand-canyon':          GRAND_CANYON_CAMPGROUNDS,
  yosemite:                YOSEMITE_CAMPGROUNDS,
  'great-smoky-mountains': GRSM_CAMPGROUNDS,
  'lake-tahoe':             TAHOE_CAMPGROUNDS,
};

export default function ParkCampingPage() {
  const params = useParams();
  const slug   = typeof params.park === 'string' ? params.park : '';
  const park   = getPark(slug);
  const baseCamps: ParkCampsite[] = PARK_CAMPS[slug] ?? [];

  const [camps,    setCamps]    = useState<ParkCampsite[]>(baseCamps);
  const [selected, setSelected] = useState<ParkPin | null>(null);
  const [loading,  setLoading]  = useState(false);

  useEffect(() => {
    const recgov = baseCamps.filter(c => c.facilityId && !c.note?.includes('Permit'));
    if (!recgov.length) return;
    setLoading(true);
    Promise.allSettled(
      recgov.map((c: any) =>
        fetch(`/api/campsites?facilityId=${c.facilityId}`)
          .then(r => r.json())
          .then((d: any) => ({ id: c.id, available: d.available, total: d.total }))
      )
    ).then(results => {
      const liveMap: Record<string, { available: number; total: number }> = {};
      results.forEach(r => { if (r.status === 'fulfilled') liveMap[r.value.id] = r.value; });
      setCamps(baseCamps.map(c => {
        const live = liveMap[c.id];
        if (!live) return c;
        return {
          ...c,
          available: live.available,
          sites:     live.total || c.sites,
          full:      live.available === 0,
          limited:   live.available > 0 && live.available <= 5,
        };
      }));
      setLoading(false);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  if (!park) return <div className="sw"><p>Park not found. <Link href="/parks" className="bp">← All Parks</Link></p></div>;

  return (
    <div className="sw" style={{ paddingBottom:'4rem' }}>
      <div style={{ fontSize:'.74rem', color:'var(--granite)', marginBottom:'.75rem' }}>
        <Link href="/parks" style={{ color:'var(--glacial)' }}>Parks</Link>
        {' → '}
        <Link href={`/parks/${slug}`} style={{ color:'var(--glacial)' }}>{park.shortName}</Link>
        {' → '} Camping
      </div>
      <div className="eye">Camping · {park.shortName}</div>
      <h1 className="stitle">Campgrounds</h1>
      <p className="ssub">{camps.length} campgrounds{loading ? ' · Checking live availability…' : ''}</p>

      {/* Map */}
      <div style={{ marginBottom:'1.5rem' }}>
        <ParkMap
          pins={camps}
          mode="camping"
          center={[park.lat, park.lng]}
          zoom={park.zoom}
          selected={selected}
          onSelect={p => setSelected(p as ParkCampsite | null)}
          parkColor={park.heroColor}
        />
      </div>

      {/* Campground cards */}
      <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
        {camps.map(c => {
          const isSel = selected?.id === c.id;
          const avail = c.available;
          const statusColor = c.full ? '#E05050' : c.limited ? '#E0B85C' : '#4ABC78';
          const statusLabel = avail === undefined ? null
            : c.full    ? '● Full'
            : c.limited ? `● ${avail} left`
            : '● Available';

          return (
            <div key={c.id} onClick={() => setSelected(isSel ? null : c)}
              style={{ background:isSel?'rgba(74,173,188,.06)':'rgba(13,27,42,.65)',
                border:`1px solid ${isSel?'var(--glacial)':'var(--cborder)'}`,
                borderRadius:12, padding:'1.25rem 1.5rem', cursor:'pointer', transition:'all .18s' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'1rem', marginBottom:'.5rem' }}>
                <div>
                  <h3 style={{ fontFamily:'var(--fd)', fontSize:'1rem', fontWeight:700, marginBottom:'.2rem' }}>{c.name}</h3>
                  <div style={{ fontSize:'.74rem', color:'var(--granite)' }}>
                    {c.sites} sites · {c.hookups ? 'Hookups available' : 'No hookups'}
                    {c.res ? ' · Reservable' : ' · First-come'}
                    {c.fee > 0 ? ` · $${c.fee}/night` : ' · Free'}
                  </div>
                </div>
                {statusLabel && (
                  <span style={{ background:`${statusColor}20`, color:statusColor,
                    borderRadius:6, padding:'3px 10px', fontSize:'.76rem', fontWeight:700, flexShrink:0 }}>
                    {statusLabel}
                  </span>
                )}
              </div>
              <p style={{ fontSize:'.82rem', color:'rgba(242,245,247,.72)', lineHeight:1.7, marginBottom:'.85rem' }}>{c.desc}</p>
              {c.note && (
                <div style={{ background:'rgba(224,184,92,.07)', border:'1px solid rgba(224,184,92,.2)',
                  borderRadius:7, padding:'.5rem .85rem', fontSize:'.76rem', color:'#E0B85C', marginBottom:'.75rem' }}>
                  ⚠ {c.note}
                </div>
              )}
              <a href={c.url} target="_blank" rel="noopener" onClick={e => e.stopPropagation()}
                className="bp" style={{ textDecoration:'none' }}>
                {c.res ? 'Book on Recreation.gov →' : 'More Info →'}
              </a>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop:'2rem', background:'rgba(74,173,188,.06)', border:'1px solid rgba(74,173,188,.15)',
        borderRadius:12, padding:'1.1rem 1.25rem' }}>
        <div style={{ fontWeight:700, fontSize:'.86rem', marginBottom:'.5rem', color:'var(--glacial)' }}>💡 Booking tips for {park.shortName}</div>
        <div style={{ fontSize:'.8rem', color:'rgba(242,245,247,.7)', lineHeight:1.75 }}>
          Recreation.gov reservations open 6 months in advance at 7am Eastern. Set a calendar reminder
          for exactly 6 months before your target date. First-come sites fill by 9–10am on summer weekends.
        </div>
      </div>
      <div style={{ marginTop:'1.5rem' }}>
        <Link href={`/parks/${slug}`} style={{ fontSize:'.82rem', color:'var(--granite)', fontWeight:600 }}>← Back to {park.shortName}</Link>
      </div>
    </div>
  );
}
