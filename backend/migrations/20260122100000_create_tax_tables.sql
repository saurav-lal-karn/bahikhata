-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
CREATE TABLE IF NOT EXISTS public.tax_documents (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    family_id uuid NOT NULL,
    user_id uuid, -- Optional if we want user specific
    name text NOT NULL,
    category text NOT NULL,
    year text NOT NULL,
    file_url text, -- Store path or url
    remarks text,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP NULL
);

CREATE TABLE IF NOT EXISTS public.tax_deductions (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    family_id uuid NOT NULL,
    user_id uuid,
    name text NOT NULL,
    amount numeric NOT NULL,
    max_limit numeric NOT NULL, -- limit is reserved keyword sometimes
    category text NOT NULL, -- 80C, 80D etc
    year text NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP NULL
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
DROP TABLE IF EXISTS public.tax_documents;
DROP TABLE IF EXISTS public.tax_deductions;
-- +goose StatementEnd
