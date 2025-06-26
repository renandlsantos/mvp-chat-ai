# CLAUDE.md - Lobe Chat Project Guide

## Project Overview

**Lobe Chat** is an open-source, high-performance chatbot framework that supports speech synthesis, multimodal interactions, and an extensible Function Call plugin system. It provides one-click free deployment of private ChatGPT/LLM web applications.

### Key Features
- **Chain of Thought (CoT)** visualization for AI reasoning
- **Branching Conversations** with continuation and standalone modes
- **Artifacts Support** for dynamic content creation
- **File Upload & Knowledge Base** functionality
- **Multi-Model Provider Support** (42+ providers including OpenAI, Anthropic, Google, etc.)
- **Local LLM Support** via Ollama
- **Vision Recognition** capabilities
- **TTS & STT** voice conversation
- **Text-to-Image Generation**
- **Plugin System** with 42+ available plugins
- **Agent Market** with 499+ community agents
- **Progressive Web App (PWA)** support
- **Multi-User Management** with authentication
- **Custom Themes** and mobile adaptation

## Technology Stack

### Core Framework
- **Next.js 15.3.3** - React framework with App Router
- **React 19.1.0** - UI library
- **TypeScript 5.8.3** - Type safety
- **Turbopack** - Fast development bundler

### State Management & Data
- **Zustand 5.0.4** - State management
- **TanStack Query 5.79.0** - Server state management
- **tRPC 11.2.0** - Type-safe API layer
- **Drizzle ORM 0.41.0** - Database ORM
- **PostgreSQL** - Server database (with PGlite for client-side)

### Styling & UI
- **Ant Design 5.25.4** - UI component library
- **@lobehub/ui 2.1.15** - Custom component library
- **antd-style 3.7.1** - Styling solution
- **Framer Motion 12.15.0** - Animations
- **Lucide React 0.509.0** - Icons

### AI & ML Integrations
- **Vercel AI SDK 3.4.33** - AI model integrations
- **OpenAI 4.104.0** - OpenAI API
- **Anthropic SDK 0.54.0** - Claude API
- **Google Generative AI 0.24.1** - Gemini API
- **Langchain 0.3.27** - LLM framework
- **Ollama 0.5.16** - Local model support

### Development & Testing
- **Vitest 3.2.0** - Testing framework
- **ESLint** - Code linting (via @lobehub/lint)
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **Commitlint** - Commit message linting

### Deployment & Infrastructure
- **Docker** - Containerization
- **Vercel** - Deployment platform
- **Sentry** - Error monitoring
- **PWA/Serwist** - Service worker management

## Project Structure

```
lobe-chat/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (backend)/         # Backend API routes
│   │   │   ├── api/           # REST API endpoints
│   │   │   ├── trpc/          # tRPC procedures
│   │   │   └── webapi/        # Web API handlers
│   │   └── [variants]/        # Dynamic routes with variants
│   ├── chains/                # LangChain integrations
│   ├── components/            # Reusable React components
│   ├── config/                # Configuration files
│   │   ├── aiModels/          # AI model configurations
│   │   └── modelProviders/    # Provider configurations
│   ├── database/              # Database layer
│   │   ├── client/            # Client-side database (PGlite)
│   │   ├── server/            # Server-side database models
│   │   ├── schemas/           # Drizzle schemas
│   │   └── migrations/        # Database migrations
│   ├── features/              # Feature-specific components
│   ├── hooks/                 # Custom React hooks
│   ├── layout/                # Layout components
│   ├── libs/                  # Library integrations
│   ├── services/              # Business logic services
│   ├── store/                 # Zustand stores
│   ├── types/                 # TypeScript type definitions
│   └── utils/                 # Utility functions
├── packages/                  # Monorepo packages
│   ├── electron-client-ipc/   # Electron IPC client
│   ├── electron-server-ipc/   # Electron IPC server
│   ├── file-loaders/          # File processing utilities
│   └── web-crawler/           # Web crawling functionality
├── docs/                      # Documentation
├── locales/                   # Internationalization files
├── public/                    # Static assets
└── scripts/                   # Build and utility scripts
```

## Key Scripts

### Development
```bash
pnpm dev              # Start development server (port 3010, with Turbopack)
pnpm dev:desktop      # Start desktop development server (port 3015)
```

### Building
```bash
pnpm build            # Production build
pnpm build:analyze    # Build with bundle analysis
pnpm build:docker     # Docker build
pnpm build:electron   # Electron build
```

### Testing
```bash
pnpm test             # Run all tests
pnpm test-app         # Run app tests only
pnpm test-server      # Run server tests only
pnpm test:update      # Update test snapshots
```

### Linting & Formatting
```bash
pnpm lint             # Run all linting (TypeScript, styles, circular deps)
pnpm lint:ts          # TypeScript/ESLint
pnpm lint:style       # Stylelint
pnpm prettier         # Format all files
```

### Database
```bash
pnpm db:generate      # Generate Drizzle schemas and client
pnpm db:migrate       # Run database migrations
pnpm db:studio        # Open Drizzle Studio
pnpm db:push          # Push schema to database
```

### Internationalization
```bash
pnpm i18n             # Generate i18n files
pnpm docs:i18n        # Generate documentation i18n
```

## Configuration Files

### Core Config
- **`next.config.ts`** - Next.js configuration with PWA, Sentry, bundle analysis
- **`tsconfig.json`** - TypeScript configuration with path aliases
- **`drizzle.config.ts`** - Database ORM configuration
- **`vitest.config.ts`** - Test configuration

### Code Quality
- **`.eslintrc.js`** - ESLint configuration extending @lobehub/lint
- **`prettier`** - Code formatting (configured via @lobehub/lint)
- **`commitlint`** - Commit message linting

### Package Management
- **`package.json`** - Dependencies and scripts
- **`pnpm-workspace.yaml`** - Monorepo workspace configuration

## Environment Variables

### Required
- `OPENAI_API_KEY` - OpenAI API key
- `ACCESS_CODE` - Access password (optional but recommended)

### Optional
- `OPENAI_PROXY_URL` - OpenAI API proxy URL
- `OPENAI_MODEL_LIST` - Custom model list configuration
- `NEXT_PUBLIC_BASE_PATH` - Custom base path
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - NextAuth.js secret
- `SENTRY_DSN` - Sentry error tracking

### Database Options
- `NEXT_PUBLIC_CLIENT_DB` - Client database type (`pglite` for local)
- Server database using PostgreSQL for multi-user scenarios

## Development Guidelines

### Code Architecture
- **Feature-driven structure** - Components organized by features
- **Service layer pattern** - Business logic separated into services
- **Type-safe APIs** - Full TypeScript coverage with tRPC
- **Component composition** - Reusable UI components with consistent patterns

### State Management
- **Zustand stores** for global state management
- **TanStack Query** for server state caching
- **Optimistic updates** for better UX
- **Selectors pattern** for efficient store subscriptions

### Testing Strategy
- **Vitest** for unit and integration testing
- **Happy DOM** for DOM testing environment
- **Test coverage** tracking via V8 provider
- **Snapshot testing** for UI consistency

### Performance Optimization
- **Bundle analysis** with webpack-bundle-analyzer
- **Code splitting** with dynamic imports
- **Image optimization** with Next.js Image component
- **PWA caching** with Serwist service worker

### Internationalization
- **i18next** for multi-language support
- **Automated translation workflows** with LLM assistance
- **18 supported languages** including RTL support

## Desktop Application

The project includes an Electron-based desktop application:
- **Location**: `apps/desktop/`
- **IPC packages**: `packages/electron-*-ipc/`
- **Platform-specific features**: File system access, system integration

## Plugin System

Extensible plugin architecture supporting:
- **Function calling** capabilities
- **Custom rendering** components
- **Plugin marketplace** with community contributions
- **SDK**: `@lobehub/chat-plugin-sdk` for plugin development

## Database Architecture

### Dual Database Support
- **Client-side**: PGlite for local storage with CRDT sync
- **Server-side**: PostgreSQL for multi-user deployments
- **Migrations**: Automated schema versioning
- **Models**: Comprehensive entities for chat, files, knowledge base

### Key Tables
- **messages** - Chat conversations with reasoning support
- **sessions** - Chat sessions and agent configurations  
- **files** - File uploads and knowledge base documents
- **users** - User management and authentication
- **ai_models/ai_providers** - AI service configurations

## Deployment Options

### Cloud Platforms
- **Vercel** - Recommended for serverless deployment
- **Zeabur, Sealos** - Alternative cloud platforms
- **Railway, Netlify** - Additional deployment options

### Self-Hosting
- **Docker Compose** - Full stack with database
- **Docker** - Standalone application container
- **Manual deployment** - Custom server setup

## Community & Ecosystem

### Related Projects
- **@lobehub/ui** - UI component library
- **@lobehub/icons** - AI/LLM brand icons
- **@lobehub/tts** - Text-to-speech library
- **@lobehub/lint** - Shared linting configuration

### Contribution
- **GitHub**: Issues, discussions, and pull requests
- **Discord**: Community chat and support
- **Plugin marketplace**: Community-driven extensions
- **Agent marketplace**: Shared AI assistants

This is a sophisticated, production-ready chatbot framework with enterprise-grade architecture, comprehensive testing, and active community development. The codebase demonstrates modern React/Next.js patterns with careful attention to performance, accessibility, and user experience.