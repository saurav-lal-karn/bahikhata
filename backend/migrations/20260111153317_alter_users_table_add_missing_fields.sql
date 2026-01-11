-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS avatar_url text DEFAULT NULL;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS phone_number text DEFAULT NULL;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS two_factor_enabled boolean DEFAULT false;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS theme text DEFAULT 'light';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS locale text DEFAULT 'en';
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
ALTER TABLE public.users DROP COLUMN IF EXISTS avatar_url;
ALTER TABLE public.users DROP COLUMN IF EXISTS phone_number;
ALTER TABLE public.users DROP COLUMN IF EXISTS two_factor_enabled;
ALTER TABLE public.users DROP COLUMN IF EXISTS theme;
ALTER TABLE public.users DROP COLUMN IF EXISTS locale;
-- +goose StatementEnd
