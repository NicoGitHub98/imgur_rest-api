/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    IMGUR_CLIENT_ID: 'your_client_id'
  },
  images: {
    domains: ['i.imgur.com','imgur.com'],
  },
}

module.exports = nextConfig
