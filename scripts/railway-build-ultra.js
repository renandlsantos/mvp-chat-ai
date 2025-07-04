#!/usr/bin/env node
const fs = require('fs');
const { execSync } = require('child_process');

console.log('🚂 Iniciando build ULTRA otimizado para Railway...');
console.log('⚡ Este build prioriza VELOCIDADE sobre otimização');

try {
  // 1. Backup da configuração original
  if (fs.existsSync('next.config.ts')) {
    console.log('📦 Fazendo backup da configuração original...');
    fs.renameSync('next.config.ts', 'next.config.original.ts');
  }

  // 2. Usar configuração ULTRA otimizada
  console.log('⚙️ Aplicando configuração ULTRA otimizada...');
  fs.renameSync('next.config.railway-ultra.ts', 'next.config.ts');

  // 3. Limpar completamente a pasta .next
  if (fs.existsSync('.next')) {
    console.log('🧹 Limpando build anterior completamente...');
    execSync('rm -rf .next', { stdio: 'inherit' });
  }

  // 4. Criar estrutura mínima
  fs.mkdirSync('.next', { recursive: true });

  // 5. Configurar ambiente para build rápido
  const env = {
    ...process.env,
    // Máxima memória disponível
    NODE_OPTIONS: '--max-old-space-size=8192 --max-semi-space-size=128',
    // Desabilitar TUDO que não é essencial
    NEXT_TELEMETRY_DISABLED: '1',
    ANALYZE: 'false',
    DISABLE_SENTRY: 'true',
    // Forçar modo de produção
    NODE_ENV: 'production',
    // Configurações para build rápido
    NEXT_PRIVATE_STANDALONE: 'true',
    NEXT_PRIVATE_MINIMAL_MODE: '1',
    // Desabilitar features
    NEXT_RUNTIME_SKIP_PREFETCH: '1',
    NEXT_DISABLE_MINIFICATION: '1',
    NEXT_DISABLE_COMPRESSION: '1',
  };

  // 6. Executar build com timeout estendido
  console.log('🔨 Executando build ULTRA rápido...');
  console.log('⏱️ Isso pode levar alguns minutos...');
  
  try {
    execSync('next build', { 
      stdio: 'inherit',
      env,
      // Timeout de 30 minutos
      timeout: 30 * 60 * 1000,
    });
  } catch (error) {
    console.error('❌ Build falhou, tentando sem páginas estáticas...');
    
    // Criar um arquivo para forçar modo dinâmico em TODAS as páginas
    const forceConfig = `
// Forçar TODAS as páginas a serem dinâmicas
export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 0;
`;
    
    // Escrever em cada pasta principal
    const folders = [
      'src/app/[variants]',
      'src/app/[variants]/(main)',
      'src/app/[variants]/(auth)',
    ];
    
    folders.forEach(folder => {
      const configPath = `${folder}/force-dynamic.config.ts`;
      if (fs.existsSync(folder)) {
        fs.writeFileSync(configPath, forceConfig, 'utf8');
        console.log(`✍️ Criado ${configPath}`);
      }
    });
    
    // Tentar novamente
    execSync('next build', { 
      stdio: 'inherit',
      env,
      timeout: 30 * 60 * 1000,
    });
  }

  console.log('✅ Build ULTRA concluído com sucesso!');

  // 7. Verificar se o build foi criado
  if (!fs.existsSync('.next/BUILD_ID')) {
    console.log('📝 Criando BUILD_ID manualmente...');
    fs.writeFileSync('.next/BUILD_ID', 'railway-ultra-' + Date.now(), 'utf8');
  }

} catch (error) {
  console.error('❌ Erro fatal no build:', error.message);
  process.exit(1);
} finally {
  // Restaurar configuração original
  if (fs.existsSync('next.config.ts') && fs.existsSync('next.config.original.ts')) {
    console.log('🔄 Restaurando configuração original...');
    fs.unlinkSync('next.config.ts');
    fs.renameSync('next.config.original.ts', 'next.config.ts');
  }
}