
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  typescript: {
    // Temporarily ignore TypeScript errors during build
    ignoreBuildErrors: true,
  },
  eslint: {
    // Disable ESLint during builds to save memory
    ignoreDuringBuilds: true,
  },
  images: {
    // Disable image optimization to save memory
    unoptimized: true,
  },
  experimental: {
    // Disable experimental features that use memory
    serverMinification: false,
    optimizeCss: false,
    workerThreads: false,
    // Reduce concurrent builds
    cpus: 1,
  },
  webpack: (config, { isServer }) => {
    // Disable webpack optimizations to reduce memory usage
    config.optimization = {
      ...config.optimization,
      minimize: false,
      splitChunks: false,
      runtimeChunk: false,
    };
    
    // Disable source maps in production
    if (!isServer) {
      config.devtool = false;
    }
    
    return config;
  }
};

module.exports = nextConfig;
