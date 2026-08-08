'use client';
import Link from 'next/link';
import { ACTS_FALLBACK } from '@/lib/data';
import { ACTIVITY_MAPS } from '@/lib/activityLocations';

const ACT_SLUG: Record<string, string> = {
  'Camping':           'camping',
  'Hiking':            'hiking',
  'Swimming':          'swimming',
  'Kayaking':          'kayaking',
  'Boating':           'boating',
  'Mountain Biking':   'mtb',
  'Skiing & Riding':   'skiing',
  'Snowshoeing':       'snowshoeing',
  'Fishing':           'fishing',
  'Paddleboarding':    'sup',
  'Rock Climbing':     'climbing',
  'Backpacking':       'backpacking',
  'Wildlife Watching': 'wildlife',
};

export default function ActivitiesPage() {
  const acts = ACTS_FALLBACK;

  return (
    <div className="sw">
      <div className="eye">Activities · Lake Tahoe Basin</div>
      <h2 className="stitle">Activities in the Basin</h2>
      <p className="ssub">
        Everything the lake has to offer — all four seasons, all free.
        Click any activity to view a full map with locations, launch spots, rentals, and more.
      </p>

      <div className="act-grid">
        {acts.map(a => {
          const slug     = ACT_SLUG[a.name];
          const pinCount = slug && ACTIVITY_MAPS[slug] ? ACTIVITY_MAPS[slug].pins.length : 0;
          return (
            <div key={a.name} className="act-card">
              <div className="act-icon">{a.icon}</div>
              <div className="act-name">{a.name}</div>
              <div className="act-desc">{a.desc}</div>
              {slug && (
                <Link
                  href={`/activities/${slug}`}
                  style={{ display:'inline-flex', alignItems:'center', gap:'.35rem',
                    marginTop:'.75rem', fontSize:'.74rem', color:'var(--glacial)', fontWeight:600 }}
                >
                  View map
                  {pinCount > 0 && (
                    <span style={{ background:'rgba(74,173,188,.15)', color:'var(--glacial)',
                      borderRadius:10, padding:'1px 7px', fontSize:'.64rem' }}>
                      {pinCount} locations
                    </span>
                  )}
                  →
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
