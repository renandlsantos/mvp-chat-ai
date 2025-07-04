# Guia de Build para Railway

## Problema
O build padrão do projeto consome muita memória devido ao tamanho da aplicação e quantidade de páginas estáticas geradas.

## Soluções Implementadas

### 1. Build Simples (RECOMENDADO PARA RAILWAY)
```bash
pnpm run build:railway-simple
```
**Este é o comando configurado no Railway por padrão.**
- NÃO modifica ou deleta arquivos existentes
- Preserva o cache montado pelo Railway
- Evita erro "Device or resource busy"

### 2. Build Básico (Fallback)
```bash
pnpm run build:railway-basic
```
- Usa configuração MÍNIMA
- Apenas configurações essenciais
- Mais rápido que o build completo

### 3. Build Otimizado (Original)
```bash
pnpm run build:railway
```
- Configuração otimizada mas preserva cache
- Define limite de memória para 8GB
- Mantém plugins essenciais

### 4. Build Seguro (Alternativa)
```bash
pnpm run build:railway-safe
```
- Limpa builds anteriores (preservando cache)
- Usa modo de compilação experimental

### 5. Build Ultra (Para timeout)
```bash
pnpm run build:railway-ultra
```
- Configuração extrema para evitar timeout
- Desabilita TODAS as otimizações
- Timeout estendido para 30 minutos

### 6. Build Mínimo (Emergência)
```bash
pnpm run build:railway-minimal
```
- Cria configuração temporária ultra-mínima
- Tenta build alternativo se falhar

## Configurações no Railway

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

## Otimizações Aplicadas

1. **Renderização Dinâmica**: Todas as páginas são forçadas a serem dinâmicas
2. **Webpack Mínimo**: Apenas plugins essenciais são mantidos
3. **Sem Otimizações**: Minimização, split chunks e source maps desabilitados
4. **Fallbacks**: Módulos node têm fallback no client-side
5. **Cache Desabilitado**: Para evitar problemas de memória

## Se Ainda Falhar

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