# CLAUDE.md - Guia do Projeto AI Hub

## Visão Geral do Projeto

**AI Hub** é um framework de chatbot de código aberto e alta performance que suporta síntese de voz, interações multimodais e um sistema extensível de plugins Function Call. Oferece implantação gratuita com um clique de aplicações web privadas ChatGPT/LLM.

### Recursos Principais
- **Visualização Chain of Thought (CoT)** para raciocínio de IA
- **Conversas Ramificadas** com modos de continuação e independente
- **Suporte a Artefatos** para criação dinâmica de conteúdo com Sandpack
- **Upload de Arquivos e Base de Conhecimento** com embeddings vetoriais
- **Suporte Multi-Provedores de Modelos** (50+ provedores incluindo OpenAI, Anthropic, Google, DeepSeek, etc.)
- **Suporte a LLM Local** via Ollama
- **Capacidades de Reconhecimento Visual**
- **Conversação por Voz TTS & STT**
- **Geração de Texto para Imagem** via DALL-E e outros provedores
- **Sistema de Plugins** com 42+ plugins disponíveis
- **Mercado de Agentes** com 499+ agentes da comunidade
- **Suporte Progressive Web App (PWA)**
- **Gerenciamento Multi-Usuário** com RBAC e autenticação
- **Temas Personalizados** e adaptação mobile
- **Colaboração em Tempo Real** com Y.js/WebRTC
- **Suporte Model Context Protocol (MCP)**
- **Sistema de Avaliação RAG**
- **Autenticação via Access Code** para proteção simples
- **Sistema de Créditos de Usuário** para controle de uso

## Stack Tecnológico

### Framework Principal
- **Next.js 15.3.3** - Framework React com App Router
- **React 19.1.0** - Biblioteca de UI com recursos mais recentes
- **TypeScript 5.8.3** - Tipagem segura em todo projeto
- **Turbopack** - Bundler rápido para desenvolvimento
- **PNPM 10.10.0** - Gerenciador de pacotes

### Gerenciamento de Estado e Dados
- **Zustand 5.0.4** - Gerenciamento de estado leve
- **TanStack Query 5.79.0** - Gerenciamento e cache de estado do servidor
- **tRPC 11.2.0** - Camada de API type-safe
- **Drizzle ORM 0.41.0** - ORM de banco de dados com migrações
- **PostgreSQL** - Banco de dados de produção com pgvector para embeddings
- **PGlite 0.2.17** - Banco de dados client-side para funcionalidade offline
- **Dexie 3.2.7** - Wrapper IndexedDB para armazenamento client

### Estilização e UI
- **Ant Design 5.25.4** - Biblioteca principal de componentes UI
- **@lobehub/ui 2.5.6** - Biblioteca de componentes customizados
- **antd-style 3.7.1** - Solução de estilização CSS-in-JS
- **Framer Motion 12.15.0** - Animações e transições
- **Lucide React 0.522.0** - Biblioteca moderna de ícones
- **@icons-pack/react-simple-icons** - Ícones de marcas

### Integrações AI & ML
- **Vercel AI SDK 3.4.33** - Integrações de modelos AI
- **OpenAI 4.104.0** - API OpenAI
- **Anthropic SDK 0.54.0** - API Claude
- **Google Generative AI 0.24.1** - API Gemini
- **Langchain 0.3.27** - Framework LLM e chains
- **Ollama 0.5.16** - Suporte a modelos locais
- **@modelcontextprotocol/sdk 1.12.1** - Suporte ao protocolo MCP
- **Langfuse 3.37.3** - Observabilidade e analytics LLM

### Desenvolvimento e Testes
- **Vitest 3.2.0** - Framework de testes com cobertura
- **Happy DOM 17.5.6** - Ambiente de teste DOM rápido
- **@lobehub/lint 1.26.2** - Configuração de linting compartilhada
- **ESLint 8.57.1** - Linting de código
- **Prettier 3.5.3** - Formatação de código
- **Stylelint 15.11.0** - Linting CSS
- **Husky 9.1.7** - Git hooks
- **Commitlint 19.8.1** - Linting de mensagens de commit

### Autenticação e Segurança
- **NextAuth.js 5.0.0-beta.25** - Framework de autenticação
- **@clerk/nextjs 6.21.0** - Provedor de autenticação
- **OIDC Provider 8.8.1** - Implementação OpenID Connect
- **Jose 5.10.0** - Utilitários JWT
- **Crypto-js 4.2.0** - Funções criptográficas

### Processamento de Arquivos e Base de Conhecimento
- **@lobechat/file-loaders** - Utilitários customizados de processamento de arquivos
- **PDF-parse 1.1.1** - Extração de texto PDF
- **Mammoth 1.9.1** - Processamento DOCX
- **EPUB2 3.0.2** - Processamento EPUB
- **Sharp 0.33.5** - Processamento de imagens
- **Unstructured-client 0.19.0** - Serviço de processamento de documentos

### Tempo Real e Colaboração
- **Y.js 13.6.27** - CRDT para colaboração em tempo real
- **Y-WebRTC 10.3.0** - Provedor WebRTC para Y.js
- **Y-protocols 1.0.6** - Protocolos Y.js
- **WebSocket (ws 8.18.2)** - Suporte WebSocket

### Deploy e Infraestrutura
- **Docker** - Containerização
- **Vercel** - Plataforma principal de deploy
- **@sentry/nextjs 7.120.3** - Monitoramento de erros e performance
- **@serwist/next 9.0.14** - Service worker para PWA
- **MinIO** - Armazenamento de objetos compatível com S3
- **Casdoor** - Gerenciamento de identidade e acesso

### Analytics e Monitoramento
- **@vercel/analytics 1.5.0** - Analytics Vercel
- **@vercel/speed-insights 1.2.0** - Insights de performance
- **PostHog.js 1.249.0** - Analytics de produto
- **React-scan 0.3.4** - Monitoramento de performance React

## Estrutura do Projeto

```
mvp-chat-ai/
├── src/
│   ├── app/                              # Next.js App Router application
│   │   ├── (backend)/                   # Backend API routes
│   │   │   ├── api/                     # REST API endpoints
│   │   │   ├── middleware/              # API middleware
│   │   │   ├── oidc/                    # OIDC authentication endpoints
│   │   │   ├── trpc/                    # tRPC procedures and routers
│   │   │   └── webapi/                  # Web API handlers
│   │   ├── [variants]/                  # Dynamic route variants
│   │   │   ├── (auth)/                  # Authentication routes
│   │   │   ├── (main)/                  # Main application routes
│   │   │   ├── @modal/                  # Parallel modal routes
│   │   │   └── oauth/                   # OAuth callback routes
│   │   ├── desktop/                     # Desktop app specific routes
│   │   ├── manifest.ts                  # PWA manifest
│   │   ├── robots.tsx                   # SEO robots.txt
│   │   ├── sitemap.tsx                  # Dynamic sitemap
│   │   └── sw.ts                        # Service worker
│   ├── chains/                          # LangChain integration chains
│   │   ├── __tests__/                   # Chain unit tests
│   │   ├── abstractChunk.ts             # Text chunking chain
│   │   ├── answerWithContext.ts         # RAG answer generation
│   │   ├── langDetect.ts                # Language detection
│   │   ├── pickEmoji.ts                 # Emoji selection
│   │   ├── rewriteQuery.ts              # Query rewriting
│   │   ├── summaryAgentName.ts          # Agent name generation
│   │   ├── summaryDescription.ts        # Content summarization
│   │   ├── summaryHistory.ts            # Chat history summary
│   │   ├── summaryTags.ts               # Tag generation
│   │   ├── summaryTitle.ts              # Title generation
│   │   └── translate.ts                 # Translation chain
│   ├── components/                      # Reusable React components
│   │   ├── Analytics/                   # Analytics providers (Google, Plausible, etc.)
│   │   ├── BrandWatermark/              # Branding components
│   │   ├── DragUpload/                  # File drag & drop upload
│   │   ├── Error/                       # Error handling components
│   │   ├── FileIcon/                    # File type icons
│   │   ├── Loading/                     # Loading states
│   │   ├── Notification/                # Toast notifications
│   │   ├── ClientOnly/                  # Client-side rendering wrapper
│   │   ├── DraggablePanelContainer/     # Draggable panel components
│   │   ├── SafeHotkey/                  # Safe hotkey implementation
│   │   ├── SafeIcon/                    # Safe icon wrapper
│   │   ├── SafeSearchBar/               # Safe search bar component
│   │   ├── client/                      # Client-side only components
│   │   ├── mdx/                         # MDX rendering components
│   │   └── server/                      # Server-side components
│   ├── config/                          # Configuration management
│   │   ├── aiModels/                    # AI model configurations (50+ providers)
│   │   ├── modelProviders/              # Provider-specific configs
│   │   │   ├── env.ts                   # Environment-based config
│   │   │   └── limited.ts               # Limited model configurations
│   │   ├── featureFlags/                # Feature flag schemas
│   │   ├── analytics.ts                 # Analytics configuration
│   │   ├── auth.ts                      # Authentication config
│   │   ├── db.ts                        # Database configuration
│   │   ├── file.ts                      # File handling config
│   │   ├── knowledge.ts                 # Knowledge base config
│   │   └── tools.ts                     # Tool configurations
│   ├── database/                        # Database layer architecture
│   │   ├── client/                      # Client-side database (PGlite)
│   │   │   ├── db.ts                    # Client DB instance
│   │   │   ├── migrations.json          # Client migrations
│   │   │   ├── pglite.ts                # PGlite configuration
│   │   │   └── schemas/                 # Client-side schemas
│   │   ├── core/                        # Database adapters
│   │   │   ├── db-adaptor.ts            # Multi-DB adapter
│   │   │   ├── electron.ts              # Electron DB adapter
│   │   │   └── web-server.ts            # Web server DB adapter
│   │   ├── migrations/                  # SQL migration files (25 migrations)
│   │   ├── models/                      # Data access layer models
│   │   │   ├── agent.ts                 # Agent management
│   │   │   ├── aiModel.ts               # AI model management
│   │   │   ├── aiProvider.ts            # Provider management
│   │   │   ├── file.ts                  # File management
│   │   │   ├── knowledgeBase.ts         # Knowledge base
│   │   │   ├── message.ts               # Chat messages
│   │   │   ├── session.ts               # Chat sessions
│   │   │   ├── thread.ts                # Conversation threads
│   │   │   ├── topic.ts                 # Topic management
│   │   │   ├── user.ts                  # User management
│   │   │   └── userCredits.ts           # User credits management
│   │   ├── repositories/                # Repository pattern implementations
│   │   │   ├── aiInfra/                 # AI infrastructure repos
│   │   │   ├── dataExporter/            # Data export repos
│   │   │   ├── dataImporter/            # Data import repos
│   │   │   └── tableViewer/             # Database viewer repos
│   │   ├── schemas/                     # Drizzle ORM schemas
│   │   │   ├── agent.ts                 # Agent schema
│   │   │   ├── aiInfra.ts               # AI infrastructure schema
│   │   │   ├── file.ts                  # File schema
│   │   │   ├── message.ts               # Message schema
│   │   │   ├── nextauth.ts              # NextAuth schema
│   │   │   ├── oidc.ts                  # OIDC schema
│   │   │   ├── rag.ts                   # RAG schema
│   │   │   ├── rbac.ts                  # RBAC schema
│   │   │   ├── relations.ts             # Schema relations
│   │   │   └── userCredits.ts           # User credits schema
│   │   └── server/                      # Server-side database models
│   ├── features/                        # Feature-specific component groups
│   │   ├── AgentSetting/                # Agent configuration UI
│   │   ├── ChatInput/                   # Chat input components
│   │   ├── Conversation/                # Conversation UI
│   │   ├── DataImporter/                # Data import UI
│   │   ├── FileManager/                 # File management UI
│   │   ├── KnowledgeBaseModal/          # Knowledge base UI
│   │   ├── ModelSelect/                 # Model selection UI
│   │   ├── PluginStore/                 # Plugin marketplace UI
│   │   ├── ShareModal/                  # Content sharing UI
│   │   ├── SyncStatusInspector/         # Sync status UI
│   │   └── UserCredits/                 # User credits UI components
│   ├── hooks/                           # Custom React hooks
│   │   ├── useHotkeys/                  # Keyboard shortcuts
│   │   │   ├── emergency-fix.ts         # Emergency hotkey fixes
│   │   │   ├── safeguard.ts             # Hotkey safeguards
│   │   │   └── useHotkeysFixed.ts       # Fixed hotkeys implementation
│   │   ├── useGreeting/                 # Dynamic greetings
│   │   ├── useModelSupport*/            # Model capability hooks
│   │   ├── usePWAInstall.ts             # PWA installation
│   │   ├── useSyncData.ts               # Data synchronization
│   │   └── useTokenCount.ts             # Token counting
│   ├── layout/                          # Application layout components
│   │   ├── AuthProvider/                # Authentication provider
│   │   └── GlobalProvider/              # Global app providers
│   ├── libs/                            # Library integrations and wrappers
│   │   ├── clerk-auth/                  # Clerk authentication
│   │   ├── langchain/                   # LangChain integration
│   │   ├── mcp/                         # Model Context Protocol
│   │   ├── model-runtime/               # AI model runtime
│   │   ├── next-auth/                   # NextAuth.js integration
│   │   │   └── sso-providers/           # SSO provider configurations
│   │   │       └── credentials.ts       # Credentials provider
│   │   ├── oidc-provider/               # OIDC provider setup
│   │   ├── traces/                      # Observability traces
│   │   ├── trpc/                        # tRPC setup
│   │   └── unstructured/                # Document processing
│   ├── locales/                         # Internationalization
│   │   ├── default/                     # Default language definitions
│   │   ├── create.ts                    # Locale creation utilities
│   │   └── resources.ts                 # i18n resource management
│   ├── migrations/                      # Client-side data migrations
│   │   ├── FromV0ToV1.ts                # V0 to V1 migration
│   │   ├── FromV1ToV2/                  # V1 to V2 migration
│   │   ├── FromV2ToV3/                  # V2 to V3 migration
│   │   ├── FromV3ToV4/                  # V3 to V4 migration
│   │   ├── FromV4ToV5/                  # V4 to V5 migration
│   │   ├── FromV5ToV6/                  # V5 to V6 migration
│   │   ├── FromV6ToV7/                  # V6 to V7 migration
│   │   └── VersionController.ts         # Migration orchestrator
│   ├── prompts/                         # LLM prompt templates
│   │   ├── chatMessages/                # Chat message prompts
│   │   ├── files/                       # File processing prompts
│   │   ├── knowledgeBaseQA/             # RAG Q&A prompts
│   │   ├── plugin/                      # Plugin interaction prompts
│   │   └── systemRole/                  # System role prompts
│   ├── server/                          # Server-side utilities and modules
│   │   ├── globalConfig/                # Global configuration
│   │   ├── modules/                     # Server modules
│   │   ├── routers/                     # tRPC routers
│   │   ├── services/                    # Server services
│   │   └── utils/                       # Server utilities
│   ├── services/                        # Business logic services
│   │   ├── aiModel/                     # AI model service
│   │   ├── aiProvider/                  # AI provider service
│   │   ├── credits/                     # Credits management service
│   │   ├── electron/                    # Electron-specific services
│   │   ├── export/                      # Data export service
│   │   ├── file/                        # File management service
│   │   ├── import/                      # Data import service
│   │   ├── message/                     # Message service
│   │   ├── plugin/                      # Plugin service
│   │   ├── session/                     # Session service
│   │   ├── thread/                      # Thread service
│   │   ├── topic/                       # Topic service
│   │   ├── user/                        # User service
│   │   └── tableViewer/                 # Database viewer service
│   ├── store/                           # Zustand state management
│   │   ├── agent/                       # Agent state
│   │   ├── aiInfra/                     # AI infrastructure state
│   │   ├── chat/                        # Chat state
│   │   ├── electron/                    # Electron state
│   │   ├── file/                        # File state
│   │   ├── global/                      # Global app state
│   │   ├── knowledgeBase/               # Knowledge base state
│   │   ├── serverConfig/                # Server configuration state
│   │   ├── session/                     # Session state
│   │   ├── tool/                        # Tool state
│   │   └── user/                        # User state
│   ├── styles/                          # Styling and theming
│   │   ├── antdOverride.ts              # Ant Design customizations
│   │   ├── electron.ts                  # Electron-specific styles
│   │   ├── global.ts                    # Global styles
│   │   └── mobileHeader.ts              # Mobile header styles
│   ├── tools/                           # Built-in tools
│   │   ├── artifacts/                   # Artifact generation tools
│   │   ├── dalle/                       # DALL-E integration
│   │   ├── local-system/                # Local system tools
│   │   └── web-browsing/                # Web browsing tools
│   ├── types/                           # TypeScript type definitions
│   │   ├── agent/                       # Agent types
│   │   ├── chunk/                       # Text chunk types
│   │   ├── document/                    # Document types
│   │   ├── eval/                        # Evaluation types
│   │   ├── files/                       # File types
│   │   ├── knowledgeBase/               # Knowledge base types
│   │   ├── message/                     # Message types
│   │   ├── openai/                      # OpenAI-specific types
│   │   ├── session/                     # Session types
│   │   ├── tool/                        # Tool types
│   │   ├── topic/                       # Topic types
│   │   ├── trace/                       # Trace types
│   │   └── user/                        # User types
│   └── utils/                           # Utility functions
│       ├── client/                      # Client-side utilities
│       ├── fetch/                       # Fetch utilities
│       ├── server/                      # Server-side utilities
│       ├── tokenizer/                   # Token counting utilities
│       └── noSSR.ts                     # No SSR utility for client-only code
├── packages/                            # Monorepo packages
│   ├── electron-client-ipc/             # Electron IPC client
│   ├── electron-server-ipc/             # Electron IPC server
│   ├── file-loaders/                    # File processing utilities
│   └── web-crawler/                     # Web crawling functionality
├── apps/                                # Application variants
│   └── desktop/                         # Electron desktop application
├── docs/                                # Comprehensive documentation
│   ├── changelog/                       # Release changelogs
│   ├── development/                     # Development guides
│   ├── self-hosting/                    # Self-hosting guides
│   ├── usage/                           # User guides
│   ├── improvements/                    # Improvement suggestions
│   └── Project_Analysis_Gemini.md       # Gemini analysis documentation
├── locales/                             # Internationalization files (18 languages)
│   ├── ar/                              # Arabic
│   ├── de-DE/                           # German
│   ├── en-US/                           # English (default)
│   ├── es-ES/                           # Spanish
│   ├── fr-FR/                           # French
│   ├── ja-JP/                           # Japanese
│   ├── ko-KR/                           # Korean
│   ├── pt-BR/                           # Portuguese (Brazil)
│   ├── ru-RU/                           # Russian
│   ├── zh-CN/                           # Chinese (Simplified)
│   └── zh-TW/                           # Chinese (Traditional)
├── docker-compose/                      # Docker deployment configurations
│   ├── local/                           # Local development setup
│   └── production/                      # Production deployment
├── public/                              # Static assets
│   ├── icons/                           # App icons and PWA assets
│   │   ├── favicon-32x32.ico            # 32x32 favicon
│   │   ├── favicon.ico                  # Default favicon
│   │   └── originais/                   # Original icon files
│   ├── images/                          # UI images
│   ├── screenshots/                     # App screenshots
│   └── videos/                          # Demo videos
├── scripts/                             # Build and utility scripts
│   ├── buildSitemapIndex/               # Sitemap generation
│   ├── cdnWorkflow/                     # CDN deployment
│   ├── changelogWorkflow/               # Changelog automation
│   ├── dbmlWorkflow/                    # Database documentation
│   ├── docsWorkflow/                    # Documentation generation
│   ├── electronWorkflow/                # Electron build scripts
│   ├── i18nWorkflow/                    # Internationalization scripts
│   ├── migrateClientDB/                 # Client DB migration scripts
│   ├── migrateServerDB/                 # Server DB migration scripts
│   └── readmeWorkflow/                  # README automation
└── tests/                               # Test utilities and setup
    ├── setup.ts                         # Test environment setup
    └── utils.tsx                        # Test utilities
```

## Scripts Principais

### Desenvolvimento
```bash
pnpm dev              # Iniciar servidor de desenvolvimento (porta 3010, com Turbopack)
pnpm dev:desktop      # Iniciar servidor de desenvolvimento desktop (porta 3015)
```

### Build
```bash
pnpm build            # Build de produção
pnpm build:analyze    # Build com análise de bundle
pnpm build:docker     # Build Docker
pnpm build:electron   # Build Electron
```

### Testes
```bash
pnpm test             # Executar todos os testes
pnpm test-app         # Executar apenas testes da aplicação
pnpm test-server      # Executar apenas testes do servidor
pnpm test:update      # Atualizar snapshots dos testes
```

### Linting e Formatação
```bash
pnpm lint             # Executar todos os lintings (TypeScript, estilos, deps circulares)
pnpm lint:ts          # TypeScript/ESLint
pnpm lint:style       # Stylelint
pnpm prettier         # Formatar todos os arquivos
```

### Banco de Dados
```bash
pnpm db:generate      # Gerar schemas Drizzle e client
pnpm db:migrate       # Executar migrações do banco de dados
pnpm db:studio        # Abrir Drizzle Studio
pnpm db:push          # Enviar schema para o banco de dados
```

### Internacionalização
```bash
pnpm i18n             # Gerar arquivos i18n
pnpm docs:i18n        # Gerar i18n da documentação
```

## Arquivos de Configuração

### Configuração Principal
- **`next.config.ts`** - Configuração Next.js com PWA, Sentry, análise de bundle
- **`tsconfig.json`** - Configuração TypeScript com aliases de path
- **`drizzle.config.ts`** - Configuração do ORM de banco de dados
- **`vitest.config.ts`** - Configuração de testes

### Qualidade de Código
- **`.eslintrc.js`** - Configuração ESLint estendendo @lobehub/lint
- **`prettier`** - Formatação de código (configurado via @lobehub/lint)
- **`commitlint`** - Linting de mensagens de commit

### Gerenciamento de Pacotes
- **`package.json`** - Dependências e scripts
- **`pnpm-workspace.yaml`** - Configuração do workspace monorepo

## Variáveis de Ambiente

### Configuração Principal
- `NODE_ENV` - Modo do ambiente (development/production/test)
- `NEXT_PUBLIC_BASE_PATH` - Caminho base customizado para deploy
- `ACCESS_CODE` - Senha de acesso para proteção da API (opcional mas recomendado)
- `KEY_VAULTS_SECRET` - Chave secreta para criptografia

### APIs de Provedores AI
- `OPENAI_API_KEY` - Chave da API OpenAI
- `OPENAI_PROXY_URL` - URL do proxy da API OpenAI
- `OPENAI_MODEL_LIST` - Configuração customizada da lista de modelos
- `ANTHROPIC_API_KEY` - Chave da API Anthropic Claude
- `GOOGLE_API_KEY` - Chave da API Google Generative AI
- `AZURE_API_KEY` - Chave da API Azure OpenAI
- `AZURE_ENDPOINT` - Endpoint Azure OpenAI
- `OLLAMA_PROXY_URL` - URL do servidor Ollama

### Configuração do Banco de Dados
- `DATABASE_URL` - String de conexão PostgreSQL para BD do servidor
- `DATABASE_TEST_URL` - String de conexão do banco de dados de teste
- `NEXT_PUBLIC_CLIENT_DB` - Tipo de banco de dados client (`pglite` para local)

### Autenticação e Segurança
- `NEXTAUTH_SECRET` - Chave secreta NextAuth.js
- `NEXTAUTH_URL` - URL canônica NextAuth.js
- `NEXT_AUTH_SSO_PROVIDERS` - Configuração do provedor SSO (ex: casdoor)
- `AUTH_CASDOOR_ISSUER` - URL do emissor OIDC Casdoor
- `AUTH_CASDOOR_CLIENT_ID` - ID do cliente Casdoor
- `AUTH_CASDOOR_CLIENT_SECRET` - Segredo do cliente Casdoor

### Armazenamento de Arquivos (Compatível com S3)
- `S3_BUCKET` - Nome do bucket S3
- `S3_ENDPOINT` - URL do endpoint S3
- `S3_ACCESS_KEY_ID` - ID da chave de acesso S3
- `S3_SECRET_ACCESS_KEY` - Chave de acesso secreta S3
- `S3_ENABLE_PATH_STYLE` - Habilitar requisições path-style (1/0)
- `S3_SET_ACL` - Definir ACL para arquivos enviados (1/0)

### Monitoramento e Analytics
- `NEXT_PUBLIC_SENTRY_DSN` - DSN de rastreamento de erros Sentry
- `SENTRY_ORG` - Organização Sentry
- `SENTRY_PROJECT` - Projeto Sentry
- `NEXT_PUBLIC_CLARITY_PROJECT_ID` - ID do projeto Microsoft Clarity
- `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` - ID de medição Google Analytics
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` - Domínio Plausible Analytics
- `NEXT_PUBLIC_POSTHOG_KEY` - Chave PostHog analytics
- `NEXT_PUBLIC_UMAMI_SCRIPT_URL` - URL do script Umami analytics
- `NEXT_PUBLIC_UMAMI_WEBSITE_ID` - ID do website Umami

### Feature Flags e Deploy
- `NEXT_PUBLIC_IS_DESKTOP_APP` - Modo de aplicativo desktop (1/0)
- `NEXT_PUBLIC_SERVICE_MODE` - Modo de serviço (server/client)
- `DOCKER` - Modo de build Docker (true/false)
- `ANALYZE` - Modo de análise de bundle (true/false)
- `MIGRATION_DB` - Modo de migração de banco de dados (1/0)
- `TEST_SERVER_DB` - Modo de banco de dados de teste do servidor (1/0)

### Busca e Serviços Externos
- `SEARXNG_URL` - URL do motor de busca SearxNG
- `LANGFUSE_SECRET_KEY` - Chave secreta de observabilidade Langfuse
- `LANGFUSE_PUBLIC_KEY` - Chave pública de observabilidade Langfuse
- `LANGFUSE_BASE_URL` - URL base de observabilidade Langfuse

### Desenvolvimento e Debug
- `REACT_SCAN_MONITOR_API_KEY` - Chave da API de monitoramento React Scan
- `LLM_VISION_IMAGE_USE_BASE64` - Usar base64 para imagens de visão (1/0)

## Diretrizes de Desenvolvimento

### Arquitetura de Código
- **Estrutura orientada a recursos** - Componentes organizados por funcionalidades
- **Padrão de camada de serviços** - Lógica de negócio separada em serviços
- **APIs type-safe** - Cobertura completa TypeScript com tRPC
- **Composição de componentes** - Componentes UI reutilizáveis com padrões consistentes

### Gerenciamento de Estado
- **Stores Zustand** para gerenciamento de estado global
- **TanStack Query** para cache de estado do servidor
- **Atualizações otimistas** para melhor UX
- **Padrão de seletores** para inscrições eficientes da store

### Estratégia de Testes
- **Vitest** para testes unitários e de integração
- **Happy DOM** para ambiente de teste DOM
- **Rastreamento de cobertura** de testes via provedor V8
- **Testes de snapshot** para consistência da UI

### Otimização de Performance
- **Análise de bundle** com webpack-bundle-analyzer
- **Code splitting** com imports dinâmicos
- **Otimização de imagens** com componente Next.js Image
- **Cache PWA** com service worker Serwist

### Internacionalização
- **i18next** para suporte multi-idioma
- **Fluxos de tradução automatizados** com assistência de LLM
- **18 idiomas suportados** incluindo suporte RTL

## Aplicação Desktop

O projeto inclui uma aplicação desktop baseada em Electron:
- **Localização**: `apps/desktop/`
- **Pacotes IPC**: `packages/electron-*-ipc/`
- **Recursos específicos da plataforma**: Acesso ao sistema de arquivos, integração do sistema

## Sistema de Plugins

Arquitetura de plugin extensível suportando:
- **Capacidades de function calling**
- **Componentes de renderização** customizados
- **Marketplace de plugins** com contribuições da comunidade
- **SDK**: `@lobehub/chat-plugin-sdk` para desenvolvimento de plugins

## Arquitetura de Banco de Dados

### Suporte Dual de Banco de Dados
- **Client-side**: PGlite para armazenamento local com sincronização CRDT
- **Server-side**: PostgreSQL para deployments multi-usuário
- **Migrações**: Versionamento automatizado de schema
- **Modelos**: Entidades abrangentes para chat, arquivos, base de conhecimento

### Tabelas Principais
- **messages** - Conversas de chat com suporte a raciocínio
- **sessions** - Sessões de chat e configurações de agentes
- **files** - Uploads de arquivos e documentos da base de conhecimento
- **users** - Gerenciamento de usuários e autenticação
- **user_credits** - Sistema de créditos de usuário
- **ai_models/ai_providers** - Configurações de serviços AI

## Opções de Deploy

### Plataformas Cloud
- **Vercel** - Recomendado para deploy serverless
- **Zeabur, Sealos** - Plataformas cloud alternativas
- **Railway, Netlify** - Opções adicionais de deploy

### Self-Hosting
- **Docker Compose** - Stack completo com banco de dados
- **Docker** - Container de aplicação standalone
- **Deploy manual** - Configuração de servidor customizada

## Comunidade e Ecossistema

### Projetos Relacionados
- **@lobehub/ui** - Biblioteca de componentes UI
- **@lobehub/icons** - Ícones de marcas AI/LLM
- **@lobehub/tts** - Biblioteca text-to-speech
- **@lobehub/lint** - Configuração de linting compartilhada

### Contribuição
- **GitHub**: Issues, discussões e pull requests
- **Discord**: Chat e suporte da comunidade
- **Marketplace de plugins**: Extensões dirigidas pela comunidade
- **Marketplace de agentes**: Assistentes AI compartilhados

Este é um framework de chatbot sofisticado e pronto para produção com arquitetura de nível empresarial, testes abrangentes e desenvolvimento ativo da comunidade. O código demonstra padrões modernos React/Next.js com atenção cuidadosa à performance, acessibilidade e experiência do usuário.

## Arquivos Adicionais do Projeto

### Documentação Auxiliar
- **README.pt-BR.md** - README em português brasileiro
- **Gemini.md** - Documentação específica sobre integração com Google Gemini

### Novos Recursos e Customizações
- **Sistema de autenticação por Access Code** em `src/app/(backend)/api/auth/access-code/`
- **Página de login simplificada** em `src/app/[variants]/(auth)/access-login/`
- **Sistema de documentação integrado** em `src/app/[variants]/(main)/docs/`
- **Componentes de segurança aprimorados** com SafeHotkey, SafeIcon e SafeSearchBar
- **Sistema de créditos de usuário** integrado ao banco de dados
- **Suporte a autenticação por credenciais** via NextAuth