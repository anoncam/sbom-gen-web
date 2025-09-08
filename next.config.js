/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Railway deployment optimization
  output: 'standalone',
  // Allow Railway's dynamic port
  serverRuntimeConfig: {
    port: process.env.PORT || 3000
  },
}

module.exports = nextConfig