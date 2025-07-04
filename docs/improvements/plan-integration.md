# Integração de Planos e Tokens com Contas de Usuário

## 1. Alterações no Schema do Usuário

### Adicionar campos na tabela `users`:
```typescript
// src/database/schemas/user.ts
export const users = pgTable('users', {
  // ... campos existentes ...
  
  // Novos campos para planos
  planId: text('plan_id').references(() => userPlans.id),
  planExpiresAt: timestamp('plan_expires_at', { withTimezone: true }),
  stripeCustomerId: text('stripe_customer_id'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  
  // Status da conta
  accountStatus: text('account_status', { 
    enum: ['active', 'suspended', 'trial', 'expired'] 
  }).default('trial'),
  trialEndsAt: timestamp('trial_ends_at', { withTimezone: true }),
});
```

## 2. Fluxo de Registro com Plano Inicial

### A. Atualizar o registro para criar créditos automaticamente:
```typescript
// src/app/(backend)/api/auth/signup/route.ts
// Após criar o usuário, adicionar:

// Criar créditos iniciais para o usuário
const creditsService = new ServerCreditsService(newUser.id);
await creditsService.checkAndCreateUserCredits('free');

// Se oferecer trial, criar com plano básico por 7 dias
if (ENABLE_TRIAL) {
  await creditsService.updatePlan('basic');
  await db.update(users)
    .set({
      accountStatus: 'trial',
      trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      planId: 'basic'
    })
    .where(eq(users.id, newUser.id));
}
```

## 3. Middleware de Verificação de Créditos

### Criar middleware para verificar créditos antes de processar mensagens:
```typescript
// src/middleware/credits.ts
export async function checkUserCredits(userId: string): Promise<{
  hasCredits: boolean;
  remainingCredits: number;
  planType: string;
}> {
  const creditsService = new ServerCreditsService(userId);
  const userCredits = await creditsService.getUserCredits();
  
  if (!userCredits) {
    return { hasCredits: false, remainingCredits: 0, planType: 'none' };
  }
  
  const remaining = userCredits.totalCredits - userCredits.usedCredits;
  
  return {
    hasCredits: remaining > 0,
    remainingCredits: remaining,
    planType: userCredits.planId || 'free'
  };
}
```

## 4. Integração com UI

### A. Atualizar o UserCreditsDisplay para mostrar plano:
```typescript
// src/features/UserCredits/index.tsx
export const UserCreditsDisplay = () => {
  const { data: userCredits, isLoading } = useQuery({
    queryKey: ['userCredits'],
    queryFn: () => creditsService.getUserCredits(),
  });
  
  const { data: userPlan } = useQuery({
    queryKey: ['userPlan'],
    queryFn: () => creditsService.getUserPlan(),
  });

  return (
    <Card>
      <div>
        <Badge>{userPlan?.name || 'Free'}</Badge>
        <Text>Créditos: {remaining}/{userCredits.totalCredits}</Text>
        {userPlan?.expiresAt && (
          <Text type="secondary">
            Expira em: {formatDate(userPlan.expiresAt)}
          </Text>
        )}
      </div>
    </Card>
  );
};
```

### B. Criar página de gerenciamento de planos:
```typescript
// src/app/[variants]/(main)/settings/subscription/page.tsx
export default function SubscriptionPage() {
  return (
    <div>
      <PlanSelector />
      <CreditHistory />
      <PaymentMethods />
    </div>
  );
}
```

## 5. Bloqueio de Funcionalidades por Plano

### A. Criar hook para verificar permissões:
```typescript
// src/hooks/usePlanFeatures.ts
export function usePlanFeatures() {
  const { data: userCredits } = useUserCredits();
  
  const features = {
    free: {
      maxModels: ['gpt-3.5-turbo'],
      maxMessages: 100,
      maxFiles: 0,
      maxAgents: 1,
    },
    basic: {
      maxModels: ['gpt-3.5-turbo', 'gpt-4'],
      maxMessages: 1000,
      maxFiles: 10,
      maxAgents: 5,
    },
    pro: {
      maxModels: 'all',
      maxMessages: 5000,
      maxFiles: 100,
      maxAgents: 'unlimited',
    }
  };
  
  return features[userCredits?.planType || 'free'];
}
```

### B. Aplicar restrições na seleção de modelos:
```typescript
// src/features/ModelSelect/index.tsx
const planFeatures = usePlanFeatures();
const availableModels = models.filter(model => 
  planFeatures.maxModels === 'all' || 
  planFeatures.maxModels.includes(model.id)
);
```

## 6. Sistema de Notificações

### A. Notificar quando créditos estão acabando:
```typescript
// src/features/CreditAlerts/index.tsx
export function CreditAlerts() {
  const { data: credits } = useUserCredits();
  const remaining = credits?.totalCredits - credits?.usedCredits;
  
  if (remaining < 10) {
    return (
      <Alert type="warning">
        Você tem apenas {remaining} créditos restantes. 
        <Link href="/settings/subscription">Recarregar</Link>
      </Alert>
    );
  }
  
  return null;
}
```

## 7. Integrações Externas

### A. Webhook para pagamentos (Stripe/PayPal):
```typescript
// src/app/(backend)/api/webhooks/stripe/route.ts
export async function POST(req: Request) {
  const event = await stripe.webhooks.constructEvent(
    await req.text(),
    req.headers.get('stripe-signature'),
    process.env.STRIPE_WEBHOOK_SECRET
  );
  
  switch (event.type) {
    case 'checkout.session.completed':
      // Atualizar plano do usuário
      await updateUserPlan(event.data.object);
      break;
      
    case 'invoice.payment_succeeded':
      // Renovar créditos mensais
      await renewUserCredits(event.data.object);
      break;
  }
}
```

## 8. Variáveis de Ambiente Necessárias

```env
# Pagamentos
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PUBLISHABLE_KEY=pk_...

# Configurações de Planos
ENABLE_TRIAL=true
TRIAL_DAYS=7
FREE_PLAN_CREDITS=100
```

## 9. Migração de Dados

### SQL para migração:
```sql
-- Adicionar campos na tabela users
ALTER TABLE users 
ADD COLUMN plan_id TEXT REFERENCES user_plans(id),
ADD COLUMN plan_expires_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN stripe_customer_id TEXT,
ADD COLUMN stripe_subscription_id TEXT,
ADD COLUMN account_status TEXT DEFAULT 'active',
ADD COLUMN trial_ends_at TIMESTAMP WITH TIME ZONE;

-- Criar créditos para usuários existentes
INSERT INTO user_credits (user_id, total_credits, used_credits, plan_id, reset_at)
SELECT 
  id as user_id,
  100 as total_credits,
  0 as used_credits,
  'free' as plan_id,
  NOW() + INTERVAL '30 days' as reset_at
FROM users
WHERE NOT EXISTS (
  SELECT 1 FROM user_credits WHERE user_credits.user_id = users.id
);
```

## 10. Testes Necessários

1. **Teste de Registro**: Verificar se créditos são criados
2. **Teste de Dedução**: Confirmar dedução ao enviar mensagens
3. **Teste de Limites**: Bloquear quando sem créditos
4. **Teste de Upgrade**: Atualizar plano e créditos
5. **Teste de Renovação**: Reset mensal de créditos