#!/bin/bash

echo "🚀 Iniciando MinIO Server..."
echo "📁 Armazenamento de arquivos e documentação"
echo ""

# Criar diretório para dados se não existir
mkdir -p ./minio-data

# Iniciar MinIO com Docker
docker run -d \
  --name aihub-minio \
  -p 9000:9000 \
  -p 9001:9001 \
  -v ./minio-data:/data \
  -e "MINIO_ROOT_USER=minioadmin" \
  -e "MINIO_ROOT_PASSWORD=minioadmin" \
  minio/minio server /data --console-address ":9001"

echo ""
echo "✅ MinIO iniciado com sucesso!"
echo ""
echo "🌐 Endpoints:"
echo "   - API: http://localhost:9000"
echo "   - Console: http://localhost:9001"
echo ""
echo "🔑 Credenciais:"
echo "   - Username: minioadmin"
echo "   - Password: minioadmin"
echo ""
echo "📝 Próximos passos:"
echo "1. Acesse o console em http://localhost:9001"
echo "2. Faça login com as credenciais acima"
echo "3. Crie o bucket 'aihub-files'"
echo "4. Configure as políticas de acesso como público (se necessário)"
echo ""
echo "🔄 Reinicie o servidor Next.js para aplicar as configurações"