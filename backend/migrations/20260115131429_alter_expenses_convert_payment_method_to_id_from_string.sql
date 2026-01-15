-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query'; 
ALTER TABLE public.expenses ALTER COLUMN payment_method DROP NOT NULL;
ALTER TABLE public.expenses ADD COLUMN payment_method_id UUID REFERENCES public.payment_methods(id) ON DELETE CASCADE;

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
ALTER TABLE public.expenses ALTER COLUMN payment_method_id DROP NOT NULL;
ALTER TABLE public.expenses ADD COLUMN payment_method TEXT NOT NULL;
-- +goose StatementEnd
