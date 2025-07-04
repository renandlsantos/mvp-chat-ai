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

  // Limpar build anterior (preservando cache montado pelo Railway)
  if (fs.existsSync('.next')) {
    console.log('🧹 Limpando build anterior (preservando cache)...');
    const nextContents = fs.readdirSync('.next');
    nextContents.forEach(item => {
      if (item !== 'cache') {
        try {
          execSync(`rm -rf ".next/${item}"`, { stdio: 'inherit' });
        } catch (e) {
          console.log(`⚠️ Não foi possível remover .next/${item}`);
        }
      }
    });
  }

  // Executar build com limite de memória aumentado
  console.log('🔨 Executando build...');
  execSync('NODE_OPTIONS="--max-old-space-size=8192" next build', { 
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_OPTIONS: '--max-old-space-size=8192'
    }
  });

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