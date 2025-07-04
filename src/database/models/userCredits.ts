import { desc, eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';

import { LobeChatDatabase } from '@/database/type';

import { NewCreditTransaction, NewUserCredits, creditTransactions, userCredits } from '../schemas/userCredits';

export interface IUserCreditsModel {
  addCredits: (userId: string, amount: number, details: Omit<NewCreditTransaction, 'id' | 'userId' | 'amount' | 'balance'>) => Promise<void>;
  checkAndCreateUserCredits: (userId: string, planId?: string) => Promise<UserCredits>;
  create: (params: NewUserCredits) => Promise<UserCredits>;
  deductCredits: (userId: string, amount: number, details: Omit<NewCreditTransaction, 'id' | 'userId' | 'amount' | 'balance'>) => Promise<boolean>;
  delete: (userId: string) => Promise<void>;
  findByUserId: (userId: string) => Promise<UserCredits | null>;
  getTransactionHistory: (userId: string, limit?: number) => Promise<CreditTransaction[]>;
  resetMonthlyCredits: (userId: string) => Promise<void>;
}

export type UserCredits = typeof userCredits.$inferSelect;
export type CreditTransaction = typeof creditTransactions.$inferSelect;

export class UserCreditsModel {
  private userId: string;
  private db: LobeChatDatabase;

  constructor(db: LobeChatDatabase, userId: string) {
    this.userId = userId;
    this.db = db;
  }

  create = async (params: NewUserCredits): Promise<UserCredits> => {
    const [result] = await this.db
      .insert(userCredits)
      .values(params)
      .returning();

    return result;
  };

  delete = async (userId: string): Promise<void> => {
    await this.db.delete(userCredits).where(eq(userCredits.userId, userId));
  };

  findByUserId = async (userId: string): Promise<UserCredits | null> => {
    const [result] = await this.db
      .select()
      .from(userCredits)
      .where(eq(userCredits.userId, userId))
      .limit(1);

    return result || null;
  };

  checkAndCreateUserCredits = async (userId: string, planId?: string): Promise<UserCredits> => {
    let userCredit = await this.findByUserId(userId);

    if (!userCredit) {
      // Default to free plan with 100 credits
      const defaultCredits = 100;

      userCredit = await this.create({
        planId: planId || null,
        resetAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        totalCredits: defaultCredits,
        usedCredits: 0,
        userId, // Next month
      });
    }

    return userCredit;
  };

  deductCredits = async (
    userId: string,
    amount: number,
    details: Omit<NewCreditTransaction, 'id' | 'userId' | 'amount' | 'balance'>
  ): Promise<boolean> => {
    const userCredit = await this.findByUserId(userId);
    if (!userCredit) {
      throw new Error('User credits not found');
    }

    const currentRemaining = userCredit.totalCredits - userCredit.usedCredits;
    if (currentRemaining < amount) {
      return false; // Insufficient credits
    }

    // Update user credits
    const newUsed = userCredit.usedCredits + amount;
    const newBalance = userCredit.totalCredits - newUsed;

    await this.db
      .update(userCredits)
      .set({
        updatedAt: new Date(),
        usedCredits: newUsed,
      })
      .where(eq(userCredits.userId, userId));

    // Record transaction
    await this.db.insert(creditTransactions).values({
      amount: -amount,
      // Negative for deduction
balance: newBalance,
      
id: nanoid(), 
      type: 'usage',
      userId,
      ...details,
    });

    return true;
  };

  addCredits = async (
    userId: string,
    amount: number,
    details: Omit<NewCreditTransaction, 'id' | 'userId' | 'amount' | 'balance'>
  ): Promise<void> => {
    const userCredit = await this.findByUserId(userId);
    if (!userCredit) {
      throw new Error('User credits not found');
    }

    // Update user credits
    const newTotal = userCredit.totalCredits + amount;
    const newBalance = newTotal - userCredit.usedCredits;

    await this.db
      .update(userCredits)
      .set({
        totalCredits: newTotal,
        updatedAt: new Date(),
      })
      .where(eq(userCredits.userId, userId));

    // Record transaction
    await this.db.insert(creditTransactions).values({
      amount: amount,
      balance: newBalance,
      id: nanoid(),
      userId,
      ...details,
    });
  };

  getTransactionHistory = async (userId: string, limit: number = 50): Promise<CreditTransaction[]> => {
    return await this.db
      .select()
      .from(creditTransactions)
      .where(eq(creditTransactions.userId, userId))
      .orderBy(desc(creditTransactions.createdAt))
      .limit(limit);
  };

  resetMonthlyCredits = async (userId: string): Promise<void> => {
    const userCredit = await this.findByUserId(userId);
    if (!userCredit) {
      throw new Error('User credits not found');
    }

    // Default monthly reset to 100 credits for free plan
    const monthlyLimit = 100;

    await this.db
      .update(userCredits)
      .set({
        resetAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        totalCredits: monthlyLimit,
        updatedAt: new Date(),
        usedCredits: 0,
      })
      .where(eq(userCredits.userId, userId));

    // Record reset transaction
    await this.db.insert(creditTransactions).values({
      amount: monthlyLimit,
      balance: monthlyLimit,
      description: 'Monthly credit reset',
      id: nanoid(),
      type: 'refill',
      userId,
    });
  };
}