/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // If it's a client-side bundle, ignore Node.js modules that should only run on the server
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        net: false,
        dns: false,
        tls: false,
        pg: false,
      }
    }
    
    return config
  },
  // Enable strict mode for React
  reactStrictMode: true,
  swcMinify: true,
  // Don't polyfill unnecessary Node.js modules
  experimental: {
    serverComponentsExternalPackages: ['pg']
  }
}

module.exports = nextConfig 