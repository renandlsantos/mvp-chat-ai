#!/bin/bash

# DigitalOcean MVP Chat AI Setup Script
# Este script automatiza a configuração inicial do servidor

set -e

echo "🚀 MVP Chat AI - DigitalOcean Setup"
echo "===================================="

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para logging
log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Verificar se está rodando como root
if [[ $EUID -eq 0 ]]; then
   error "Este script não deve ser executado como root!"
fi

# Atualizar sistema
log "Atualizando sistema..."
sudo apt update && sudo apt upgrade -y

# Instalar dependências básicas
log "Instalando dependências do sistema..."
sudo apt install -y \
    curl \
    git \
    build-essential \
    nginx \
    postgresql \
    postgresql-contrib \
    redis-server \
    ufw \
    htop \
    ncdu \
    tmux

# Instalar Node.js 22
log "Instalando Node.js 22..."
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar pnpm
log "Instalando pnpm..."
npm install -g pnpm@10.10.0

# Configurar swap
log "Configurando swap de 8GB..."
if [ ! -f /swapfile ]; then
    sudo fallocate -l 8G /swapfile
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
else
    warning "Swap já existe"
fi

# Aumentar limites do sistema
log "Configurando limites do sistema..."
echo "fs.file-max = 65535" | sudo tee -a /etc/sysctl.conf
echo "* soft nofile 65535" | sudo tee -a /etc/security/limits.conf
echo "* hard nofile 65535" | sudo tee -a /etc/security/limits.conf
sudo sysctl -p

# Configurar PostgreSQL
log "Configurando PostgreSQL..."
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Gerar senha aleatória para o banco
DB_PASSWORD=$(openssl rand -base64 32)
echo "Database Password: $DB_PASSWORD" > ~/mvp-chat-ai-credentials.txt
chmod 600 ~/mvp-chat-ai-credentials.txt

# Criar usuário e banco de dados
sudo -u postgres psql <<EOF
CREATE USER chatai WITH PASSWORD '$DB_PASSWORD';
CREATE DATABASE chatai_production OWNER chatai;
GRANT ALL PRIVILEGES ON DATABASE chatai_production TO chatai;
\q
EOF

# Instalar pgvector
log "Instalando pgvector..."
sudo apt install -y postgresql-16-pgvector || sudo apt install -y postgresql-15-pgvector || sudo apt install -y postgresql-14-pgvector
sudo -u postgres psql -d chatai_production -c "CREATE EXTENSION IF NOT EXISTS vector;"

# Otimizar PostgreSQL para produção
log "Otimizando PostgreSQL..."
PG_VERSION=$(sudo -u postgres psql -t -c "SELECT version();" | grep -oP '\d+\.\d+' | head -1 | cut -d. -f1)
PG_CONFIG="/etc/postgresql/$PG_VERSION/main/postgresql.conf"

# Detectar RAM total
TOTAL_RAM=$(free -m | awk '/^Mem:/{print $2}')
SHARED_BUFFERS=$((TOTAL_RAM / 4))
EFFECTIVE_CACHE=$((TOTAL_RAM * 3 / 4))

sudo cp $PG_CONFIG $PG_CONFIG.backup
sudo tee -a $PG_CONFIG > /dev/null <<EOF

# Performance Tuning
shared_buffers = ${SHARED_BUFFERS}MB
effective_cache_size = ${EFFECTIVE_CACHE}MB
work_mem = 64MB
maintenance_work_mem = 2GB
max_connections = 200
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
EOF

sudo systemctl restart postgresql

# Clone do repositório
log "Clonando repositório..."
cd /opt
if [ ! -d "mvp-chat-ai" ]; then
    sudo git clone https://github.com/renandlsantos/mvp-chat-ai.git
    sudo chown -R $USER:$USER mvp-chat-ai
else
    warning "Repositório já existe"
fi

cd mvp-chat-ai

# Criar arquivo .env
log "Criando arquivo .env..."
cat > .env.production <<EOF
# Database
DATABASE_URL=postgresql://chatai:$DB_PASSWORD@localhost:5432/chatai_production

# Next.js
NEXTAUTH_URL=http://localhost:3210
NEXTAUTH_SECRET=$(openssl rand -base64 32)
KEY_VAULTS_SECRET=$(openssl rand -base64 32)

# Service Mode
NEXT_PUBLIC_SERVICE_MODE=server
NODE_ENV=production

# Adicione suas chaves de API aqui
# OPENAI_API_KEY=
# ANTHROPIC_API_KEY=
# GOOGLE_API_KEY=
EOF

warning "Configure suas chaves de API em /opt/mvp-chat-ai/.env.production"

# Instalar dependências
log "Instalando dependências..."
pnpm install --frozen-lockfile

# Build da aplicação
log "Executando build de produção (isso pode demorar)..."
NODE_OPTIONS="--max-old-space-size=49152" pnpm build

# Executar migrações
log "Executando migrações do banco de dados..."
pnpm db:migrate

# Instalar PM2
log "Instalando PM2..."
npm install -g pm2

# Criar configuração PM2
log "Configurando PM2..."
cat > ecosystem.config.js <<'EOF'
module.exports = {
  apps: [{
    name: 'mvp-chat-ai',
    script: 'pnpm',
    args: 'start',
    cwd: '/opt/mvp-chat-ai',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3210,
      NODE_OPTIONS: '--max-old-space-size=28672'
    },
    error_file: '/var/log/pm2/mvp-chat-ai-error.log',
    out_file: '/var/log/pm2/mvp-chat-ai-out.log',
    log_file: '/var/log/pm2/mvp-chat-ai-combined.log',
    time: true,
    max_memory_restart: '28G',
    autorestart: true,
    watch: false,
    max_restarts: 10,
    min_uptime: '10s',
    env_production: {
      NODE_ENV: 'production'
    }
  }]
};
EOF

# Criar diretório de logs
sudo mkdir -p /var/log/pm2
sudo chown -R $USER:$USER /var/log/pm2

# Configurar Nginx
log "Configurando Nginx..."
sudo tee /etc/nginx/sites-available/mvp-chat-ai > /dev/null <<'EOF'
server {
    listen 80;
    server_name _;
    
    client_max_body_size 100M;
    
    location / {
        proxy_pass http://localhost:3210;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # WebSocket support
    location /api/chat/ws {
        proxy_pass http://localhost:3210;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 86400;
    }
}
EOF

# Ativar site
sudo ln -sf /etc/nginx/sites-available/mvp-chat-ai /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx

# Configurar Redis
log "Configurando Redis..."
sudo sed -i 's/# maxmemory <bytes>/maxmemory 4gb/' /etc/redis/redis.conf
sudo sed -i 's/# maxmemory-policy noeviction/maxmemory-policy allkeys-lru/' /etc/redis/redis.conf
sudo systemctl restart redis
sudo systemctl enable redis

# Configurar firewall
log "Configurando firewall..."
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
echo "y" | sudo ufw enable

# Iniciar aplicação
log "Iniciando aplicação..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup systemd -u $USER --hp /home/$USER | tail -n 1 | sudo bash

# Instalar ferramentas de monitoramento
log "Instalando ferramentas de monitoramento..."
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 100M
pm2 set pm2-logrotate:retain 7
pm2 set pm2-logrotate:compress true

# Criar script de backup
log "Criando script de backup..."
cat > ~/backup-mvp-chat-ai.sh <<'EOF'
#!/bin/bash
BACKUP_DIR="/home/$USER/backups"
mkdir -p $BACKUP_DIR
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -U chatai chatai_production > $BACKUP_DIR/mvp_chat_ai_$DATE.sql
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
EOF
chmod +x ~/backup-mvp-chat-ai.sh

# Adicionar cron para backup diário
(crontab -l 2>/dev/null; echo "0 2 * * * /home/$USER/backup-mvp-chat-ai.sh") | crontab -

# Resumo final
echo ""
echo "======================================"
echo -e "${GREEN}✅ Setup concluído com sucesso!${NC}"
echo "======================================"
echo ""
echo "📋 Informações importantes:"
echo "  - Aplicação rodando em: http://$(curl -s ifconfig.me)"
echo "  - Credenciais salvas em: ~/mvp-chat-ai-credentials.txt"
echo "  - Logs em: pm2 logs mvp-chat-ai"
echo ""
echo "⚠️  Próximos passos:"
echo "  1. Configure suas chaves de API em /opt/mvp-chat-ai/.env.production"
echo "  2. Configure um domínio e SSL com: sudo certbot --nginx -d seu-dominio.com"
echo "  3. Reinicie a aplicação: pm2 restart mvp-chat-ai"
echo ""
echo "🔧 Comandos úteis:"
echo "  - pm2 status         # Ver status da aplicação"
echo "  - pm2 logs          # Ver logs"
echo "  - pm2 monit         # Monitor em tempo real"
echo "  - pm2 restart all   # Reiniciar aplicação"
echo ""
log "Setup finalizado!"