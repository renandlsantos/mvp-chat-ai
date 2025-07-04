# Guia de Fortalecimento de Segurança

Este documento descreve melhorias de segurança e melhores práticas para a aplicação Lobe Chat.

## 🟢 Autenticação e Autorização (Pronto para Fortalecer)

### Recursos de Segurança Atuais
- NextAuth.js 5.0.0-beta.25 com múltiplos provedores
- Implementação de provedor OIDC
- Integração de autenticação Clerk
- Schemas RBAC (Controle de Acesso Baseado em Função)

### Melhorias de Segurança

#### 1. Segurança JWT
**Status**: 🟢 Pronto para implementar ⚡ Alto impacto 🔧 Baixo esforço

**Atual**: JWT básico com `jose@5.10.0`
**Localização**: `src/utils/server/jwt.ts`, `src/utils/jwt.ts`

**Melhorias**:
```typescript
// Configuração JWT aprimorada
const JWT_CONFIG = {
  algorithm: 'ES256', // Usar curva elíptica em vez de HS256
  expiresIn: '15m',   // Expiração mais curta
  issuer: process.env.JWT_ISSUER,
  audience: process.env.JWT_AUDIENCE,
  notBefore: '0s',
  clockTolerance: '30s'
}

// Implementar rotação JWT
const refreshTokenConfig = {
  expiresIn: '7d',
  rotating: true // Rotacionar refresh tokens
}
```

#### 2. Session Security
**Status**: 🟢 Ready to implement ⚡ High impact

**Current**: NextAuth.js session management
**Enhancement**: Secure session configuration

**Implementation**:
```typescript
// next-auth configuration
export const authConfig = {
  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 60, // 30 minutes
    updateAge: 5 * 60, // 5 minutes
  },
  jwt: {
    maxAge: 30 * 60, // 30 minutes
  },
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true, // HTTPS only
        domain: process.env.COOKIE_DOMAIN
      }
    }
  }
}
```

#### 3. RBAC Enforcement
**Status**: 🟡 Partially implemented ⚡ High impact

**Current**: RBAC schemas in `src/database/schemas/rbac.ts`
**Enhancement**: Middleware-level RBAC enforcement

**Implementation**:
```typescript
// Enhanced RBAC middleware
export function withRBACGuard(requiredPermissions: string[]) {
  return async (req: NextRequest) => {
    const session = await getServerSession(authConfig)
    
    if (!session?.user?.permissions) {
      return new Response('Unauthorized', { status: 401 })
    }
    
    const hasPermission = requiredPermissions.every(
      permission => session.user.permissions.includes(permission)
    )
    
    if (!hasPermission) {
      return new Response('Forbidden', { status: 403 })
    }
  }
}
```

## 🟢 Data Protection (Ready to Implement)

### Current Setup
- Encryption utilities with `crypto-js@4.2.0`
- Key vault secret management
- Database encryption capabilities

### Enhancement Opportunities

#### 1. Field-Level Encryption
**Status**: 🟢 Ready to implement ⚡ High impact

**Location**: `src/database/schemas/`
**Current**: Basic data storage
**Enhancement**: Sensitive field encryption

**Implementation**:
```typescript
// Encrypted field schema
export const encryptedMessage = text('content_encrypted')
export const encryptedApiKey = text('api_key_encrypted')

// Encryption utilities
import CryptoJS from 'crypto-js'

export function encryptField(data: string): string {
  return CryptoJS.AES.encrypt(data, process.env.KEY_VAULTS_SECRET).toString()
}

export function decryptField(encryptedData: string): string {
  return CryptoJS.AES.decrypt(encryptedData, process.env.KEY_VAULTS_SECRET).toString(CryptoJS.enc.Utf8)
}
```

#### 2. API Key Management
**Status**: 🟢 Ready to implement ⚡ High impact

**Current**: Plain text API key storage
**Enhancement**: Encrypted API key storage with rotation

**Implementation**:
```typescript
// API key encryption service
export class ApiKeyService {
  private static encrypt(apiKey: string): string {
    const key = process.env.KEY_VAULTS_SECRET
    return CryptoJS.AES.encrypt(apiKey, key).toString()
  }
  
  private static decrypt(encryptedKey: string): string {
    const key = process.env.KEY_VAULTS_SECRET
    return CryptoJS.AES.decrypt(encryptedKey, key).toString(CryptoJS.enc.Utf8)
  }
  
  static async rotateApiKey(userId: string, provider: string): Promise<void> {
    // Implement key rotation logic
  }
}
```

#### 3. PII Data Handling
**Status**: 🟡 Partially implemented

**Current**: Basic user data storage
**Enhancement**: PII classification and protection

**Implementation**:
- Add PII detection utilities
- Implement data masking for logs
- Add GDPR compliance tools

## 🟢 Network Security (Ready to Implement)

### Current Setup
- HTTPS enforcement in production
- CORS configuration
- Secure headers

### Enhancement Opportunities

#### 1. Security Headers
**Status**: 🟢 Ready to implement ⚡ High impact 🔧 Low effort

**Current**: Basic Next.js headers in `next.config.ts`
**Enhancement**: Comprehensive security headers

**Implementation**:
```typescript
// Enhanced security headers
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY'
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff'
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin'
        },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=()'
        },
        {
          key: 'Content-Security-Policy',
          value: generateCSP()
        },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=31536000; includeSubDomains; preload'
        }
      ]
    }
  ]
}
```

#### 2. Rate Limiting
**Status**: 🟡 Partially implemented

**Current**: No explicit rate limiting
**Enhancement**: API rate limiting with `request-filtering-agent@2.0.1`

**Implementation**:
```typescript
// Rate limiting middleware
import { RateLimiter } from 'request-filtering-agent'

const rateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
})

export { rateLimiter as rateLimitMiddleware }
```

#### 3. Input Validation & Sanitization
**Status**: 🟢 Ready to implement ⚡ High impact

**Current**: Zod validation with `zod@3.25.48`
**Enhancement**: Enhanced validation and sanitization

**Implementation**:
```typescript
// Enhanced validation schemas
import { z } from 'zod'

export const sanitizeUserInput = z.string()
  .trim()
  .max(10000)
  .refine(value => !/<script|javascript:|data:|vbscript:/i.test(value), {
    message: 'Input contains potentially dangerous content'
  })

export const validateApiEndpoint = z.string()
  .url()
  .refine(url => {
    const allowedDomains = process.env.ALLOWED_API_DOMAINS?.split(',') || []
    return allowedDomains.some(domain => url.includes(domain))
  })
```

## 🟢 File Upload Security (Ready to Implement)

### Current Setup
- File type validation with `file-type@20.5.0`
- S3-compatible storage
- File processing utilities

### Security Enhancements

#### 1. Enhanced File Validation
**Status**: 🟢 Ready to implement ⚡ High impact

**Location**: `src/utils/uploadFile.ts`
**Current**: Basic file type checking
**Enhancement**: Deep file validation

**Implementation**:
```typescript
import { fileTypeFromBuffer } from 'file-type'

export async function validateFileUpload(file: File): Promise<boolean> {
  // File size validation
  const maxSize = 50 * 1024 * 1024 // 50MB
  if (file.size > maxSize) {
    throw new Error('File too large')
  }
  
  // MIME type validation
  const allowedTypes = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf', 'text/plain', 'text/markdown',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error('File type not allowed')
  }
  
  // Magic number validation
  const buffer = await file.arrayBuffer()
  const detectedType = await fileTypeFromBuffer(new Uint8Array(buffer))
  
  if (!detectedType || detectedType.mime !== file.type) {
    throw new Error('File type mismatch')
  }
  
  // Virus scanning (placeholder - integrate with ClamAV or similar)
  await scanForMalware(buffer)
  
  return true
}
```

#### 2. Secure File Storage
**Status**: 🟢 Ready to implement

**Current**: S3-compatible storage
**Enhancement**: Encrypted storage with access controls

**Implementation**:
```typescript
// Enhanced S3 configuration
const s3Config = {
  bucket: process.env.S3_BUCKET,
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
  region: process.env.S3_REGION,
  // Enable server-side encryption
  serverSideEncryption: 'AES256',
  // Enable access logging
  logging: {
    targetBucket: `${process.env.S3_BUCKET}-logs`,
    targetPrefix: 'access-logs/'
  }
}
```

## 🟢 Database Security (Ready to Implement)

### Current Setup
- PostgreSQL with parameterized queries via Drizzle ORM
- Connection string encryption
- Migration system

### Security Enhancements

#### 1. Database Access Controls
**Status**: 🟢 Ready to implement ⚡ High impact

**Current**: Basic connection configuration
**Enhancement**: Enhanced access controls

**Implementation**:
```typescript
// Enhanced database configuration
export const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,
    rejectUnauthorized: true,
    ca: process.env.DB_SSL_CERT
  },
  pool: {
    min: 2,
    max: 10,
    acquireTimeoutMillis: 30000,
    idleTimeoutMillis: 30000
  },
  // Enable query logging for audit
  logging: process.env.NODE_ENV === 'production' ? false : true,
  // Enable statement timeout
  statement_timeout: 30000,
  // Enable connection timeout
  connectionTimeoutMillis: 5000
}
```

#### 2. Row-Level Security
**Status**: 🟡 Partially implemented

**Current**: Basic user isolation
**Enhancement**: PostgreSQL RLS policies

**Implementation**:
```sql
-- Enable RLS on tables
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY user_messages ON messages
  FOR ALL TO authenticated
  USING (user_id = current_user_id());

CREATE POLICY user_sessions ON sessions
  FOR ALL TO authenticated  
  USING (user_id = current_user_id());
```

## 🟢 Audit & Monitoring (Ready to Implement)

### Current Setup
- Sentry for error tracking
- Multiple analytics providers
- Basic logging

### Security Enhancements

#### 1. Security Event Logging
**Status**: 🟢 Ready to implement ⚡ High impact

**Dependencies**: `pino@9.7.0` for structured logging

**Implementation**:
```typescript
import pino from 'pino'

const securityLogger = pino({
  name: 'security',
  level: 'info',
  redact: ['password', 'token', 'apiKey'], // Redact sensitive data
})

export function logSecurityEvent(event: SecurityEvent) {
  securityLogger.info({
    type: 'security_event',
    event: event.type,
    userId: event.userId,
    ip: event.ip,
    userAgent: event.userAgent,
    timestamp: new Date().toISOString(),
    risk: event.risk
  })
}
```

#### 2. Intrusion Detection
**Status**: 🟡 Requires development

**Current**: Basic monitoring
**Enhancement**: Behavioral analysis

**Implementation**:
```typescript
// Anomaly detection service
export class SecurityMonitor {
  static async detectAnomalies(userId: string, activity: UserActivity) {
    // Detect unusual login patterns
    // Monitor failed authentication attempts
    // Track API usage patterns
    // Alert on suspicious file uploads
  }
  
  static async blockSuspiciousActivity(userId: string, reason: string) {
    // Temporary account suspension
    // IP blocking
    // Alert security team
  }
}
```

## 🟢 Environment & Secrets Management (Ready to Implement)

### Current Setup
- Environment variable configuration
- Key vault secret integration

### Security Enhancements

#### 1. Secrets Rotation
**Status**: 🟡 Requires development ⚡ High impact

**Implementation**:
```typescript
// Automated secrets rotation
export class SecretsManager {
  static async rotateSecret(secretName: string): Promise<void> {
    // Generate new secret
    // Update all references
    // Validate new secret works
    // Clean up old secret
  }
  
  static async validateSecrets(): Promise<void> {
    // Check secret expiration
    // Validate secret format
    // Test secret connectivity
  }
}
```

#### 2. Environment Hardening
**Status**: 🟢 Ready to implement 🔧 Low effort

**Implementation**:
```bash
# Production environment hardening
NODE_ENV=production
NODE_OPTIONS="--max-old-space-size=4096 --no-deprecation"

# Security headers
FORCE_HTTPS=true
SECURE_COOKIES=true
TRUST_PROXY=true

# Rate limiting
RATE_LIMIT_ENABLED=true
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=900000

# Monitoring
ENABLE_SECURITY_MONITORING=true
SECURITY_LOG_LEVEL=info
```

## Implementation Priority

### Critical (Immediate)
1. **Security headers** - Add comprehensive security headers
2. **Input validation** - Enhanced sanitization and validation
3. **JWT security** - Shorter expiration and rotation
4. **File upload validation** - Deep file type validation

### High Priority
1. **Field-level encryption** - Encrypt sensitive database fields
2. **Rate limiting** - Implement API rate limiting
3. **Audit logging** - Security event logging
4. **Session security** - Enhanced session management

### Medium Priority
1. **RBAC enforcement** - Middleware-level permissions
2. **Database RLS** - Row-level security policies
3. **Secrets rotation** - Automated secret management
4. **Intrusion detection** - Behavioral monitoring

## Security Checklist

### Before Production
- [ ] Enable HTTPS with valid certificates
- [ ] Configure security headers
- [ ] Implement rate limiting
- [ ] Set up audit logging
- [ ] Enable field-level encryption
- [ ] Configure secure sessions
- [ ] Set up monitoring alerts
- [ ] Implement backup encryption
- [ ] Configure RBAC policies
- [ ] Set up secrets rotation

### Regular Maintenance
- [ ] Review access logs weekly
- [ ] Rotate secrets monthly  
- [ ] Update dependencies quarterly
- [ ] Conduct security audits annually
- [ ] Review RBAC permissions quarterly
- [ ] Test backup restoration quarterly