/** @type {import('next').NextConfig} */
const nextConfig = {
  // Serve the app from the domain root
  trailingSlash: false,

  // Allow Leaflet tile images from OSM
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.tile.openstreetmap.org' },
      { protocol: 'https', hostname: 'fonts.googleapis.com' },
      { protocol: 'https', hostname: 'fonts.gstatic.com' },
    ],
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options',        value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy',        value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',     value: 'geolocation=(), microphone=()' },
        ],
      },
      {
        source: '/data/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=900, stale-while-revalidate=60' }],
      },
    ];
  },
};

module.exports = nextConfig;
