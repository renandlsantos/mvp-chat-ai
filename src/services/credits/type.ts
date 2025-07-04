import { CreditTransaction, UserCredits } from '@/database/schemas/userCredits';

export interface ICreditsService {
  getUserCredits: () => Promise<UserCredits | null>;
  deductCredits: (amount: number, details: {
    description?: string;
    messageId?: string;
    modelName?: string;
    tokensUsed?: number;
  }) => Promise<boolean>;
  addCredits: (amount: number, details: {
    type: 'refill' | 'bonus' | 'subscription';
    description?: string;
  }) => Promise<void>;
  getTransactionHistory: (limit?: number) => Promise<CreditTransaction[]>;
  checkAndCreateUserCredits: (planType?: string) => Promise<UserCredits>;
  updatePlan: (planType: string) => Promise<UserCredits>;
}

export interface CreditUsageParams {
  modelName: string;
  tokensUsed: number;
  messageId?: string;
  description?: string;
}

export interface CreditPlan {
  id: string;
  name: string;
  credits: number;
  price: number;
}

export const CREDIT_PLANS: CreditPlan[] = [
  { id: 'free', name: 'Free', credits: 100, price: 0 },
  { id: 'basic', name: 'Basic', credits: 1000, price: 9.99 },
  { id: 'pro', name: 'Pro', credits: 5000, price: 29.99 },
  { id: 'enterprise', name: 'Enterprise', credits: 20000, price: 99.99 },
];

export const TOKEN_TO_CREDIT_RATIO = 0.01; // 1 token = 0.01 credits