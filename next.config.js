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
        "pg-native": false,
      };
    }

    return config;
  },
  // Enable strict mode for React
  reactStrictMode: true,
  serverExternalPackages: ["pg"],
};

module.exports = nextConfig;
