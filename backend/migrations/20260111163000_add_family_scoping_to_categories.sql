-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
ALTER TABLE public.expense_categories 
ADD COLUMN family_id UUID REFERENCES public.family(id) ON DELETE CASCADE,
ADD COLUMN created_by_id UUID REFERENCES public.users(id) ON DELETE SET NULL;

CREATE INDEX idx_expense_categories_family_id ON public.expense_categories(family_id);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
DROP INDEX IF EXISTS idx_expense_categories_family_id;
ALTER TABLE public.expense_categories 
DROP COLUMN IF EXISTS family_id,
DROP COLUMN IF EXISTS created_by_id;
-- +goose StatementEnd
