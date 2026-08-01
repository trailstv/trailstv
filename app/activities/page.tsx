'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ACTS_FALLBACK } from '@/lib/data';

export default function ActivitiesPage() {
  const [tier] = useState<'free' | 'basic'>('free');
  const acts = ACTS_FALLBACK;

  return (
    <div className="sw">
      <div className="eye">Activities · Lake Tahoe Basin</div>
      <h2 className="stitle">Activities in the Basin</h2>
      <p className="ssub">
        Everything the lake has to offer — all four seasons. Basic unlocks in-depth guides,
        rental directories, and live condition alerts.
      </p>

      <div className="act-grid">
        {acts.map(a => {
          const locked = a.tier === 'basic' && tier !== 'basic';
          return (
            <div key={a.name} className="act-card">
              {locked && <div className="act-lock">Basic</div>}
              <div className="act-icon">{a.icon}</div>
              <div className="act-name">{a.name}</div>
              <div className="act-desc">{a.desc}</div>
              {locked ? (
                <Link href="/pricing" style={{ display:'inline-block', marginTop:'.75rem', fontSize:'.74rem', color:'var(--gold)', fontWeight:600 }}>
                  Unlock with Basic →
                </Link>
              ) : (
                <Link href="/plan" style={{ display:'inline-block', marginTop:'.75rem', fontSize:'.74rem', color:'var(--glacial)', fontWeight:600 }}>
                  Plan this activity →
                </Link>
              )}
            </div>
          );
        })}
      </div>

      {tier === 'free' && (
        <div style={{ marginTop:'2.5rem', background:'rgba(74,173,188,.06)', border:'1px solid rgba(74,173,188,.2)', borderRadius:12, padding:'1.5rem', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem' }}>
          <div>
            <div style={{ fontWeight:700, marginBottom:'.25rem' }}>Unlock all activity guides with Basic</div>
            <div style={{ fontSize:'.8rem', color:'var(--granite)' }}>
              Rental directories, live condition alerts, permit guides — $3.99/month
            </div>
          </div>
          <Link href="/pricing" className="bp">Upgrade to Basic →</Link>
        </div>
      )}
    </div>
  );
}
