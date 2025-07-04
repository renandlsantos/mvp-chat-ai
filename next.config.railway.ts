import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  compress: false,
  
  experimental: {
    serverMinification: false,
    webpackBuildWorker: false,
  },
  
  // Ignorar erros para acelerar o build
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Configurações para reduzir memória
  staticPageGenerationTimeout: 60,
  generateBuildId: async () => 'railway-' + Date.now(),
  
  // Desabilitar otimização de imagens
  images: {
    unoptimized: true,
  },
  
  reactStrictMode: false,
  poweredByHeader: false,
  generateEtags: false,
  productionBrowserSourceMaps: false,
  
  webpack: (config, { isServer }) => {
    // Resolver problemas de módulos apenas no client
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        zipfile: false,
        fs: false,
        path: false,
        crypto: false,
      };
    }
    
    // Configurações de otimização conservadoras
    config.optimization = {
      ...config.optimization,
      minimize: false,
      splitChunks: {
        chunks: 'async',
        minSize: 20000,
        cacheGroups: {
          default: false,
          vendors: false,
        },
      },
    };
    
    // Configurar paralelismo reduzido
    config.parallelism = 2;
    
    // Desabilitar source maps
    config.devtool = false;
    
    // Adicionar plugin para ignorar módulos problemáticos
    const webpack = require('webpack');
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^zipfile$/,
      })
    );
    
    return config;
  },
  
  // Configurar headers mínimos
  async headers() {
    return [];
  },
  
  // Configurar redirects mínimos
  async redirects() {
    return [];
  },
};

export default nextConfig;