-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
ALTER TABLE public.wallet_transfers DROP COLUMN IF EXISTS from_wallet_id;
ALTER TABLE public.wallet_transfers DROP COLUMN IF EXISTS to_wallet_id;
ALTER TABLE public.wallet_transfers ADD COLUMN from_wallet_id UUID NOT NULL;
ALTER TABLE public.wallet_transfers ADD COLUMN to_wallet_id UUID NOT NULL;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
ALTER TABLE public.wallet_transfers DROP COLUMN IF EXISTS from_wallet_id;
ALTER TABLE public.wallet_transfers DROP COLUMN IF EXISTS to_wallet_id;
ALTER TABLE public.wallet_transfers ADD COLUMN from_wallet_id INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public.wallet_transfers ADD COLUMN to_wallet_id INTEGER NOT NULL DEFAULT 0;
-- +goose StatementEnd
