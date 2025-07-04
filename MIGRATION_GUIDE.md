# 🔄 Guia de Migração - Monorepo para Arquitetura Modular

## 📋 Visão Geral

Este guia explica como migrar do monorepo atual para uma arquitetura modular com projetos separados.

## 🏗️ Nova Estrutura

```
mvp-chat-ai/
├── backend/          # ✅ API Server completa e independente
│   ├── src/          # Código fonte
│   ├── tests/        # Testes
│   ├── Dockerfile    # Pronto para deploy
│   └── package.json  # Dependências isoladas
│
├── frontend/         # ✅ Aplicação Web completa
│   ├── src/          # Código React/Next.js
│   ├── public/       # Assets estáticos
│   ├── Dockerfile    # Pronto para deploy
│   └── package.json  # Dependências isoladas
│
├── mobile/           # ✅ App Mobile
│   ├── src/          # Código React Native
│   ├── assets/       # Recursos do app
│   └── package.json  # Dependências isoladas
│
├── shared/           # 📦 Código compartilhado
│   ├── types/        # TypeScript types
│   ├── utils/        # Utilidades comuns
│   └── constants/    # Constantes compartilhadas
│
└── infrastructure/   # 🔧 Configurações de infra
    ├── docker/       # Docker configs
    ├── kubernetes/   # K8s manifests
    └── nginx/        # Proxy configs
```

## 🚀 Processo de Migração

### 1. Executar Script de Reorganização

```bash
# Fazer backup primeiro!
git add . && git commit -m "backup: before reorganization"

# Executar reorganização
./scripts/reorganize-repository.sh
```

### 2. Verificar Estrutura Criada

```bash
# Verificar se as pastas foram criadas
ls -la backend/ frontend/ mobile/ shared/

# Verificar arquivos principais
cat backend/package.json
cat frontend/package.json
```

### 3. Instalar Dependências

```bash
# Opção 1: Instalar tudo de uma vez
./scripts/install-all.sh

# Opção 2: Instalar individualmente
cd backend && pnpm install && cd ..
cd frontend && pnpm install && cd ..
cd mobile && pnpm install && cd ..
```

### 4. Configurar Variáveis de Ambiente

```bash
# Backend
cp backend/.env.example backend/.env
# Editar backend/.env com suas configurações

# Frontend
cp frontend/.env.example frontend/.env.local
# Editar frontend/.env.local
```

### 5. Executar Migrações do Banco

```bash
cd backend
pnpm db:migrate
```

## 🔧 Desenvolvimento

### Opção 1: Usando Make (Recomendado)

```bash
# Iniciar tudo
make dev

# Ou iniciar individualmente
make dev-backend    # Apenas backend
make dev-frontend   # Apenas frontend
make dev-mobile     # Apenas mobile
```

### Opção 2: Usando Docker

```bash
# Iniciar todos os serviços
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar tudo
docker-compose down
```

### Opção 3: Manual

```bash
# Terminal 1 - Banco de dados
docker run -p 5432:5432 -e POSTGRES_PASSWORD=chatai_password postgres:16

# Terminal 2 - Redis
docker run -p 6379:6379 redis:7-alpine

# Terminal 3 - Backend
cd backend && pnpm dev

# Terminal 4 - Frontend
cd frontend && pnpm dev
```

## 📊 Mapeamento de Arquivos

| Arquivo Original | Novo Local |
|-----------------|------------|
| `src/app/(backend)/api/*` | `backend/src/api/routes/` |
| `src/database/*` | `backend/src/database/` |
| `src/server/*` | `backend/src/core/` |
| `src/services/*` | `backend/src/services/` |
| `src/chains/*` | `backend/src/services/ai/` |
| `src/app/[variants]/*` | `frontend/src/app/` |
| `src/components/*` | `frontend/src/components/` |
| `src/features/*` | `frontend/src/features/` |
| `src/hooks/*` | `frontend/src/hooks/` |
| `src/store/*` | `frontend/src/store/` |
| `public/*` | `frontend/public/` |

## 🌐 URLs e Portas

### Desenvolvimento

| Serviço | URL | Porta |
|---------|-----|-------|
| Frontend | http://localhost:3000 | 3000 |
| Backend API | http://localhost:3210 | 3210 |
| PostgreSQL | localhost | 5432 |
| Redis | localhost | 6379 |

### Produção (Docker)

| Serviço | URL Interna | URL Externa |
|---------|-------------|-------------|
| Frontend | http://frontend:3000 | http://localhost |
| Backend | http://backend:3210 | http://localhost/api |

## 🚢 Deploy

### Backend (DigitalOcean/VPS)

```bash
cd backend
pnpm build
docker build -t mvp-chat-backend .
docker run -p 3210:3210 --env-file .env mvp-chat-backend
```

### Frontend (Vercel)

```bash
cd frontend
vercel --prod
```

### Frontend (DigitalOcean/VPS)

```bash
cd frontend
pnpm build
docker build -t mvp-chat-frontend .
docker run -p 3000:3000 --env-file .env mvp-chat-frontend
```

## ❓ Troubleshooting

### Problema: Arquivos não foram copiados

```bash
# Verificar se os arquivos existem no local original
ls -la src/app/(backend)/api/

# Copiar manualmente se necessário
cp -r src/app/\(backend\)/api/* backend/src/api/routes/
```

### Problema: Dependências não instaladas

```bash
# Limpar cache do pnpm
pnpm store prune

# Reinstalar
cd backend && rm -rf node_modules pnpm-lock.yaml && pnpm install
```

### Problema: Erro de conexão Frontend → Backend

```bash
# Verificar se backend está rodando
curl http://localhost:3210/health

# Verificar variável de ambiente
echo $NEXT_PUBLIC_API_URL
```

### Problema: Banco de dados não conecta

```bash
# Verificar se PostgreSQL está rodando
docker ps | grep postgres

# Testar conexão
psql postgresql://chatai:chatai_password@localhost:5432/chatai_production
```

## ✅ Checklist de Validação

- [ ] Backend inicia sem erros (`cd backend && pnpm dev`)
- [ ] Frontend conecta ao backend
- [ ] Banco de dados está acessível
- [ ] Redis está funcionando
- [ ] Login/autenticação funciona
- [ ] Chat funciona corretamente
- [ ] Upload de arquivos funciona
- [ ] WebSocket conecta

## 🎯 Benefícios da Nova Arquitetura

1. **Deploy Independente**: Cada serviço pode ser deployado separadamente
2. **Escalabilidade**: Scale apenas o que precisa (ex: só o backend)
3. **Desenvolvimento Paralelo**: Times podem trabalhar sem conflitos
4. **Testes Isolados**: Teste cada serviço independentemente
5. **Manutenção Simplificada**: Código mais organizado e modular
6. **CI/CD Otimizado**: Pipelines específicos por serviço
7. **Monitoramento Granular**: Métricas por serviço

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs: `docker-compose logs [serviço]`
2. Consulte os READMEs específicos de cada projeto
3. Abra uma issue no repositório