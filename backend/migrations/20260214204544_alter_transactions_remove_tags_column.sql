-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
ALTER TABLE public.transactions DROP COLUMN IF EXISTS tags;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS tags JSONB;
-- +goose StatementEnd
