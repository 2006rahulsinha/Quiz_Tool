/** @type {import('next').NextConfig} */
const nextConfig = {
reactStrictMode: true,
// Remove standalone output for Vercel
// output: 'standalone', // Only use for Docker
env: {
// These will be replaced by Vercel environment variables
NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
},
}
module.exports = nextConfig 