#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🪶 Railway ULTRALIGHT Build - Frontend/Backend Only');
console.log('💾 Memory:', Math.round(require('os').totalmem() / 1024 / 1024), 'MB');

// Ultra conservative memory
process.env.NODE_OPTIONS = '--max-old-space-size=30720'; // 30GB
process.env.NEXT_TELEMETRY_DISABLED = '1';
process.env.DISABLE_SENTRY = 'true';
process.env.ANALYZE = 'false';
process.env.SKIP_ENV_VALIDATION = 'true';

// Disable heavy features
process.env.NEXT_PUBLIC_ENABLE_KNOWLEDGE_BASE = 'false';
process.env.NEXT_PUBLIC_ENABLE_FILE_UPLOAD = 'false';
process.env.NEXT_PUBLIC_ENABLE_PLUGINS = 'false';
process.env.NEXT_PUBLIC_ENABLE_ARTIFACTS = 'false';
process.env.NEXT_PUBLIC_ENABLE_DISCOVER = 'false';
process.env.NEXT_PUBLIC_ENABLE_DOCS = 'false';

// Ultra minimal Next.js config
const ultralightConfig = `
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
    // Disable all optimizations
    config.optimization = {
      minimize: false,
      splitChunks: false,
      runtimeChunk: false,
    };
    config.cache = false;
    config.devtool = false;
    
    // Skip heavy modules
    config.resolve.alias = {
      ...config.resolve.alias,
      '@lobehub/charts': false,
      '@codesandbox/sandpack-react': false,
      '@cyntler/react-doc-viewer': false,
      'pdfjs-dist': false,
      'react-pdf': false,
      'epub2': false,
      'mammoth': false,
      'officeparser': false,
      '@langchain/community': false,
      'modern-screenshot': false,
      '@xterm/xterm': false,
    };
    
    // Ignore heavy file types
    config.module.rules.push({
      test: /\.(pdf|epub|docx|xlsx|pptx)$/,
      use: 'null-loader',
    });
    
    return config;
  },
  // Exclude heavy pages from build
  async rewrites() {
    return [
      {
        source: '/discover/:path*',
        destination: '/api/disabled',
      },
      {
        source: '/docs/:path*',
        destination: '/api/disabled',
      },
      {
        source: '/knowledge-base/:path*',
        destination: '/api/disabled',
      },
      {
        source: '/artifacts/:path*',
        destination: '/api/disabled',
      },
    ];
  },
};

module.exports = nextConfig;
`;

// Minimal disabled API route
const disabledRoute = `
export default function handler(req, res) {
  res.status(503).json({ message: 'This feature is temporarily disabled for minimal build' });
}
`;

console.log('📋 Creating ultralight configuration...');

// Backup original config
if (fs.existsSync('next.config.js')) {
  fs.renameSync('next.config.js', 'next.config.ultralight.backup');
}

// Write ultralight config
fs.writeFileSync('next.config.js', ultralightConfig);

// Create disabled API route
const apiDir = path.join('src', 'app', '(backend)', 'api');
if (!fs.existsSync(path.join(apiDir, 'disabled.ts'))) {
  fs.writeFileSync(path.join(apiDir, 'disabled.ts'), disabledRoute);
}

// Clean everything
console.log('🧹 Ultra cleanup...');
try {
  execSync('rm -rf .next node_modules/.cache 2>/dev/null || true');
} catch (e) {}

// Temporarily move heavy directories
const heavyDirs = [
  'src/app/[variants]/(main)/discover',
  'src/app/[variants]/(main)/docs',
  'src/features/KnowledgeBaseModal',
  'src/features/FileManager',
  'src/features/PluginStore',
  'src/tools/artifacts',
  'packages/file-loaders',
  'packages/web-crawler',
];

const movedDirs = [];

try {
  console.log('📦 Temporarily hiding heavy features...');
  
  heavyDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      const backupDir = dir + '.ultralight_backup';
      fs.renameSync(dir, backupDir);
      movedDirs.push({ original: dir, backup: backupDir });
      console.log(`  - Hidden: ${dir}`);
    }
  });

  console.log('🔨 Starting ultralight build...');
  
  // Force garbage collection
  if (global.gc) {
    global.gc();
  }

  // Run build
  execSync('next build', { 
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: 'production',
    }
  });
  
  console.log('✅ ULTRALIGHT BUILD SUCCESS!');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
} finally {
  // Restore everything
  console.log('🔄 Restoring configuration...');
  
  // Restore directories
  movedDirs.forEach(({ original, backup }) => {
    if (fs.existsSync(backup)) {
      fs.renameSync(backup, original);
    }
  });
  
  // Restore config
  if (fs.existsSync('next.config.ultralight.backup')) {
    fs.unlinkSync('next.config.js');
    fs.renameSync('next.config.ultralight.backup', 'next.config.js');
  }
  
  // Remove disabled route
  const disabledPath = path.join(apiDir, 'disabled.ts');
  if (fs.existsSync(disabledPath)) {
    fs.unlinkSync(disabledPath);
  }
}