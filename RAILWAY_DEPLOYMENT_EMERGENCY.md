# 🚨 Guia de Emergência - Deploy no Railway

## Situação
O build está dando timeout no Railway devido ao tamanho do projeto.

## Soluções (em ordem de preferência)

### 1. Docker Build (CONFIGURADO)
O Railway agora está configurado para usar Docker em vez de Nixpacks.
- Usa `Dockerfile.railway-fast` por padrão
- Build em etapa única para máxima velocidade

### 2. Build Local + Docker Hub
Se o Railway continuar falhando:

```bash
# 1. Fazer build local
./scripts/build-and-push-docker.sh

# 2. No Railway:
# - Vá em Settings > Deploy
# - Selecione "Docker Image"
# - Digite: seu-usuario/sua-imagem:latest
```

### 3. Deploy Direto (Última Opção)
```bash
# Build local
NODE_OPTIONS="--max-old-space-size=8192" \
NEXT_TELEMETRY_DISABLED=1 \
pnpm run build

# Commit da pasta .next
git add .next -f
git commit -m "Add pre-built files"
git push

# No Railway, use:
pnpm run start
```

### 4. Alternativas ao Railway

#### Vercel (Recomendado para Next.js)
```bash
npm i -g vercel
vercel
```

#### Render.com
- Crie conta em render.com
- Conecte o GitHub
- Deploy automático

#### Fly.io
```bash
curl -L https://fly.io/install.sh | sh
fly launch
fly deploy
```

## Configurações de Emergência

### Variáveis no Railway
```env
NODE_OPTIONS=--max-old-space-size=8192
NEXT_TELEMETRY_DISABLED=1
RAILWAY_SKIP_BUILD=true  # Se usar pre-built
```

### Aumentar Timeout
No Railway Dashboard:
- Settings > Build > Timeout
- Aumentar para 30 minutos

### Usar Plano Maior
- Considere upgrade para "Team" ou "Pro"
- Mais CPU e memória disponíveis

## Contato de Suporte

Se nada funcionar:
- Railway Discord: https://discord.gg/railway
- Abra ticket: support@railway.app
- Mencione: "Next.js large project build timeout"

## Status Atual

✅ Mudado para Docker build
✅ Configuração ultra otimizada
✅ Scripts de fallback criados
⏳ Aguardando próximo deploy

---

**IMPORTANTE**: O projeto é grande demais para o plano gratuito do Railway. 
Considere usar Vercel (otimizado para Next.js) ou fazer upgrade do plano.