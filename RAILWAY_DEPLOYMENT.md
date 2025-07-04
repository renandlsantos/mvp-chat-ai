# Railway Deployment Guide

## Configuração para Deploy no Railway sem Docker

### Arquivos Configurados

1. **nixpacks.toml** - Configuração do Nixpacks
   - Node.js 22 com OpenSSL
   - Instalação com pnpm frozen-lockfile
   - Build com script otimizado

2. **railway.toml** - Configuração do Railway
   - Health check configurado
   - Política de restart automático
   - Limite de memória otimizado

3. **scripts/railway-nixpacks-build.js** - Script de build otimizado
   - Ignora erros TypeScript temporariamente
   - Desabilita features que consomem memória
   - Fallback com mais memória se necessário

### Como Fazer Deploy

1. No Railway, crie um novo projeto
2. Conecte seu repositório GitHub
3. Configure as variáveis de ambiente necessárias
4. O Railway detectará automaticamente o nixpacks.toml
5. O build será executado com as otimizações

### Variáveis de Ambiente Importantes

```env
NODE_OPTIONS=--max-old-space-size=8192
NEXT_TELEMETRY_DISABLED=1
DISABLE_SENTRY=true
ANALYZE=false
```

### Solução de Problemas

Se o build falhar por falta de memória:
1. O script tentará automaticamente com 12GB
2. Se ainda falhar, considere reduzir features ou usar um plano maior

### Monitoramento

- Health check em `/api/health`
- Logs disponíveis no dashboard do Railway
- Restart automático em caso de falha