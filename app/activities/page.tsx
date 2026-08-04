'use client';
import Link from 'next/link';
import { ACTS_FALLBACK } from '@/lib/data';

export default function ActivitiesPage() {
  const acts = ACTS_FALLBACK;

  return (
    <div className="sw">
      <div className="eye">Activities · Lake Tahoe Basin</div>
      <h2 className="stitle">Activities in the Basin</h2>
      <p className="ssub">
        Everything the lake has to offer — all four seasons, all free.
      </p>

      <div className="act-grid">
        {acts.map(a => (
          <div key={a.name} className="act-card">
            <div className="act-icon">{a.icon}</div>
            <div className="act-name">{a.name}</div>
            <div className="act-desc">{a.desc}</div>
            <Link href="/plan" style={{ display:'inline-block', marginTop:'.75rem', fontSize:'.74rem', color:'var(--glacial)', fontWeight:600 }}>
              Plan this activity →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
