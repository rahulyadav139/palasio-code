/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/snippet',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
