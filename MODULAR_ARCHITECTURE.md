# 🏗️ Arquitetura Modular - MVP Chat AI

## 📋 Visão Geral

Esta documentação descreve como separar o projeto em 3 partes independentes:
- **Frontend** (Next.js Client) - Porta 3000
- **Backend** (API Server) - Porta 3210
- **App Mobile** (React Native/Expo) - Porta 19000

## 🗂️ Nova Estrutura de Diretórios

```
mvp-chat-ai/
├── apps/
│   ├── frontend/          # Next.js Frontend (CSR/SSG)
│   ├── backend/           # API Server (Express + tRPC)
│   └── mobile/            # React Native App
├── packages/
│   ├── shared/            # Código compartilhado
│   ├── database/          # Models e migrations
│   └── ui-components/     # Componentes React reutilizáveis
├── infrastructure/
│   ├── docker-compose.yml
│   ├── nginx/
│   └── scripts/
└── docs/
```

## 🎨 Frontend (Next.js Client)

### Estrutura do Frontend

```bash
mkdir -p apps/frontend
cd apps/frontend
```

### package.json do Frontend

```json
{
  "name": "@mvp-chat-ai/frontend",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev -p 3000",
    "build": "next build",
    "start": "next start -p 3000",
    "lint": "next lint"
  },
  "dependencies": {
    "@tanstack/react-query": "^5.79.0",
    "@trpc/client": "^11.2.0",
    "@trpc/react-query": "^11.2.0",
    "next": "^15.3.3",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "@lobehub/ui": "^2.5.6",
    "antd": "^5.25.4",
    "zustand": "5.0.4"
  }
}
```

### next.config.js do Frontend

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  
  // Configurar proxy para API
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3210/api/:path*',
      },
      {
        source: '/trpc/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3210/trpc/:path*',
      },
    ];
  },
  
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3210',
    NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3210',
  },
};

module.exports = nextConfig;
```

### .env.frontend

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3210
NEXT_PUBLIC_WS_URL=ws://localhost:3210

# Frontend Only
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_ANALYTICS_ID=
NEXT_PUBLIC_SENTRY_DSN=
```

## 🚀 Backend (API Server)

### Estrutura do Backend

```bash
mkdir -p apps/backend
cd apps/backend
```

### package.json do Backend

```json
{
  "name": "@mvp-chat-ai/backend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsx build src/index.ts --outdir=dist",
    "start": "node dist/index.js",
    "db:migrate": "drizzle-kit migrate",
    "db:generate": "drizzle-kit generate"
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
    "@neondatabase/serverless": "^1.0.0"
  }
}
```

### src/index.ts do Backend

```typescript
import express from 'express';
import cors from 'cors';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { createContext } from './context';
import { appRouter } from './routers';
import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3210;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// tRPC
const trpcServer = createHTTPServer({
  router: appRouter,
  createContext,
  middleware: cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  }),
});

app.use('/trpc', (req, res) => {
  trpcServer(req, res);
});

// API Routes
app.use('/api', require('./routes'));

// WebSocket Server
const server = app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});

const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('New WebSocket connection');
  
  ws.on('message', (message) => {
    // Handle WebSocket messages
    console.log('Received:', message.toString());
  });
  
  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });
});

export { app, wss };
```

### .env.backend

```env
# Database
DATABASE_URL=postgresql://chatai:password@localhost:5432/chatai_production

# Security
JWT_SECRET=your-jwt-secret
ENCRYPTION_KEY=your-encryption-key

# AI Providers
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GOOGLE_API_KEY=

# S3 Storage
S3_ENDPOINT=
S3_BUCKET=
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=

# Redis
REDIS_URL=redis://localhost:6379

# Server
PORT=3210
NODE_ENV=production
```

## 📱 App Mobile (React Native)

### Estrutura do App Mobile

```bash
mkdir -p apps/mobile
cd apps/mobile
npx create-expo-app . --template blank-typescript
```

### package.json do Mobile

```json
{
  "name": "@mvp-chat-ai/mobile",
  "version": "1.0.0",
  "main": "node_modules/expo/AppEntry.js",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
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
    "expo-secure-store": "~14.0.0"
  }
}
```

### App.tsx do Mobile

```typescript
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { trpc } from './utils/trpc';
import { MainNavigator } from './navigation/MainNavigator';

const queryClient = new QueryClient();

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3210/trpc',
    }),
  ],
});

export default function App() {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <MainNavigator />
      </QueryClientProvider>
    </trpc.Provider>
  );
}
```

## 🐳 Docker Compose para Desenvolvimento

### docker-compose.yml

```yaml
version: '3.8'

services:
  # Database
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

  # Redis
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes

  # Backend API
  backend:
    build:
      context: ./apps/backend
      dockerfile: Dockerfile
    ports:
      - "3210:3210"
    environment:
      - DATABASE_URL=postgresql://chatai:chatai_password@postgres:5432/chatai_production
      - REDIS_URL=redis://redis:6379
      - NODE_ENV=development
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started
    volumes:
      - ./apps/backend:/app
      - /app/node_modules

  # Frontend
  frontend:
    build:
      context: ./apps/frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:3210
      - NEXT_PUBLIC_WS_URL=ws://backend:3210
    depends_on:
      - backend
    volumes:
      - ./apps/frontend:/app
      - /app/node_modules
      - /app/.next

  # Nginx (Production)
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./infrastructure/nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./infrastructure/nginx/sites:/etc/nginx/sites-enabled
    depends_on:
      - frontend
      - backend

volumes:
  postgres_data:
  redis_data:
```

## 🔧 Scripts de Gerenciamento

### Makefile

```makefile
.PHONY: dev prod build test clean

# Development
dev:
	docker-compose up -d postgres redis
	cd apps/backend && npm run dev &
	cd apps/frontend && npm run dev &
	cd apps/mobile && npm start

# Production build
build:
	cd apps/backend && npm run build
	cd apps/frontend && npm run build

# Start production
prod:
	docker-compose up -d

# Run tests
test:
	cd apps/backend && npm test
	cd apps/frontend && npm test
	cd apps/mobile && npm test

# Clean everything
clean:
	docker-compose down -v
	rm -rf apps/*/node_modules
	rm -rf apps/*/dist
	rm -rf apps/frontend/.next
```

## 🚀 Como Executar

### 1. Desenvolvimento Local

```bash
# Clone o repositório
git clone https://github.com/renandlsantos/mvp-chat-ai.git
cd mvp-chat-ai

# Instalar dependências de cada app
cd apps/backend && pnpm install && cd ../..
cd apps/frontend && pnpm install && cd ../..
cd apps/mobile && pnpm install && cd ../..

# Iniciar banco de dados e Redis
docker-compose up -d postgres redis

# Em terminais separados:
# Terminal 1 - Backend
cd apps/backend && npm run dev

# Terminal 2 - Frontend
cd apps/frontend && npm run dev

# Terminal 3 - Mobile (opcional)
cd apps/mobile && npm start
```

### 2. Produção com Docker

```bash
# Build e start todos os serviços
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar tudo
docker-compose down
```

### 3. Deploy Individual

#### Deploy Backend (DigitalOcean)
```bash
cd apps/backend
npm run build
pm2 start dist/index.js --name mvp-chat-backend
```

#### Deploy Frontend (Vercel)
```bash
cd apps/frontend
vercel --prod
```

#### Deploy Mobile (Expo)
```bash
cd apps/mobile
expo build:android
expo build:ios
```

## 📊 Portas e Endpoints

| Serviço | Porta | URL |
|---------|-------|-----|
| Frontend | 3000 | http://localhost:3000 |
| Backend API | 3210 | http://localhost:3210 |
| PostgreSQL | 5432 | localhost:5432 |
| Redis | 6379 | localhost:6379 |
| Mobile | 19000 | Expo Dev |

## 🔐 Variáveis de Ambiente

### Frontend (.env.frontend)
- `NEXT_PUBLIC_API_URL` - URL da API Backend
- `NEXT_PUBLIC_WS_URL` - URL WebSocket
- Analytics e tracking

### Backend (.env.backend)
- `DATABASE_URL` - PostgreSQL connection
- `REDIS_URL` - Redis connection
- API Keys dos provedores AI
- S3/Storage credentials

### Mobile (.env.mobile)
- `EXPO_PUBLIC_API_URL` - URL da API Backend
- App specific configs

## ✅ Benefícios desta Arquitetura

1. **Escalabilidade Independente** - Scale frontend/backend separadamente
2. **Deploy Flexível** - Deploy em diferentes plataformas
3. **Desenvolvimento Paralelo** - Times podem trabalhar independentemente
4. **Manutenção Simplificada** - Código mais organizado e modular
5. **Performance Otimizada** - Cada serviço otimizado para seu propósito