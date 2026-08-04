'use client';
import { useState } from 'react';
import Link from 'next/link';

const FREE_FEATURES = [
  { section:'🗺️ Explore', items:[
    { label:'Overview of all 6 core activities', included: true },
    { label:'5-day weather forecast',             included: true },
    { label:'Basic amenities map',                included: true },
    { label:'Plan Your Trip advisor',             included: true },
  ]},
  { section:'🏕️ Camping', items:[
    { label:'Campground overview & locations',  included: true  },
    { label:'Park descriptions & booking links',included: true  },
    { label:'Live site availability',           included: false },
    { label:'Fee & permit details',             included: false },
  ]},
  { section:'📋 Planning', items:[
    { label:'Save up to 2 trips',  included: true  },
    { label:'Rental directories',  included: false },
    { label:'Live campsite map',   included: false },
  ]},
];

const BASIC_FEATURES = [
  { section:'🛶 Water Activities', items:[
    'Full kayak rental directory — 8+ locations',
    'SUP rental locations mapped',
    'Top 10 paddling spots with launch info',
  ]},
  { section:'🚵 Bike Rentals', items:[
    'Bike shop directory with hours & pricing',
    'E-bike & MTB rental locations mapped',
    'Trail-to-shop pairing guide',
  ]},
  { section:'🏕️ Camping — Full Access', items:[
    'Live campsite availability map',
    '14-day availability calendar per campground',
    'Per-campground fee & permit breakdowns',
    'Bear canister requirements by zone',
    'Fire restriction alerts by zone',
  ]},
  { section:'⛵ Boating', items:[
    'Full marina directory with launch fees',
    'Boat rental guide: pontoon, ski boat, jet ski',
    'Lake conditions & wind advisories',
  ]},
  { section:'⛷️ Skiing & Winter', items:[
    'Live snow depth — all 14 resorts',
    'Lift ticket price tracker',
    'Backcountry & avalanche info',
  ]},
  { section:'📋 Advanced Planning', items:[
    'Unlimited saved trips',
    'Offline downloadable maps',
    'Multi-day route optimizer',
    'Gear checklist generator',
    'Permit filing assistance',
    'Trail condition reports',
    'Priority TrailsTV support',
  ]},
];

const COMPARE_ROWS = [
  ['Activity overviews',           '✓',       '✓'],
  ['Weather forecast',             '5-day',   '14-day'],
  ['Amenities map',                'Basic',   'Full + marina'],
  ['Kayak & bike rental guide',    '—',       '✓'],
  ['Live campsite availability',   '—',       '✓'],
  ['Camping fees & permits',       '—',       '✓'],
  ['Boating & marina guide',       '—',       '✓'],
  ['Live ski conditions',          '—',       '✓'],
  ['Offline maps',                 '—',       '✓'],
  ['Saved trips',                  '2',       'Unlimited'],
  ['Permit filing help',           '—',       '✓'],
];

const FAQS = [
  ['Can I switch plans anytime?',
   'Yes — upgrade or downgrade at any time. Changes take effect immediately and you\'re prorated for the remainder of your billing cycle.'],
  ['What does "live campsite availability" mean?',
   'Basic pulls real-time data from the Recreation.gov API and ReserveCalifornia so you see actual open sites before you make the drive.'],
  ['Will there be more tiers later?',
   'Possibly — but for now Basic includes absolutely everything. No upsells, no locked features above Basic.'],
  ['Does Basic include lift tickets?',
   'It includes live conditions, pricing info, and discount windows — actual ticket purchases are completed on each resort\'s own website.'],
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const monthly     = 3.99;
  const annualPerMo = (monthly * 0.8).toFixed(2);

  return (
    <div className="sw">
      <div className="eye">Membership Plans · TrailsTV Lake Tahoe Planner</div>
      <h2 className="stitle">Choose Your Tahoe</h2>
      <p className="ssub">Two simple plans. Start free, upgrade when the mountains call louder.</p>

      {/* Billing toggle */}
      <div style={{ display:'flex', alignItems:'center', gap:'.75rem', marginBottom:'2rem' }}>
        <button className={`mfb${!annual?' act':''}`} onClick={() => setAnnual(false)}>Monthly</button>
        <button className={`mfb${annual?' act':''}`}  onClick={() => setAnnual(true)}>Annual <span style={{ color:'var(--gold)', marginLeft:'.3rem' }}>Save 20%</span></button>
      </div>

      {/* Cards */}
      <div className="price-grid" style={{ maxWidth:900 }}>

        {/* Free */}
        <div className="pcrd">
          <div className="pcrd-tier">Free</div>
          <div className="pcrd-price">$0</div>
          <div className="pcrd-sub">forever · no card needed</div>
          <p style={{ fontSize:'.8rem', color:'var(--granite)', lineHeight:1.65, marginBottom:'1.25rem' }}>
            A bird&apos;s-eye view of Tahoe&apos;s best. Perfect for first-timers who want to explore before diving in.
          </p>
          <div style={{ fontWeight:700, fontSize:'.76rem', color:'var(--glacial)', marginBottom:'.75rem' }}>What&apos;s included</div>
          {FREE_FEATURES.map(section => (
            <div key={section.section} style={{ marginBottom:'.85rem' }}>
              <div style={{ fontSize:'.68rem', fontWeight:700, color:'var(--glacial)', marginBottom:'.35rem' }}>{section.section}</div>
              {section.items.map(item => (
                <div key={item.label} style={{ display:'flex', gap:8, fontSize:'.78rem', marginBottom:'.2rem' }}>
                  <span style={{ color: item.included ? '#4ABC78' : 'var(--cborder)', fontWeight:700, flexShrink:0 }}>
                    {item.included ? '✓' : '—'}
                  </span>
                  <span style={{ color: item.included ? 'var(--snow)' : 'var(--granite)' }}>{item.label}</span>
                </div>
              ))}
            </div>
          ))}
          <Link href="/plan" className="bs" style={{ display:'block', textAlign:'center', marginTop:'1.25rem' }}>
            Get Started Free →
          </Link>
        </div>

        {/* Basic */}
        <div className="pcrd featured">
          <div className="pcrd-badge">Most Popular</div>
          <div className="pcrd-tier" style={{ color:'var(--glacial)' }}>Basic</div>
          <div className="pcrd-price">
            ${annual ? annualPerMo : monthly.toFixed(2)}
            <span style={{ fontSize:'1rem', fontWeight:400, color:'var(--granite)' }}>/mo</span>
          </div>
          <div className="pcrd-sub">
            {annual
              ? `$${(parseFloat(annualPerMo)*12).toFixed(2)} billed annually`
              : 'billed monthly'}
          </div>
          <p style={{ fontSize:'.8rem', color:'rgba(242,245,247,.7)', lineHeight:1.65, marginBottom:'1.25rem' }}>
            Full access to everything the Lake Tahoe basin has to offer — all activities, live data, deep guides, and unlimited planning tools.
          </p>
          <div style={{ fontWeight:700, fontSize:'.76rem', color:'var(--glacial)', marginBottom:'.75rem' }}>Everything in Free, plus:</div>
          {BASIC_FEATURES.map(section => (
            <div key={section.section} style={{ marginBottom:'.85rem' }}>
              <div style={{ fontSize:'.68rem', fontWeight:700, color:'var(--glacial)', marginBottom:'.35rem' }}>{section.section}</div>
              {section.items.map(item => (
                <div key={item} style={{ display:'flex', gap:8, fontSize:'.78rem', marginBottom:'.2rem' }}>
                  <span style={{ color:'#4ABC78', fontWeight:700, flexShrink:0 }}>✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          ))}
          <Link href="/plan" className="bp" style={{ display:'block', textAlign:'center', marginTop:'1.25rem' }}>
            Start Basic →
          </Link>
        </div>
      </div>

      {/* Compare table */}
      <h3 style={{ fontFamily:'var(--fd)', fontSize:'1.3rem', fontWeight:700, margin:'2.5rem 0 1rem' }}>Quick Comparison</h3>
      <div style={{ background:'var(--cbg)', border:'1px solid var(--cborder)', borderRadius:12, overflow:'hidden', maxWidth:700 }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'.82rem' }}>
          <thead>
            <tr style={{ background:'rgba(13,27,42,.8)' }}>
              <th style={{ textAlign:'left', padding:'10px 14px', color:'var(--granite)', fontWeight:600 }}>&nbsp;</th>
              <th style={{ textAlign:'center', padding:'10px 14px', color:'var(--granite)', fontWeight:600, width:90 }}>Free</th>
              <th style={{ textAlign:'center', padding:'10px 14px', color:'var(--glacial)', fontWeight:700, width:90 }}>Basic</th>
            </tr>
          </thead>
          <tbody>
            {COMPARE_ROWS.map(([feat, free, basic]) => (
              <tr key={feat} style={{ borderTop:'1px solid var(--cborder)' }}>
                <td style={{ padding:'8px 14px' }}>{feat}</td>
                <td style={{ textAlign:'center', color: free==='✓'?'#4ABC78':free==='—'?'var(--granite)':'var(--snow)', fontWeight: free!=='✓'&&free!=='—'?700:undefined }}>{free}</td>
                <td style={{ textAlign:'center', color: basic==='✓'||basic==='Unlimited'?'#4ABC78':basic==='—'?'var(--granite)':'var(--snow)', fontWeight: basic!=='—'?700:undefined }}>{basic}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FAQ */}
      <h3 style={{ fontFamily:'var(--fd)', fontSize:'1.3rem', fontWeight:700, margin:'2.5rem 0 1rem' }}>Common Questions</h3>
      <div style={{ display:'flex', flexDirection:'column', gap:'.75rem', maxWidth:700 }}>
        {FAQS.map(([q, a]) => (
          <div key={q} style={{ background:'var(--cbg)', border:'1px solid var(--cborder)', borderRadius:10, padding:'1.1rem 1.25rem' }}>
            <div style={{ fontWeight:600, marginBottom:'.4rem', fontSize:'.88rem' }}>{q}</div>
            <div style={{ fontSize:'.8rem', color:'var(--granite)', lineHeight:1.65 }}>{a}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
