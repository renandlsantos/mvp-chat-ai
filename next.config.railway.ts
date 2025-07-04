import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  compress: false, // Desabilitar compressão para economizar CPU/memória
  swcMinify: false,
  experimental: {
    serverMinification: false,
    optimizePackageImports: [],
    webpackBuildWorker: false, // Desabilitar workers do webpack
  },
  transpilePackages: [], // Não transpilar pacotes extras
  webpack: (config) => {
    // Configurações mínimas do webpack
    config.optimization = {
      ...config.optimization,
      minimize: false, // Desabilitar minimização
      splitChunks: false, // Desabilitar split chunks
      runtimeChunk: false,
    };
    
    // Desabilitar cache
    config.cache = false;
    
    // Reduzir paralelismo
    config.parallelism = 1;
    
    // Sem source maps
    config.devtool = false;
    
    // Desabilitar plugins pesados
    config.plugins = config.plugins.filter((plugin) => {
      const pluginName = plugin.constructor.name;
      // Manter apenas plugins essenciais
      return !pluginName.includes('Telemetry') && 
             !pluginName.includes('BuildManifest') &&
             !pluginName.includes('FontStylesheet');
    });
    
    return config;
  },
  images: {
    unoptimized: true, // Desabilitar otimização de imagens
  },
  reactStrictMode: false,
  poweredByHeader: false,
  generateEtags: false,
  productionBrowserSourceMaps: false,
};

export default nextConfig;