/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allow TensorFlow.js model fetches from CDN
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Cross-Origin-Embedder-Policy', value: 'credentialless' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
