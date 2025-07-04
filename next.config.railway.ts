import type { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'standalone',
  compress: isProd,
  swcMinify: false, // Desabilitar minificação SWC para economizar memória
  experimental: {
    serverMinification: false,
    optimizePackageImports: [], // Desabilitar otimização de imports
  },
  webpack: (config) => {
    // Desabilitar cache do webpack para economizar memória
    config.cache = false;
    
    // Reduzir paralelismo
    config.parallelism = 1;
    
    // Desabilitar source maps em produção
    if (isProd) {
      config.devtool = false;
    }
    
    return config;
  },
  images: {
    minimumCacheTTL: 60,
    deviceSizes: [640, 768, 1024, 1280, 1600],
    imageSizes: [16, 32, 48, 64, 96],
  },
  // Desabilitar features desnecessárias durante o build
  reactStrictMode: false,
  poweredByHeader: false,
};

export default nextConfig;