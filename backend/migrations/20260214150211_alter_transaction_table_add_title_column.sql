-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS title TEXT; 
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
ALTER TABLE public.transactions DROP COLUMN IF EXISTS title;
-- +goose StatementEnd
