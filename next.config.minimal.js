/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: false,
  swcMinify: false,
  poweredByHeader: false,
  compress: false,
  
  typescript: {
    ignoreBuildErrors: true,
  },
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  images: {
    unoptimized: true,
    domains: [],
  },
  
  experimental: {
    serverMinification: false,
    optimizeCss: false,
    workerThreads: false,
    cpus: 1,
    optimizePackageImports: [],
  },
  
  webpack: (config, { isServer }) => {
    // Disable all webpack optimizations
    config.optimization = {
      minimize: false,
      splitChunks: false,
      runtimeChunk: false,
      concatenateModules: false,
      sideEffects: false,
    };
    
    // Disable caching
    config.cache = false;
    config.devtool = false;
    
    // Skip heavy dependencies
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        // Charts and visualization
        '@lobehub/charts': false,
        'recharts': false,
        'd3': false,
        
        // Document processing
        'pdfjs-dist': false,
        'react-pdf': false,
        'epub2': false,
        'mammoth': false,
        'officeparser': false,
        'pdf-parse': false,
        
        // Code editor
        '@codesandbox/sandpack-react': false,
        'monaco-editor': false,
        
        // Terminal
        '@xterm/xterm': false,
        
        // AI/ML heavy deps
        '@langchain/community': false,
        'langchain': false,
        
        // Image processing
        'sharp': false,
        'plaiceholder': false,
        'modern-screenshot': false,
        
        // File viewers
        '@cyntler/react-doc-viewer': false,
      };
    }
    
    // Ignore certain file types
    config.module.rules.push({
      test: /\.(pdf|epub|docx|xlsx|pptx|wasm)$/,
      loader: 'ignore-loader',
    });
    
    return config;
  },
  
  // Skip non-essential API routes
  async rewrites() {
    return {
      beforeFiles: [
        // Redirect heavy features to disabled endpoint
        {
          source: '/discover/:path*',
          destination: '/api/minimal-disabled',
        },
        {
          source: '/docs/:path*', 
          destination: '/api/minimal-disabled',
        },
        {
          source: '/knowledge/:path*',
          destination: '/api/minimal-disabled',
        },
      ],
    };
  },
  
  // Minimal env vars
  env: {
    NEXT_PUBLIC_MINIMAL_BUILD: 'true',
    NEXT_PUBLIC_DISABLE_FEATURES: 'knowledge,artifacts,plugins,discover,docs',
  },
};

module.exports = nextConfig;