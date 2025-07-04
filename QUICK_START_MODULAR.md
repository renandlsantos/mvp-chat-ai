# 🚀 Quick Start - Arquitetura Modular

## 📦 Estrutura Separada

O projeto agora está dividido em 3 aplicações independentes:

```
mvp-chat-ai/
├── apps/
│   ├── frontend/    # Next.js (Porta 3000)
│   ├── backend/     # API Server (Porta 3210)
│   └── mobile/      # React Native App
└── docker-compose.yml
```

## 🏃‍♂️ Início Rápido

### Opção 1: Docker (Recomendado)

```bash
# Iniciar tudo com um comando
docker-compose up -d

# Acessar:
# Frontend: http://localhost:3000
# Backend API: http://localhost:3210
# Banco: localhost:5432
```

### Opção 2: Desenvolvimento Local

#### 1️⃣ Preparar o ambiente

```bash
# Executar script de separação (primeira vez apenas)
chmod +x scripts/split-monorepo.sh
./scripts/split-monorepo.sh

# Instalar dependências
cd apps/backend && pnpm install && cd ../..
cd apps/frontend && pnpm install && cd ../..
```

#### 2️⃣ Configurar variáveis de ambiente

```bash
# Backend
cp apps/backend/.env.example apps/backend/.env
# Editar com suas chaves de API

# Frontend
cp apps/frontend/.env.example apps/frontend/.env
```

#### 3️⃣ Iniciar os serviços

**Terminal 1 - Banco de Dados:**
```bash
docker-compose up -d postgres redis
```

**Terminal 2 - Backend:**
```bash
cd apps/backend
pnpm dev
```

**Terminal 3 - Frontend:**
```bash
cd apps/frontend
pnpm dev
```

## 🔗 URLs e Portas

| Serviço | URL | Descrição |
|---------|-----|-----------|
| Frontend | http://localhost:3000 | Interface do usuário |
| Backend API | http://localhost:3210 | API REST + tRPC |
| Health Check | http://localhost:3210/health | Status da API |
| PostgreSQL | localhost:5432 | Banco de dados |
| Redis | localhost:6379 | Cache |

## 📱 Mobile App

```bash
cd apps/mobile
pnpm install
pnpm start

# Escanear QR code com Expo Go
```

## 🛠️ Comandos Úteis

```bash
# Desenvolvimento
make dev          # Inicia frontend + backend
make dev-mobile   # Inicia app mobile

# Build
make build        # Build de produção

# Testes
make test         # Executa todos os testes

# Limpeza
make clean        # Remove node_modules e builds
```

## 🚀 Deploy Individual

### Backend (DigitalOcean/VPS)
```bash
cd apps/backend
pnpm build
pm2 start dist/index.js --name chat-backend
```

### Frontend (Vercel)
```bash
cd apps/frontend
vercel --prod
```

### Frontend (DigitalOcean/VPS)
```bash
cd apps/frontend
pnpm build
pm2 start npm --name chat-frontend -- start
```

## 📝 Variáveis de Ambiente Essenciais

### Backend (.env)
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/chatai
JWT_SECRET=seu-secret-aqui
OPENAI_API_KEY=sk-...
```

### Frontend (.env)
```env
NEXT_PUBLIC_API_URL=http://localhost:3210
```

## ❓ Troubleshooting

### Erro de conexão Frontend → Backend
- Verificar se o backend está rodando na porta 3210
- Confirmar NEXT_PUBLIC_API_URL no frontend

### Erro de banco de dados
- Verificar se PostgreSQL está rodando
- Confirmar DATABASE_URL no backend

### Erro de CORS
- Backend já está configurado para aceitar localhost:3000
- Para produção, ajustar FRONTEND_URL no backend

## 🎯 Próximos Passos

1. **Configurar chaves de API** nos arquivos .env
2. **Executar migrações** do banco: `cd apps/backend && pnpm db:migrate`
3. **Personalizar** as aplicações conforme necessário
4. **Deploy** em suas plataformas preferidas