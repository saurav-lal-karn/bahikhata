-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';

CREATE TABLE IF NOT EXISTS public.transactions (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    type public.enum_transaction_category_type NOT NULL,
    amount NUMERIC NOT NULL,
    description TEXT,
    wallet_id uuid REFERENCES public.wallets(id),
    category_id uuid REFERENCES public.transaction_categories(id),
    payment_method_id uuid REFERENCES public.payment_methods(id),
    transaction_date TIMESTAMP NOT NULL DEFAULT NOW(),
    family_id uuid REFERENCES public.family(id) ON DELETE CASCADE,
    user_id uuid REFERENCES public.users(id),
    parent_id uuid REFERENCES public.transactions(id),
    created_by_id uuid REFERENCES public.users(id),
    transfer_ref_id uuid,
    tags JSONB,
    attachments JSONB,
    file_id uuid,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP NULL
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
DROP TABLE IF EXISTS public.transactions;
-- +goose StatementEnd
