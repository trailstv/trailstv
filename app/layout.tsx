import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import '@/styles/globals.css';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'TrailsTV',
  description: 'Plan camping, hiking, kayaking, skiing, and boating in the Lake Tahoe basin. Live campsite availability via Recreation.gov.',
  themeColor: '#0D1B2A',
  icons: {
    icon:  '/assets/favicon.ico',
    apple: '/assets/icon-180.png',
  },
  openGraph: {
    title:       'TrailsTV',
    description: 'The complete outdoor adventure planner for the Lake Tahoe basin.',
    url:         'https://trailstv.com',
    siteName:    'TrailsTV',
    type:        'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      </head>
      <body>
        <div className="topo-bg" aria-hidden="true">
          <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
            <g fill="none" stroke="#4AADBC" strokeWidth="1">
              <ellipse cx="720" cy="450" rx="680" ry="340"/>
              <ellipse cx="720" cy="450" rx="555" ry="262"/>
              <ellipse cx="720" cy="450" rx="432" ry="196"/>
              <ellipse cx="720" cy="450" rx="312" ry="134"/>
              <ellipse cx="720" cy="450" rx="196" ry="82"/>
              <ellipse cx="720" cy="450" rx="92"  ry="38"/>
              <ellipse cx="230" cy="155" rx="305" ry="172"/>
              <ellipse cx="230" cy="155" rx="195" ry="108"/>
              <ellipse cx="230" cy="155" rx="96"  ry="53"/>
              <ellipse cx="1195" cy="695" rx="365" ry="192"/>
              <ellipse cx="1195" cy="695" rx="235" ry="122"/>
              <ellipse cx="1195" cy="695" rx="118" ry="60"/>
            </g>
          </svg>
        </div>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
