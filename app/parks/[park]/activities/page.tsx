'use client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getPark } from '@/lib/parks';

const ACTIVITIES = [
  { slug:'hiking',      icon:'🥾', name:'Hiking',             desc:'Trails, trailheads, and difficulty ratings.' },
  { slug:'camping',     icon:'⛺', name:'Camping',             desc:'Campgrounds, live availability, booking links.' },
  { slug:'mtb',         icon:'🚵', name:'Mountain Biking',     desc:'MTB-legal trails and routes in and around the park.' },
  { slug:'climbing',    icon:'🧗', name:'Rock Climbing',       desc:'Crags, routes, and gear shops near the park.' },
  { slug:'fishing',     icon:'🎣', name:'Fishing',             desc:'Lakes, rivers, and permit requirements.' },
  { slug:'wildlife',    icon:'🦅', name:'Wildlife Watching',   desc:'Prime viewing spots, best times, what to look for.' },
  { slug:'backpacking', icon:'🌲', name:'Backpacking',         desc:'Backcountry routes, permit systems, wilderness camps.' },
  { slug:'scenic',      icon:'📸', name:'Scenic Drives & Views',desc:'Key overlooks, drives, and sunset spots.' },
];

const EXCLUDED: Record<string, string[]> = {
  'grand-canyon':          ['mtb'],
  'great-smoky-mountains': ['climbing'],
  yellowstone:             ['climbing'],
  zion:                    [],
  yosemite:                [],
};

export default function ParkActivitiesPage() {
  const params = useParams();
  const slug   = typeof params.park === 'string' ? params.park : '';
  const park   = getPark(slug);
  if (!park) return <div className="sw"><p>Park not found. <Link href="/parks" className="bp">← All Parks</Link></p></div>;

  const available = ACTIVITIES.filter(a => !(EXCLUDED[slug] ?? []).includes(a.slug));

  return (
    <div className="sw" style={{ paddingBottom:'4rem' }}>
      <div style={{ fontSize:'.74rem', color:'var(--granite)', marginBottom:'.75rem' }}>
        <Link href="/parks" style={{ color:'var(--glacial)' }}>Parks</Link>
        {' → '}
        <Link href={`/parks/${slug}`} style={{ color:'var(--glacial)' }}>{park.shortName}</Link>
        {' → '} Activities
      </div>
      <div className="eye">Activities · {park.shortName}</div>
      <h1 className="stitle">What to Do in {park.shortName}</h1>
      <p className="ssub">Select an activity for locations, maps, and key info.</p>
      <div className="act-grid" style={{ marginTop:'1.5rem' }}>
        {available.map(a => (
          <Link key={a.slug} href={`/parks/${slug}/activities/${a.slug}`} style={{ textDecoration:'none', color:'inherit' }}>
            <div className="act-card" style={{ cursor:'pointer' }}>
              <div className="act-icon">{a.icon}</div>
              <div className="act-name">{a.name}</div>
              <div className="act-desc">{a.desc}</div>
              <div style={{ marginTop:'.75rem', fontSize:'.74rem', color:park.heroColor, fontWeight:600 }}>View map →</div>
            </div>
          </Link>
        ))}
      </div>
      <div style={{ marginTop:'2rem' }}>
        <Link href={`/parks/${slug}`} style={{ fontSize:'.82rem', color:'var(--granite)', fontWeight:600 }}>← Back to {park.shortName}</Link>
      </div>
    </div>
  );
}
