#!/bin/bash
# Script de build otimizado para Railway

echo "🚂 Iniciando build no Railway..."

# Configurar variáveis de ambiente
export NODE_OPTIONS="--max-old-space-size=4096"
export NEXT_TELEMETRY_DISABLED=1
export ANALYZE=false

# Limpar caches antigos
echo "🧹 Limpando caches..."
rm -rf .next

# Build da aplicação
echo "🔨 Executando build..."
pnpm run build

# Verificar se o build foi bem sucedido
if [ $? -eq 0 ]; then
  echo "✅ Build concluído com sucesso!"
else
  echo "❌ Erro durante o build"
  exit 1
fi