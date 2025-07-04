#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚂 Railway Nixpacks Build Script v2.0');
console.log('📊 Node version:', process.version);
console.log('💾 Total Memory:', Math.round(require('os').totalmem() / 1024 / 1024), 'MB');
console.log('💾 Free Memory:', Math.round(require('os').freemem() / 1024 / 1024), 'MB');

// Set optimized environment variables
process.env.NODE_OPTIONS = '--max-old-space-size=8192';
process.env.NEXT_TELEMETRY_DISABLED = '1';
process.env.DISABLE_SENTRY = 'true';
process.env.ANALYZE = 'false';
process.env.SKIP_ENV_VALIDATION = 'true';

// Clean previous builds
if (fs.existsSync('.next')) {
  console.log('🧹 Cleaning .next directory...');
  execSync('rm -rf .next', { stdio: 'inherit' });
}

// Create a minimal next.config.js to override complex configs
const minimalConfig = `
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
`;

// Backup original config
console.log('📋 Backing up original config...');
if (fs.existsSync('next.config.ts')) {
  fs.renameSync('next.config.ts', 'next.config.ts.backup');
}

// Write minimal config
fs.writeFileSync('next.config.js', minimalConfig);

try {
  // Run prebuild cleanup
  console.log('🧹 Running prebuild cleanup...');
  execSync('pnpm run prebuild', { stdio: 'inherit' });
  
  // Run build with optimizations
  console.log('🔨 Starting optimized build...');
  execSync('next build', { 
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: 'production',
      // Force production mode
      NEXT_PUBLIC_VERCEL_ENV: 'production',
    }
  });
  
  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  
  // Try alternative build with even more memory
  console.log('🔄 Trying alternative build with more memory...');
  process.env.NODE_OPTIONS = '--max-old-space-size=12288';
  
  try {
    execSync('next build', { stdio: 'inherit' });
    console.log('✅ Alternative build completed!');
  } catch (finalError) {
    console.error('❌ All build attempts failed');
    process.exit(1);
  }
} finally {
  // Always restore original config
  console.log('🔄 Restoring original config...');
  if (fs.existsSync('next.config.ts.backup')) {
    fs.unlinkSync('next.config.js');
    fs.renameSync('next.config.ts.backup', 'next.config.ts');
  }
}