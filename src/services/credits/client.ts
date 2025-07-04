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
      body: JSON.stringify({ planType }),
      method: 'POST',
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
      body: JSON.stringify({ amount, ...details }),
      method: 'POST',
    });
    return response.success;
  };

  addCredits = async (
    amount: number,
    details: {
      description?: string;
      type: 'refill' | 'bonus' | 'subscription';
    }
  ): Promise<void> => {
    await this._fetch('/api/credits/add', {
      body: JSON.stringify({ amount, ...details }),
      method: 'POST',
    });
  };

  getTransactionHistory = async (limit: number = 50): Promise<CreditTransaction[]> => {
    return this._fetch(`/api/credits/transactions?limit=${limit}`, {
      method: 'GET',
    });
  };

  updatePlan = async (planType: string): Promise<UserCredits> => {
    return this._fetch('/api/credits/plan', {
      body: JSON.stringify({ planType }),
      method: 'PUT',
    });
  };
}