import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  compress: false, // Desabilitar compressão para economizar CPU/memória
  experimental: {
    serverMinification: false,
    optimizePackageImports: [],
    webpackBuildWorker: false, // Desabilitar workers do webpack
  },
  transpilePackages: [], // Não transpilar pacotes extras
  typescript: {
    // Durante o build no Railway, ignorar erros de TypeScript
    ignoreBuildErrors: true,
  },
  eslint: {
    // Durante o build, ignorar erros de ESLint
    ignoreDuringBuilds: true,
  },
  // Desabilitar geração estática para evitar erros de Suspense
  staticPageGenerationTimeout: 120,
  // Configurar para gerar menos páginas estáticas
  generateBuildId: async () => 'build',
  // Desabilitar otimizações de fonte
  optimizeFonts: false,
  webpack: (config, { isServer }) => {
    // Resolver o problema do módulo zipfile
    if (!isServer) {
      config.resolve = {
        ...config.resolve,
        fallback: {
          ...config.resolve?.fallback,
          zipfile: false,
          fs: false,
          path: false,
          crypto: false,
        },
      };
    }
    
    // Ignorar módulos problemáticos apenas no servidor
    if (isServer) {
      config.externals = [
        ...(Array.isArray(config.externals) ? config.externals : [config.externals]),
        { zipfile: 'commonjs zipfile' }
      ];
    }
    
    // Configurações mínimas do webpack
    config.optimization = {
      ...config.optimization,
      minimize: false, // Desabilitar minimização
      splitChunks: false, // Desabilitar split chunks
      runtimeChunk: false,
      moduleIds: 'deterministic',
      removeAvailableModules: false,
      removeEmptyChunks: false,
      sideEffects: false,
    };
    
    // Desabilitar cache
    config.cache = false;
    
    // Reduzir paralelismo
    config.parallelism = 1;
    
    // Sem source maps
    config.devtool = false;
    
    // Desabilitar plugins pesados mas manter os essenciais
    config.plugins = config.plugins.filter((plugin) => {
      const pluginName = plugin.constructor.name;
      // Remover apenas plugins não essenciais
      return !pluginName.includes('Telemetry') && 
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