<div align="center"><a name="readme-top"></a>

[![][image-banner]][vercel-link]

# Lobe Chat

Uma interface/framework moderno e de código aberto para ChatGPT/LLMs.<br/>
Suporta síntese de voz, multimodal e sistema extensível de plugins ([function call][docs-function-call]).<br/>
Implantação **GRATUITA** com um clique da sua aplicação de chat privada OpenAI ChatGPT/Claude/Gemini/Groq/Ollama.

**Português (Brasil)** · [English](./README.md) · [简体中文](./README.zh-CN.md) · [Site Oficial][official-site] · [Changelog][changelog] · [Documentação][docs] · [Blog][blog] · [Feedback][github-issues-link]

<!-- GRUPO DE SHIELDS -->

[![][github-release-shield]][github-release-link]
[![][docker-release-shield]][docker-release-link]
[![][vercel-shield]][vercel-link]
[![][discord-shield]][discord-link]<br/>
[![][codecov-shield]][codecov-link]
[![][github-action-test-shield]][github-action-test-link]
[![][github-action-release-shield]][github-action-release-link]
[![][github-releasedate-shield]][github-releasedate-link]<br/>
[![][github-contributors-shield]][github-contributors-link]
[![][github-forks-shield]][github-forks-link]
[![][github-stars-shield]][github-stars-link]
[![][github-issues-shield]][github-issues-link]
[![][github-license-shield]][github-license-link]<br>
[![][sponsor-shield]][sponsor-link]

**Compartilhe o Repositório LobeChat**

[![][share-x-shield]][share-x-link]
[![][share-telegram-shield]][share-telegram-link]
[![][share-whatsapp-shield]][share-whatsapp-link]
[![][share-reddit-shield]][share-reddit-link]
[![][share-weibo-shield]][share-weibo-link]
[![][share-mastodon-shield]][share-mastodon-link]
[![][share-linkedin-shield]][share-linkedin-link]

<sup>Pioneirando a nova era do pensamento e criação. Construído para você, o Super Indivíduo.</sup>

[![][github-trending-shield]][github-trending-url] <br /> <br /> <a href="https://vercel.com/oss"> <img alt="Programa OSS Vercel" src="https://vercel.com/oss/program-badge.svg" /> </a>

![][image-overview]

</div>

<details>
<summary><kbd>Índice</kbd></summary>

#### ÍNDICE

- [👋🏻 Começar & Junte-se à Nossa Comunidade](#-começar--junte-se-à-nossa-comunidade)
- [✨ Recursos](#-recursos)
  - [`1` Chain of Thought](#1-chain-of-thought)
  - [`2` Conversas Ramificadas](#2-conversas-ramificadas)
  - [`3` Suporte a Artefatos](#3-suporte-a-artefatos)
  - [`4` Upload de Arquivos / Base de Conhecimento](#4-upload-de-arquivos--base-de-conhecimento)
  - [`5` Suporte Multi-Provedor de Modelos](#5-suporte-multi-provedor-de-modelos)
  - [`6` Suporte a Large Language Model (LLM) Local](#6-suporte-a-large-language-model-llm-local)
  - [`7` Reconhecimento Visual do Modelo](#7-reconhecimento-visual-do-modelo)
  - [`8` Conversação por Voz TTS & STT](#8-conversação-por-voz-tts--stt)
  - [`9` Geração de Texto para Imagem](#9-geração-de-texto-para-imagem)
  - [`10` Sistema de Plugins (Function Calling)](#10-sistema-de-plugins-function-calling)
  - [`11` Mercado de Agentes (GPTs)](#11-mercado-de-agentes-gpts)
  - [`12` Suporte a Banco de Dados Local / Remoto](#12-suporte-a-banco-de-dados-local--remoto)
  - [`13` Suporte a Gerenciamento Multi-Usuário](#13-suporte-a-gerenciamento-multi-usuário)
  - [`14` Progressive Web App (PWA)](#14-progressive-web-app-pwa)
  - [`15` Adaptação para Dispositivos Móveis](#15-adaptação-para-dispositivos-móveis)
  - [`16` Temas Personalizados](#16-temas-personalizados)
  - [`*` O que mais](#-o-que-mais)
- [⚡️ Performance](#️-performance)
- [🛳 Self Hosting](#-self-hosting)
  - [`A` Implantando com Vercel, Zeabur, Sealos ou Alibaba Cloud](#a-implantando-com-vercel-zeabur-sealos-ou-alibaba-cloud)
  - [`B` Implantando com Docker](#b-implantando-com-docker)
  - [Variáveis de Ambiente](#variáveis-de-ambiente)
- [📦 Ecossistema](#-ecossistema)
- [🧩 Plugins](#-plugins)
- [⌨️ Desenvolvimento Local](#️-desenvolvimento-local)
- [🤝 Contribuindo](#-contribuindo)
- [❤️ Patrocinador](#️-patrocinador)
- [🔗 Mais Produtos](#-mais-produtos)

####

<br/>

</details>

## 👋🏻 Começar & Junte-se à Nossa Comunidade

Somos um grupo de design-engineers e/acc, esperando fornecer componentes de design modernos e ferramentas para AIGC.
Adotando a abordagem Bootstrapping, nosso objetivo é fornecer aos desenvolvedores e usuários um ecossistema de produtos mais aberto, transparente e amigável.

Seja para usuários ou desenvolvedores profissionais, o LobeHub será seu playground de Agentes AI. Esteja ciente de que o LobeChat está atualmente sob desenvolvimento ativo, e feedback é bem-vindo para qualquer [problema][issues-link] encontrado.

| [![][vercel-shield-badge]][vercel-link]   | Nenhuma instalação ou registro necessário! Visite nosso site para experimentá-lo em primeira mão.                  |
| :---------------------------------------- | :----------------------------------------------------------------------------------------------------------------- |
| [![][discord-shield-badge]][discord-link] | Junte-se à nossa comunidade Discord! É aqui que você pode se conectar com desenvolvedores e outros usuários entusiastas do LobeHub. |

> \\[!IMPORTANTE]
>
> **Favorite-nos**, Você receberá todas as notificações de release do GitHub sem atraso \\~ ⭐️

[![][image-star]][github-stars-link]

## ✨ Recursos

### `1` [Chain of Thought][docs-feat-cot]

Experimente o raciocínio da IA como nunca antes. Observe como problemas complexos se desenrolam passo a passo através da nossa inovadora visualização Chain of Thought (CoT). Este recurso revolucionário fornece transparência sem precedentes no processo de tomada de decisão da IA, permitindo que você observe como as conclusões são alcançadas em tempo real.

### `2` [Conversas Ramificadas][docs-feat-branch]

Apresentando uma maneira mais natural e flexível de conversar com IA. Com Conversas Ramificadas, suas discussões podem fluir em múltiplas direções, assim como as conversas humanas fazem. Crie novos ramos de conversa a partir de qualquer mensagem, dando-lhe a liberdade de explorar diferentes caminhos enquanto preserva o contexto original.

### `3` [Suporte a Artefatos][docs-feat-artifacts]

Experimente o poder dos Artefatos Claude, agora integrado ao LobeChat. Este recurso revolucionário expande os limites da interação IA-humano, permitindo criação e visualização em tempo real de diversos formatos de conteúdo.

### `4` [Upload de Arquivos / Base de Conhecimento][docs-feat-knowledgebase]

O LobeChat suporta funcionalidade de upload de arquivos e base de conhecimento. Você pode fazer upload de vários tipos de arquivos incluindo documentos, imagens, áudio e vídeo, bem como criar bases de conhecimento, tornando conveniente para os usuários gerenciar e buscar arquivos.

### `5` [Suporte Multi-Provedor de Modelos][docs-feat-provider]

No desenvolvimento contínuo do LobeChat, entendemos profundamente a importância da diversidade em provedores de serviços de modelo para atender às necessidades da comunidade ao fornecer serviços de conversação AI. Portanto, expandimos nosso suporte para múltiplos provedores de serviços de modelo, ao invés de estar limitado a apenas um.

#### Provedores de Serviços de Modelo Suportados

Implementamos suporte para os seguintes provedores de serviços de modelo:

- **[OpenAI](https://lobechat.com/discover/provider/openai)**: Líder global em pesquisa de inteligência artificial
- **[Ollama](https://lobechat.com/discover/provider/ollama)**: Fornece modelos que cobrem uma ampla gama de campos
- **[Anthropic](https://lobechat.com/discover/provider/anthropic)**: Empresa focada em pesquisa e desenvolvimento de IA
- **[Google](https://lobechat.com/discover/provider/google)**: Série Gemini do Google
- **[DeepSeek](https://lobechat.com/discover/provider/deepseek)**: Empresa focada em pesquisa e aplicação de tecnologia AI

> 📊 Total de provedores: [<kbd>**41**</kbd>](https://lobechat.com/discover/providers)

### `6` [Suporte a Large Language Model (LLM) Local][docs-feat-local]

Para atender às necessidades específicas dos usuários, o LobeChat também suporta o uso de modelos locais baseados em [Ollama](https://ollama.ai), permitindo que os usuários usem flexivelmente seus próprios modelos ou de terceiros.

### `7` [Reconhecimento Visual do Modelo][docs-feat-vision]

O LobeChat agora suporta o mais recente modelo [`gpt-4-vision`](https://platform.openai.com/docs/guides/vision) do OpenAI com capacidades de reconhecimento visual, uma inteligência multimodal que pode perceber visuais.

### `8` [Conversação por Voz TTS & STT][docs-feat-tts]

O LobeChat suporta tecnologias Text-to-Speech (TTS) e Speech-to-Text (STT), permitindo que nossa aplicação converta mensagens de texto em saídas de voz claras, permitindo que os usuários interajam com nosso agente conversacional como se estivessem falando com uma pessoa real.

### `9` [Geração de Texto para Imagem][docs-feat-t2i]

Com suporte para a mais recente tecnologia de geração de texto para imagem, o LobeChat agora permite que os usuários invoquem ferramentas de criação de imagem diretamente dentro das conversas com o agente.

### `10` [Sistema de Plugins (Function Calling)][docs-feat-plugin]

O ecossistema de plugins do LobeChat é uma extensão importante de sua funcionalidade principal, aumentando muito a praticidade e flexibilidade do assistente LobeChat.

### `11` [Mercado de Agentes (GPTs)][docs-feat-agent]

No Mercado de Agentes LobeChat, criadores podem descobrir uma comunidade vibrante e inovadora que reúne uma multitude de agentes bem projetados.

### `12` [Suporte a Banco de Dados Local / Remoto][docs-feat-database]

O LobeChat suporta o uso de bancos de dados do lado do servidor e locais. Dependendo das suas necessidades, você pode escolher a solução de implantação apropriada.

### `13` [Suporte a Gerenciamento Multi-Usuário][docs-feat-auth]

O LobeChat suporta gerenciamento multi-usuário e fornece duas principais soluções de autenticação e gerenciamento de usuários para atender diferentes necessidades.

### `14` [Progressive Web App (PWA)][docs-feat-pwa]

Entendemos profundamente a importância de fornecer uma experiência perfeita para usuários no ambiente multi-dispositivo de hoje. Portanto, adotamos a tecnologia Progressive Web Application ([PWA](https://support.google.com/chrome/answer/9658361)).

### `15` [Adaptação para Dispositivos Móveis][docs-feat-mobile]

Realizamos uma série de designs de otimização para dispositivos móveis para melhorar a experiência móvel do usuário.

### `16` [Temas Personalizados][docs-feat-theme]

Como uma aplicação orientada a design-engineering, o LobeChat coloca grande ênfase nas experiências personalizadas dos usuários, portanto introduzindo modos de tema flexíveis e diversos.

### `*` O que mais

Além desses recursos, o LobeChat também tem muito melhor técnica básica por baixo:

- [x] 💨 **Implantação Rápida**: Usando a plataforma Vercel ou imagem docker, você pode implantar com apenas um clique e completar o processo em 1 minuto sem configuração complexa.
- [x] 🌐 **Domínio Personalizado**: Se os usuários têm seu próprio domínio, eles podem vinculá-lo à plataforma para acesso rápido ao agente de diálogo de qualquer lugar.
- [x] 🔒 **Proteção de Privacidade**: Todos os dados são armazenados localmente no navegador do usuário, garantindo a privacidade do usuário.
- [x] 💎 **Design de UI Requintado**: Com uma interface cuidadosamente projetada, oferece uma aparência elegante e interação suave. Suporta temas claro e escuro e é amigável para mobile. Suporte PWA fornece uma experiência mais parecida com nativo.
- [x] 🗣️ **Experiência de Conversa Suave**: Respostas fluidas garantem uma experiência de conversa suave. Suporta totalmente renderização Markdown, incluindo destaque de código, fórmulas LaTex, fluxogramas Mermaid e mais.

## ⚡️ Performance

> \\[!NOTA]
>
> A lista completa de relatórios pode ser encontrada nos [📘 Relatórios Lighthouse][docs-lighthouse]

|                   Desktop                   |                   Mobile                   |
| :-----------------------------------------: | :----------------------------------------: |
|              ![][chat-desktop]              |              ![][chat-mobile]              |
| [📑 Relatório Lighthouse][chat-desktop-report] | [📑 Relatório Lighthouse][chat-mobile-report] |

## 🛳 Self Hosting

O LobeChat fornece Versão Self-Hosted com Vercel, Alibaba Cloud e [Imagem Docker][docker-release-link]. Isso permite que você implante seu próprio chatbot em poucos minutos sem conhecimento prévio.

### `A` Implantando com Vercel, Zeabur, Sealos ou Alibaba Cloud

Se você quiser implantar este serviço no Vercel, Zeabur ou Alibaba Cloud, pode seguir estes passos:

- Prepare sua [Chave API OpenAI](https://platform.openai.com/account/api-keys).
- Clique no botão abaixo para começar a implantação: Faça login diretamente com sua conta GitHub, e lembre-se de preencher `OPENAI_API_KEY`(obrigatório) e `ACCESS_CODE` (recomendado) na seção de variáveis de ambiente.
- Após a implantação, você pode começar a usar.
- Vincule um domínio personalizado (opcional): O DNS do domínio atribuído pelo Vercel está poluído em algumas áreas; vincular um domínio personalizado pode conectar diretamente.

### `B` Implantando com Docker

Fornecemos uma imagem Docker para implantar o serviço LobeChat em seu próprio dispositivo privado. Use o seguinte comando para iniciar o serviço LobeChat:

```fish
docker run -d -p 3210:3210 \
  -e OPENAI_API_KEY=sk-xxxx \
  -e ACCESS_CODE=sua-senha \
  lobehub/lobe-chat
```

### Variáveis de Ambiente

Este projeto fornece alguns itens de configuração adicionais definidos com variáveis de ambiente:

| Variável de Ambiente | Obrigatório | Descrição                                                                                                                                                               | Exemplo                                                                                                              |
| -------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `OPENAI_API_KEY`     | Sim      | Esta é a chave API que você aplica na página da conta OpenAI                                                                                                                  | `sk-xxxxxx...xxxxxx`                                                                                                 |
| `ACCESS_CODE`        | Não       | Adicione uma senha para acessar este serviço; você pode definir uma senha longa para evitar vazamentos. Se este valor contém uma vírgula, é um array de senhas.              | `awCTe)re_r74` ou `rtrt_ewee3@09!` ou `code1,code2,code3`                                                            |

## 📦 Ecossistema

| NPM                               | Repositório                              | Descrição                                                                                           | Versão                                   |
| --------------------------------- | --------------------------------------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| [@lobehub/ui][lobe-ui-link]       | [lobehub/lobe-ui][lobe-ui-github]       | Biblioteca de componentes UI de código aberto dedicada à construção de aplicações web AIGC.                         | [![][lobe-ui-shield]][lobe-ui-link]       |
| [@lobehub/icons][lobe-icons-link] | [lobehub/lobe-icons][lobe-icons-github] | Coleção de Ícones e Logos SVG de Marcas de Modelos AI / LLM Populares.                                            | [![][lobe-icons-shield]][lobe-icons-link] |
| [@lobehub/tts][lobe-tts-link]     | [lobehub/lobe-tts][lobe-tts-github]     | Biblioteca React Hooks TTS/STT de alta qualidade e confiável                                                   | [![][lobe-tts-shield]][lobe-tts-link]     |
| [@lobehub/lint][lobe-lint-link]   | [lobehub/lobe-lint][lobe-lint-github]   | Configurações para ESlint, Stylelint, Commitlint, Prettier, Remark e Semantic Release para LobeHub. | [![][lobe-lint-shield]][lobe-lint-link]   |

## 🧩 Plugins

Os plugins fornecem um meio de estender as capacidades de [Function Calling][docs-function-call] do LobeChat. Se você está interessado no desenvolvimento de plugins, consulte nosso [📘 Guia de Desenvolvimento de Plugin][docs-plugin-dev] na Wiki.

## ⌨️ Desenvolvimento Local

Você pode usar GitHub Codespaces para desenvolvimento online:

[![][codespaces-shield]][codespaces-link]

Ou clone para desenvolvimento local:

```fish
$ git clone https://github.com/lobehub/lobe-chat.git
$ cd lobe-chat
$ pnpm install
$ pnpm dev
```

Se você gostaria de aprender mais detalhes, sinta-se livre para consultar nosso [📘 Guia de Desenvolvimento][docs-dev-guide].

## 🤝 Contribuindo

Contribuições de todos os tipos são mais que bem-vindas; se você está interessado em contribuir com código, sinta-se livre para verificar nossos [Issues][github-issues-link] e [Projetos][github-project-link] do GitHub para se envolver e nos mostrar do que você é capaz.

[![][pr-welcome-shield]][pr-welcome-link]
[![][submit-agents-shield]][submit-agents-link]
[![][submit-plugin-shield]][submit-plugin-link]

## ❤️ Patrocinador

Cada contribuição conta e sua doação única brilha em nossa galáxia de apoio! Você é uma estrela cadente, causando um impacto rápido e brilhante em nossa jornada. Obrigado por acreditar em nós – sua generosidade nos guia em direção à nossa missão, um flash brilhante de cada vez.

## 🔗 Mais Produtos

- **[🅰️ Lobe SD Theme][lobe-theme]:** Tema moderno para Stable Diffusion WebUI, design de interface requintado, UI altamente personalizável e recursos que aumentam a eficiência.
- **[⛵️ Lobe Midjourney WebUI][lobe-midjourney-webui]:** WebUI para Midjourney, aproveita IA para gerar rapidamente uma ampla gama de imagens ricas e diversas a partir de prompts de texto.
- **[🌏 Lobe i18n][lobe-i18n] :** Lobe i18n é uma ferramenta de automação para o processo de tradução i18n (internacionalização), alimentada pelo ChatGPT.
- **[💌 Lobe Commit][lobe-commit]:** Lobe Commit é uma ferramenta CLI que aproveita Langchain/ChatGPT para gerar mensagens de commit baseadas em Gitmoji.

---

#### 📝 Licença

Copyright © 2025 [LobeHub][profile-link]. <br />
Este projeto é licenciado sob [Apache 2.0](./LICENSE).

<!-- GRUPO DE LINKS -->

[back-to-top]: https://img.shields.io/badge/-VOLTAR_AO_TOPO-151515?style=flat-square
[blog]: https://lobehub.com/blog
[changelog]: https://lobehub.com/changelog
[chat-desktop]: https://raw.githubusercontent.com/lobehub/lobe-chat/lighthouse/lighthouse/chat/desktop/pagespeed.svg
[chat-desktop-report]: https://lobehub.github.io/lobe-chat/lighthouse/chat/desktop/chat_preview_lobehub_com_chat.html
[chat-mobile]: https://raw.githubusercontent.com/lobehub/lobe-chat/lighthouse/lighthouse/chat/mobile/pagespeed.svg
[chat-mobile-report]: https://lobehub.github.io/lobe-chat/lighthouse/chat/mobile/chat_preview_lobehub_com_chat.html
[codecov-link]: https://codecov.io/gh/lobehub/lobe-chat
[codecov-shield]: https://img.shields.io/codecov/c/github/lobehub/lobe-chat?labelColor=black&style=flat-square&logo=codecov&logoColor=white
[codespaces-link]: https://codespaces.new/lobehub/lobe-chat
[codespaces-shield]: https://github.com/codespaces/badge.svg
[discord-link]: https://discord.gg/AYFPHvv2jT
[discord-shield]: https://img.shields.io/discord/1127171173982154893?color=5865F2&label=discord&labelColor=black&logo=discord&logoColor=white&style=flat-square
[discord-shield-badge]: https://img.shields.io/discord/1127171173982154893?color=5865F2&label=discord&labelColor=black&logo=discord&logoColor=white&style=for-the-badge
[docker-release-link]: https://hub.docker.com/r/lobehub/lobe-chat-database
[docker-release-shield]: https://img.shields.io/docker/v/lobehub/lobe-chat-database?color=369eff&label=docker&labelColor=black&logo=docker&logoColor=white&style=flat-square&sort=semver
[docs]: https://lobehub.com/docs/usage/start
[docs-dev-guide]: https://github.com/lobehub/lobe-chat/wiki/index
[docs-feat-agent]: https://lobehub.com/docs/usage/features/agent-market
[docs-feat-artifacts]: https://lobehub.com/docs/usage/features/artifacts
[docs-feat-auth]: https://lobehub.com/docs/usage/features/auth
[docs-feat-branch]: https://lobehub.com/docs/usage/features/branching-conversations
[docs-feat-cot]: https://lobehub.com/docs/usage/features/cot
[docs-feat-database]: https://lobehub.com/docs/usage/features/database
[docs-feat-knowledgebase]: https://lobehub.com/blog/knowledge-base
[docs-feat-local]: https://lobehub.com/docs/usage/features/local-llm
[docs-feat-mobile]: https://lobehub.com/docs/usage/features/mobile
[docs-feat-plugin]: https://lobehub.com/docs/usage/features/plugin-system
[docs-feat-provider]: https://lobehub.com/docs/usage/features/multi-ai-providers
[docs-feat-pwa]: https://lobehub.com/docs/usage/features/pwa
[docs-feat-t2i]: https://lobehub.com/docs/usage/features/text-to-image
[docs-feat-theme]: https://lobehub.com/docs/usage/features/theme
[docs-feat-tts]: https://lobehub.com/docs/usage/features/tts
[docs-feat-vision]: https://lobehub.com/docs/usage/features/vision
[docs-function-call]: https://lobehub.com/blog/openai-function-call
[docs-lighthouse]: https://github.com/lobehub/lobe-chat/wiki/Lighthouse
[docs-plugin-dev]: https://lobehub.com/docs/usage/plugins/development
[github-action-release-link]: https://github.com/actions/workflows/lobehub/lobe-chat/release.yml
[github-action-release-shield]: https://img.shields.io/github/actions/workflow/status/lobehub/lobe-chat/release.yml?label=release&labelColor=black&logo=githubactions&logoColor=white&style=flat-square
[github-action-test-link]: https://github.com/actions/workflows/lobehub/lobe-chat/test.yml
[github-action-test-shield]: https://img.shields.io/github/actions/workflow/status/lobehub/lobe-chat/test.yml?label=test&labelColor=black&logo=githubactions&logoColor=white&style=flat-square
[github-contributors-link]: https://github.com/lobehub/lobe-chat/graphs/contributors
[github-contributors-shield]: https://img.shields.io/github/contributors/lobehub/lobe-chat?color=c4f042&labelColor=black&style=flat-square
[github-forks-link]: https://github.com/lobehub/lobe-chat/network/members
[github-forks-shield]: https://img.shields.io/github/forks/lobehub/lobe-chat?color=8ae8ff&labelColor=black&style=flat-square
[github-issues-link]: https://github.com/lobehub/lobe-chat/issues
[github-issues-shield]: https://img.shields.io/github/issues/lobehub/lobe-chat?color=ff80eb&labelColor=black&style=flat-square
[github-license-link]: https://github.com/lobehub/lobe-chat/blob/main/LICENSE
[github-license-shield]: https://img.shields.io/badge/license-apache%202.0-white?labelColor=black&style=flat-square
[github-project-link]: https://github.com/lobehub/lobe-chat/projects
[github-release-link]: https://github.com/lobehub/lobe-chat/releases
[github-release-shield]: https://img.shields.io/github/v/release/lobehub/lobe-chat?color=369eff&labelColor=black&logo=github&style=flat-square
[github-releasedate-link]: https://github.com/lobehub/lobe-chat/releases
[github-releasedate-shield]: https://img.shields.io/github/release-date/lobehub/lobe-chat?labelColor=black&style=flat-square
[github-stars-link]: https://github.com/lobehub/lobe-chat/network/stargazers
[github-stars-shield]: https://img.shields.io/github/stars/lobehub/lobe-chat?color=ffcb47&labelColor=black&style=flat-square
[github-trending-shield]: https://trendshift.io/api/badge/repositories/2256
[github-trending-url]: https://trendshift.io/repositories/2256
[image-banner]: https://github.com/user-attachments/assets/6f293c7f-47b4-47eb-9202-fe68a942d35b
[image-overview]: https://github.com/user-attachments/assets/dbfaa84a-2c82-4dd9-815c-5be616f264a4
[image-star]: https://github.com/user-attachments/assets/c3b482e7-cef5-4e94-bef9-226900ecfaab
[issues-link]: https://img.shields.io/github/issues/lobehub/lobe-chat.svg?style=flat
[lobe-commit]: https://github.com/lobehub/lobe-commit/tree/master/packages/lobe-commit
[lobe-i18n]: https://github.com/lobehub/lobe-commit/tree/master/packages/lobe-i18n
[lobe-icons-github]: https://github.com/lobehub/lobe-icons
[lobe-icons-link]: https://www.npmjs.com/package/@lobehub/icons
[lobe-icons-shield]: https://img.shields.io/npm/v/@lobehub/icons?color=369eff&labelColor=black&logo=npm&logoColor=white&style=flat-square
[lobe-lint-github]: https://github.com/lobehub/lobe-lint
[lobe-lint-link]: https://www.npmjs.com/package/@lobehub/lint
[lobe-lint-shield]: https://img.shields.io/npm/v/@lobehub/lint?color=369eff&labelColor=black&logo=npm&logoColor=white&style=flat-square
[lobe-midjourney-webui]: https://github.com/lobehub/lobe-midjourney-webui
[lobe-theme]: https://github.com/lobehub/sd-webui-lobe-theme
[lobe-tts-github]: https://github.com/lobehub/lobe-tts
[lobe-tts-link]: https://www.npmjs.com/package/@lobehub/tts
[lobe-tts-shield]: https://img.shields.io/npm/v/@lobehub/tts?color=369eff&labelColor=black&logo=npm&logoColor=white&style=flat-square
[lobe-ui-github]: https://github.com/lobehub/lobe-ui
[lobe-ui-link]: https://www.npmjs.com/package/@lobehub/ui
[lobe-ui-shield]: https://img.shields.io/npm/v/@lobehub/ui?color=369eff&labelColor=black&logo=npm&logoColor=white&style=flat-square
[official-site]: https://lobehub.com
[pr-welcome-link]: https://github.com/lobehub/lobe-chat/pulls
[pr-welcome-shield]: https://img.shields.io/badge/🤯_pr_welcome-%E2%86%92-ffcb47?labelColor=black&style=for-the-badge
[profile-link]: https://github.com/lobehub
[share-linkedin-link]: https://linkedin.com/feed
[share-linkedin-shield]: https://img.shields.io/badge/-compartilhe%20no%20linkedin-black?labelColor=black&logo=linkedin&logoColor=white&style=flat-square
[share-mastodon-link]: https://mastodon.social/share?text=Confira%20este%20repositório%20GitHub%20%F0%9F%A4%AF%20LobeChat%20-%20Um%20framework%20de%20chatbot%20extensível%20%28Function%20Calling%29%20de%20código%20aberto%20e%20alta%20performance.%20Suporta%20implantação%20gratuita%20com%20um%20clique%20da%20sua%20aplicação%20web%20ChatGPT%2FLLM%20privada.%20https://github.com/lobehub/lobe-chat%20#chatbot%20#chatGPT%20#openAI
[share-mastodon-shield]: https://img.shields.io/badge/-compartilhe%20no%20mastodon-black?labelColor=black&logo=mastodon&logoColor=white&style=flat-square
[share-reddit-link]: https://www.reddit.com/submit?title=Confira%20este%20repositório%20GitHub%20%F0%9F%A4%AF%20LobeChat%20-%20Um%20framework%20de%20chatbot%20extensível%20%28Function%20Calling%29%20de%20código%20aberto%20e%20alta%20performance.%20Suporta%20implantação%20gratuita%20com%20um%20clique%20da%20sua%20aplicação%20web%20ChatGPT%2FLLM%20privada.%20%23chatbot%20%23chatGPT%20%23openAI&url=https%3A%2F%2Fgithub.com%2Flobehub%2Flobe-chat
[share-reddit-shield]: https://img.shields.io/badge/-compartilhe%20no%20reddit-black?labelColor=black&logo=reddit&logoColor=white&style=flat-square
[share-telegram-link]: https://t.me/share/url"?text=Confira%20este%20repositório%20GitHub%20%F0%9F%A4%AF%20LobeChat%20-%20Um%20framework%20de%20chatbot%20extensível%20%28Function%20Calling%29%20de%20código%20aberto%20e%20alta%20performance.%20Suporta%20implantação%20gratuita%20com%20um%20clique%20da%20sua%20aplicação%20web%20ChatGPT%2FLLM%20privada.%20%23chatbot%20%23chatGPT%20%23openAI&url=https%3A%2F%2Fgithub.com%2Flobehub%2Flobe-chat
[share-telegram-shield]: https://img.shields.io/badge/-compartilhe%20no%20telegram-black?labelColor=black&logo=telegram&logoColor=white&style=flat-square
[share-weibo-link]: http://service.weibo.com/share/share.php?sharesource=weibo&title=Confira%20este%20repositório%20GitHub%20%F0%9F%A4%AF%20LobeChat%20-%20Um%20framework%20de%20chatbot%20extensível%20%28Function%20Calling%29%20de%20código%20aberto%20e%20alta%20performance.%20Suporta%20implantação%20gratuita%20com%20um%20clique%20da%20sua%20aplicação%20web%20ChatGPT%2FLLM%20privada.%20%23chatbot%20%23chatGPT%20%23openAI&url=https%3A%2F%2Fgithub.com%2Flobehub%2Flobe-chat
[share-weibo-shield]: https://img.shields.io/badge/-compartilhe%20no%20weibo-black?labelColor=black&logo=sinaweibo&logoColor=white&style=flat-square
[share-whatsapp-link]: https://api.whatsapp.com/send?text=Confira%20este%20repositório%20GitHub%20%F0%9F%A4%AF%20LobeChat%20-%20Um%20framework%20de%20chatbot%20extensível%20%28Function%20Calling%29%20de%20código%20aberto%20e%20alta%20performance.%20Suporta%20implantação%20gratuita%20com%20um%20clique%20da%20sua%20aplicação%20web%20ChatGPT%2FLLM%20privada.%20https%3A%2F%2Fgithub.com%2Flobehub%2Flobe-chat%20%23chatbot%20%23chatGPT%20%23openAI
[share-whatsapp-shield]: https://img.shields.io/badge/-compartilhe%20no%20whatsapp-black?labelColor=black&logo=whatsapp&logoColor=white&style=flat-square
[share-x-link]: https://x.com/intent/tweet?hashtags=chatbot%2CchatGPT%2CopenAI&text=Confira%20este%20repositório%20GitHub%20%F0%9F%A4%AF%20LobeChat%20-%20Um%20framework%20de%20chatbot%20extensível%20%28Function%20Calling%29%20de%20código%20aberto%20e%20alta%20performance.%20Suporta%20implantação%20gratuita%20com%20um%20clique%20da%20sua%20aplicação%20web%20ChatGPT%2FLLM%20privada.&url=https%3A%2F%2Fgithub.com%2Flobehub%2Flobe-chat
[share-x-shield]: https://img.shields.io/badge/-compartilhe%20no%20x-black?labelColor=black&logo=x&logoColor=white&style=flat-square
[sponsor-link]: https://opencollective.com/lobehub 'Torne-se ❤️ LobeHub Sponsor'
[sponsor-shield]: https://img.shields.io/badge/-Patrocinar%20LobeHub-f04f88?logo=opencollective&logoColor=white&style=flat-square
[submit-agents-link]: https://github.com/lobehub/lobe-chat-agents
[submit-agents-shield]: https://img.shields.io/badge/🤖/🏪_submeter_agente-%E2%86%92-c4f042?labelColor=black&style=for-the-badge
[submit-plugin-link]: https://github.com/lobehub/lobe-chat-plugins
[submit-plugin-shield]: https://img.shields.io/badge/🧩/🏪_submeter_plugin-%E2%86%92-95f3d9?labelColor=black&style=for-the-badge
[vercel-link]: https://chat-preview.lobehub.com
[vercel-shield]: https://img.shields.io/badge/vercel-online-55b467?labelColor=black&logo=vercel&style=flat-square
[vercel-shield-badge]: https://img.shields.io/badge/EXPERIMENTE%20LOBECHAT-ONLINE-55b467?labelColor=black&logo=vercel&style=for-the-badge