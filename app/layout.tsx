import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import '@/styles/globals.css';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

const playfair = Playfair_Display({
  subsets: ['latin'], weight: ['700','900'],
  style: ['normal','italic'], variable: '--font-display', display: 'swap',
});
const inter = Inter({
  subsets: ['latin'], weight: ['300','400','500','600'],
  variable: '--font-body', display: 'swap',
});

export const viewport = {
  themeColor: '#0D1B2A',
};

export const metadata: Metadata = {
  title: { default: 'TrailsTV', template: '%s — TrailsTV' },
  description: 'Hiking, MTB, camping, kayaking, climbing, and wildlife maps for every national park in the continental US.',
  icons: { icon: '/assets/favicon.ico', apple: '/assets/icon-180.png' },
  openGraph: {
    title: 'TrailsTV — National Parks Planner',
    description: 'Plan your next national park adventure with live trail maps, campsite availability, fire conditions, and snow reports.',
    siteName: 'TrailsTV', type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-56EE9VXWVM"/>
        <script dangerouslySetInnerHTML={{ __html:`
          window.dataLayer=window.dataLayer||[];
          function gtag(){dataLayer.push(arguments);}
          gtag('js',new Date());
          gtag('config','G-56EE9VXWVM');
        `}}/>
      </head>
      <body>
        <div className="topo-bg" aria-hidden="true">
          <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
            <g fill="none" stroke="#4AADBC" strokeWidth="1">
              <ellipse cx="720" cy="450" rx="680" ry="340"/>
              <ellipse cx="720" cy="450" rx="560" ry="260"/>
              <ellipse cx="720" cy="450" rx="440" ry="190"/>
              <ellipse cx="720" cy="450" rx="320" ry="130"/>
              <ellipse cx="720" cy="450" rx="200" ry="80"/>
            </g>
          </svg>
        </div>
        <Nav/>
        <main>{children}</main>
        <Footer/>
      </body>
    </html>
  );
}
