import { BaseClientService } from '@/services/baseClientService';
import { CreditTransaction, UserCredits } from '@/database/schemas/userCredits';
import { ICreditsService } from './type';

export class ClientCreditsService extends BaseClientService implements ICreditsService {
  getUserCredits = async (): Promise<UserCredits | null> => {
    return this._fetch('/api/credits', {
      method: 'GET',
    });
  };

  checkAndCreateUserCredits = async (planType: string = 'free'): Promise<UserCredits> => {
    return this._fetch('/api/credits/init', {
      method: 'POST',
      body: JSON.stringify({ planType }),
    });
  };

  deductCredits = async (
    amount: number,
    details: {
      description?: string;
      messageId?: string;
      modelName?: string;
      tokensUsed?: number;
    }
  ): Promise<boolean> => {
    const response = await this._fetch('/api/credits/deduct', {
      method: 'POST',
      body: JSON.stringify({ amount, ...details }),
    });
    return response.success;
  };

  addCredits = async (
    amount: number,
    details: {
      type: 'refill' | 'bonus' | 'subscription';
      description?: string;
    }
  ): Promise<void> => {
    await this._fetch('/api/credits/add', {
      method: 'POST',
      body: JSON.stringify({ amount, ...details }),
    });
  };

  getTransactionHistory = async (limit: number = 50): Promise<CreditTransaction[]> => {
    return this._fetch(`/api/credits/transactions?limit=${limit}`, {
      method: 'GET',
    });
  };

  updatePlan = async (planType: string): Promise<UserCredits> => {
    return this._fetch('/api/credits/plan', {
      method: 'PUT',
      body: JSON.stringify({ planType }),
    });
  };
}