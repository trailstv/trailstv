import Link from 'next/link';

export const metadata = { title: 'About — TrailsTV Lake Tahoe Planner' };

export default function AboutPage() {
  return (
    <div className="sw" style={{ maxWidth: 760, paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div className="eye">About TrailsTV</div>
      <h1 className="stitle">The Lake Tahoe Basin in One Place</h1>

      <div style={{ fontSize: '.92rem', lineHeight: 1.85, color: 'rgba(242,245,247,.8)' }}>
        <p style={{ marginBottom: '1.5rem' }}>
          TrailsTV started as a simple idea: Lake Tahoe is one of the most extraordinary outdoor destinations on earth, and the information about it is scattered across dozens of agency websites, PDF brochures, and recreation apps. We built the Lake Tahoe Planner to fix that.
        </p>
        <p style={{ marginBottom: '1.5rem' }}>
          Everything in one place — live campsite availability from Recreation.gov and ReserveCalifornia, weather from OpenWeatherMap, lake level from the USGS gauge at Tahoe City, fire restrictions from the USFS Lake Tahoe Basin Management Unit, and snow depth from the NRCS SNOTEL network. All the data that used to require six browser tabs, in one dashboard that updates automatically.
        </p>

        <h2 style={{ fontFamily: 'var(--fd)', fontSize: '1.2rem', fontWeight: 700, margin: '2rem 0 .75rem' }}>What We Cover</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '.5rem', marginBottom: '1.5rem' }}>
          {[
            '⛺ 14 verified campgrounds',
            '🥾 33 hiking trailheads',
            '🚵 16 MTB trail systems',
            '🛶 21 kayak launch spots',
            '⛵ 20 marinas & boat ramps',
            '⛷️ 16 ski resorts',
            '🎣 18 fishing locations',
            '🧗 12 climbing crags',
            '🌿 34 amenity locations',
            '🌡️ Live weather & forecast',
            '🔥 Fire restriction alerts',
            '🔵 Live lake level data',
          ].map(item => (
            <div key={item} style={{ background: 'rgba(13,27,42,.6)', border: '1px solid var(--cborder)', borderRadius: 8, padding: '.6rem .85rem', fontSize: '.8rem' }}>
              {item}
            </div>
          ))}
        </div>

        <h2 style={{ fontFamily: 'var(--fd)', fontSize: '1.2rem', fontWeight: 700, margin: '2rem 0 .75rem' }}>Our Data Sources</h2>
        <p style={{ marginBottom: '1rem' }}>
          We don't invent data — we aggregate it from authoritative federal and state sources and surface it in a way that's actually useful for planning a trip.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.4rem', marginBottom: '1.5rem' }}>
          {[
            ['Recreation.gov & ReserveCalifornia', 'Live campsite availability and booking'],
            ['USGS Gauge 10337000', 'Lake Tahoe water level, measured at Tahoe City since 1900'],
            ['USFS Lake Tahoe Basin Management Unit', 'Fire restrictions, trail closures, permit requirements'],
            ['NRCS SNOTEL Network', 'Snow depth across the basin — Mt. Rose, Donner, Rubicon'],
            ['OpenWeatherMap', 'Current conditions and 7-day forecast'],
            ['OpenStreetMap / Overpass API', 'Trailhead locations and trail data'],
            ['TahoeOutdoorsTV', 'Trail guides and activity content'],
          ].map(([source, desc]) => (
            <div key={source} style={{ display: 'flex', gap: '1rem', padding: '.5rem 0', borderBottom: '1px solid var(--cborder)', fontSize: '.82rem' }}>
              <span style={{ fontWeight: 600, minWidth: 280, color: 'var(--glacial)' }}>{source}</span>
              <span style={{ color: 'var(--granite)' }}>{desc}</span>
            </div>
          ))}
        </div>

        <h2 style={{ fontFamily: 'var(--fd)', fontSize: '1.2rem', fontWeight: 700, margin: '2rem 0 .75rem' }}>A Note on Accuracy</h2>
        <p style={{ marginBottom: '1.5rem' }}>
          Trail conditions, campsite availability, and fire restrictions change quickly. We cache data at appropriate intervals — campsite availability every 15 minutes, weather every 30 minutes, fire restrictions every hour, lake level every 6 hours. Always verify critical safety information directly with the USFS or relevant agency before heading into the backcountry.
        </p>

        <h2 style={{ fontFamily: 'var(--fd)', fontSize: '1.2rem', fontWeight: 700, margin: '2rem 0 .75rem' }}>Get in Touch</h2>
        <p>
          Questions, corrections, or suggestions? We want to hear from you — especially if you spot data that needs updating.
        </p>
        <div style={{ display: 'flex', gap: '.75rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
          <Link href="/contact" className="bp">Contact Us →</Link>
          <a href="https://trailstv.com" target="_blank" rel="noopener" className="bs">TrailsTV.com ↗</a>
        </div>
      </div>
    </div>
  );
}
