'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const links = [
  { href: '/',            label: 'Explore'       },
  { href: '/plan',        label: 'Plan Your Trip' },
  { href: '/activities',  label: 'Activities'     },
  { href: '/trails',      label: 'Trail Map'      },
  { href: '/map',         label: 'Amenities'      },
  { href: '/pricing',     label: 'Plans'          },
];

export default function Nav() {
  const pathname  = usePathname();
  const [open, setOpen] = useState(false);

  return (
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
          <div className="logo-name">Lake Tahoe Planner</div>
        </div>
      </Link>

      {/* Desktop nav links */}
      <div className="nav-links">
        {links.map(l => (
          <Link
            key={l.href}
            href={l.href}
            className={`nl${pathname === l.href ? ' active' : ''}`}
            style={{ textDecoration: 'none' }}
          >
            {l.label}
          </Link>
        ))}
      </div>

      {/* Right side */}
      <div className="nav-right">
        <span className="tbadge tf">Free</span>
        <Link href="/plan" className="btn-login" style={{ textDecoration: 'none' }}>
          Sign In
        </Link>
      </div>
    </nav>
  );
}
