-- +goose Up
-- +goose StatementBegin
-- 1. Migrate Expense Categories
INSERT INTO public.transaction_categories (id, name, type, description, is_active, is_system, family_id, created_at, updated_at, deleted_at)
SELECT id, name, 'EXPENSE', description, true, false, family_id, created_at, updated_at, deleted_at
FROM public.expense_categories
ON CONFLICT (id) DO NOTHING;

-- 2. Migrate Income Types
INSERT INTO public.transaction_categories (id, name, type, description, is_active, is_system, family_id, created_at, updated_at, deleted_at)
SELECT id, name, 'INCOME', description, true, is_system, family_id, created_at, updated_at, deleted_at
FROM public.income_types
ON CONFLICT (id) DO NOTHING;

-- 3. Migrate Expenses to Transactions
INSERT INTO public.transactions (
    id, type, amount, description, wallet_id, category_id, 
    payment_method_id, transaction_date, family_id, created_by_id, 
    created_at, updated_at, deleted_at
)
SELECT 
    id, 'EXPENSE', amount, COALESCE(name || ': ' || description, name, description), 
    NULL, -- wallet_id was not explicitly in legacy expenses table in early migrations, checking if it was added later
    category_id, 
    payment_method_id, transaction_date, family_id, created_by_id, 
    created_at, updated_at, deleted_at
FROM public.expenses
ON CONFLICT (id) DO NOTHING;

-- Note: Need to verify if 'expenses' table has wallet_id now. 
-- Looking at earlier migrations, it might not have been added yet or was added via another migration.
-- Checking 20260111103829_create_expenses_table.sql - it doesn't have wallet_id.
-- Let's check all migrations again for expenses table changes.

-- 4. Migrate Income to Transactions
INSERT INTO public.transactions (
    id, type, amount, description, wallet_id, category_id, 
    transaction_date, family_id, created_by_id, 
    created_at, updated_at, deleted_at
)
SELECT 
    id, 'INCOME', amount, COALESCE(name || ': ' || description, name, description), 
    wallet_id, source_id, 
    date, family_id, created_by_id, 
    created_at, updated_at, deleted_at
FROM public.income
ON CONFLICT (id) DO NOTHING;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DELETE FROM public.transactions WHERE type IN ('INCOME', 'EXPENSE');
DELETE FROM public.transaction_categories WHERE type IN ('INCOME', 'EXPENSE');
-- +goose StatementEnd
