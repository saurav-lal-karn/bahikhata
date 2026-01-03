-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
CREATE TABLE IF NOT EXISTS public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    first_name text NOT NULL,
    last_name text NOT NULL,
    user_name text NOT NULL UNIQUE,
    email text NOT NULL UNIQUE,
    password text NOT NULL,
    role text NOT NULL DEFAULT 'user',
    family_id uuid NULL,
    country text NULL,
    created_by uuid NULL,
    email_verified boolean NOT NULL DEFAULT false,
    last_logged_in_at timestamp NULL,
    email_verified_at timestamp NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP NULL
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
DROP TABLE IF EXISTS public.users;
-- +goose StatementEnd
