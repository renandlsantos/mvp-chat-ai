# Guia de Ativação de Recursos

Este guia cobre recursos que já estão implementados no código mas podem estar desabilitados por padrão ou requerem configuração específica para ativar.

## 🟢 Analytics e Monitoramento (Pronto para Ativar)

### Google Analytics
**Status**: 🟢 Pronto para ativar ⚡ Alto impacto 🔧 Baixo esforço

**Localização**: `src/components/Analytics/Google.tsx`

**Ativação**:
```bash
# Definir variável de ambiente
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

### Microsoft Clarity
**Status**: 🟢 Pronto para ativar ⚡ Alto impacto 🔧 Baixo esforço

**Localização**: `src/components/Analytics/Clarity.tsx`

**Ativação**:
```bash
NEXT_PUBLIC_CLARITY_PROJECT_ID=your-project-id
```

### Plausible Analytics
**Status**: 🟢 Pronto para ativar

**Localização**: `src/components/Analytics/Plausible.tsx`

**Ativação**:
```bash
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=yourdomain.com
```

### PostHog Analytics
**Status**: 🟢 Pronto para ativar ⚡ Alto impacto

**Localização**: `src/components/Analytics/Posthog.tsx`

**Ativação**:
```bash
NEXT_PUBLIC_POSTHOG_KEY=your-posthog-key
```

### Umami Analytics
**Status**: 🟢 Pronto para ativar

**Localização**: `src/components/Analytics/Umami.tsx`

**Ativação**:
```bash
NEXT_PUBLIC_UMAMI_SCRIPT_URL=https://umami.example.com/script.js
NEXT_PUBLIC_UMAMI_WEBSITE_ID=your-website-id
```

## 🟢 Monitoramento de Erros (Pronto para Ativar)

### Integração Sentry
**Status**: 🟢 Pronto para ativar ⚡ Alto impacto 🔧 Baixo esforço

**Arquivos**: 
- `sentry.client.config.ts`
- `sentry.edge.config.ts` 
- `sentry.server.config.ts`

**Ativação**:
```bash
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id
SENTRY_ORG=your-org
SENTRY_PROJECT=your-project
```

**Recursos habilitados**:
- Rastreamento de erros
- Monitoramento de performance
- Replay de sessão
- Rastreamento de releases

## 🟢 Colaboração em Tempo Real (Pronto para Ativar)

### Colaboração Y.js WebRTC
**Status**: 🟢 Pronto para ativar ⚡ Alto impacto

**Dependências instaladas**:
- `yjs@13.6.27`
- `y-webrtc@10.3.0` 
- `y-protocols@1.0.6`

**Ativação**: Configurar configurações WebRTC nas variáveis de ambiente

## 🟢 Autenticação Avançada (Pronto para Ativar)

### Autenticação Clerk
**Status**: 🟢 Pronto para ativar ⚡ Alto impacto

**Localização**: `src/libs/clerk-auth/`

**Dependências**: `@clerk/nextjs@6.21.0`

**Ativação**: Configurar Clerk nas variáveis de ambiente

### Provedor OIDC
**Status**: 🟢 Pronto para ativar ⚡ Alto impacto

**Localização**: `src/libs/oidc-provider/`

**Dependências**: `oidc-provider@8.8.1`

**Recursos**:
- Implementação customizada de provedor OIDC
- Manipulação JWT
- Políticas de interação

## 🟢 File Storage & Processing (Ready to Activate)

### S3 Compatible Storage
**Status**: 🟢 Ready to activate ⚡ High impact 🔧 Low effort

**Configuration**:
```bash
S3_BUCKET=your-bucket-name
S3_ENDPOINT=https://your-s3-endpoint.com
S3_ACCESS_KEY_ID=your-access-key
S3_SECRET_ACCESS_KEY=your-secret-key
S3_ENABLE_PATH_STYLE=1  # For MinIO compatibility
```

### Advanced File Processing
**Status**: 🟢 Ready to activate ⚡ High impact

**Features available**:
- PDF processing (`pdf-parse@1.1.1`)
- DOCX processing (`mammoth@1.9.1`)
- EPUB processing (`epub2@3.0.2`)
- Image processing (`sharp@0.33.5`)
- Unstructured document processing (`unstructured-client@0.19.0`)

## 🟢 AI Provider Integration (Ready to Activate)

### Available Providers (50+ supported)
**Status**: 🟢 Ready to activate ⚡ High impact 🔧 Low effort

**Location**: `src/config/modelProviders/`

**Providers ready to activate**:
- Anthropic Claude (`@anthropic-ai/sdk@0.54.0`)
- Google Gemini (`@google/generative-ai@0.24.1`)
- AWS Bedrock (`@aws-sdk/client-bedrock-runtime@3.821.0`)
- Azure OpenAI
- Ollama (`ollama@0.5.16`)
- 45+ additional providers

**Activation**: Configure API keys for desired providers

## 🟢 Progressive Web App (Ready to Activate)

### PWA Features
**Status**: 🟢 Ready to activate ⚡ High impact 🔧 Low effort

**Location**: `src/app/sw.ts`, `next.config.ts`

**Features**:
- Service worker (`@serwist/next@9.0.14`)
- App manifest
- Offline functionality
- Install prompts

**Activation**: PWA is enabled by default in production

## 🟢 Knowledge Base & RAG (Ready to Activate)

### Vector Embeddings
**Status**: 🟢 Ready to activate ⚡ High impact

**Database**: PostgreSQL with pgvector extension

**Features**:
- Document chunking
- Vector embeddings
- Semantic search
- RAG evaluation system

**Activation**: Configure PostgreSQL with pgvector

## 🟢 LLM Observability (Ready to Activate)

### Langfuse Integration
**Status**: 🟢 Ready to activate ⚡ High impact

**Dependencies**: `langfuse@3.37.3`, `langfuse-core@3.37.3`

**Activation**:
```bash
LANGFUSE_SECRET_KEY=your-secret-key
LANGFUSE_PUBLIC_KEY=your-public-key
LANGFUSE_BASE_URL=https://cloud.langfuse.com
```

**Features**:
- LLM call tracking
- Performance monitoring
- Cost tracking
- Prompt versioning

## 🟢 Search Integration (Ready to Activate)

### SearxNG Search Engine
**Status**: 🟢 Ready to activate ⚡ High impact

**Docker setup**: Available in `docker-compose/local/`

**Activation**:
```bash
SEARXNG_URL=http://searxng:8080
```

## 🟢 Model Context Protocol (Ready to Activate)

### MCP Integration
**Status**: 🟢 Ready to activate ⚡ High impact

**Dependencies**: `@modelcontextprotocol/sdk@1.12.1`

**Location**: `src/libs/mcp/`

**Features**:
- MCP client implementation
- Tool integration
- Context management

## 🟡 React Performance Monitoring (Partially Implemented)

### React Scan
**Status**: 🟡 Partially implemented

**Dependencies**: `react-scan@0.3.4`

**Activation**:
```bash
REACT_SCAN_MONITOR_API_KEY=your-api-key
```

**Note**: May conflict with PGlite, use carefully

## 🟢 Desktop Application (Ready to Activate)

### Electron App
**Status**: 🟢 Ready to activate ⚡ High impact

**Location**: `apps/desktop/`

**Features**:
- Cross-platform desktop app
- File system access
- Native integrations
- Auto-updates

**Build**:
```bash
npm run desktop:build
```

## 🟢 Development Tools (Ready to Activate)

### Bundle Analysis
**Status**: 🟢 Ready to activate 🔧 Low effort

**Activation**:
```bash
ANALYZE=true npm run build
```

### Database Studio
**Status**: 🟢 Ready to activate 🔧 Low effort

**Activation**:
```bash
npm run db:studio
```

### Test Coverage
**Status**: 🟢 Ready to activate 🔧 Low effort

**Activation**:
```bash
npm run test-app:coverage
npm run test-server:coverage
```

## Template de Ambiente

Crie um arquivo `.env.local` com os recursos que você deseja ativar:

```bash
# Recursos Principais
ACCESS_CODE=seu-codigo-de-acesso
KEY_VAULTS_SECRET=sua-chave-secreta

# Provedores AI
OPENAI_API_KEY=sua-chave-openai
ANTHROPIC_API_KEY=sua-chave-anthropic
GOOGLE_API_KEY=sua-chave-google

# Analytics (escolha um ou mais)
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
NEXT_PUBLIC_CLARITY_PROJECT_ID=seu-id-clarity
NEXT_PUBLIC_POSTHOG_KEY=sua-chave-posthog

# Monitoramento de Erros
NEXT_PUBLIC_SENTRY_DSN=seu-dsn-sentry

# Banco de Dados (para modo servidor)
DATABASE_URL=postgresql://usuario:senha@host:porta/database

# Armazenamento de Arquivos
S3_BUCKET=seu-bucket
S3_ENDPOINT=seu-endpoint-s3
S3_ACCESS_KEY_ID=sua-chave-de-acesso
S3_SECRET_ACCESS_KEY=sua-chave-secreta

# Observabilidade LLM
LANGFUSE_SECRET_KEY=sua-chave-secreta-langfuse
LANGFUSE_PUBLIC_KEY=sua-chave-publica-langfuse
LANGFUSE_BASE_URL=https://cloud.langfuse.com

# Busca
SEARXNG_URL=http://localhost:8080
```