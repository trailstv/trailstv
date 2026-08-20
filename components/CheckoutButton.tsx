'use client';

interface Props {
  tierId:    string;
  cta:       string;
  highlight: boolean;
}

export default function CheckoutButton({ tierId, cta, highlight }: Props) {
  function handleClick() {
    // TODO: replace with real Stripe checkout session fetch
    // fetch('/api/checkout', { method:'POST', body: JSON.stringify({ tier: tierId }) })
    //   .then(r => r.json())
    //   .then(d => { if (d.url) window.location.href = d.url; });
    alert(`Stripe checkout for ${tierId} — add STRIPE_PRICE_${tierId.toUpperCase()} to your Vercel env vars and wire up /api/checkout`);
  }

  return (
    <button
      onClick={handleClick}
      className={highlight ? 'bp' : 'bs'}
      style={{ width:'100%', cursor:'pointer' }}
    >
      {cta}
    </button>
  );
}
