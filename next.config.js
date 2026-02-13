/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  async rewrites() {
    const R2_BASE = 'https://pub-b5c905be79734df794cad8fee3c595d4.r2.dev';
    
    return [
      // WICHTIG: Spezifische Rewrites ZUERST (Reihenfolge ist entscheidend!)
      
      // /media/bela/* → R2 /bela/* (spezifisch, muss vor /media/* kommen)
      {
        source: '/media/bela/:path*',
        destination: `${R2_BASE}/bela/:path*`,
      },
      
      // /media/* → R2 /* (allgemein, kommt nach spezifischen Regeln)
      {
        source: '/media/:path*',
        destination: `${R2_BASE}/:path*`,
      },
      
      // /bela/* → R2 /bela/* (für direkte Bela-Asset-Requests)
      {
        source: '/bela/:path*',
        destination: `${R2_BASE}/bela/:path*`,
      },
    ];
  },
}

module.exports = nextConfig
