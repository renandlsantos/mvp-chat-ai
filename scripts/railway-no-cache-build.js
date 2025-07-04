#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚂 Railway Build (No Cache Clean) v1.0');
console.log('📊 Node version:', process.version);
console.log('💾 Memory:', Math.round(require('os').totalmem() / 1024 / 1024), 'MB');

// Set environment
process.env.NODE_OPTIONS = '--max-old-space-size=8192';
process.env.NEXT_TELEMETRY_DISABLED = '1';
process.env.DISABLE_SENTRY = 'true';
process.env.SKIP_ENV_VALIDATION = 'true';

try {
  // Run prebuild
  console.log('🧹 Running prebuild...');
  execSync('pnpm run prebuild', { stdio: 'inherit' });
  
  // Build with TypeScript errors ignored
  console.log('🔨 Starting build with relaxed checks...');
  execSync('next build', { 
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: 'production',
      // Ignore TypeScript errors
      SKIP_TYPE_CHECK: 'true'
    }
  });
  
  console.log('✅ Build completed!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}