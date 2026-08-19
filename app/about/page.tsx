import Link from 'next/link';
import { PARK_LIST } from '@/lib/parks';
import { ACTIVITIES } from '@/lib/activities';

export const metadata = { title: 'About' };

export default function AboutPage() {
  return (
    <div className="sw" style={{ maxWidth:760, paddingBottom:'4rem' }}>
      <div className="eye">About TrailsTV</div>
      <h1 className="stitle">Built for people who go outside</h1>
      <p className="ssub">
        TrailsTV pulls together trail maps, campsite availability, fire restrictions, snow reports,
        and live NPS alerts for every national park in the continental US — all in one place,
        without the browser-tab juggling.
      </p>

      <h2 style={{ fontFamily:'var(--fd)', fontSize:'1.1rem', fontWeight:700, margin:'2rem 0 .75rem', color:'var(--glacial)' }}>
        {PARK_LIST.length} Parks Covered
      </h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:'.5rem', marginBottom:'2rem' }}>
        {PARK_LIST.map(park => (
          <Link key={park.slug} href={`/parks/${park.slug}`}
            style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
              background:'rgba(13,27,42,.6)', border:`1px solid ${park.heroColor}30`,
              borderLeft:`3px solid ${park.heroColor}`, borderRadius:8,
              padding:'.6rem .85rem', textDecoration:'none', color:'inherit', fontSize:'.8rem' }}>
            <span style={{ fontWeight:600 }}>{park.shortName}</span>
            <span style={{ color:park.heroColor, fontSize:'.7rem' }}>→</span>
          </Link>
        ))}
      </div>

      <h2 style={{ fontFamily:'var(--fd)', fontSize:'1.1rem', fontWeight:700, margin:'2rem 0 .75rem', color:'var(--glacial)' }}>
        {ACTIVITIES.length} Activity Maps
      </h2>
      <div style={{ display:'flex', flexWrap:'wrap', gap:'.5rem', marginBottom:'2rem' }}>
        {ACTIVITIES.map(a => (
          <span key={a.slug} style={{ background:'rgba(13,27,42,.6)', border:'1px solid var(--cborder)',
            borderRadius:20, padding:'5px 14px', fontSize:'.78rem', fontWeight:600 }}>
            {a.icon} {a.name}
          </span>
        ))}
      </div>

      <h2 style={{ fontFamily:'var(--fd)', fontSize:'1.1rem', fontWeight:700, margin:'2rem 0 .75rem', color:'var(--glacial)' }}>
        Data Sources
      </h2>
      <div style={{ display:'flex', flexDirection:'column', gap:'.5rem', marginBottom:'2rem' }}>
        {[
          ['NPS Data API',            'Park information, campgrounds, visitor centers, and alerts (developer.nps.gov)'],
          ['Recreation.gov RIDB',     'Live campsite availability and permit system integration'],
          ['Open-Meteo',              '7-day weather forecast for each park — free, no API key needed'],
          ['OpenStreetMap / Leaflet', 'All map tiles and geographic data — free forever'],
          ['USFS / NIFC',             'Fire restriction levels and active fire perimeter data'],
          ['NOAA / Open-Meteo',       'Snow depth and snowfall data for ski conditions'],
        ].map(([source, desc]) => (
          <div key={source} style={{ display:'flex', gap:'1rem', padding:'.5rem 0',
            borderBottom:'1px solid var(--cborder)', fontSize:'.82rem', flexWrap:'wrap' }}>
            <span style={{ fontWeight:600, minWidth:200, color:'var(--glacial)', flexShrink:0 }}>{source}</span>
            <span style={{ color:'var(--granite)' }}>{desc}</span>
          </div>
        ))}
      </div>

      <div style={{ display:'flex', gap:'.75rem', flexWrap:'wrap', marginTop:'2rem' }}>
        <Link href="/" className="bp">View All Parks →</Link>
        <Link href="/pricing" className="bs">See Pricing →</Link>
      </div>
    </div>
  );
}
