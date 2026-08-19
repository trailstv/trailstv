'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Footer() {
  const [year, setYear] = useState(2026);
  useEffect(() => { setYear(new Date().getFullYear()); }, []);

  return (
    <footer style={{ background:'rgba(9,20,32,.95)', borderTop:'1px solid var(--cborder)', marginTop:'auto' }}>
      <div className="sw" style={{ padding:'2.5rem 2rem 1.5rem', display:'flex', flexDirection:'column', gap:'2rem' }}>

        {/* Top row */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:'2rem' }}>
          <div>
            <div style={{ fontFamily:'var(--fd)', fontSize:'1.1rem', fontWeight:900, marginBottom:'.5rem' }}>
              Trails<span style={{ color:'var(--glacial)' }}>TV</span>
            </div>
            <div style={{ fontSize:'.78rem', color:'var(--granite)', lineHeight:1.7 }}>
              Hiking, MTB, camping, kayaking, climbing, and wildlife maps for every national park in the continental US.
            </div>
          </div>

          <div>
            <div style={{ fontSize:'.68rem', fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color:'var(--glacial)', marginBottom:'.75rem' }}>Parks</div>
            <div style={{ display:'flex', flexDirection:'column', gap:'.35rem' }}>
              {[
                ['Grand Canyon',          '/parks/grand-canyon'],
                ['Great Smoky Mountains', '/parks/great-smoky-mountains'],
                ['Yellowstone',           '/parks/yellowstone'],
                ['Yosemite',              '/parks/yosemite'],
                ['Zion',                  '/parks/zion'],
                ['All Parks →',           '/'],
              ].map(([label, href]) => (
                <Link key={href} href={href} style={{ fontSize:'.78rem', color:'var(--granite)', fontWeight:500 }}>
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize:'.68rem', fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color:'var(--glacial)', marginBottom:'.75rem' }}>Activities</div>
            <div style={{ display:'flex', flexDirection:'column', gap:'.35rem' }}>
              {['Hiking','Mountain Biking','Camping','Kayaking','Rock Climbing','Wildlife Viewing'].map(a => (
                <span key={a} style={{ fontSize:'.78rem', color:'var(--granite)' }}>{a}</span>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize:'.68rem', fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color:'var(--glacial)', marginBottom:'.75rem' }}>Site</div>
            <div style={{ display:'flex', flexDirection:'column', gap:'.35rem' }}>
              {[
                ['Pricing',        '/pricing'],
                ['About',          '/about'],
                ['Privacy Policy', '/privacy-policy'],
                ['Terms',          '/terms'],
              ].map(([label, href]) => (
                <Link key={href} href={href} style={{ fontSize:'.78rem', color:'var(--granite)' }}>{label}</Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop:'1px solid var(--cborder)', paddingTop:'1rem', display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:'.5rem' }}>
          <div style={{ fontSize:'.72rem', color:'var(--granite)' }}>
            © {year} TrailsTV · Map data © OpenStreetMap contributors
          </div>
          <div style={{ fontSize:'.72rem', color:'var(--granite)' }}>
            Trail & conditions data: NPS Data API · Recreation.gov · Open-Meteo
          </div>
        </div>
      </div>
    </footer>
  );
}
