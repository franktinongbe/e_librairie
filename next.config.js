/** @type {import('next').NextConfig} */
const securityHeaders = [
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'no-referrer'
  },
  {
    key: 'Permissions-Policy',
    value: 'geolocation=(), microphone=()'
  }
];

const nextConfig = {
  reactStrictMode: true,
  
  // Désactive le blocage de build dû à ESLint (Netlify)
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Désactive le blocage de build dû aux erreurs TypeScript (si nécessaire)
  typescript: {
    ignoreBuildErrors: true,
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          ...securityHeaders,
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline'; img-src 'self' data:; style-src 'self' 'unsafe-inline'"
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig;