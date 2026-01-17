-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
CREATE TABLE IF NOT EXISTS public.wallets (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    starting_balance DECIMAL(20, 2) NOT NULL,
    balance DECIMAL(20, 2) NOT NULL,
    currency TEXT NOT NULL,
    description TEXT NULL,
    wallet_issuer_name TEXT NULL,
    wallet_id TEXT NULL,
    wallet_type_id UUID NOT NULL REFERENCES public.wallet_types(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    family_id UUID NOT NULL REFERENCES public.family(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP NULL
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
DROP TABLE IF EXISTS public.wallets;
-- +goose StatementEnd
