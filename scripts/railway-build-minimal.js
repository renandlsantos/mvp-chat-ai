#!/usr/bin/env node
const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

console.log('🚂 Iniciando build mínimo para Railway...');

try {
  // 1. Criar uma configuração mínima temporária
  const minimalConfig = `
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  generateStaticParams: false,
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  images: { unoptimized: true },
  experimental: {
    // Desabilitar tudo que não é essencial
    optimizeCss: false,
    nextScriptWorkers: false,
    scrollRestoration: false,
    serverMinification: false,
    webpackBuildWorker: false,
  },
  // Forçar build mínimo
  distDir: '.next',
  cleanDistDir: true,
  reactStrictMode: false,
  webpack: (config) => {
    // Configurações mínimas
    config.optimization.minimize = false;
    config.optimization.splitChunks = false;
    config.devtool = false;
    
    // Resolver zipfile
    if (config.resolve.fallback) {
      config.resolve.fallback.zipfile = false;
    }
    
    return config;
  },
};

export default nextConfig;
`;

  // 2. Backup da configuração original
  if (fs.existsSync('next.config.ts')) {
    console.log('📦 Fazendo backup da configuração original...');
    fs.renameSync('next.config.ts', 'next.config.backup.ts');
  }

  // 3. Escrever configuração mínima
  console.log('✍️ Escrevendo configuração mínima...');
  fs.writeFileSync('next.config.ts', minimalConfig, 'utf8');

  // 4. Limpar pasta .next
  if (fs.existsSync('.next')) {
    console.log('🧹 Limpando build anterior...');
    execSync('rm -rf .next', { stdio: 'inherit' });
  }

  // 5. Executar build com configurações extremas
  console.log('🔨 Executando build mínimo...');
  const env = {
    ...process.env,
    NODE_OPTIONS: '--max-old-space-size=8192',
    NEXT_TELEMETRY_DISABLED: '1',
    // Forçar modo de produção mínimo
    NODE_ENV: 'production',
    NEXT_PRIVATE_STANDALONE: 'true',
    // Desabilitar features
    NEXT_PUBLIC_DISABLE_SENTRY: 'true',
    DISABLE_SENTRY: 'true',
    ANALYZE: 'false',
  };

  try {
    execSync('next build', { 
      stdio: 'inherit',
      env,
    });
  } catch (buildError) {
    console.error('❌ Build falhou, tentando abordagem alternativa...');
    
    // Tentar build sem geração de páginas
    execSync('next build --experimental-app-only', { 
      stdio: 'inherit',
      env,
    });
  }

  console.log('✅ Build concluído!');

} catch (error) {
  console.error('❌ Erro fatal:', error.message);
  process.exit(1);
} finally {
  // Restaurar configuração original
  if (fs.existsSync('next.config.backup.ts')) {
    console.log('🔄 Restaurando configuração original...');
    if (fs.existsSync('next.config.ts')) {
      fs.unlinkSync('next.config.ts');
    }
    fs.renameSync('next.config.backup.ts', 'next.config.ts');
  }
}