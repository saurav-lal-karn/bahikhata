-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
ALTER TABLE public.wallet_transfers ALTER COLUMN date TYPE TIMESTAMP USING date::timestamp;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
ALTER TABLE public.wallet_transfers ALTER COLUMN date TYPE TEXT;
-- +goose StatementEnd
