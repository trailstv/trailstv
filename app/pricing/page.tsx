'use client';
import { useState } from 'react';
import Link from 'next/link';

const FREE_FEATS  = ['Interactive campsite map','7-day weather forecast','Activity overview (12 activities)','Fire restriction alerts','Live lake conditions','Basic trail status'];
const BASIC_FEATS = ['Everything in Free','Kayak & bike rental directory','Live campsite availability alerts','Activity depth guides & tips','Campsite permit guides','Fishing charter listings','Ski & snow conditions','15 saved trips'];

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const monthlyPrice = 3.99;
  const annualPrice  = (monthlyPrice * 12 * 0.8 / 12).toFixed(2); // 20% off

  return (
    <div className="sw">
      <div className="eye">Membership Plans · TrailsTV Lake Tahoe Planner</div>
      <h2 className="stitle">Choose Your Tahoe</h2>
      <p className="ssub">Two simple plans. Start free, upgrade when the mountains call louder.</p>

      {/* Billing toggle */}
      <div style={{ display:'flex', alignItems:'center', gap:'.75rem', marginBottom:'2rem' }}>
        <button className={`mfb${!annual?' act':''}`} onClick={() => setAnnual(false)}>Monthly</button>
        <button className={`mfb${annual?' act':''}`}  onClick={() => setAnnual(true)}>Annual <span style={{ color:'var(--gold)', marginLeft:'.25rem' }}>Save 20%</span></button>
      </div>

      {/* Price cards */}
      <div className="price-grid">
        {/* Free */}
        <div className="pcrd">
          <div className="pcrd-tier">Free</div>
          <div className="pcrd-price">$0</div>
          <div className="pcrd-sub">Always free — no card needed</div>
          <ul className="pcrd-feats">
            {FREE_FEATS.map(f => <li key={f}>{f}</li>)}
          </ul>
          <Link href="/plan" className="bs" style={{ display:'block', textAlign:'center', padding:'10px' }}>
            Get Started Free →
          </Link>
        </div>

        {/* Basic */}
        <div className="pcrd featured">
          <div className="pcrd-badge">Most Popular</div>
          <div className="pcrd-tier" style={{ color:'var(--glacial)' }}>Basic</div>
          <div className="pcrd-price">${annual ? annualPrice : monthlyPrice}<span style={{ fontSize:'1rem', fontWeight:400, color:'var(--granite)' }}>/mo</span></div>
          <div className="pcrd-sub">
            {annual ? `$${(parseFloat(annualPrice)*12).toFixed(2)} billed annually` : 'Billed monthly · Cancel anytime'}
          </div>
          <ul className="pcrd-feats">
            {BASIC_FEATS.map(f => <li key={f}>{f}</li>)}
          </ul>
          <Link href="/plan" className="bp" style={{ display:'block', textAlign:'center', padding:'10px' }}>
            Upgrade to Basic →
          </Link>
        </div>
      </div>

      {/* Compare table */}
      <h3 style={{ fontFamily:'var(--fd)', fontSize:'1.3rem', fontWeight:700, margin:'2.5rem 0 1rem' }}>Full Feature Comparison</h3>
      <div style={{ background:'var(--cbg)', border:'1px solid var(--cborder)', borderRadius:12, overflow:'hidden', maxWidth:700 }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'.82rem' }}>
          <thead>
            <tr style={{ background:'rgba(13,27,42,.8)' }}>
              <th style={{ textAlign:'left', padding:'10px 14px', color:'var(--granite)', fontWeight:600 }}>Feature</th>
              <th style={{ textAlign:'center', padding:'10px 14px', color:'var(--granite)', fontWeight:600, width:90 }}>Free</th>
              <th style={{ textAlign:'center', padding:'10px 14px', color:'var(--glacial)', fontWeight:600, width:90 }}>Basic</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Campsite map','✓','✓'],['Weather forecast','✓','✓'],['Fire alerts','✓','✓'],['Activity overview','✓','✓'],
              ['Rental directories','—','✓'],['Live availability alerts','—','✓'],['Activity depth guides','—','✓'],
              ['Permit guides','—','✓'],['Fishing charters','—','✓'],['Ski conditions','—','✓'],
              ['Saved trips','—','15'],
            ].map(([feat, free, basic]) => (
              <tr key={feat} style={{ borderTop:'1px solid var(--cborder)' }}>
                <td style={{ padding:'9px 14px' }}>{feat}</td>
                <td style={{ textAlign:'center', color: free==='✓'?'#4ABC78':'var(--granite)' }}>{free}</td>
                <td style={{ textAlign:'center', color: basic==='✓'||basic!=='—'?'#4ABC78':'var(--granite)', fontWeight: basic!=='—'&&basic!=='✓'?700:undefined }}>{basic}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FAQ */}
      <h3 style={{ fontFamily:'var(--fd)', fontSize:'1.3rem', fontWeight:700, margin:'2.5rem 0 1rem' }}>Common Questions</h3>
      <div style={{ display:'flex', flexDirection:'column', gap:'.75rem', maxWidth:700 }}>
        {[
          ['Can I cancel anytime?','Yes — cancel from your account settings at any time. No penalties, no questions asked.'],
          ['Is my data safe?','We store only what you share. Trips and preferences are tied to your account and never sold to third parties.'],
          ['Do I need Basic to use the map?','No — the interactive campsite map, weather, and fire alerts are always free.'],
        ].map(([q, a]) => (
          <div key={q} style={{ background:'var(--cbg)', border:'1px solid var(--cborder)', borderRadius:10, padding:'1.1rem 1.25rem' }}>
            <div style={{ fontWeight:600, marginBottom:'.4rem', fontSize:'.88rem' }}>{q}</div>
            <div style={{ fontSize:'.8rem', color:'var(--granite)', lineHeight:1.65 }}>{a}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
