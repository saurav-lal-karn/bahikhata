-- +goose Up
-- +goose StatementBegin
DROP TABLE IF EXISTS public.expenses CASCADE;
DROP TABLE IF EXISTS public.income CASCADE;
DROP TABLE IF EXISTS public.expense_categories CASCADE;
DROP TABLE IF EXISTS public.income_types CASCADE;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
-- Recreating legacy tables is complex and shouldn't be needed after successful migration.
-- If rollback is required, it should be done from the data migration script.
SELECT 'Down migration not implemented';
-- +goose StatementEnd
