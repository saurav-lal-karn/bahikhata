-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
CREATE TABLE IF NOT EXISTS public.income_types (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    is_system boolean DEFAULT false,
    created_by_id UUID REFERENCES users(id) ON DELETE CASCADE,
    family_id UUID REFERENCES family(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP NULL
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
DROP TABLE IF EXISTS public.income_types;
-- +goose StatementEnd
