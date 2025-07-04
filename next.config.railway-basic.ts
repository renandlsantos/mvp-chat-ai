import type { NextConfig } from 'next';

// Configuração BÁSICA mínima para Railway
const nextConfig: NextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  // Forçar build mais rápido
  staticPageGenerationTimeout: 30,
  experimental: {
    serverMinification: false,
  },
  webpack: (config) => {
    // Apenas resolver o problema do zipfile
    if (config.resolve?.fallback) {
      config.resolve.fallback.zipfile = false;
    }
    
    // Desabilitar minimização
    config.optimization.minimize = false;
    
    return config;
  },
};

export default nextConfig;