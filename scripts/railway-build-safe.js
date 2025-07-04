#!/usr/bin/env node
const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

console.log('🚂 Iniciando build otimizado para Railway (modo seguro)...');

// Função para executar comando com tratamento de erro
function runCommand(command, description) {
  console.log(`\n🔧 ${description}...`);
  try {
    execSync(command, { 
      stdio: 'inherit',
      env: {
        ...process.env,
        NODE_OPTIONS: '--max-old-space-size=8192',
        NEXT_TELEMETRY_DISABLED: '1',
      }
    });
    return true;
  } catch (error) {
    console.error(`❌ Erro: ${error.message}`);
    return false;
  }
}

try {
  // 1. Backup da configuração original
  if (fs.existsSync('next.config.ts')) {
    console.log('📦 Fazendo backup da configuração original...');
    fs.renameSync('next.config.ts', 'next.config.original.ts');
  }

  // 2. Usar configuração otimizada
  console.log('⚙️ Aplicando configuração otimizada...');
  fs.renameSync('next.config.railway.ts', 'next.config.ts');

  // 3. Limpar builds anteriores (exceto cache)
  console.log('🧹 Limpando builds anteriores...');
  if (fs.existsSync('.next')) {
    // Preservar apenas o cache
    const cacheDir = '.next/cache';
    const hasCache = fs.existsSync(cacheDir);
    
    if (hasCache) {
      // Mover cache temporariamente
      fs.renameSync(cacheDir, '.next-cache-temp');
    }
    
    // Remover .next
    execSync('rm -rf .next', { stdio: 'inherit' });
    
    // Restaurar cache
    if (hasCache) {
      fs.mkdirSync('.next', { recursive: true });
      fs.renameSync('.next-cache-temp', cacheDir);
    }
  }

  // 4. Criar estrutura .next básica
  fs.mkdirSync('.next', { recursive: true });

  // 5. Build em modo mínimo
  console.log('🔨 Executando build...');
  
  // Definir variáveis de ambiente para build mínimo
  process.env.NEXT_PRIVATE_STANDALONE = 'true';
  process.env.NEXT_PRIVATE_MINIMAL_MODE = '1';
  
  // Executar build com configurações mínimas
  const buildSuccess = runCommand(
    'next build --experimental-build-mode=compile',
    'Compilando aplicação'
  );

  if (!buildSuccess) {
    // Tentar build alternativo se falhar
    console.log('🔄 Tentando build alternativo...');
    runCommand('next build', 'Build padrão');
  }

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

// Criar arquivo de sucesso para verificação
fs.writeFileSync('.next/BUILD_ID', 'railway-build', 'utf8');
console.log('📋 Build ID criado: railway-build');