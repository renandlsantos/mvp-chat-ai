#!/usr/bin/env node
const fs = require('fs');
const { execSync } = require('child_process');

console.log('🚂 Iniciando build SIMPLES para Railway...');
console.log('📌 Este build não modifica arquivos existentes');

try {
  // 1. Backup da configuração original
  if (fs.existsSync('next.config.ts')) {
    console.log('📦 Fazendo backup da configuração original...');
    fs.copyFileSync('next.config.ts', 'next.config.original.ts');
  }

  // 2. Copiar configuração otimizada
  console.log('⚙️ Aplicando configuração otimizada...');
  fs.copyFileSync('next.config.railway.ts', 'next.config.ts');

  // 3. NÃO DELETAR NADA - apenas executar o build
  console.log('🔨 Executando build (sem limpar arquivos anteriores)...');
  
  const env = {
    ...process.env,
    NODE_OPTIONS: '--max-old-space-size=8192',
    NEXT_TELEMETRY_DISABLED: '1',
    NODE_ENV: 'production',
  };

  execSync('next build', { 
    stdio: 'inherit',
    env,
  });

  console.log('✅ Build concluído com sucesso!');

} catch (error) {
  console.error('❌ Erro durante o build:', error.message);
  process.exit(1);
} finally {
  // Restaurar configuração original
  if (fs.existsSync('next.config.original.ts')) {
    console.log('🔄 Restaurando configuração original...');
    fs.copyFileSync('next.config.original.ts', 'next.config.ts');
    fs.unlinkSync('next.config.original.ts');
  }
}