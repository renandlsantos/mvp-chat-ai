import { and, desc, eq, sql } from 'drizzle-orm';
import { nanoid } from 'nanoid';

import { LobeChatDatabase } from '@/database/type';

import { NewCreditTransaction, NewUserCredits, creditTransactions, userCredits, userPlans } from '../schemas/userCredits';

export interface UserCreditsModel {
  create: (params: NewUserCredits) => Promise<UserCredits>;
  delete: (userId: string) => Promise<void>;
  findByUserId: (userId: string) => Promise<UserCredits | null>;
  deductCredits: (userId: string, amount: number, details: Omit<NewCreditTransaction, 'id' | 'userId' | 'amount' | 'balance'>) => Promise<boolean>;
  addCredits: (userId: string, amount: number, details: Omit<NewCreditTransaction, 'id' | 'userId' | 'amount' | 'balance'>) => Promise<void>;
  getTransactionHistory: (userId: string, limit?: number) => Promise<CreditTransaction[]>;
  resetMonthlyCredits: (userId: string) => Promise<void>;
  checkAndCreateUserCredits: (userId: string, planId?: string) => Promise<UserCredits>;
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
        userId,
        totalCredits: defaultCredits,
        usedCredits: 0,
        planId: planId || null,
        resetAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Next month
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
        usedCredits: newUsed,
        updatedAt: new Date(),
      })
      .where(eq(userCredits.userId, userId));

    // Record transaction
    await this.db.insert(creditTransactions).values({
      id: nanoid(),
      userId,
      amount: -amount, // Negative for deduction
      balance: newBalance,
      type: 'usage',
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
      id: nanoid(),
      userId,
      amount: amount,
      balance: newBalance,
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
        usedCredits: 0,
        totalCredits: monthlyLimit,
        resetAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      })
      .where(eq(userCredits.userId, userId));

    // Record reset transaction
    await this.db.insert(creditTransactions).values({
      id: nanoid(),
      userId,
      amount: monthlyLimit,
      balance: monthlyLimit,
      type: 'refill',
      description: 'Monthly credit reset',
    });
  };
}