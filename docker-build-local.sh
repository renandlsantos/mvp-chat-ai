#!/bin/bash

echo "🏗️ Fazendo build local primeiro..."

# Build local
NODE_OPTIONS="--max-old-space-size=8192" \
NEXT_TELEMETRY_DISABLED=1 \
pnpm run build

if [ $? -eq 0 ]; then
    echo "✅ Build local concluído!"
    
    # Criar Dockerfile que apenas copia os arquivos já buildados
    cat > Dockerfile.prebuilt << 'EOF'
FROM node:20-alpine
WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm@9.1.0

# Copiar package files
COPY package.json pnpm-lock.yaml* ./

# Instalar apenas produção
RUN pnpm install --prod --no-frozen-lockfile --ignore-scripts

# Copiar arquivos já buildados
COPY .next ./.next
COPY public ./public
COPY next.config.ts ./

# Se tiver standalone
COPY .next/standalone ./

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Usar o servidor standalone se existir
CMD if [ -f "server.js" ]; then \
      node server.js; \
    elif [ -f ".next/standalone/server.js" ]; then \
      node .next/standalone/server.js; \
    else \
      pnpm start; \
    fi
EOF

    echo "📦 Dockerfile.prebuilt criado!"
    echo ""
    echo "Agora você pode:"
    echo "1. Fazer commit dos arquivos buildados:"
    echo "   git add .next Dockerfile.prebuilt"
    echo "   git commit -m 'Add prebuilt files'"
    echo "   git push"
    echo ""
    echo "2. No Railway, mude dockerfilePath para: ./Dockerfile.prebuilt"
    
else
    echo "❌ Build local falhou"
    exit 1
fi