-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
CREATE TABLE IF NOT EXISTS public.recurring_transactions (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    family_id uuid NOT NULL,
    name text NOT NULL,
    amount numeric NOT NULL,
    frequency text NOT NULL,
    next_due_date timestamp NOT NULL,
    type text NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP NULL
)
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
DROP TABLE IF EXISTS public.recurring_transactions;
-- +goose StatementEnd
