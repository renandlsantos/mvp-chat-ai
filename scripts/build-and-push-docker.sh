#!/bin/bash

echo "🐳 Build local e push para Docker Hub"
echo "⚠️  Use este script se o build no Railway continuar falhando"

# Verificar se está logado no Docker Hub
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando. Inicie o Docker Desktop primeiro."
    exit 1
fi

# Solicitar informações
read -p "Digite seu usuário do Docker Hub: " DOCKER_USER
read -p "Digite o nome da imagem (ex: mvp-chat-ai): " IMAGE_NAME

# Tag da imagem
IMAGE_TAG="${DOCKER_USER}/${IMAGE_NAME}:latest"

echo "📦 Construindo imagem: $IMAGE_TAG"

# Build com Dockerfile otimizado
docker build -f Dockerfile.railway -t $IMAGE_TAG .

if [ $? -eq 0 ]; then
    echo "✅ Build concluído com sucesso!"
    
    echo "📤 Fazendo push para Docker Hub..."
    docker push $IMAGE_TAG
    
    if [ $? -eq 0 ]; then
        echo "✅ Push concluído!"
        echo ""
        echo "🚀 Agora no Railway:"
        echo "1. Vá em Settings > Service"
        echo "2. Em 'Deploy' selecione 'Docker Image'"
        echo "3. Digite: $IMAGE_TAG"
        echo "4. Clique em 'Deploy'"
    else
        echo "❌ Erro no push. Faça login primeiro: docker login"
    fi
else
    echo "❌ Erro no build"
    exit 1
fi