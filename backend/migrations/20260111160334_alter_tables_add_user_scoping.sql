-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';

-- Define tables to modify
-- expenses, income, budgets, accounts, debts, goals, investments, recurring_transactions

-- 1. Add user_id column and FK
ALTER TABLE public.expenses ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE public.income ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE public.budgets ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE public.accounts ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE public.debts ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE public.goals ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE public.investments ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE public.recurring_transactions ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.users(id) ON DELETE CASCADE;

-- 2. Make family_id Nullable
ALTER TABLE public.expenses ALTER COLUMN family_id DROP NOT NULL;
ALTER TABLE public.income ALTER COLUMN family_id DROP NOT NULL;
ALTER TABLE public.budgets ALTER COLUMN family_id DROP NOT NULL;
ALTER TABLE public.accounts ALTER COLUMN family_id DROP NOT NULL;
ALTER TABLE public.debts ALTER COLUMN family_id DROP NOT NULL;
ALTER TABLE public.goals ALTER COLUMN family_id DROP NOT NULL;
ALTER TABLE public.investments ALTER COLUMN family_id DROP NOT NULL;
ALTER TABLE public.recurring_transactions ALTER COLUMN family_id DROP NOT NULL;

-- 3. Add Ownership Check Constraints (Either User OR Family, exclusive or inclusive depending on logic. Here enforcing AT LEAST ONE, and typically mutual exclusion if desired, but allowing one or the other suffices for "scoping")
-- Constraint: (family_id IS NOT NULL) OR (user_id IS NOT NULL)
ALTER TABLE public.expenses ADD CONSTRAINT check_expenses_ownership CHECK (family_id IS NOT NULL OR user_id IS NOT NULL);
ALTER TABLE public.income ADD CONSTRAINT check_income_ownership CHECK (family_id IS NOT NULL OR user_id IS NOT NULL);
ALTER TABLE public.budgets ADD CONSTRAINT check_budgets_ownership CHECK (family_id IS NOT NULL OR user_id IS NOT NULL);
ALTER TABLE public.accounts ADD CONSTRAINT check_accounts_ownership CHECK (family_id IS NOT NULL OR user_id IS NOT NULL);
ALTER TABLE public.debts ADD CONSTRAINT check_debts_ownership CHECK (family_id IS NOT NULL OR user_id IS NOT NULL);
ALTER TABLE public.goals ADD CONSTRAINT check_goals_ownership CHECK (family_id IS NOT NULL OR user_id IS NOT NULL);
ALTER TABLE public.investments ADD CONSTRAINT check_investments_ownership CHECK (family_id IS NOT NULL OR user_id IS NOT NULL);
ALTER TABLE public.recurring_transactions ADD CONSTRAINT check_recurring_ownership CHECK (family_id IS NOT NULL OR user_id IS NOT NULL);

-- 4. Add Indexes
-- Common Indexes
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON public.expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_income_user_id ON public.income(user_id);
CREATE INDEX IF NOT EXISTS idx_budgets_user_id ON public.budgets(user_id);
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON public.accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_debts_user_id ON public.debts(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON public.goals(user_id);
CREATE INDEX IF NOT EXISTS idx_investments_user_id ON public.investments(user_id);
CREATE INDEX IF NOT EXISTS idx_recurring_user_id ON public.recurring_transactions(user_id);

-- Specific Filters
CREATE INDEX IF NOT EXISTS idx_expenses_payment_method ON public.expenses(payment_method);
CREATE INDEX IF NOT EXISTS idx_expenses_transaction_date ON public.expenses(transaction_date);
CREATE INDEX IF NOT EXISTS idx_income_transaction_date ON public.income(transaction_date);

-- 5. Data Integrity Constraints (Basic checks)
ALTER TABLE public.expenses ADD CONSTRAINT check_expenses_amount_pos CHECK (amount > 0);
ALTER TABLE public.income ADD CONSTRAINT check_income_amount_pos CHECK (amount > 0);
ALTER TABLE public.budgets ADD CONSTRAINT check_budgets_limit_pos CHECK (amount_limit > 0);
ALTER TABLE public.budgets ADD CONSTRAINT check_budget_period CHECK (period IN ('Monthly', 'Yearly', 'Weekly'));

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';

-- Reverting changes is complex if data exists, but structurally:

-- Remove Constraints
ALTER TABLE public.expenses DROP CONSTRAINT IF EXISTS check_expenses_amount_pos;
ALTER TABLE public.income DROP CONSTRAINT IF EXISTS check_income_amount_pos;
ALTER TABLE public.budgets DROP CONSTRAINT IF EXISTS check_budgets_limit_pos;
ALTER TABLE public.budgets DROP CONSTRAINT IF EXISTS check_budget_period;

ALTER TABLE public.expenses DROP CONSTRAINT IF EXISTS check_expenses_ownership;
ALTER TABLE public.income DROP CONSTRAINT IF EXISTS check_income_ownership;
ALTER TABLE public.budgets DROP CONSTRAINT IF EXISTS check_budgets_ownership;
ALTER TABLE public.accounts DROP CONSTRAINT IF EXISTS check_accounts_ownership;
ALTER TABLE public.debts DROP CONSTRAINT IF EXISTS check_debts_ownership;
ALTER TABLE public.goals DROP CONSTRAINT IF EXISTS check_goals_ownership;
ALTER TABLE public.investments DROP CONSTRAINT IF EXISTS check_investments_ownership;
ALTER TABLE public.recurring_transactions DROP CONSTRAINT IF EXISTS check_recurring_ownership;

-- Remove Indexes
DROP INDEX IF EXISTS idx_expenses_user_id;
DROP INDEX IF EXISTS idx_income_user_id;
DROP INDEX IF EXISTS idx_budgets_user_id;
DROP INDEX IF EXISTS idx_accounts_user_id;
DROP INDEX IF EXISTS idx_debts_user_id;
DROP INDEX IF EXISTS idx_goals_user_id;
DROP INDEX IF EXISTS idx_investments_user_id;
DROP INDEX IF EXISTS idx_recurring_user_id;
DROP INDEX IF EXISTS idx_expenses_payment_method;
DROP INDEX IF EXISTS idx_expenses_transaction_date;
DROP INDEX IF EXISTS idx_income_transaction_date;

-- Revert family_id to NOT NULL (WARNING: Will fail if any nulls exist)
-- ALTER TABLE public.expenses ALTER COLUMN family_id SET NOT NULL; 
-- (Skipping strict revert of NULL constraint to avoid down migration failures on data)

-- Remove user_id
ALTER TABLE public.expenses DROP COLUMN IF EXISTS user_id;
ALTER TABLE public.income DROP COLUMN IF EXISTS user_id;
ALTER TABLE public.budgets DROP COLUMN IF EXISTS user_id;
ALTER TABLE public.accounts DROP COLUMN IF EXISTS user_id;
ALTER TABLE public.debts DROP COLUMN IF EXISTS user_id;
ALTER TABLE public.goals DROP COLUMN IF EXISTS user_id;
ALTER TABLE public.investments DROP COLUMN IF EXISTS user_id;
ALTER TABLE public.recurring_transactions DROP COLUMN IF EXISTS user_id;

-- +goose StatementEnd
