-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'enum_transaction_category_type'
    ) THEN
        CREATE TYPE public.enum_transaction_category_type
        AS ENUM ('INCOME', 'EXPENSE');
    END IF;
END$$;


CREATE TABLE IF NOT EXISTS public.transaction_categories (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    type public.enum_transaction_category_type,
    description TEXT,
    icon TEXT,
    color TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    is_system BOOLEAN DEFAULT FALSE,
    parent_id uuid REFERENCES public.transaction_categories(id),
    family_id uuid REFERENCES public.family(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP NULL
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
DROP TABLE IF EXISTS public.transaction_categories;
DROP TYPE IF EXISTS public.enum_transaction_category_type;
-- +goose StatementEnd
