#!/usr/bin/env node
const fs = require('fs');
const { execSync } = require('child_process');

console.log('🚂 Build BÁSICO Railway - Configuração mínima');

try {
  // Usar configuração básica
  if (fs.existsSync('next.config.railway-basic.ts')) {
    fs.copyFileSync('next.config.ts', 'next.config.backup.ts');
    fs.copyFileSync('next.config.railway-basic.ts', 'next.config.ts');
  }

  // Build simples
  execSync('NODE_OPTIONS="--max-old-space-size=8192" next build', { 
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_OPTIONS: '--max-old-space-size=8192',
      NEXT_TELEMETRY_DISABLED: '1',
    }
  });

  console.log('✅ Build básico concluído!');

} catch (error) {
  console.error('❌ Erro:', error.message);
  process.exit(1);
} finally {
  // Restaurar
  if (fs.existsSync('next.config.backup.ts')) {
    fs.copyFileSync('next.config.backup.ts', 'next.config.ts');
    fs.unlinkSync('next.config.backup.ts');
  }
}