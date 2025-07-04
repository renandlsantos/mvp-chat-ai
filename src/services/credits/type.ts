import { CreditTransaction, UserCredits } from '@/database/schemas/userCredits';

export interface ICreditsService {
  addCredits: (amount: number, details: {
    description?: string;
    type: 'refill' | 'bonus' | 'subscription';
  }) => Promise<void>;
  checkAndCreateUserCredits: (planType?: string) => Promise<UserCredits>;
  deductCredits: (amount: number, details: {
    description?: string;
    messageId?: string;
    modelName?: string;
    tokensUsed?: number;
  }) => Promise<boolean>;
  getTransactionHistory: (limit?: number) => Promise<CreditTransaction[]>;
  getUserCredits: () => Promise<UserCredits | null>;
  updatePlan: (planType: string) => Promise<UserCredits>;
}

export interface CreditUsageParams {
  description?: string;
  messageId?: string;
  modelName: string;
  tokensUsed: number;
}

export interface CreditPlan {
  credits: number;
  id: string;
  name: string;
  price: number;
}

export const CREDIT_PLANS: CreditPlan[] = [
  { credits: 100, id: 'free', name: 'Free', price: 0 },
  { credits: 1000, id: 'basic', name: 'Basic', price: 9.99 },
  { credits: 5000, id: 'pro', name: 'Pro', price: 29.99 },
  { credits: 20_000, id: 'enterprise', name: 'Enterprise', price: 99.99 },
];

export const TOKEN_TO_CREDIT_RATIO = 0.01; // 1 token = 0.01 credits