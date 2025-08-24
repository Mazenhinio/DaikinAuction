/** @type {import('next').NextConfig} */
const nextConfig = {
  // App Router is enabled by default in Next.js 14
  
  // Ensure environment variables are available
  env: {
    GOOGLE_SPREADSHEET_ID: process.env.GOOGLE_SPREADSHEET_ID,
    GOOGLE_SERVICE_ACCOUNT_EMAIL: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY,
    JWT_SECRET: process.env.JWT_SECRET,
  },
  
  // Optimize for Vercel deployment
  experimental: {
    serverComponentsExternalPackages: ['googleapis']
  }
}

module.exports = nextConfig
