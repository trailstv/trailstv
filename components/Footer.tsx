'use client';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import { SITE_DATA_FALLBACK, type SiteData } from '@/lib/data';

interface LiveData {
  weather:    SiteData['weather'];
  fire:       SiteData['fire'];
  lake:       SiteData['lake'];
  ski:        SiteData['ski'];
  camping:    SiteData['camping'];
  sources:    Record<string, string>;
  lastFetch:  Date | null;
}

const INITIAL: LiveData = {
  weather:   SITE_DATA_FALLBACK.weather,
  fire:      SITE_DATA_FALLBACK.fire,
  lake:      SITE_DATA_FALLBACK.lake,
  ski:       SITE_DATA_FALLBACK.ski,
  camping:   SITE_DATA_FALLBACK.camping,
  sources:   {},
  lastFetch: null,
};

export default function Footer() {
  const [data,      setData]      = useState<LiveData>(INITIAL);
  const [loading,   setLoading]   = useState(false);
  const [year,      setYear]      = useState(2026);

  useEffect(() => { setYear(new Date().getFullYear()); }, []);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [weather, fire, lake, snow] = await Promise.allSettled([
        fetch('/api/weather').then(r => r.json()),
        fetch('/api/fire').then(r => r.json()),
        fetch('/api/lake').then(r => r.json()),
        fetch('/api/snow').then(r => r.json()),
      ]);

      setData(prev => ({
        weather:  weather.status === 'fulfilled' ? weather.value : prev.weather,
        fire:     fire.status    === 'fulfilled' ? fire.value    : prev.fire,
        lake:     lake.status    === 'fulfilled' ? lake.value    : prev.lake,
        ski:      snow.status    === 'fulfilled' ? snow.value    : prev.ski,
        camping:  prev.camping,
        sources: {
          weather: weather.status === 'fulfilled' ? weather.value.source : 'fallback',
          fire:    fire.status    === 'fulfilled' ? fire.value.source    : 'fallback',
          lake:    lake.status    === 'fulfilled' ? lake.value.source    : 'fallback',
          snow:    snow.status    === 'fulfilled' ? snow.value.source    : 'fallback',
        },
        lastFetch: new Date(),
      }));
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount, then every 30 minutes
  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchAll]);

  const d = data;

  const ticker = [
    `${d.weather.current.icon} ${d.weather.current.tempF}°F · ${d.weather.current.condition}`,
    `💧 Water ${d.weather.waterTempF}°F`,
    `🔵 Lake ${d.lake.levelFt.toLocaleString()} ft`,
    `🌿 Clarity ${d.lake.clarityFt} ft`,
    `🥾 Trails ${SITE_DATA_FALLBACK.trails.statusLabel}`,
    `⛺ ${d.camping.totalAvailable} sites available`,
    `🔥 Fire ${d.fire.restrictionLabel}`,
    `⛷️ ${d.ski.openResorts}/${d.ski.resortCount} resorts open`,
  ];
  const tickerItems = [...ticker, ...ticker];

  const lastUpdated = d.lastFetch
    ? d.lastFetch.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null;

  // Dot color for each source
  const srcDot = (src: string) => src === 'fallback' ? '🟡' : '🟢';

  return (
    <footer>
      {/* Fire alert */}
      {d.fire.alertActive && (
        <div className="footer-alert-bar">
          <span>🔥</span>
          <span>{d.fire.alertText}</span>
          <a
            href="https://www.fs.usda.gov/ltbmu/"
            target="_blank" rel="noopener"
            style={{ color:'#E24B4A', fontWeight:700, marginLeft:'auto', whiteSpace:'nowrap', textDecoration:'underline' }}
          >
            Details →
          </a>
        </div>
      )}

      {/* Ticker */}
      <div className="footer-ticker">
        <div className="ticker-label">
          <div className="ticker-dot"/>LIVE
        </div>
        <div className="ticker-track">
          {tickerItems.map((item, i) => (
            <span key={i}>{item}</span>
          ))}
        </div>
      </div>

      {/* Main body */}
      <div className="footer-body">

        {/* Brand */}
        <div>
          <div className="footer-brand-logo">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M3 19c2-4.5 4-7 7-7s4 5.5 7 5.5 4-3.2 6-3.2" stroke="#4AADBC" strokeWidth="2" strokeLinecap="round"/>
              <path d="M3 23c2-3.2 4-5 7-5s4 4 7 4 4-2.5 6-2.5" stroke="#D4A853" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="14" cy="10" r="3.2" fill="rgba(74,173,188,.68)"/>
            </svg>
            <div>
              <div className="footer-brand-tag">TrailsTV</div>
              <div className="footer-brand-name">Lake Tahoe Planner</div>
            </div>
          </div>
          <p className="footer-brand-desc">
            The complete outdoor adventure planner for the Lake Tahoe basin.
            Camping, hiking, kayaking, skiing, boating — all four seasons, powered by live data.
          </p>
        </div>

        {/* Explore */}
        <div>
          <div className="footer-col-title">Explore</div>
          <ul className="footer-links">
            <li><Link href="/campsites">⛺ Find Campsites</Link></li>
            <li><Link href="/activities">🥾 Hiking Trails</Link></li>
            <li><Link href="/activities">🚵 Mountain Biking</Link></li>
            <li><Link href="/activities">🛶 Kayaking</Link></li>
            <li><Link href="/activities">⛷️ Skiing &amp; Riding</Link></li>
            <li><Link href="/activities">🏔️ Snowshoeing</Link></li>
          </ul>
        </div>

        {/* Plan */}
        <div>
          <div className="footer-col-title">Plan</div>
          <ul className="footer-links">
            <li><Link href="/map">📍 Amenities Map</Link></li>
            <li><Link href="/trails">🗺️ Trail Map</Link></li>
            <li><a href="https://www.recreation.gov" target="_blank" rel="noopener">🏕️ Recreation.gov ↗</a></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <div className="footer-col-title">Resources</div>
          <ul className="footer-links">
            <li><a href="https://www.fs.usda.gov/ltbmu/" target="_blank" rel="noopener">🌲 USFS Lake Tahoe ↗</a></li>
            <li><a href="https://tahoeoutdoorstv.com" target="_blank" rel="noopener">📰 TahoeOutdoorsTV ↗</a></li>
            <li><a href="https://laketahoewatertrail.org" target="_blank" rel="noopener">🛶 Water Trail Map ↗</a></li>
            <li><a href="https://parks.nv.gov" target="_blank" rel="noopener">🌿 NV State Parks ↗</a></li>
            <li><a href="https://visitlaketahoe.com" target="_blank" rel="noopener">📍 Visit Lake Tahoe ↗</a></li>
            <li><a href="https://tahoebonanza.com" target="_blank" rel="noopener">📰 Tahoe Bonanza ↗</a></li>
          </ul>
        </div>

        {/* Live conditions */}
        <div>
          <div className="footer-col-title">Live Conditions</div>
          <div className="footer-live">
            {[
              ['Water Temp',        `${d.weather.waterTempF}°F`,                                    'flr-good'],
              ["Today's High",      `${d.weather.current.tempF}°F`,                                 ''],
              ['Sites Available',   `${d.camping.totalAvailable}`,                                  'flr-good'],
              ['Trail Status',      SITE_DATA_FALLBACK.trails.statusLabel,                          'flr-good'],
              ['Snow Base',         d.ski.baseDepthIn > 0 ? `${d.ski.baseDepthIn}"` : 'Off-season', ''],
              ['Fire Restrictions', d.fire.restrictionLabel,                                        ''],
              ['Lake Level',        `${d.lake.levelFt.toLocaleString()} ft`,                        ''],
            ].map(([label, val, cls]) => (
              <div key={label} className="footer-live-row">
                <span className="flr-label">{label}</span>
                <span className={`flr-val ${cls}`}>{val}</span>
              </div>
            ))}
          </div>

          <button
            className="footer-refresh-btn"
            onClick={fetchAll}
            disabled={loading}
          >
            {loading ? '⟳ Refreshing…' : '↻ Refresh Data'}
          </button>

          {lastUpdated && (
            <div style={{ fontSize:'.64rem', color:'rgba(139,158,168,.45)', marginTop:'.4rem' }}>
              Updated {lastUpdated}
              {d.sources.weather && d.sources.weather !== 'fallback' && (
                <span style={{ marginLeft:'.4rem' }}>{srcDot(d.sources.weather)}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop:'1px solid rgba(74,173,188,.1)', padding:'1.1rem 3rem', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'.75rem' }}>
        <div className="footer-legal">
          {[
            ['/privacy-policy','Privacy Policy'],
            ['/terms','Terms of Service'],
            ['/cookies','Cookie Policy'],
            ['/accessibility','Accessibility'],
            ['/contact','Contact Us'],
          ].map(([href, label]) => (
            <Link key={label} href={href}>{label}</Link>
          ))}
        </div>
        <div style={{ fontSize:'.7rem', color:'rgba(139,158,168,.5)' }}>
          © {year} <a href="https://trailstv.com" style={{ color:'var(--glacial)', textDecoration:'none', fontWeight:600 }}>TrailsTV.com</a> · Lake Tahoe Planner
        </div>
      </div>
    </footer>
  );
}
