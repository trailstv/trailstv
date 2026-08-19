'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

const NAV_LINKS = [
  { href: '/',        label: 'Parks'    },
  { href: '/pricing', label: 'Pricing'  },
  { href: '/about',   label: 'About'    },
];

const MORE_LINKS = [
  { href: '/about',          label: 'About Us',            icon: 'ℹ️' },
  { href: '/contact',        label: 'Contact',             icon: '✉️' },
  { href: '/privacy-policy', label: 'Privacy Policy',      icon: '🔒' },
  { href: '/terms',          label: 'Terms of Service',    icon: '📄' },
  { href: '/cookies',        label: 'Cookie Policy',       icon: '🍪' },
  { href: '/accessibility',  label: 'Accessibility',       icon: '♿' },
];

export default function Nav() {
  const pathname     = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropOpen,   setDropOpen]   = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropOpen(false);
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  // Close everything on route change
  useEffect(() => {
    setMobileOpen(false);
    setDropOpen(false);
  }, [pathname]);

  const isMoreActive = MORE_LINKS.some(l => pathname === l.href);

  return (
    <>
      <nav>
        {/* Logo */}
        <Link href="/" className="logo" style={{ textDecoration: 'none' }}>
          <svg width="25" height="25" viewBox="0 0 26 26" fill="none">
            <path d="M3 17c2-4 4-6.5 6.5-6.5s3.5 4.5 6.5 4.5 3.5-2.8 5.5-2.8" stroke="#4AADBC" strokeWidth="2" strokeLinecap="round"/>
            <path d="M3 21c2-3 4-5 6.5-5s3.5 3.5 6.5 3.5 3.5-2.2 5.5-2.2" stroke="#D4A853" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="13" cy="8" r="2.8" fill="rgba(74,173,188,.65)"/>
          </svg>
          <div>
            <div className="logo-tag">TrailsTV</div>
            <div className="logo-name">Lake Tahoe</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="nav-links">
          {NAV_LINKS.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={`nl${pathname === l.href ? ' active' : ''}`}
              style={{ textDecoration: 'none' }}
            >
              {l.label}
            </Link>
          ))}

          {/* More dropdown */}
          <div ref={dropRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setDropOpen(o => !o)}
              className={`nl${isMoreActive ? ' active' : ''}`}
              style={{
                display:    'flex',
                alignItems: 'center',
                gap:        4,
                cursor:     'pointer',
                fontFamily: 'var(--fb)',
                fontSize:   '.82rem',
                fontWeight: 500,
              }}
              aria-haspopup="true"
              aria-expanded={dropOpen}
            >
              More
              <svg
                width="12" height="12" viewBox="0 0 12 12" fill="none"
                style={{ transition: 'transform .2s', transform: dropOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
              >
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {dropOpen && (
              <div style={{
                position:   'absolute',
                top:        'calc(100% + 10px)',
                right:      0,
                minWidth:   200,
                background: 'rgba(9,20,32,.97)',
                border:     '1px solid var(--cborder)',
                borderRadius: 10,
                boxShadow:  '0 8px 32px rgba(0,0,0,.5)',
                zIndex:     999,
                overflow:   'hidden',
                animation:  'fadeUp .15s ease',
              }}>
                {MORE_LINKS.map((l, i) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    style={{
                      display:    'flex',
                      alignItems: 'center',
                      gap:        '.6rem',
                      padding:    '.6rem 1rem',
                      fontSize:   '.8rem',
                      fontWeight: pathname === l.href ? 700 : 400,
                      color:      pathname === l.href ? 'var(--glacial)' : 'rgba(242,245,247,.75)',
                      textDecoration: 'none',
                      borderTop:  i > 0 ? '1px solid rgba(74,173,188,.06)' : 'none',
                      transition: 'background .15s',
                      background: pathname === l.href ? 'rgba(74,173,188,.07)' : 'transparent',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(74,173,188,.07)')}
                    onMouseLeave={e => (e.currentTarget.style.background = pathname === l.href ? 'rgba(74,173,188,.07)' : 'transparent')}
                  >
                    <span style={{ fontSize: '.9rem', lineHeight: 1 }}>{l.icon}</span>
                    {l.label}
                    {i === 0 && (
                      <span style={{ marginLeft: 'auto', fontSize: '.65rem', color: 'var(--granite)' }}>
                        About TrailsTV
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile hamburger */}
        <button
          className="hamburger"
          onClick={() => setMobileOpen(o => !o)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <span style={{ display: 'block', width: 20, height: 2, background: 'var(--glacial)', borderRadius: 2, transition: 'all .2s', transform: mobileOpen ? 'rotate(45deg) translate(5px,5px)' : 'none' }}/>
          <span style={{ display: 'block', width: 20, height: 2, background: 'var(--glacial)', borderRadius: 2, transition: 'all .2s', opacity: mobileOpen ? 0 : 1, marginTop: 5 }}/>
          <span style={{ display: 'block', width: 20, height: 2, background: 'var(--glacial)', borderRadius: 2, transition: 'all .2s', transform: mobileOpen ? 'rotate(-45deg) translate(5px,-5px)' : 'none', marginTop: mobileOpen ? 0 : 5 }}/>
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{
          position:   'fixed',
          top:        56,
          left:       0,
          right:      0,
          bottom:     0,
          background: 'rgba(9,20,32,.98)',
          zIndex:     998,
          overflowY:  'auto',
          padding:    '1.5rem 2rem',
          display:    'flex',
          flexDirection: 'column',
          gap:        '.2rem',
          animation:  'fadeUp .2s ease',
        }}>
          {/* Main links */}
          <div style={{ fontSize: '.65rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--granite)', marginBottom: '.5rem' }}>
            Navigation
          </div>
          {NAV_LINKS.map(l => (
            <Link
              key={l.href}
              href={l.href}
              style={{
                display:    'block',
                padding:    '.75rem .5rem',
                fontSize:   '1rem',
                fontWeight: pathname === l.href ? 700 : 400,
                color:      pathname === l.href ? 'var(--glacial)' : 'rgba(242,245,247,.8)',
                textDecoration: 'none',
                borderBottom: '1px solid var(--cborder)',
              }}
            >
              {l.label}
            </Link>
          ))}

          {/* More links */}
          <div style={{ fontSize: '.65rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--granite)', margin: '1.25rem 0 .5rem' }}>
            More
          </div>
          {MORE_LINKS.map(l => (
            <Link
              key={l.href}
              href={l.href}
              style={{
                display:    'flex',
                alignItems: 'center',
                gap:        '.75rem',
                padding:    '.65rem .5rem',
                fontSize:   '.9rem',
                color:      pathname === l.href ? 'var(--glacial)' : 'rgba(242,245,247,.7)',
                textDecoration: 'none',
                borderBottom: '1px solid var(--cborder)',
                fontWeight: pathname === l.href ? 700 : 400,
              }}
            >
              <span>{l.icon}</span>{l.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
