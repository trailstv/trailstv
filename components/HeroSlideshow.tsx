'use client';
import { useState, useEffect } from 'react';

// One slide per destination.
// Images go in /public/assets/hero/
// Format: hero-[slug].jpg — 2400x1350px, JPEG, <500KB
// Subject should sit right-of-center; left side is covered by text overlay.
const SLIDES = [
  {
    slug:     'lake-tahoe',
    name:     'Lake Tahoe',
    img:      '/assets/hero/hero-lake-tahoe.jpg',
    fallback: 'linear-gradient(135deg, #0a1e2e 0%, #0D1B2A 100%)',
    color:    '#4AADBC',
  },
  {
    slug:     'great-smoky-mountains',
    name:     'Great Smoky Mountains',
    img:      '/assets/hero/hero-great-smoky-mountains.jpg',
    fallback: 'linear-gradient(135deg, #1a3a2a 0%, #0D1B2A 100%)',
    color:    '#4ABC78',
  },
  {
    slug:     'zion',
    name:     'Zion',
    img:      '/assets/hero/hero-zion.jpg',
    fallback: 'linear-gradient(135deg, #3a1a0a 0%, #0D1B2A 100%)',
    color:    '#E07040',
  },
  {
    slug:     'yellowstone',
    name:     'Yellowstone',
    img:      '/assets/hero/hero-yellowstone.jpg',
    fallback: 'linear-gradient(135deg, #2a2a0a 0%, #0D1B2A 100%)',
    color:    '#D4A853',
  },
  {
    slug:     'grand-canyon',
    name:     'Grand Canyon',
    img:      '/assets/hero/hero-grand-canyon.jpg',
    fallback: 'linear-gradient(135deg, #3a1a0a 0%, #1a0a0a 100%)',
    color:    '#C4603A',
  },
  {
    slug:     'yosemite',
    name:     'Yosemite',
    img:      '/assets/hero/hero-yosemite.jpg',
    fallback: 'linear-gradient(135deg, #0a1a2a 0%, #0D1B2A 100%)',
    color:    '#4AADBC',
  },
];

const DURATION   = 5000;
const FADE_SPEED = '1.4s';

export default function HeroSlideshow() {
  const [current,  setCurrent]  = useState(0);
  const [prev,     setPrev]     = useState<number | null>(null);
  const [fading,   setFading]   = useState(false);
  const [imgError, setImgError] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const timer = setInterval(() => {
      setPrev(current);
      setFading(true);
      setCurrent(c => (c + 1) % SLIDES.length);
      setTimeout(() => { setPrev(null); setFading(false); }, 1500);
    }, DURATION);
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  function goTo(idx: number) {
    if (idx === current) return;
    setPrev(current);
    setFading(true);
    setCurrent(idx);
    setTimeout(() => { setPrev(null); setFading(false); }, 1500);
  }

  function slideStyle(slide: typeof SLIDES[0], hasError?: boolean): React.CSSProperties {
    if (hasError || !slide.img) return { background: slide.fallback };
    return { backgroundImage:`url(${slide.img})`, backgroundSize:'cover', backgroundPosition:'center' };
  }

  const slide = SLIDES[current];

  return (
    <div style={{ position:'absolute', inset:0, zIndex:0 }}>

      {/* Outgoing slide */}
      {prev !== null && fading && (
        <div
          key={`prev-${prev}`}
          style={{ position:'absolute', inset:0, zIndex:1,
            animation:`heroFadeOut ${FADE_SPEED} ease forwards`,
            ...slideStyle(SLIDES[prev], imgError[prev]) }}
        />
      )}

      {/* Incoming slide */}
      <div
        key={`curr-${current}`}
        style={{ position:'absolute', inset:0, zIndex:2,
          animation:`heroFadeIn ${FADE_SPEED} ease forwards`,
          ...slideStyle(slide, imgError[current]) }}
      >
        {!imgError[current] && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={slide.img} alt="" style={{ display:'none' }}
            onError={() => setImgError(e => ({ ...e, [current]: true }))} />
        )}
      </div>

      {/* Gradient overlay */}
      <div style={{ position:'absolute', inset:0, zIndex:3,
        background:'linear-gradient(to right, rgba(9,20,32,.88) 0%, rgba(9,20,32,.45) 55%, rgba(9,20,32,.15) 100%)' }}/>

      {/* Dot indicators */}
      <div style={{ position:'absolute', bottom:'1.5rem', left:'50%',
        transform:'translateX(-50%)', zIndex:4,
        display:'flex', gap:'.5rem', alignItems:'center' }}>
        {SLIDES.map((s, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to ${s.name}`}
            style={{ width:i===current?22:7, height:7, borderRadius:4,
              background:i===current?SLIDES[i].color:'rgba(242,245,247,.3)',
              border:'none', cursor:'pointer', padding:0, transition:'all .4s ease' }}
          />
        ))}
      </div>

      <style>{`
        @keyframes heroFadeIn  { from { opacity:0 } to { opacity:1 } }
        @keyframes heroFadeOut { from { opacity:1 } to { opacity:0 } }
      `}</style>
    </div>
  );
}
