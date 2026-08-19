'use client';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { getPark } from '@/lib/parks';
import type { ParkPin } from '@/components/ParkMap';

const ParkMap = dynamic(() => import('@/components/ParkMap'), {
  ssr: false,
  loading: () => <div style={{ height:400, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(13,27,42,.7)' }}><div className="spin-wrap"><div className="spinner"/>Loading map…</div></div>,
});

export default function KayakingPage() {
  const params = useParams();
  const slug   = typeof params.park === 'string' ? params.park : '';
  const park   = getPark(slug);
  const [selected, setSelected] = useState<ParkPin | null>(null);

  if (!park) return <div className="sw"><p>Park not found. <Link href="/" className="bp">← All Parks</Link></p></div>;

  return (
    <div className="sw" style={{ paddingBottom:'4rem' }}>
      <div style={{ fontSize:'.74rem', color:'var(--granite)', marginBottom:'.75rem' }}>
        <Link href={`/parks/${slug}`} style={{ color:'var(--glacial)' }}>{park.shortName}</Link>
        {' → '} Kayaking & Paddling
      </div>
      <div className="eye">Kayaking & Paddling · {park.shortName}</div>
      <h1 className="stitle">🛶 Kayaking & Paddling</h1>
      <p className="ssub">Put-ins, take-outs, and river/lake access points.</p>

      <div style={{ background:'rgba(74,173,188,.06)', border:'1px solid rgba(74,173,188,.15)',
        borderRadius:12, padding:'2rem', textAlign:'center', marginTop:'1.5rem' }}>
        <div style={{ fontSize:'2.5rem', marginBottom:'.75rem' }}>🗺️</div>
        <div style={{ fontFamily:'var(--fd)', fontSize:'1.1rem', fontWeight:700, marginBottom:'.5rem' }}>
          Kayaking & Paddling Map — {park.shortName}
        </div>
        <div style={{ fontSize:'.84rem', color:'var(--granite)', lineHeight:1.7, marginBottom:'1.25rem', maxWidth:480, margin:'0 auto .75rem' }}>
          Put-ins, take-outs, and river/lake access points. Data for {park.shortName} loads from NPS and third-party sources.
          Interactive pins will appear here with location details, ratings, and permit information.
        </div>
        <div style={{ display:'flex', gap:'.75rem', justifyContent:'center', flexWrap:'wrap' }}>
          <a href={park.website} target="_blank" rel="noopener" className="bp">NPS Website →</a>
          <Link href={`/parks/${slug}`} className="bs">← Park Overview</Link>
        </div>
      </div>
    </div>
  );
}
