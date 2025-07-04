#!/usr/bin/env node
const fs = require('fs');
const { execSync } = require('child_process');

console.log('🚂 Iniciando build otimizado para Railway...');

try {
  // Backup do next.config.ts original
  if (fs.existsSync('next.config.ts')) {
    console.log('📦 Fazendo backup da configuração original...');
    fs.renameSync('next.config.ts', 'next.config.original.ts');
  }

  // Usar configuração otimizada
  console.log('⚙️ Aplicando configuração otimizada...');
  fs.renameSync('next.config.railway.ts', 'next.config.ts');

  // Limpar cache
  console.log('🧹 Limpando cache...');
  execSync('rm -rf .next', { stdio: 'inherit' });

  // Executar build
  console.log('🔨 Executando build...');
  execSync('next build', { stdio: 'inherit' });

  console.log('✅ Build concluído com sucesso!');
} catch (error) {
  console.error('❌ Erro durante o build:', error.message);
  process.exit(1);
} finally {
  // Restaurar configuração original
  if (fs.existsSync('next.config.ts') && fs.existsSync('next.config.original.ts')) {
    console.log('🔄 Restaurando configuração original...');
    fs.unlinkSync('next.config.ts');
    fs.renameSync('next.config.original.ts', 'next.config.ts');
  }
}