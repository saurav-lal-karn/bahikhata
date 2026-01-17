-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
ALTER TABLE public.wallet_transfers ADD COLUMN IF NOT EXISTS family_id uuid REFERENCES public.family(id) ON DELETE CASCADE;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
ALTER TABLE public.wallet_transfers DROP COLUMN IF EXISTS family_id;
-- +goose StatementEnd
