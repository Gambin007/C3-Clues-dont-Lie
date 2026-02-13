/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  async rewrites() {
    const R2_BASE = 'https://pub-b5c905be79734df794cad8fee3c595d4.r2.dev';
    
    return [
      // Rewrite /media/* requests to Cloudflare R2
      {
        source: '/media/:path*',
        destination: `${R2_BASE}/media/:path*`,
      },
      // Rewrite /bela/* requests to Cloudflare R2 (for Bela HTML/CSS/JS/assets)
      {
        source: '/bela/:path*',
        destination: `${R2_BASE}/bela/:path*`,
      },
    ];
  },
}

module.exports = nextConfig
