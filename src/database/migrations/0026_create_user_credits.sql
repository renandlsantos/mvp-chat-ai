-- Create user_credits table
CREATE TABLE IF NOT EXISTS "user_credits" (
  "id" text PRIMARY KEY NOT NULL,
  "user_id" text NOT NULL,
  "plan_type" text DEFAULT 'free' NOT NULL,
  "total_credits" numeric(10,2) DEFAULT '0' NOT NULL,
  "used_credits" numeric(10,2) DEFAULT '0' NOT NULL,
  "remaining_credits" numeric(10,2) DEFAULT '0' NOT NULL,
  "monthly_limit" numeric(10,2) DEFAULT '100' NOT NULL,
  "reset_date" timestamp with time zone NOT NULL,
  "is_active" boolean DEFAULT true NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- Create credit_transactions table
CREATE TABLE IF NOT EXISTS "credit_transactions" (
  "id" text PRIMARY KEY NOT NULL,
  "user_id" text NOT NULL,
  "amount" numeric(10,2) NOT NULL,
  "type" text NOT NULL,
  "description" text,
  "message_id" text,
  "model_name" text,
  "tokens_used" integer,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- Add foreign key constraints
DO $$ BEGIN
 ALTER TABLE "user_credits" ADD CONSTRAINT "user_credits_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "credit_transactions" ADD CONSTRAINT "credit_transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS "idx_user_credits_user_id" ON "user_credits" ("user_id");
CREATE INDEX IF NOT EXISTS "idx_credit_transactions_user_id" ON "credit_transactions" ("user_id");
CREATE INDEX IF NOT EXISTS "idx_credit_transactions_created_at" ON "credit_transactions" ("created_at");
CREATE INDEX IF NOT EXISTS "idx_credit_transactions_type" ON "credit_transactions" ("type");