# 🚀 Deploy do MVP Chat AI na DigitalOcean

## 📊 Especificações Recomendadas

### Opção 1: **Droplet Otimizado para Produção** (Recomendado)
- **Tipo**: Memory-Optimized Droplet
- **Specs**: 
  - **CPU**: 8 vCPUs
  - **RAM**: 64 GB
  - **SSD**: 320 GB
  - **Transferência**: 7 TB
- **Preço**: ~$336/mês
- **Região**: NYC3 ou SFO3 (melhor latência)

### Opção 2: **Droplet Balanceado** (Custo-benefício)
- **Tipo**: General Purpose Premium Intel
- **Specs**:
  - **CPU**: 8 vCPUs
  - **RAM**: 32 GB
  - **SSD**: 200 GB NVMe
  - **Transferência**: 6 TB
- **Preço**: ~$192/mês

### Opção 3: **Droplet Mínimo** (Desenvolvimento/Teste)
- **Tipo**: General Purpose Regular
- **Specs**:
  - **CPU**: 4 vCPUs
  - **RAM**: 16 GB
  - **SSD**: 100 GB
  - **Transferência**: 5 TB
- **Preço**: ~$96/mês

## 🛠️ Configuração Inicial

### 1. Criar Droplet

```bash
# Via DigitalOcean CLI
doctl compute droplet create mvp-chat-ai \
  --region nyc3 \
  --size m-8vcpu-64gb \
  --image ubuntu-24-04-x64 \
  --ssh-keys YOUR_SSH_KEY_ID \
  --enable-monitoring \
  --enable-backups
```

### 2. Configuração do Sistema

SSH no droplet e execute:

```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar dependências essenciais
sudo apt install -y curl git build-essential nginx postgresql postgresql-contrib redis-server

# Instalar Node.js 22
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar pnpm
npm install -g pnpm@10.10.0

# Configurar swap (importante para builds)
sudo fallocate -l 8G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Aumentar limites do sistema
echo "fs.file-max = 65535" | sudo tee -a /etc/sysctl.conf
echo "* soft nofile 65535" | sudo tee -a /etc/security/limits.conf
echo "* hard nofile 65535" | sudo tee -a /etc/security/limits.conf
sudo sysctl -p
```

### 3. Configurar PostgreSQL

```bash
# Configurar PostgreSQL
sudo -u postgres psql <<EOF
CREATE USER chatai WITH PASSWORD 'your_secure_password';
CREATE DATABASE chatai_production OWNER chatai;
GRANT ALL PRIVILEGES ON DATABASE chatai_production TO chatai;
\q
EOF

# Habilitar pgvector
sudo apt install -y postgresql-16-pgvector
sudo -u postgres psql -d chatai_production -c "CREATE EXTENSION IF NOT EXISTS vector;"

# Configurar PostgreSQL para produção
sudo nano /etc/postgresql/16/main/postgresql.conf
# Ajustar:
# max_connections = 200
# shared_buffers = 16GB  # 25% da RAM
# effective_cache_size = 48GB  # 75% da RAM
# work_mem = 64MB
# maintenance_work_mem = 2GB

sudo systemctl restart postgresql
```

### 4. Deploy da Aplicação

```bash
# Clone o repositório
cd /opt
sudo git clone https://github.com/renandlsantos/mvp-chat-ai.git
sudo chown -R $USER:$USER mvp-chat-ai
cd mvp-chat-ai

# Configurar variáveis de ambiente
cp .env.example .env.production
nano .env.production
# Configurar todas as variáveis necessárias

# Instalar dependências
pnpm install --frozen-lockfile

# Build de produção
NODE_OPTIONS="--max-old-space-size=49152" pnpm build

# Executar migrações
pnpm db:migrate
```

### 5. Configurar PM2 para Gerenciamento de Processo

```bash
# Instalar PM2
npm install -g pm2

# Criar arquivo de configuração PM2
cat > ecosystem.config.js <<EOF
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
    watch: false
  }]
};
EOF

# Iniciar aplicação
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 6. Configurar Nginx como Proxy Reverso

```bash
# Criar configuração Nginx
sudo nano /etc/nginx/sites-available/mvp-chat-ai

# Adicionar:
server {
    listen 80;
    server_name your-domain.com;
    
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

# Ativar site
sudo ln -s /etc/nginx/sites-available/mvp-chat-ai /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 7. Configurar SSL com Let's Encrypt

```bash
# Instalar Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obter certificado SSL
sudo certbot --nginx -d your-domain.com
```

### 8. Configurar Firewall

```bash
# Configurar UFW
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## 🔧 Otimizações Adicionais

### 1. Redis para Cache

```bash
# Configurar Redis
sudo nano /etc/redis/redis.conf
# maxmemory 4gb
# maxmemory-policy allkeys-lru

sudo systemctl restart redis
```

### 2. Configurar S3 para Arquivos

Use DigitalOcean Spaces (compatível com S3):

```bash
# No .env.production
S3_ENDPOINT=https://nyc3.digitaloceanspaces.com
S3_BUCKET=mvp-chat-ai
S3_ACCESS_KEY_ID=your_spaces_key
S3_SECRET_ACCESS_KEY=your_spaces_secret
S3_REGION=nyc3
```

### 3. Monitoramento

```bash
# Instalar monitoring stack
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 100M
pm2 set pm2-logrotate:retain 7

# Configurar alertas
pm2 install pm2-slack
# ou
pm2 install pm2-discord
```

## 📈 Escalabilidade

### Para Alto Tráfego:

1. **Load Balancer**: Use DigitalOcean Load Balancer
2. **Multiple Droplets**: 
   - 2-3 App Servers (32GB cada)
   - 1 Database Server (64GB, optimized for PostgreSQL)
   - 1 Redis Server (16GB)
3. **Managed Database**: Considere DigitalOcean Managed PostgreSQL

## 💰 Estimativa de Custos

### Setup Completo Recomendado:
- **Droplet Principal**: $336/mês (64GB RAM)
- **Spaces (S3)**: $5/mês (250GB + 1TB transfer)
- **Backups**: $67/mês (20% do droplet)
- **Load Balancer**: $12/mês (se necessário)
- **Total**: ~$420/mês

### Setup Econômico:
- **Droplet**: $192/mês (32GB RAM)
- **Spaces**: $5/mês
- **Total**: ~$197/mês

## 🚨 Comandos Úteis

```bash
# Verificar status
pm2 status
pm2 logs mvp-chat-ai

# Restart aplicação
pm2 restart mvp-chat-ai

# Monitorar recursos
pm2 monit

# Backup do banco
pg_dump -U chatai chatai_production > backup_$(date +%Y%m%d).sql

# Verificar logs
tail -f /var/log/pm2/mvp-chat-ai-error.log
```

## 📞 Suporte

Para problemas específicos da DigitalOcean:
- **Documentação**: https://docs.digitalocean.com
- **Community**: https://www.digitalocean.com/community
- **Support Ticket**: Via painel de controle

---

**Nota**: Para produção real, considere também:
- CDN (Cloudflare)
- Monitoring (Datadog/New Relic)
- Backup automatizado
- CI/CD pipeline