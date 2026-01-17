-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
ALTER TABLE public.expenses ADD COLUMN IF NOT EXISTS name TEXT NOT NULL;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
ALTER TABLE public.expenses DROP COLUMN IF EXISTS name;
-- +goose StatementEnd
