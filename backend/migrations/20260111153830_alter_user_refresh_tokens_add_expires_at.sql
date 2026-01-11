-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
ALTER TABLE public.user_refresh_tokens ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP DEFAULT NOW() + INTERVAL '7 day';
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
ALTER TABLE public.user_refresh_tokens DROP COLUMN IF EXISTS expires_at;
-- +goose StatementEnd
