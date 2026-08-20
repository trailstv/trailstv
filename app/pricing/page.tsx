import Link from 'next/link';
import { TIERS } from '@/lib/tiers';
import CheckoutButton from '@/components/CheckoutButton';

export const metadata = { title: 'Pricing' };

export default function PricingPage() {
  return (
    <div className="sw" style={{ paddingBottom:'4rem' }}>
      <div className="eye">Simple pricing</div>
      <h1 className="stitle">One price. Every park.</h1>
      <p className="ssub">
        All trail maps, conditions, and fire/snow data are always free.
        Upgrade for live campsite availability, permit alerts, and offline maps.
      </p>

      <div className="price-grid">
        {TIERS.map(tier => (
          <div key={tier.id} className={`pcrd${tier.highlight ? ' featured' : ''}`}>
            {tier.highlight && <div className="pcrd-badge">Most Popular</div>}
            <div className="pcrd-tier">{tier.name}</div>
            <div className="pcrd-price">{tier.price}</div>
            <div className="pcrd-sub">{tier.priceSub}</div>

            <div style={{ flex:1, display:'flex', flexDirection:'column', gap:'.45rem', marginBottom:'1.5rem' }}>
              {tier.features.map(f => (
                <div key={f.label} style={{ display:'flex', gap:'.5rem', alignItems:'flex-start', fontSize:'.82rem' }}>
                  <span style={{ color:f.included ? '#4ABC78' : 'var(--cborder)', fontWeight:700, flexShrink:0, marginTop:1 }}>
                    {f.included ? '✓' : '—'}
                  </span>
                  <span style={{ color:f.included ? 'rgba(242,245,247,.85)' : 'var(--granite)' }}>
                    {f.label}
                  </span>
                </div>
              ))}
            </div>

            {tier.id === 'free' ? (
              <Link href="/" className={tier.highlight ? 'bp' : 'bs'}
                style={{ textAlign:'center', display:'block', textDecoration:'none' }}>
                {tier.cta}
              </Link>
            ) : (
              <CheckoutButton tierId={tier.id} cta={tier.cta} highlight={tier.highlight}/>
            )}
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div style={{ maxWidth:700, margin:'0 auto' }}>
        <h2 style={{ fontFamily:'var(--fd)', fontSize:'1.3rem', fontWeight:700, marginBottom:'1.5rem', textAlign:'center' }}>
          Frequently Asked Questions
        </h2>
        <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
          {[
            ['Is it really free?',       'Yes — all trail maps, weather, fire restrictions, snow conditions, NPS alerts, and park information are free forever, for every park.'],
            ['What does Explorer add?',  'Live Recreation.gov campsite availability (updated every 15 minutes), email alerts when a campsite opens for your target dates, and permit lottery reminders.'],
            ['What is the Local plan?',  'A one-time purchase — not a subscription. You get everything in Explorer plus offline maps for all parks, unlimited saved trips, and all future parks as we add them.'],
            ['Can I cancel Explorer?',   'Yes, anytime. No questions asked. Your Free access continues after cancellation.'],
            ['Which parks are included?','18 national parks in the continental US, with more being added. All parks are included at every tier.'],
          ].map(([q, a]) => (
            <div key={q} style={{ background:'rgba(13,27,42,.6)', border:'1px solid var(--cborder)', borderRadius:12, padding:'1.1rem 1.25rem' }}>
              <div style={{ fontWeight:700, fontSize:'.9rem', marginBottom:'.4rem' }}>{q}</div>
              <div style={{ fontSize:'.82rem', color:'rgba(242,245,247,.72)', lineHeight:1.75 }}>{a}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
