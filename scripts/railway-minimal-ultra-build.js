#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 Railway Ultra Minimal Build v3.0');
console.log('💾 Total Memory:', Math.round(require('os').totalmem() / 1024 / 1024), 'MB');

// Set ultra conservative memory limits
process.env.NODE_OPTIONS = '--max-old-space-size=40960 --gc-global --expose-gc --optimize-for-size';
process.env.NEXT_TELEMETRY_DISABLED = '1';
process.env.DISABLE_SENTRY = 'true';
process.env.ANALYZE = 'false';
process.env.SKIP_ENV_VALIDATION = 'true';

// Create ultra minimal config
const ultraMinimalConfig = `
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  trailingSlash: false,
  poweredByHeader: false,
  generateEtags: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    loader: 'custom',
    loaderFile: './image-loader.js'
  },
  experimental: {
    serverMinification: false,
    optimizeCss: false,
    workerThreads: false,
    cpus: 1,
    esmExternals: false,
    fallbackNodePolyfills: false,
  },
  webpack: (config, { isServer, dev }) => {
    // Ultra minimal webpack config
    config.optimization = {
      minimize: false,
      splitChunks: false,
      runtimeChunk: false,
      concatenateModules: false,
      usedExports: false,
      sideEffects: false,
    };
    
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
    };
    
    config.cache = false;
    config.devtool = false;
    
    // Force single chunk
    config.plugins = config.plugins.filter(plugin => 
      !plugin.constructor.name.includes('SplitChunks')
    );
    
    return config;
  }
};

module.exports = nextConfig;
`;

// Create minimal image loader
const imageLoader = `
export default function imageLoader({ src }) {
  return src;
}
`;

// Backup and replace configs
console.log('📋 Creating ultra minimal configs...');
if (fs.existsSync('next.config.js')) {
  fs.renameSync('next.config.js', 'next.config.js.backup');
}
fs.writeFileSync('next.config.js', ultraMinimalConfig);
fs.writeFileSync('image-loader.js', imageLoader);

// Clean everything possible
console.log('🧹 Ultra cleanup...');
try {
  execSync('rm -rf .next node_modules/.cache 2>/dev/null || true', { stdio: 'inherit' });
} catch (e) {
  console.log('⚠️ Cleanup failed, continuing...');
}

try {
  console.log('🔨 Starting ultra minimal build...');
  
  // Force garbage collection if available
  if (global.gc) {
    global.gc();
  }
  
  execSync('next build', { 
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: 'production',
    },
    maxBuffer: 1024 * 1024 * 100 // 100MB buffer
  });
  
  console.log('✅ Ultra minimal build completed!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
} finally {
  // Restore configs
  console.log('🔄 Restoring configs...');
  try {
    fs.unlinkSync('next.config.js');
    fs.unlinkSync('image-loader.js');
    if (fs.existsSync('next.config.js.backup')) {
      fs.renameSync('next.config.js.backup', 'next.config.js');
    }
  } catch (e) {
    console.log('⚠️ Config restoration failed');
  }
}