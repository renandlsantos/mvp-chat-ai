# Guia de Build para Railway

## Problema
O build padrão do projeto consome muita memória devido ao tamanho da aplicação e quantidade de páginas estáticas geradas.

## Soluções Implementadas

### 1. Build Otimizado (Recomendado)
Use o comando padrão que já está configurado no Railway:
```bash
pnpm run build:railway
```

Este comando:
- Usa configuração otimizada (`next.config.railway.ts`)
- Define limite de memória para 8GB
- Mantém plugins essenciais do webpack
- Desabilita otimizações que consomem memória

### 2. Build Seguro (Alternativa)
Se o build padrão falhar com erro de memória, use:
```bash
pnpm run build:railway-safe
```

Este comando:
- Limpa builds anteriores (preservando cache)
- Usa modo de compilação experimental
- Cria BUILD_ID manualmente

### 3. Build Mínimo (Emergência)
Se ambos falharem, use o build mínimo:
```bash
pnpm run build:railway-minimal
```

Este comando:
- Cria configuração temporária ultra-mínima
- Desabilita TODAS as features não essenciais
- Tenta build alternativo se o padrão falhar

### 4. Configurações no Railway

#### Variáveis de Ambiente
Adicione estas variáveis no Railway:
```env
NODE_OPTIONS=--max-old-space-size=8192
NEXT_TELEMETRY_DISABLED=1
DISABLE_SENTRY=true
ANALYZE=false
```

#### nixpacks.toml
O arquivo já está configurado com:
- Node.js 20
- 8GB de memória
- Instalação de dependências do sistema

### 5. Otimizações Aplicadas

1. **Renderização Dinâmica**: Todas as páginas são forçadas a serem dinâmicas
2. **Webpack Mínimo**: Apenas plugins essenciais são mantidos
3. **Sem Otimizações**: Minimização, split chunks e source maps desabilitados
4. **Fallbacks**: Módulos node têm fallback no client-side
5. **Cache Desabilitado**: Para evitar problemas de memória

### 6. Se Ainda Falhar

1. **Aumente o Plano do Railway**: Considere um plano com mais memória
2. **Use Docker**: Build local e push da imagem:
   ```bash
   docker build -t seu-usuario/mvp-chat-ai .
   docker push seu-usuario/mvp-chat-ai
   ```

3. **Build Local**: Faça o build localmente e commite a pasta `.next`:
   ```bash
   pnpm run build
   git add .next -f
   git commit -m "Add built files"
   git push
   ```

## Monitoramento

Durante o build, monitore:
- Uso de memória no dashboard do Railway
- Logs de build para identificar onde falha
- Tempo de build (timeout padrão: 20 minutos)

## Suporte

Se precisar de ajuda:
1. Verifique os logs completos no Railway
2. Abra uma issue no GitHub com os logs
3. Considere usar Vercel ou outras plataformas otimizadas para Next.js