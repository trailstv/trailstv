'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { SITE_DATA_FALLBACK, type SiteData } from '@/lib/data';

export default function Footer() {
  const [data, setData]   = useState<SiteData>(SITE_DATA_FALLBACK);
  const [year,  setYear]  = useState(2026);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const ticker = [
    `☀️ ${data.weather.current.tempF}°F · ${data.weather.current.condition}`,
    `💧 Water ${data.weather.waterTempF}°F`,
    `🔵 Lake ${data.lake.levelFt.toLocaleString()} ft`,
    `🌿 Clarity ${data.lake.clarityFt} ft`,
    `🥾 Trails ${data.trails.statusLabel}`,
    `⛺ ${data.camping.totalAvailable} sites available`,
    `🔥 Fire ${data.fire.restrictionLabel}`,
    `⛷️ ${data.ski.openResorts}/${data.ski.resortCount} resorts open`,
  ];
  // Double for seamless loop
  const tickerItems = [...ticker, ...ticker];

  return (
    <footer>
      {/* Fire alert */}
      {data.fire.alertActive && (
        <div className="footer-alert-bar">
          <span className="footer-alert-icon">🔥</span>
          <span>{data.fire.alertText}</span>
          <a href="https://www.fs.usda.gov/ltbmu/" target="_blank" rel="noopener"
             style={{ color:'#E24B4A', fontWeight:700, marginLeft:'auto', whiteSpace:'nowrap', textDecoration:'underline' }}>
            Details →
          </a>
        </div>
      )}

      {/* Ticker */}
      <div className="footer-ticker">
        <div className="ticker-label"><div className="ticker-dot"/>LIVE</div>
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
          <div className="footer-social">
            {[
              ['https://instagram.com/trailstv',  '📸', 'Instagram'],
              ['https://youtube.com/@trailstv',   '▶',  'YouTube'],
              ['https://facebook.com/trailstv',   'f',  'Facebook'],
              ['https://twitter.com/trailstv',    '𝕏',  'X / Twitter'],
              ['https://tiktok.com/@trailstv',    '♪',  'TikTok'],
            ].map(([href, icon, title]) => (
              <a key={title as string} href={href as string} target="_blank" rel="noopener"
                 className="footer-social-btn" title={title as string}>
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* Explore */}
        <div>
          <div className="footer-col-title">Explore</div>
          <ul className="footer-links">
            {[
              ['/campsites', '⛺ Find Campsites'],
              ['/activities','🥾 Hiking Trails'],
              ['/activities','🚵 Mountain Biking'],
              ['/activities','🛶 Kayaking'],
              ['/activities','⛷️ Skiing & Riding'],
              ['/activities','🏔️ Snowshoeing'],
            ].map(([href, label]) => (
              <li key={label}><Link href={href}>{label}</Link></li>
            ))}
          </ul>
        </div>

        {/* Plan */}
        <div>
          <div className="footer-col-title">Plan</div>
          <ul className="footer-links">
            <li><Link href="/plan">🗺️ Plan Your Trip</Link></li>
            <li><Link href="/map">📍 Amenities Map</Link></li>
            <li><Link href="/pricing">💳 Plans &amp; Pricing</Link></li>
            <li><a href="/onboarding">🚀 Get Started <span className="fl-badge fl-hot">Free</span></a></li>
            <li><a href="https://www.recreation.gov" target="_blank" rel="noopener">🏕️ Recreation.gov ↗</a></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <div className="footer-col-title">Resources</div>
          <ul className="footer-links">
            {[
              ['https://www.fs.usda.gov/ltbmu/','🌲 USFS Lake Tahoe ↗'],
              ['https://tahoeoutdoorstv.com',   '📰 TahoeOutdoorsTV ↗'],
              ['https://laketahoewatertrail.org','🛶 Water Trail Map ↗'],
              ['https://parks.nv.gov',           '🌿 NV State Parks ↗'],
              ['https://visitlaketahoe.com',     '📍 Visit Lake Tahoe ↗'],
              ['https://tahoebonanza.com',       '📰 Tahoe Bonanza ↗'],
            ].map(([href, label]) => (
              <li key={label}><a href={href} target="_blank" rel="noopener">{label}</a></li>
            ))}
          </ul>
        </div>

        {/* Live conditions */}
        <div>
          <div className="footer-col-title">Live Conditions</div>
          <div className="footer-live">
            {[
              ['Water Temp',        `${data.weather.waterTempF}°F`,              'flr-good'],
              'Today\'s High',
              ['Today\'s High',     `${data.weather.current.tempF}°F`,            ''],
              ['Sites Available',   `${data.camping.totalAvailable}`,             'flr-good'],
              ['Trail Status',      data.trails.statusLabel,                      'flr-good'],
              ['Snow Base',         data.ski.baseDepthIn > 0 ? `${data.ski.baseDepthIn}"` : 'Off-season', ''],
              ['Fire Restrictions', data.fire.restrictionLabel,                   ''],
              ['Lake Level',        `${data.lake.levelFt.toLocaleString()} ft`,   ''],
            ].filter(Array.isArray).map(([label, val, cls]) => (
              <div key={label as string} className="footer-live-row">
                <span className="flr-label">{label as string}</span>
                <span className={`flr-val ${cls as string}`}>{val as string}</span>
              </div>
            ))}
          </div>
          <button className="footer-refresh-btn">↻ Refresh Data</button>
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
