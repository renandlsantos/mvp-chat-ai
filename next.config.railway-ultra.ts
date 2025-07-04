import type { NextConfig } from 'next';

// Configuração ULTRA otimizada para Railway - máxima velocidade de build
const nextConfig: NextConfig = {
  output: 'standalone',
  compress: false,
  
  experimental: {
    serverMinification: false,
    webpackBuildWorker: false,
    // Desabilitar cache para evitar serialização
    incrementalCacheHandlerPath: undefined,
    isrMemoryCacheSize: 0,
  },
  
  // Ignorar TODOS os erros
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Desabilitar COMPLETAMENTE a geração estática
  generateStaticParams: () => [],
  staticPageGenerationTimeout: 1, // 1 segundo apenas
  
  // Sem otimizações
  images: {
    unoptimized: true,
    disableStaticImages: true,
  },
  
  reactStrictMode: false,
  poweredByHeader: false,
  generateEtags: false,
  productionBrowserSourceMaps: false,
  
  // Desabilitar todos os recursos não essenciais
  async headers() { return []; },
  async redirects() { return []; },
  async rewrites() { 
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [],
    };
  },
  
  webpack: (config, { isServer, dev }) => {
    // Desabilitar COMPLETAMENTE o cache
    config.cache = false;
    
    // Resolver zipfile
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        zipfile: false,
        fs: false,
        path: false,
        crypto: false,
        stream: false,
        util: false,
        buffer: false,
      };
    }
    
    // Configurações ULTRA mínimas
    config.optimization = {
      minimize: false,
      minimizer: [],
      splitChunks: false,
      runtimeChunk: false,
      sideEffects: false,
      usedExports: false,
      concatenateModules: false,
      // Desabilitar TUDO relacionado a otimização
      providedExports: false,
      innerGraph: false,
      mangleExports: false,
      nodeEnv: false,
    };
    
    // Máximo de 1 worker
    config.parallelism = 1;
    
    // Sem source maps
    config.devtool = false;
    
    // Configurações de performance
    config.performance = {
      hints: false,
      maxEntrypointSize: Infinity,
      maxAssetSize: Infinity,
    };
    
    // Adicionar plugin para ignorar módulos problemáticos
    const webpack = require('webpack');
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^(zipfile|canvas|jsdom)$/,
      })
    );
    
    // Remover plugins desnecessários
    config.plugins = config.plugins.filter(plugin => {
      const name = plugin.constructor.name;
      const keepPlugins = [
        'DefinePlugin',
        'BuildManifestPlugin',
        'IgnorePlugin',
      ];
      return keepPlugins.some(keep => name.includes(keep));
    });
    
    // Configurar módulos para velocidade máxima
    if (config.module) {
      config.module.unsafeCache = true;
      
      // Desabilitar parsing desnecessário
      config.module.noParse = /jquery|lodash|moment/;
      
      // Simplificar regras
      if (config.module.rules) {
        config.module.rules = config.module.rules.map(rule => {
          if (rule.oneOf) {
            rule.oneOf = rule.oneOf.map(loader => {
              // Desabilitar cache em loaders
              if (loader.use && loader.use.options) {
                loader.use.options.cacheDirectory = false;
              }
              return loader;
            });
          }
          return rule;
        });
      }
    }
    
    // Configurações de resolução rápida
    config.resolve = {
      ...config.resolve,
      symlinks: false,
      cacheWithContext: false,
    };
    
    return config;
  },
  
  // Sem transpilação
  transpilePackages: [],
  
  // Configurações de servidor mínimas
  serverRuntimeConfig: {},
  publicRuntimeConfig: {},
  
  // Desabilitar análise de bundle
  analyzeServer: false,
  analyzeBrowser: false,
  
  // Build ID fixo
  generateBuildId: async () => 'railway-ultra',
};

export default nextConfig;