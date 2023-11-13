/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/code',
      },
    ];
  },
};

module.exports = nextConfig;
