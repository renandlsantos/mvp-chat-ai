#!/bin/bash

# Script para separar o monorepo em Frontend, Backend e Mobile
# Mantém a compatibilidade com o banco de dados e funcionalidades

set -e

echo "🔄 Iniciando separação do monorepo..."

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Diretório raiz
ROOT_DIR=$(pwd)

# Criar estrutura de diretórios
echo -e "${BLUE}📁 Criando estrutura de diretórios...${NC}"
mkdir -p apps/{frontend,backend,mobile}
mkdir -p packages/{shared,database,ui-components}
mkdir -p infrastructure/{nginx,scripts}

# ========== BACKEND ==========
echo -e "${GREEN}🚀 Configurando Backend...${NC}"

# Criar estrutura do backend
mkdir -p apps/backend/{src,dist}
mkdir -p apps/backend/src/{routers,services,database,middleware,utils}

# Copiar arquivos do backend
cp -r src/app/\(backend\)/api/* apps/backend/src/routers/ 2>/dev/null || true
cp -r src/server/* apps/backend/src/ 2>/dev/null || true
cp -r src/database/* apps/backend/src/database/ 2>/dev/null || true
cp -r src/libs/trpc apps/backend/src/libs/ 2>/dev/null || true

# Criar package.json do backend
cat > apps/backend/package.json << 'EOF'
{
  "name": "@mvp-chat-ai/backend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc && tsc-alias",
    "start": "node dist/index.js",
    "db:migrate": "tsx src/database/migrate.ts",
    "db:generate": "drizzle-kit generate",
    "test": "vitest"
  },
  "dependencies": {
    "@trpc/server": "^11.2.0",
    "@trpc/standalone": "^11.2.0",
    "cors": "^2.8.5",
    "drizzle-orm": "^0.41.0",
    "express": "^4.19.2",
    "ws": "^8.18.2",
    "dotenv": "^16.5.0",
    "jose": "^5.10.0",
    "bcryptjs": "^3.0.2",
    "pg": "^8.16.0",
    "@neondatabase/serverless": "^1.0.0",
    "redis": "^4.6.7",
    "zod": "^3.25.48"
  },
  "devDependencies": {
    "@types/node": "^22.15.29",
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "tsx": "^4.19.4",
    "typescript": "^5.8.3",
    "drizzle-kit": "^0.30.6",
    "vitest": "^3.2.0",
    "tsc-alias": "^1.8.8"
  }
}
EOF

# Criar tsconfig.json do backend
cat > apps/backend/tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "lib": ["ES2022"],
    "moduleResolution": "NodeNext",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
EOF

# Criar index.ts principal do backend
cat > apps/backend/src/index.ts << 'EOF'
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createHTTPHandler } from '@trpc/server/adapters/standalone';
import { appRouter } from './routers';
import { createContext } from './context';
import { WebSocketServer } from 'ws';
import { initDatabase } from './database';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3210;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL?.split(',') || ['http://localhost:3000'],
  credentials: true,
}));
app.use(express.json({ limit: '100mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version 
  });
});

// tRPC handler
app.use(
  '/trpc',
  createHTTPHandler({
    router: appRouter,
    createContext,
  })
);

// Initialize database
initDatabase().then(() => {
  console.log('✅ Database initialized');
}).catch(console.error);

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Backend API running on http://localhost:${PORT}`);
  console.log(`📡 tRPC endpoint: http://localhost:${PORT}/trpc`);
});

// WebSocket setup
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('New WebSocket connection');
  
  ws.on('message', (message) => {
    console.log('Received:', message.toString());
  });
  
  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });
});

export { app, wss };
EOF

# ========== FRONTEND ==========
echo -e "${GREEN}🎨 Configurando Frontend...${NC}"

# Criar estrutura do frontend
mkdir -p apps/frontend/{src,public,components,hooks,services,store}

# Copiar arquivos do frontend
cp -r src/app/\[variants\]/* apps/frontend/src/ 2>/dev/null || true
cp -r src/components/* apps/frontend/components/ 2>/dev/null || true
cp -r src/hooks/* apps/frontend/hooks/ 2>/dev/null || true
cp -r src/store/* apps/frontend/store/ 2>/dev/null || true
cp -r src/features/* apps/frontend/src/features/ 2>/dev/null || true
cp -r public/* apps/frontend/public/ 2>/dev/null || true

# Criar package.json do frontend
cat > apps/frontend/package.json << 'EOF'
{
  "name": "@mvp-chat-ai/frontend",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev -p 3000",
    "build": "next build",
    "start": "next start -p 3000",
    "lint": "next lint",
    "test": "vitest"
  },
  "dependencies": {
    "@tanstack/react-query": "^5.79.0",
    "@trpc/client": "^11.2.0",
    "@trpc/react-query": "^11.2.0",
    "@trpc/next": "^11.1.4",
    "next": "^15.3.3",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "@lobehub/ui": "^2.5.6",
    "antd": "^5.25.4",
    "antd-style": "^3.7.1",
    "zustand": "5.0.4",
    "framer-motion": "^12.15.0",
    "lucide-react": "^0.522.0",
    "ahooks": "^3.8.5",
    "immer": "^10.1.1",
    "swr": "^2.3.3"
  },
  "devDependencies": {
    "@types/react": "^19.1.6",
    "@types/react-dom": "^19.1.5",
    "@types/node": "^22.15.29",
    "typescript": "^5.8.3",
    "eslint": "^8.57.1",
    "eslint-config-next": "^15.3.3",
    "vitest": "^3.2.0",
    "@vitejs/plugin-react": "^4.2.1"
  }
}
EOF

# Criar next.config.js do frontend
cat > apps/frontend/next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  
  // Proxy API calls to backend
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3210'}/api/:path*`,
      },
      {
        source: '/trpc/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3210'}/trpc/:path*`,
      },
    ];
  },
  
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3210',
    NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3210',
  },
  
  images: {
    domains: ['localhost'],
  },
};

module.exports = nextConfig;
EOF

# ========== MOBILE ==========
echo -e "${GREEN}📱 Configurando Mobile App...${NC}"

cd apps/mobile
npx create-expo-app . --template blank-typescript --no-install
cd $ROOT_DIR

# Adicionar dependências do mobile
cat > apps/mobile/package.json << 'EOF'
{
  "name": "@mvp-chat-ai/mobile",
  "version": "1.0.0",
  "main": "node_modules/expo/AppEntry.js",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "eject": "expo eject"
  },
  "dependencies": {
    "expo": "~51.0.0",
    "expo-status-bar": "~2.0.0",
    "react": "19.1.0",
    "react-native": "0.76.0",
    "@tanstack/react-query": "^5.79.0",
    "@trpc/client": "^11.2.0",
    "@trpc/react-query": "^11.2.0",
    "react-native-webview": "13.12.5",
    "expo-secure-store": "~14.0.0",
    "@react-navigation/native": "^7.0.0",
    "@react-navigation/stack": "^7.0.0",
    "react-native-safe-area-context": "5.0.0",
    "react-native-screens": "~4.1.0"
  },
  "devDependencies": {
    "@babel/core": "^7.24.0",
    "@types/react": "~19.1.0",
    "@types/react-native": "~0.76.0",
    "typescript": "^5.8.3"
  },
  "private": true
}
EOF

# ========== SHARED PACKAGES ==========
echo -e "${GREEN}📦 Configurando pacotes compartilhados...${NC}"

# Database package
cat > packages/database/package.json << 'EOF'
{
  "name": "@mvp-chat-ai/database",
  "version": "1.0.0",
  "main": "index.ts",
  "dependencies": {
    "drizzle-orm": "^0.41.0",
    "drizzle-kit": "^0.30.6",
    "pg": "^8.16.0",
    "drizzle-zod": "^0.5.1"
  }
}
EOF

# Copiar schemas do banco
cp -r src/database/schemas packages/database/ 2>/dev/null || true

# ========== DOCKER ==========
echo -e "${GREEN}🐳 Criando Docker Compose...${NC}"

cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  postgres:
    image: pgvector/pgvector:pg16
    environment:
      POSTGRES_USER: chatai
      POSTGRES_PASSWORD: chatai_password
      POSTGRES_DB: chatai_production
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U chatai"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  backend:
    build: ./apps/backend
    ports:
      - "3210:3210"
    environment:
      - DATABASE_URL=postgresql://chatai:chatai_password@postgres:5432/chatai_production
      - REDIS_URL=redis://redis:6379
      - NODE_ENV=development
    depends_on:
      postgres:
        condition: service_healthy
    volumes:
      - ./apps/backend:/app
      - /app/node_modules

  frontend:
    build: ./apps/frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:3210
    depends_on:
      - backend
    volumes:
      - ./apps/frontend:/app
      - /app/node_modules

volumes:
  postgres_data:
  redis_data:
EOF

# ========== ENV FILES ==========
echo -e "${GREEN}📄 Criando arquivos .env...${NC}"

# Backend .env
cat > apps/backend/.env.example << 'EOF'
# Database
DATABASE_URL=postgresql://chatai:chatai_password@localhost:5432/chatai_production

# Redis
REDIS_URL=redis://localhost:6379

# Security
JWT_SECRET=your-jwt-secret-here
ENCRYPTION_KEY=your-encryption-key-here

# AI Providers
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GOOGLE_API_KEY=

# Server
PORT=3210
NODE_ENV=development
EOF

# Frontend .env
cat > apps/frontend/.env.example << 'EOF'
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3210
NEXT_PUBLIC_WS_URL=ws://localhost:3210

# Analytics
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_ANALYTICS_ID=
EOF

# ========== SCRIPTS ==========
echo -e "${GREEN}🔧 Criando scripts auxiliares...${NC}"

# Makefile
cat > Makefile << 'EOF'
.PHONY: install dev build start clean test

install:
	cd apps/backend && pnpm install
	cd apps/frontend && pnpm install
	cd apps/mobile && pnpm install

dev:
	docker-compose up -d postgres redis
	make -j 2 dev-backend dev-frontend

dev-backend:
	cd apps/backend && pnpm dev

dev-frontend:
	cd apps/frontend && pnpm dev

dev-mobile:
	cd apps/mobile && pnpm start

build:
	cd apps/backend && pnpm build
	cd apps/frontend && pnpm build

start:
	docker-compose up -d

stop:
	docker-compose down

clean:
	docker-compose down -v
	rm -rf apps/*/node_modules
	rm -rf apps/frontend/.next
	rm -rf apps/backend/dist

test:
	cd apps/backend && pnpm test
	cd apps/frontend && pnpm test
EOF

echo -e "${GREEN}✅ Separação concluída!${NC}"
echo ""
echo "Próximos passos:"
echo "1. cd apps/backend && pnpm install"
echo "2. cd apps/frontend && pnpm install"
echo "3. Configure os arquivos .env em cada aplicação"
echo "4. make dev (para iniciar tudo)"
echo ""
echo "Ou use Docker:"
echo "docker-compose up -d"