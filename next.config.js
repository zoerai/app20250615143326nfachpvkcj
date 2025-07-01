/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Docker deployment
  output: 'standalone',
  
  // Optimize for production
  swcMinify: true,
  
  // Handle static assets properly
  assetPrefix: process.env.NODE_ENV === 'production' ? undefined : undefined,
  
  // Ensure proper image optimization
  images: {
    unoptimized: process.env.NODE_ENV === 'production',
  },
  
  // Add any existing configuration here
  // This template will be merged with existing next.config.js if present
}

module.exports = nextConfig 