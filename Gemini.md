# Gemini Code Orchestrator: Análise do Projeto Lobe Chat

Este documento foi gerado pelo Gemini, atuando como um orquestrador de código, para fornecer uma análise detalhada e um mapa de conhecimento do projeto Lobe Chat. O objetivo é servir como um guia de referência para futuras tarefas de desenvolvimento, manutenção e evolução do projeto.

## 1. Visão Geral do Projeto

- **Nome:** `@lobehub/chat`
- **Descrição:** Um framework de chatbot de código aberto e alta performance. Suporta síntese de voz, multimodalidade e um sistema extensível de plugins (Function Calling). Permite o deploy com um clique de uma aplicação web privada de ChatGPT/LLM.
- **Estrutura:** É um monorepo gerenciado com `pnpm workspaces`, contendo a aplicação web principal, uma aplicação desktop (Electron) e pacotes compartilhados.

## 2. Tecnologias e Dependências

| Categoria | Tecnologias |
| :--- | :--- |
| **Framework Principal** | Next.js (com Turbopack para desenvolvimento) |
| **Linguagem** | TypeScript |
| **Estilização** | Ant Design (`antd`), `antd-style`, `styled-components` |
| **Gerenciamento de Estado**| Zustand |
| **Comunicação com API** | tRPC, `swr`, `react-query` |
| **Banco de Dados** | PostgreSQL (via Neon, Vercel Postgres, etc.) |
| **ORM** | Drizzle ORM |
| **Autenticação** | NextAuth.js, Clerk |
| **Testes** | Vitest, Testing Library |
| **Linting & Formatting** | ESLint, Prettier, Stylelint, Commitlint |
| **IA & LLMs** | OpenAI, Anthropic, Google Gemini, LangChain, Hugging Face |
| **Desktop App** | Electron |
| **PWA** | `@serwist/next` |
| **Monitoramento** | Sentry |

## 3. Estrutura de Diretórios

A estrutura do projeto é modular e bem organizada, separando claramente as responsabilidades.

```
.
├── apps/
│   └── desktop/      # Código-fonte da aplicação Electron
├── packages/
│   ├── electron-client-ipc/ # Comunicação IPC (client-side)
│   ├── electron-server-ipc/ # Comunicação IPC (server-side)
│   ├── file-loaders/      # Lógica para carregar arquivos
│   └── web-crawler/       # Ferramenta de web crawling
├── src/
│   ├── app/            # App Router do Next.js (páginas, rotas, layouts)
│   ├── chains/         # Lógica de LangChain
│   ├── components/     # Componentes React
│   ├── config/         # Configurações da aplicação
│   ├── const/          # Constantes
│   ├── database/       # Schemas e lógica de acesso a dados (Drizzle)
│   ├── envs/           # Gerenciamento de variáveis de ambiente
│   ├── features/       # Módulos de funcionalidades
│   ├── hooks/          # Hooks React customizados
│   ├── layout/         # Componentes de Layout
│   ├── libs/           # Bibliotecas e utilitários
│   ├── locales/        # Arquivos de internacionalização (i18n)
│   ├── migrations/     # Migrações do banco de dados
│   ├── prompts/        # Templates de prompts para LLMs
│   ├── server/         # Lógica de backend (tRPC, etc.)
│   ├── services/       # Lógica de negócio, APIs externas
│   ├── store/          # Gerenciamento de estado (Zustand)
│   ├── styles/         # Estilos globais e temas
│   ├── tools/          # Ferramentas para Function Calling
│   ├── types/          # Definições de tipos TypeScript
│   └── utils/          # Funções utilitárias
└── ...
```

## 4. Scripts e Workflows

O `package.json` define uma série de scripts para automatizar tarefas comuns:

-   **Desenvolvimento:** `dev` (inicia o servidor de desenvolvimento com Turbopack), `dev:desktop`
-   **Build:** `build`, `build:docker`, `build:electron`
-   **Testes:** `test`, `test-app`, `test-server` (com relatórios de cobertura)
-   **Banco de Dados:** `db:generate` (gera migrações), `db:migrate` (aplica migrações), `db:studio` (inicia o Drizzle Studio).
-   **Linting e Qualidade:** `lint`, `lint:ts`, `lint:style`, `type-check`
-   **Workflows:** Diversos scripts em `scripts/` e `workflow:*` para automatizar tarefas como i18n, geração de changelog, sitemap, etc.

## 5. Arquitetura de Dados e IA

-   **Banco de Dados:** O projeto utiliza Drizzle ORM com PostgreSQL. Os schemas estão localizados em `src/database/schemas`. A configuração (`drizzle.config.ts`) é flexível e suporta diferentes ambientes (dev, test).
-   **IA:** A arquitetura é projetada para ser agnóstica em relação ao provedor de LLM, com integrações para vários modelos (OpenAI, Gemini, Claude, etc.).
-   **LangChain:** O diretório `src/chains` sugere o uso de LangChain para orquestrar interações complexas com os modelos de linguagem.
-   **Function Calling:** O diretório `src/tools` indica um sistema para definir ferramentas que o LLM pode invocar, permitindo a extensão das suas capacidades.
-   **Gerenciamento de Estado:** O Zustand (`src/store`) é usado para gerenciar o estado da interface do usuário de forma reativa e eficiente.

## 6. Build e Deploy

-   **Web:** A aplicação pode ser implantada em plataformas como Vercel ou Netlify.
-   **Docker:** O projeto inclui `Dockerfile`s e scripts (`build:docker`) para criar imagens de contêiner, facilitando o auto-hospedagem (self-hosting).
-   **Desktop:** A aplicação Electron (`apps/desktop`) pode ser compilada para diferentes sistemas operacionais.
-   **PWA:** Em produção, a aplicação web funciona como um Progressive Web App, permitindo a instalação e o uso offline.
-   **CI/CD:** O diretório `.github/workflows` contém uma série de actions do GitHub para automação de testes, build, release e tradução.

---
*Este documento é um artefato vivo e deve ser atualizado à medida que o projeto evolui.*
