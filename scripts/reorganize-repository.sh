#!/bin/bash

# Script para reorganizar completamente o repositório em módulos separados
# Cada módulo terá tudo que precisa para funcionar independentemente

set -e

echo "🔄 Iniciando reorganização completa do repositório..."

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Diretório raiz
ROOT_DIR=$(pwd)

# Função de log
log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

# Criar estrutura base
log "📁 Criando nova estrutura de diretórios..."
mkdir -p backend/{src,tests,scripts,docs}
mkdir -p frontend/{src,public,tests,scripts,docs}
mkdir -p mobile/{src,assets,tests,docs}
mkdir -p shared/{types,utils,constants,schemas}
mkdir -p infrastructure/{docker,kubernetes,nginx,scripts}
mkdir -p docs

# ========================================
# BACKEND - Estrutura Completa
# ========================================
log "🚀 Organizando Backend..."

# Criar estrutura do backend
mkdir -p backend/src/{api,core,database,libs,services,utils,config}
mkdir -p backend/src/api/{routes,middleware,validators,controllers}
mkdir -p backend/src/core/{auth,chat,credits,files,knowledge,models,plugins}
mkdir -p backend/src/database/{schemas,migrations,seeds,repositories}
mkdir -p backend/src/services/{ai,storage,cache,queue,websocket}

# Copiar arquivos do backend
log "📋 Copiando arquivos do backend..."

# API Routes
if [ -d "src/app/(backend)/api" ]; then
    cp -r src/app/\(backend\)/api/* backend/src/api/routes/ 2>/dev/null || true
fi

# Database
if [ -d "src/database" ]; then
    cp -r src/database/schemas backend/src/database/ 2>/dev/null || true
    cp -r src/database/models backend/src/database/repositories/ 2>/dev/null || true
    cp -r src/database/migrations backend/src/database/ 2>/dev/null || true
fi

# Server modules
if [ -d "src/server" ]; then
    cp -r src/server/* backend/src/core/ 2>/dev/null || true
fi

# Services
if [ -d "src/services" ]; then
    cp -r src/services/* backend/src/services/ 2>/dev/null || true
fi

# tRPC
if [ -d "src/libs/trpc" ]; then
    cp -r src/libs/trpc backend/src/libs/ 2>/dev/null || true
fi

# Chains (AI)
if [ -d "src/chains" ]; then
    cp -r src/chains backend/src/services/ai/ 2>/dev/null || true
fi

# Criar package.json do Backend
cat > backend/package.json << 'EOF'
{
  "name": "@mvp-chat-ai/backend",
  "version": "1.0.0",
  "description": "Backend API for MVP Chat AI",
  "type": "module",
  "main": "dist/index.js",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc && tsc-alias",
    "start": "node dist/index.js",
    "start:prod": "NODE_ENV=production node dist/index.js",
    "test": "vitest",
    "test:coverage": "vitest run --coverage",
    "lint": "eslint src --ext .ts,.tsx",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "tsx src/database/migrate.ts",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio",
    "db:seed": "tsx src/database/seeds/index.ts"
  },
  "dependencies": {
    "@anthropic-ai/sdk": "^0.54.0",
    "@aws-sdk/client-s3": "^3.821.0",
    "@azure/openai": "^1.0.0",
    "@google/generative-ai": "^0.24.1",
    "@langchain/community": "^0.3.45",
    "@neondatabase/serverless": "^1.0.0",
    "@trpc/server": "^11.2.0",
    "@trpc/standalone": "^11.2.0",
    "bcryptjs": "^3.0.2",
    "bull": "^4.16.3",
    "cors": "^2.8.5",
    "dotenv": "^16.5.0",
    "drizzle-orm": "^0.41.0",
    "express": "^4.19.2",
    "express-rate-limit": "^7.4.1",
    "helmet": "^8.0.0",
    "ioredis": "^5.4.2",
    "jose": "^5.10.0",
    "langchain": "^0.3.27",
    "multer": "^1.4.5-lts.1",
    "openai": "^4.104.0",
    "pg": "^8.16.0",
    "pino": "^9.7.0",
    "sharp": "^0.33.5",
    "stripe": "^16.12.0",
    "unstructured-client": "^0.19.0",
    "uuid": "^11.1.0",
    "ws": "^8.18.2",
    "zod": "^3.25.48"
  },
  "devDependencies": {
    "@types/bcryptjs": "^3.0.2",
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/multer": "^1.4.14",
    "@types/node": "^22.15.29",
    "@types/pg": "^8.15.4",
    "@types/ws": "^8.18.1",
    "@typescript-eslint/eslint-plugin": "^8.28.0",
    "@typescript-eslint/parser": "^8.28.0",
    "@vitest/coverage-v8": "^3.1.4",
    "drizzle-kit": "^0.30.6",
    "eslint": "^8.57.1",
    "prettier": "^3.5.3",
    "tsx": "~4.19.4",
    "tsc-alias": "^1.8.8",
    "typescript": "^5.8.3",
    "vitest": "^3.2.0"
  }
}
EOF

# Criar tsconfig.json do Backend
cat > backend/tsconfig.json << 'EOF'
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
      "@/*": ["src/*"],
      "@api/*": ["src/api/*"],
      "@core/*": ["src/core/*"],
      "@database/*": ["src/database/*"],
      "@services/*": ["src/services/*"],
      "@shared/*": ["../shared/*"]
    },
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
EOF

# Criar arquivo principal do Backend
cat > backend/src/index.ts << 'EOF'
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { createHTTPHandler } from '@trpc/server/adapters/standalone';
import { appRouter } from './api/trpc/router';
import { createContext } from './api/trpc/context';
import { initDatabase } from './database';
import { logger } from './utils/logger';
import { errorHandler } from './api/middleware/errorHandler';
import { setupRoutes } from './api/routes';
import { initializeServices } from './services';

const app = express();
const PORT = process.env.PORT || 3210;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
}));

// Body parsing
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  });
});

// API Routes
setupRoutes(app);

// tRPC handler
app.use('/trpc', createHTTPHandler({
  router: appRouter,
  createContext,
}));

// Error handling
app.use(errorHandler);

// Initialize server
const server = createServer(app);

// WebSocket setup
const wss = new WebSocketServer({ server });

wss.on('connection', (ws, req) => {
  logger.info('New WebSocket connection', {
    ip: req.socket.remoteAddress,
    url: req.url,
  });
  
  ws.on('message', (message) => {
    // Handle WebSocket messages
    logger.debug('WebSocket message received', { message: message.toString() });
  });
  
  ws.on('close', () => {
    logger.info('WebSocket connection closed');
  });
  
  ws.on('error', (error) => {
    logger.error('WebSocket error', error);
  });
});

// Start server
async function start() {
  try {
    // Initialize database
    await initDatabase();
    logger.info('Database initialized');
    
    // Initialize services
    await initializeServices();
    logger.info('Services initialized');
    
    // Start listening
    server.listen(PORT, () => {
      logger.info(`🚀 Backend API running on http://localhost:${PORT}`);
      logger.info(`📡 tRPC endpoint: http://localhost:${PORT}/trpc`);
      logger.info(`🔌 WebSocket endpoint: ws://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

start();
EOF

# Criar .env.example do Backend
cat > backend/.env.example << 'EOF'
# Server
NODE_ENV=development
PORT=3210
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# Database
DATABASE_URL=postgresql://chatai:password@localhost:5432/chatai_production

# Redis
REDIS_URL=redis://localhost:6379

# Security
JWT_SECRET=your-jwt-secret-here-change-in-production
ENCRYPTION_KEY=your-32-char-encryption-key-here

# AI Providers
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GOOGLE_API_KEY=
AZURE_OPENAI_API_KEY=
AZURE_OPENAI_ENDPOINT=

# AWS S3 (or compatible)
S3_ENDPOINT=https://s3.amazonaws.com
S3_BUCKET=mvp-chat-ai
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=

# Stripe (optional)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Email (optional)
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
EMAIL_FROM=noreply@example.com

# Monitoring (optional)
SENTRY_DSN=
LOG_LEVEL=info
EOF

# Criar Dockerfile do Backend
cat > backend/Dockerfile << 'EOF'
# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10.10.0

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source
COPY . .

# Build application
RUN pnpm build

# Production stage
FROM node:22-alpine AS runner

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10.10.0

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml* ./

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

# Change ownership
RUN chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3210

CMD ["node", "dist/index.js"]
EOF

# ========================================
# FRONTEND - Estrutura Completa
# ========================================
log "🎨 Organizando Frontend..."

# Criar estrutura do frontend
mkdir -p frontend/src/{app,components,features,hooks,store,services,utils,styles}
mkdir -p frontend/src/app/{chat,auth,settings,discover,docs}
mkdir -p frontend/src/components/{common,chat,auth,layout}
mkdir -p frontend/src/features/{chat,auth,settings,knowledge,files}
mkdir -p frontend/public/{images,icons,fonts}

# Copiar arquivos do frontend
log "📋 Copiando arquivos do frontend..."

# App routes
if [ -d "src/app/[variants]" ]; then
    cp -r src/app/\[variants\]/* frontend/src/app/ 2>/dev/null || true
fi

# Components
if [ -d "src/components" ]; then
    cp -r src/components/* frontend/src/components/ 2>/dev/null || true
fi

# Features
if [ -d "src/features" ]; then
    cp -r src/features/* frontend/src/features/ 2>/dev/null || true
fi

# Hooks
if [ -d "src/hooks" ]; then
    cp -r src/hooks/* frontend/src/hooks/ 2>/dev/null || true
fi

# Store
if [ -d "src/store" ]; then
    cp -r src/store/* frontend/src/store/ 2>/dev/null || true
fi

# Styles
if [ -d "src/styles" ]; then
    cp -r src/styles/* frontend/src/styles/ 2>/dev/null || true
fi

# Public assets
if [ -d "public" ]; then
    cp -r public/* frontend/public/ 2>/dev/null || true
fi

# Criar package.json do Frontend
cat > frontend/package.json << 'EOF'
{
  "name": "@mvp-chat-ai/frontend",
  "version": "1.0.0",
  "description": "Frontend for MVP Chat AI",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3000",
    "build": "next build",
    "start": "next start -p 3000",
    "lint": "next lint",
    "test": "vitest",
    "test:e2e": "playwright test",
    "type-check": "tsc --noEmit",
    "format": "prettier --write \"src/**/*.{ts,tsx,js,jsx,json,css,md}\""
  },
  "dependencies": {
    "@ant-design/icons": "^5.6.1",
    "@lobehub/ui": "^2.5.6",
    "@tanstack/react-query": "^5.79.0",
    "@trpc/client": "^11.2.0",
    "@trpc/next": "^11.1.4",
    "@trpc/react-query": "^11.2.0",
    "ahooks": "^3.8.5",
    "antd": "^5.25.4",
    "antd-style": "^3.7.1",
    "dayjs": "^1.11.13",
    "framer-motion": "^12.15.0",
    "i18next": "^24.2.3",
    "immer": "^10.1.1",
    "lodash-es": "^4.17.21",
    "lucide-react": "^0.522.0",
    "nanoid": "^5.1.5",
    "next": "^15.3.3",
    "next-auth": "5.0.0-beta.25",
    "nextjs-toploader": "^3.8.16",
    "nuqs": "^2.4.3",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "react-hotkeys-hook": "^5.1.0",
    "react-i18next": "^15.5.2",
    "react-intersection-observer": "^9.14.0",
    "react-markdown": "^9.0.3",
    "react-syntax-highlighter": "^15.6.2",
    "react-use": "^17.6.0",
    "react-wrap-balancer": "^1.1.1",
    "remark-gfm": "^4.0.1",
    "swr": "^2.3.3",
    "use-merge-value": "^1.2.0",
    "uuid": "^11.1.0",
    "zustand": "5.0.4"
  },
  "devDependencies": {
    "@next/bundle-analyzer": "^15.3.3",
    "@playwright/test": "^1.50.0",
    "@types/lodash-es": "^4.17.12",
    "@types/node": "^22.15.29",
    "@types/react": "^19.1.6",
    "@types/react-dom": "^19.1.5",
    "@types/react-syntax-highlighter": "^15.5.13",
    "@types/uuid": "^10.0.0",
    "@typescript-eslint/eslint-plugin": "^8.28.0",
    "@typescript-eslint/parser": "^8.28.0",
    "@vitejs/plugin-react": "^4.2.1",
    "eslint": "^8.57.1",
    "eslint-config-next": "^15.3.3",
    "eslint-config-prettier": "^9.2.0",
    "eslint-plugin-react": "^7.38.0",
    "eslint-plugin-react-hooks": "^5.1.0",
    "prettier": "^3.5.3",
    "typescript": "^5.8.3",
    "vitest": "^3.2.0"
  }
}
EOF

# Criar next.config.js do Frontend
cat > frontend/next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  swcMinify: true,
  
  // Configurações de imagem
  images: {
    domains: ['localhost', 'api.dicebear.com'],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Proxy para API
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3210';
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
      {
        source: '/trpc/:path*',
        destination: `${apiUrl}/trpc/:path*`,
      },
    ];
  },
  
  // Headers de segurança
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
  
  // Variáveis de ambiente
  env: {
    NEXT_PUBLIC_APP_NAME: 'MVP Chat AI',
    NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version,
  },
  
  // Otimizações
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },
  
  // Webpack customization
  webpack: (config, { isServer }) => {
    // Aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': '/src',
    };
    
    return config;
  },
};

module.exports = nextConfig;
EOF

# Criar .env.example do Frontend
cat > frontend/.env.example << 'EOF'
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3210
NEXT_PUBLIC_WS_URL=ws://localhost:3210

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here

# Analytics (optional)
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=
NEXT_PUBLIC_CLARITY_PROJECT_ID=

# Features
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_PWA=true
NEXT_PUBLIC_ENABLE_VOICE=true
EOF

# Criar Dockerfile do Frontend
cat > frontend/Dockerfile << 'EOF'
# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10.10.0

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source
COPY . .

# Build application
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

# Production stage
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Change ownership
RUN chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
EOF

# ========================================
# MOBILE - Estrutura Básica
# ========================================
log "📱 Organizando Mobile..."

# Criar estrutura do mobile
mkdir -p mobile/src/{screens,components,navigation,services,utils,store}
mkdir -p mobile/assets/{images,fonts}

# Criar package.json do Mobile
cat > mobile/package.json << 'EOF'
{
  "name": "@mvp-chat-ai/mobile",
  "version": "1.0.0",
  "description": "Mobile app for MVP Chat AI",
  "main": "node_modules/expo/AppEntry.js",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "eject": "expo eject",
    "test": "jest"
  },
  "dependencies": {
    "@react-navigation/native": "^7.0.0",
    "@react-navigation/stack": "^7.0.0",
    "@tanstack/react-query": "^5.79.0",
    "@trpc/client": "^11.2.0",
    "@trpc/react-query": "^11.2.0",
    "expo": "~51.0.0",
    "expo-constants": "~17.0.0",
    "expo-linking": "~7.0.0",
    "expo-router": "~4.0.0",
    "expo-secure-store": "~14.0.0",
    "expo-status-bar": "~2.0.0",
    "react": "19.1.0",
    "react-native": "0.76.0",
    "react-native-gesture-handler": "~3.2.0",
    "react-native-reanimated": "~4.0.0",
    "react-native-safe-area-context": "5.0.0",
    "react-native-screens": "~4.1.0",
    "react-native-webview": "13.12.5"
  },
  "devDependencies": {
    "@babel/core": "^7.24.0",
    "@types/react": "~19.1.0",
    "@types/react-native": "~0.76.0",
    "jest": "^29.7.0",
    "typescript": "^5.8.3"
  },
  "private": true
}
EOF

# ========================================
# SHARED - Código Compartilhado
# ========================================
log "📦 Organizando código compartilhado..."

# Types compartilhados
cat > shared/types/index.ts << 'EOF'
// Tipos compartilhados entre frontend, backend e mobile

export interface User {
  id: string;
  email: string;
  username?: string;
  avatar?: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  sessionId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  id: string;
  title: string;
  userId: string;
  agentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}
EOF

# ========================================
# DOCKER COMPOSE - Orquestração
# ========================================
log "🐳 Criando Docker Compose..."

cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: pgvector/pgvector:pg16
    container_name: mvp-chat-postgres
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
    networks:
      - mvp-chat-network

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: mvp-chat-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes
    networks:
      - mvp-chat-network

  # Backend API
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: mvp-chat-backend
    ports:
      - "3210:3210"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://chatai:chatai_password@postgres:5432/chatai_production
      - REDIS_URL=redis://redis:6379
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started
    volumes:
      - ./backend/.env:/app/.env:ro
    networks:
      - mvp-chat-network
    restart: unless-stopped

  # Frontend Application
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: mvp-chat-frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:3210
      - NEXT_PUBLIC_WS_URL=ws://backend:3210
    depends_on:
      - backend
    networks:
      - mvp-chat-network
    restart: unless-stopped

  # Nginx Reverse Proxy (optional)
  nginx:
    image: nginx:alpine
    container_name: mvp-chat-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./infrastructure/nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./infrastructure/nginx/ssl:/etc/nginx/ssl:ro
    depends_on:
      - frontend
      - backend
    networks:
      - mvp-chat-network
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:

networks:
  mvp-chat-network:
    driver: bridge
EOF

# ========================================
# CONFIGURAÇÕES GERAIS
# ========================================
log "⚙️ Criando configurações gerais..."

# .gitignore principal
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.pnp
.pnp.js

# Production
dist/
build/
.next/
out/

# Misc
.DS_Store
*.pem
.idea/
.vscode/

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Local env files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Testing
coverage/
.nyc_output

# Logs
logs/
*.log

# OS
.DS_Store
Thumbs.db

# IDEs
.idea/
.vscode/
*.swp
*.swo

# Temporary files
tmp/
temp/
EOF

# README principal
cat > README.md << 'EOF'
# MVP Chat AI - Arquitetura Modular

## 📁 Estrutura do Projeto

```
mvp-chat-ai/
├── backend/         # API Server (Node.js + Express + tRPC)
├── frontend/        # Web App (Next.js + React)
├── mobile/          # Mobile App (React Native + Expo)
├── shared/          # Código compartilhado
├── infrastructure/  # Docker, K8s, Scripts
└── docs/           # Documentação
```

## 🚀 Quick Start

### Usando Docker (Recomendado)

```bash
# Iniciar todos os serviços
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar serviços
docker-compose down
```

### Desenvolvimento Local

#### Backend
```bash
cd backend
pnpm install
pnpm dev
```

#### Frontend
```bash
cd frontend
pnpm install
pnpm dev
```

#### Mobile
```bash
cd mobile
pnpm install
pnpm start
```

## 🔗 URLs

- Frontend: http://localhost:3000
- Backend API: http://localhost:3210
- API Docs: http://localhost:3210/docs
- PostgreSQL: localhost:5432
- Redis: localhost:6379

## 📚 Documentação

- [Backend Documentation](./backend/README.md)
- [Frontend Documentation](./frontend/README.md)
- [Mobile Documentation](./mobile/README.md)
- [API Reference](./docs/API.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)

## 🛠️ Tecnologias

### Backend
- Node.js + TypeScript
- Express + tRPC
- PostgreSQL + Drizzle ORM
- Redis
- WebSocket

### Frontend
- Next.js 15
- React 19
- Ant Design + Tailwind
- Zustand
- TanStack Query

### Mobile
- React Native
- Expo
- React Navigation

## 📦 Scripts Principais

```bash
# Instalar dependências de todos os projetos
./scripts/install-all.sh

# Executar testes
./scripts/test-all.sh

# Build para produção
./scripts/build-all.sh
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie sua branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
EOF

# Criar Makefile principal
cat > Makefile << 'EOF'
.PHONY: help install dev build test clean docker-up docker-down

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

install: ## Install all dependencies
	cd backend && pnpm install
	cd frontend && pnpm install
	cd mobile && pnpm install

dev: ## Start development servers
	@echo "Starting development servers..."
	@make -j 3 dev-backend dev-frontend dev-redis

dev-backend: ## Start backend dev server
	cd backend && pnpm dev

dev-frontend: ## Start frontend dev server
	cd frontend && pnpm dev

dev-mobile: ## Start mobile dev server
	cd mobile && pnpm start

dev-redis: ## Start Redis locally
	docker run --rm -p 6379:6379 redis:7-alpine

build: ## Build all projects
	cd backend && pnpm build
	cd frontend && pnpm build

test: ## Run all tests
	cd backend && pnpm test
	cd frontend && pnpm test

clean: ## Clean all build artifacts
	rm -rf backend/dist backend/node_modules
	rm -rf frontend/.next frontend/out frontend/node_modules
	rm -rf mobile/node_modules

docker-up: ## Start all services with Docker
	docker-compose up -d

docker-down: ## Stop all Docker services
	docker-compose down

docker-logs: ## Show Docker logs
	docker-compose logs -f

docker-clean: ## Clean Docker volumes
	docker-compose down -v
EOF

# Criar scripts auxiliares
mkdir -p scripts

cat > scripts/install-all.sh << 'EOF'
#!/bin/bash
echo "Installing dependencies for all projects..."

echo "Backend..."
cd backend && pnpm install && cd ..

echo "Frontend..."
cd frontend && pnpm install && cd ..

echo "Mobile..."
cd mobile && pnpm install && cd ..

echo "✅ All dependencies installed!"
EOF

cat > scripts/build-all.sh << 'EOF'
#!/bin/bash
echo "Building all projects..."

echo "Building backend..."
cd backend && pnpm build && cd ..

echo "Building frontend..."
cd frontend && pnpm build && cd ..

echo "✅ All projects built!"
EOF

cat > scripts/test-all.sh << 'EOF'
#!/bin/bash
echo "Running tests for all projects..."

echo "Testing backend..."
cd backend && pnpm test && cd ..

echo "Testing frontend..."
cd frontend && pnpm test && cd ..

echo "✅ All tests completed!"
EOF

chmod +x scripts/*.sh

# Criar READMEs para cada projeto
cat > backend/README.md << 'EOF'
# Backend API

## Estrutura

```
backend/
├── src/
│   ├── api/          # Routes, middleware, controllers
│   ├── core/         # Core business logic
│   ├── database/     # Database schemas and migrations
│   ├── services/     # External services (AI, storage, etc)
│   └── utils/        # Utility functions
├── tests/           # Test files
└── scripts/         # Utility scripts
```

## Comandos

```bash
pnpm dev         # Start development server
pnpm build       # Build for production
pnpm start       # Start production server
pnpm test        # Run tests
pnpm db:migrate  # Run database migrations
pnpm db:studio   # Open database GUI
```

## API Endpoints

- `GET /health` - Health check
- `/api/*` - REST API routes
- `/trpc/*` - tRPC endpoints
- WebSocket on same port

## Environment Variables

Copy `.env.example` to `.env` and configure.
EOF

cat > frontend/README.md << 'EOF'
# Frontend Application

## Estrutura

```
frontend/
├── src/
│   ├── app/         # Next.js app router pages
│   ├── components/  # Reusable components
│   ├── features/    # Feature-specific components
│   ├── hooks/       # Custom React hooks
│   ├── store/       # Zustand stores
│   └── utils/       # Utility functions
├── public/          # Static assets
└── tests/          # Test files
```

## Comandos

```bash
pnpm dev     # Start development server
pnpm build   # Build for production
pnpm start   # Start production server
pnpm test    # Run tests
pnpm lint    # Run linter
```

## Features

- Chat interface
- Authentication
- File uploads
- Knowledge base
- Real-time updates via WebSocket

## Environment Variables

Copy `.env.example` to `.env.local` and configure.
EOF

cat > mobile/README.md << 'EOF'
# Mobile Application

## Estrutura

```
mobile/
├── src/
│   ├── screens/     # Screen components
│   ├── components/  # Reusable components
│   ├── navigation/  # Navigation configuration
│   ├── services/    # API services
│   └── utils/       # Utility functions
└── assets/         # Images, fonts, etc
```

## Comandos

```bash
pnpm start    # Start Expo development server
pnpm android  # Run on Android
pnpm ios      # Run on iOS
pnpm web      # Run in web browser
```

## Setup

1. Install Expo Go on your phone
2. Run `pnpm start`
3. Scan QR code with Expo Go

## Building

```bash
eas build --platform android
eas build --platform ios
```
EOF

log "✅ Reorganização completa finalizada!"
echo ""
echo "Estrutura criada:"
echo "  📁 backend/    - API completa e independente"
echo "  📁 frontend/   - Aplicação web completa"
echo "  📁 mobile/     - App mobile"
echo "  📁 shared/     - Código compartilhado"
echo ""
echo "Próximos passos:"
echo "  1. Execute: ./scripts/reorganize-repository.sh"
echo "  2. Configure os arquivos .env em cada projeto"
echo "  3. Execute: make install"
echo "  4. Execute: make dev"
echo ""
echo "Ou use Docker:"
echo "  docker-compose up -d"