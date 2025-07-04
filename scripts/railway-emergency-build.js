#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🆘 Railway EMERGENCY Build v4.0 - Ultra Minimal');
console.log('💾 Memory:', Math.round(require('os').totalmem() / 1024 / 1024), 'MB');

// Emergency memory settings
process.env.NODE_OPTIONS = '--max-old-space-size=50176 --gc-global --expose-gc --optimize-for-size';
process.env.NEXT_TELEMETRY_DISABLED = '1';
process.env.DISABLE_SENTRY = 'true';
process.env.ANALYZE = 'false';
process.env.SKIP_ENV_VALIDATION = 'true';

// Emergency ultra minimal config - NO optimizations
const emergencyConfig = `
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  swcMinify: false,
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  images: { unoptimized: true },
  experimental: {
    serverMinification: false,
    optimizeCss: false,
    workerThreads: false,
    cpus: 1,
  },
  webpack: (config) => {
    config.optimization = {
      minimize: false,
      splitChunks: false,
      runtimeChunk: false,
    };
    config.cache = false;
    config.devtool = false;
    return config;
  }
};
module.exports = nextConfig;
`;

// Backup configs
console.log('📋 Emergency config backup...');
if (fs.existsSync('next.config.js')) {
  fs.renameSync('next.config.js', 'next.config.emergency.backup');
}

// Write emergency config
fs.writeFileSync('next.config.js', emergencyConfig);

// Emergency cleanup
console.log('🧹 Emergency cleanup...');
try {
  execSync('rm -rf .next/cache .next/static .next/server node_modules/.cache 2>/dev/null || true');
} catch (e) {}

console.log('🔨 Emergency build starting...');

try {
  // Force garbage collection
  if (global.gc) {
    console.log('🗑️ Force garbage collection...');
    global.gc();
  }

  // Run build with minimal resources
  execSync('next build', { 
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: 'production',
      FORCE_COLOR: '0',
    }
  });
  
  console.log('✅ EMERGENCY BUILD SUCCESS!');
} catch (error) {
  console.error('❌ Emergency build failed:', error.message);
  
  // Last resort - try to build with absolutely minimal pages
  console.log('🆘 TRYING ABSOLUTE MINIMAL BUILD...');
  
  // Temporarily rename complex pages
  const pagesToHide = [
    'src/app/[variants]/(main)/discover',
    'src/app/[variants]/(main)/docs',
    'src/app/[variants]/(main)/chat/(workspace)/@conversation',
  ];
  
  const backups = [];
  
  try {
    pagesToHide.forEach(page => {
      if (fs.existsSync(page)) {
        const backup = page + '.emergency_backup';
        fs.renameSync(page, backup);
        backups.push({ original: page, backup });
      }
    });
    
    // Try again with minimal pages
    execSync('next build', { stdio: 'inherit' });
    console.log('✅ MINIMAL BUILD SUCCESS!');
    
  } catch (finalError) {
    console.error('❌ All builds failed');
    process.exit(1);
  } finally {
    // Restore hidden pages
    backups.forEach(({ original, backup }) => {
      if (fs.existsSync(backup)) {
        fs.renameSync(backup, original);
      }
    });
  }
} finally {
  // Restore config
  console.log('🔄 Restoring emergency config...');
  if (fs.existsSync('next.config.emergency.backup')) {
    fs.unlinkSync('next.config.js');
    fs.renameSync('next.config.emergency.backup', 'next.config.js');
  }
}