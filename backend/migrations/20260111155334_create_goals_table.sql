-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
CREATE TABLE IF NOT EXISTS public.goals (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    family_id uuid NOT NULL,
    name text NOT NULL,
    target_amount numeric NOT NULL,
    current_amount numeric NOT NULL,
    deadline timestamp NOT NULL,
    color text NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP NULL
)
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
DROP TABLE IF EXISTS public.goals;
-- +goose StatementEnd
