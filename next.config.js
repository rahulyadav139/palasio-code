/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/code',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
