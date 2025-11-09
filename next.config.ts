import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Temporalmente ignorar errores de ESLint durante build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Temporalmente ignorar errores de TypeScript durante build
    ignoreBuildErrors: true,
  },
}

export default nextConfig
