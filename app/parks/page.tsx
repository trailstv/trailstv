import Link from 'next/link';
import { PARK_LIST } from '@/lib/parks';

export const metadata = { title: 'National Parks — TrailsTV' };

export default function ParksPage() {
  const tahoe = PARK_LIST.find(p => p.slug === 'lake-tahoe');
  const tahoeCard = tahoe ? (
    <Link href="/parks/lake-tahoe" style={{ textDecoration:'none', color:'inherit', display:'block', marginBottom:'1.25rem', marginTop:'1.5rem' }}>
      <div className="act-card" style={{ padding:0, overflow:'hidden', cursor:'pointer', borderColor:'var(--glacial)' }}>
        <div style={{ height:6, background:tahoe.heroColor }}/>
        <div style={{ padding:'1.5rem 1.75rem' }}>
          <div style={{ fontSize:'.65rem', fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color:'var(--glacial)', marginBottom:'.4rem' }}>
            Featured Destination · {tahoe.state}
          </div>
          <h2 style={{ fontFamily:'var(--fd)', fontSize:'1.3rem', fontWeight:800, marginBottom:'.4rem' }}>{tahoe.shortName}</h2>
          <p style={{ fontSize:'.84rem', color:'var(--granite)', lineHeight:1.7, marginBottom:'1rem', maxWidth:600 }}>{tahoe.tagline}</p>
          <div style={{ display:'flex', gap:'.5rem', flexWrap:'wrap' }}>
            <span className="camp-chip">{tahoe.annualVisits} visits/yr</span>
            <span className="camp-chip">14 campgrounds</span>
            <span className="camp-chip">33 trailheads</span>
            <span className="camp-chip">13 activity maps</span>
          </div>
          <div style={{ marginTop:'1rem', fontSize:'.74rem', color:tahoe.heroColor, fontWeight:600 }}>Explore Lake Tahoe →</div>
        </div>
      </div>
    </Link>
  ) : null;

  return (
    <div className="sw" style={{ paddingBottom:'4rem' }}>
      <div className="eye">National Parks Planner</div>
      <h1 className="stitle">America's Most Visited Parks</h1>
      <p className="ssub">
        Trails, camping, permits, live conditions, and weather for the 5 most-visited
        national parks in the US — all in one place.
      </p>

      {tahoeCard}

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'1.25rem' }}>
        {PARK_LIST.filter(park => park.slug !== 'lake-tahoe').map(park => (
          <Link key={park.slug} href={`/parks/${park.slug}`} style={{ textDecoration:'none', color:'inherit' }}>
            <div className="act-card" style={{ padding:0, overflow:'hidden', cursor:'pointer' }}>
              <div style={{ height:6, background:park.heroColor }}/>
              <div style={{ padding:'1.25rem 1.5rem' }}>
                <div style={{ fontSize:'.68rem', fontWeight:700, letterSpacing:'.12em',
                  textTransform:'uppercase', color:park.heroColor, marginBottom:'.4rem' }}>
                  {park.state}
                </div>
                <h2 style={{ fontFamily:'var(--fd)', fontSize:'1.1rem', fontWeight:800,
                  marginBottom:'.35rem', lineHeight:1.2 }}>
                  {park.shortName}
                </h2>
                <p style={{ fontSize:'.78rem', color:'var(--granite)', lineHeight:1.65, marginBottom:'.85rem' }}>
                  {park.tagline}
                </p>
                <div style={{ display:'flex', gap:'.5rem', flexWrap:'wrap', marginBottom:'.85rem' }}>
                  <span className="camp-chip">{park.annualVisits} visits/yr</span>
                  <span className="camp-chip">{park.acreage} acres</span>
                  {park.permitRequired && (
                    <span style={{ background:'rgba(224,184,92,.1)', color:'#E0B85C',
                      borderRadius:5, padding:'1px 7px', fontSize:'.64rem', fontWeight:600 }}>
                      ⚠ Permit required
                    </span>
                  )}
                  {park.entranceFee.startsWith('Free') && (
                    <span style={{ background:'rgba(74,188,120,.1)', color:'#4ABC78',
                      borderRadius:5, padding:'1px 7px', fontSize:'.64rem', fontWeight:600 }}>
                      ✓ Free entry
                    </span>
                  )}
                </div>
                <div style={{ fontSize:'.74rem', color:park.heroColor, fontWeight:600 }}>
                  Explore →
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
