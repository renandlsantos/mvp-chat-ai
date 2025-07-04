import { serverDB } from '@/database/server';
import { UserCreditsModel } from '@/database/models/userCredits';
import { ICreditsService, CreditUsageParams, TOKEN_TO_CREDIT_RATIO } from './type';

export class ServerCreditsService implements ICreditsService {
  private userId: string;
  private userCreditsModel: UserCreditsModel;

  constructor(userId: string) {
    this.userId = userId;
    this.userCreditsModel = new UserCreditsModel(serverDB, userId);
  }

  getUserCredits = async () => {
    return await this.userCreditsModel.findByUserId(this.userId);
  };

  checkAndCreateUserCredits = async (planType: string = 'free') => {
    return await this.userCreditsModel.checkAndCreateUserCredits(this.userId, planType);
  };

  deductCredits = async (
    amount: number,
    details: {
      description?: string;
      messageId?: string;
      modelName?: string;
      tokensUsed?: number;
    }
  ) => {
    return await this.userCreditsModel.deductCredits(this.userId, amount, {
      type: 'usage',
      description: details.description || 'AI model usage',
      messageId: details.messageId,
      model: details.modelName,
      tokenCount: details.tokensUsed,
    });
  };

  addCredits = async (
    amount: number,
    details: {
      type: 'refill' | 'bonus' | 'subscription';
      description?: string;
    }
  ) => {
    await this.userCreditsModel.addCredits(this.userId, amount, {
      type: details.type,
      description: details.description || `${details.type} credits`,
    });
  };

  getTransactionHistory = async (limit: number = 50) => {
    return await this.userCreditsModel.getTransactionHistory(this.userId, limit);
  };

  updatePlan = async (planType: string) => {
    // First check if user has credits
    let userCredits = await this.userCreditsModel.findByUserId(this.userId);
    
    if (!userCredits) {
      // Create new credits entry with new plan
      return await this.userCreditsModel.checkAndCreateUserCredits(this.userId, planType);
    }

    // Update existing plan - this would typically involve more complex logic
    // For now, we'll reset the monthly credits based on the new plan
    await this.userCreditsModel.resetMonthlyCredits(this.userId);
    
    // Fetch updated credits
    userCredits = await this.userCreditsModel.findByUserId(this.userId);
    return userCredits!;
  };

  // Helper method to calculate credits from tokens
  static calculateCreditsFromTokens = (tokensUsed: number): number => {
    return Math.ceil(tokensUsed * TOKEN_TO_CREDIT_RATIO);
  };

  // Helper method to deduct credits based on token usage
  deductCreditsFromTokens = async (params: CreditUsageParams) => {
    const creditsToDeduct = ServerCreditsService.calculateCreditsFromTokens(params.tokensUsed);
    
    return await this.deductCredits(creditsToDeduct, {
      description: params.description || `${params.modelName} usage: ${params.tokensUsed} tokens`,
      messageId: params.messageId,
      modelName: params.modelName,
      tokensUsed: params.tokensUsed,
    });
  };
}