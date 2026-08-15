'use client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getPark } from '@/lib/parks';

const LABELS: Record<string, { icon:string; name:string }> = {
  hiking:      { icon:'🥾', name:'Hiking' },
  camping:     { icon:'⛺', name:'Camping' },
  mtb:         { icon:'🚵', name:'Mountain Biking' },
  climbing:    { icon:'🧗', name:'Rock Climbing' },
  fishing:     { icon:'🎣', name:'Fishing' },
  wildlife:    { icon:'🦅', name:'Wildlife Watching' },
  backpacking: { icon:'🌲', name:'Backpacking' },
  scenic:      { icon:'📸', name:'Scenic Drives' },
};

export default function ParkActivityPage() {
  const params     = useParams();
  const slug       = typeof params.park === 'string' ? params.park : '';
  const activityId = typeof params.activity === 'string' ? params.activity : '';
  const park       = getPark(slug);
  if (!park) return <div className="sw"><p>Park not found.</p></div>;

  if (activityId === 'hiking') return (
    <div className="sw" style={{ paddingTop:'2rem' }}>
      <p>Taking you to the trail map… <Link href={`/parks/${slug}/trails`} className="bp">Trail Map →</Link></p>
    </div>
  );
  if (activityId === 'camping') return (
    <div className="sw" style={{ paddingTop:'2rem' }}>
      <p>Taking you to campgrounds… <Link href={`/parks/${slug}/camping`} className="bp">Campgrounds →</Link></p>
    </div>
  );

  const act = LABELS[activityId] ?? { icon:'🗺️', name: activityId };
  return (
    <div className="sw" style={{ paddingBottom:'4rem' }}>
      <div style={{ fontSize:'.74rem', color:'var(--granite)', marginBottom:'.75rem' }}>
        <Link href="/parks" style={{ color:'var(--glacial)' }}>Parks</Link>
        {' → '}
        <Link href={`/parks/${slug}`} style={{ color:'var(--glacial)' }}>{park.shortName}</Link>
        {' → '}
        <Link href={`/parks/${slug}/activities`} style={{ color:'var(--glacial)' }}>Activities</Link>
        {' → '} {act.name}
      </div>
      <div className="eye">{act.name} · {park.shortName}</div>
      <h1 className="stitle">{act.icon} {act.name}</h1>
      <div style={{ background:'rgba(74,173,188,.06)', border:'1px solid rgba(74,173,188,.15)',
        borderRadius:12, padding:'2rem', textAlign:'center', marginTop:'1.5rem' }}>
        <div style={{ fontSize:'2.5rem', marginBottom:'.75rem' }}>{act.icon}</div>
        <div style={{ fontFamily:'var(--fd)', fontSize:'1.1rem', fontWeight:700, marginBottom:'.5rem' }}>
          {act.name} guide coming soon
        </div>
        <div style={{ fontSize:'.84rem', color:'var(--granite)', lineHeight:1.7, marginBottom:'1.25rem' }}>
          Detailed {act.name.toLowerCase()} information for {park.shortName} is being added.
        </div>
        <div style={{ display:'flex', gap:'.75rem', justifyContent:'center', flexWrap:'wrap' }}>
          <a href={park.website} target="_blank" rel="noopener" className="bp">NPS Website →</a>
          <Link href={`/parks/${slug}/activities`} className="bs">← All Activities</Link>
        </div>
      </div>
    </div>
  );
}
