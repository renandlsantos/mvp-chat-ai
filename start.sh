#!/bin/bash
# Script de inicialização para Railway

# Configurar variáveis de ambiente necessárias
export NODE_ENV=production
export PORT=${PORT:-3000}

# Iniciar a aplicação
npm run start