import Link from 'next/link';
import { PARK_LIST } from '@/lib/parks';

export const metadata = { title: 'Parks — TrailsTV' };

export default function ParksPage() {
  return (
    <div className="sw" style={{ paddingBottom:'4rem' }}>
      <div className="eye">6 Destinations</div>
      <h1 className="stitle">Choose Your Destination</h1>
      <p className="ssub">
        Trails, camping, permits, live conditions, and weather — all in one place.
      </p>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'1.25rem', marginTop:'1.5rem' }}>
        {PARK_LIST.map(park => (
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
