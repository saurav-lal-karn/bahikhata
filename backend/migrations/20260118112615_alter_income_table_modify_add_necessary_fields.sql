-- +goose Up
-- +goose StatementBegin
-- Drop not needed fields first
ALTER TABLE public.income DROP COLUMN IF EXISTS user_id;

-- Add new needed fields
ALTER TABLE public.income ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.income ADD COLUMN IF NOT EXISTS wallet_id uuid REFERENCES wallets(id);

-- Rename and update types
ALTER TABLE public.income RENAME COLUMN transaction_date TO date;
ALTER TABLE public.income RENAME COLUMN source TO source_id;
ALTER TABLE public.income ALTER COLUMN source_id TYPE uuid USING source_id::uuid;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
-- Drop new fields
ALTER TABLE public.income DROP COLUMN IF EXISTS name;
ALTER TABLE public.income DROP COLUMN IF EXISTS wallet_id;

-- Revert rename and types
ALTER TABLE public.income ALTER COLUMN source_id TYPE TEXT;
ALTER TABLE public.income RENAME COLUMN source_id TO source;
ALTER TABLE public.income RENAME COLUMN date TO transaction_date;

-- Re-add dropped fields
ALTER TABLE public.income ADD COLUMN IF NOT EXISTS user_id uuid;
-- +goose StatementEnd
