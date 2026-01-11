-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
CREATE TABLE IF NOT EXISTS public.debts (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    family_id uuid NOT NULL,
    lender text NOT NULL,
    total_amount numeric NOT NULL,
    remaining_amount numeric NOT NULL,
    interest_rate numeric NOT NULL,
    due_date timestamp NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP NULL
)
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
DROP TABLE IF EXISTS public.debts;
-- +goose StatementEnd
