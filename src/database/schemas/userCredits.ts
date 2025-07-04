import { pgTable, text, integer, timestamp, real, boolean, unique } from 'drizzle-orm/pg-core';
import { timestamps } from './_helpers';
import { users } from './user';

// User plans table - matches existing migration
export const userPlans = pgTable('user_plans', {
  credits: integer('credits').notNull().default(0),
  id: text('id').primaryKey().notNull(),
  isActive: boolean('is_active').notNull().default(true),
  name: text('name').notNull(),
  price: real('price').notNull().default(0),
  
  ...timestamps,
});

// User credits table - matches existing migration structure
export const userCredits = pgTable('user_credits', {
  planId: text('plan_id').references(() => userPlans.id),
  resetAt: timestamp('reset_at'),
  totalCredits: real('total_credits').notNull().default(0),
  usedCredits: real('used_credits').notNull().default(0),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  
  ...timestamps,
}, (table) => ({
  userIdUnique: unique().on(table.userId),
}));

// Credit transactions table - matches existing migration structure
export const creditTransactions = pgTable('credit_transactions', {
  amount: real('amount').notNull(),
  balance: real('balance').notNull(),
  // 'usage', 'refill', 'bonus', 'subscription'
description: text('description'),
  
id: text('id').primaryKey().notNull(), 
  
messageId: text('message_id'), 
  
// Reference to message that consumed credits
model: text('model'),
  

// Model name
tokenCount: integer('token_count'), 
  

// Balance after transaction
type: text('type').notNull(), 
  
userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(), // Tokens used
  
  ...timestamps,
});

export type UserCredits = typeof userCredits.$inferSelect;
export type NewUserCredits = typeof userCredits.$inferInsert;
export type CreditTransaction = typeof creditTransactions.$inferSelect;
export type NewCreditTransaction = typeof creditTransactions.$inferInsert;
export type UserPlan = typeof userPlans.$inferSelect;
export type NewUserPlan = typeof userPlans.$inferInsert;