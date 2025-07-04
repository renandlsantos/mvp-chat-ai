import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  compress: false,
  
  experimental: {
    serverMinification: false,
    optimizePackageImports: [],
    webpackBuildWorker: false,
    // Desabilitar features experimentais que consomem memória
    instrumentationHook: false,
    parallelServerCompiles: false,
    parallelServerBuildTraces: false,
  },
  
  // Ignorar erros para acelerar o build
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Desabilitar completamente a geração estática
  generateStaticParams: false,
  dynamicParams: true,
  
  // Configurações para reduzir memória
  staticPageGenerationTimeout: 10, // Reduzir timeout
  generateBuildId: async () => 'railway-build',
  optimizeFonts: false,
  
  // Desabilitar recursos pesados
  images: {
    unoptimized: true,
    disableStaticImages: true,
  },
  
  // Headers vazios para evitar processamento
  async headers() {
    return [];
  },
  
  // Redirects vazios para evitar processamento
  async redirects() {
    return [];
  },
  
  // Rewrites vazios para evitar processamento
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [],
    };
  },
  
  reactStrictMode: false,
  poweredByHeader: false,
  generateEtags: false,
  productionBrowserSourceMaps: false,
  
  // Desabilitar todas as otimizações de bundle
  swcMinify: false,
  
  webpack: (config, { isServer }) => {
    // Resolver problemas de módulos
    if (!isServer) {
      config.resolve = {
        ...config.resolve,
        fallback: {
          ...config.resolve?.fallback,
          zipfile: false,
          fs: false,
          path: false,
          crypto: false,
          stream: false,
          util: false,
          buffer: false,
          http: false,
          https: false,
          os: false,
          querystring: false,
          zlib: false,
          net: false,
          tls: false,
          child_process: false,
        },
      };
    }
    
    // Ignorar módulos problemáticos no servidor
    if (isServer) {
      config.externals = [
        ...(Array.isArray(config.externals) ? config.externals : [config.externals]),
        { zipfile: 'commonjs zipfile' },
        'canvas',
        'jsdom',
        '@napi-rs/canvas',
      ];
    }
    
    // Desabilitar TODAS as otimizações
    config.optimization = {
      minimize: false,
      minimizer: [],
      splitChunks: false,
      runtimeChunk: false,
      moduleIds: 'named',
      chunkIds: 'named',
      nodeEnv: 'production',
      usedExports: false,
      sideEffects: false,
      providedExports: false,
      concatenateModules: false,
      flagIncludedChunks: false,
      removeAvailableModules: false,
      removeEmptyChunks: false,
      mergeDuplicateChunks: false,
      mangleExports: false,
      mangleWasmImports: false,
      realContentHash: false,
      innerGraph: false,
    };
    
    // Desabilitar cache completamente
    config.cache = false;
    
    // Configurações mínimas de performance
    config.performance = {
      hints: false,
    };
    
    // Reduzir paralelismo ao mínimo
    config.parallelism = 1;
    
    // Sem source maps
    config.devtool = false;
    
    // Desabilitar todos os plugins não essenciais
    config.plugins = config.plugins.filter((plugin) => {
      const pluginName = plugin.constructor.name;
      const essentialPlugins = [
        'DefinePlugin',
        'BuildManifestPlugin',
        'ReactFreshWebpackPlugin',
        'NextJsRequireCacheHotReloader',
      ];
      return essentialPlugins.some(name => pluginName.includes(name));
    });
    
    // Configurações adicionais para reduzir memória
    if (config.module?.rules) {
      config.module.rules.forEach((rule: any) => {
        if (rule.oneOf) {
          rule.oneOf.forEach((oneOf: any) => {
            if (oneOf.use?.loader?.includes('babel-loader')) {
              oneOf.use.options = {
                ...oneOf.use.options,
                cacheDirectory: false,
                cacheCompression: false,
              };
            }
          });
        }
      });
    }
    
    return config;
  },
  
  // Desabilitar transpilação de pacotes
  transpilePackages: [],
  
  // Configuração mínima do servidor
  serverRuntimeConfig: {},
  publicRuntimeConfig: {},
};

export default nextConfig;