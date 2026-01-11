-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
ALTER TABLE public.expense_categories 
ADD COLUMN is_system BOOLEAN DEFAULT FALSE;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
ALTER TABLE public.expense_categories 
DROP COLUMN IF EXISTS is_system;
-- +goose StatementEnd
