-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS street TEXT DEFAULT NULL;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS city TEXT DEFAULT NULL;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS state TEXT DEFAULT NULL;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS postal_code TEXT DEFAULT NULL;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
ALTER TABLE public.users DROP COLUMN IF EXISTS street;
ALTER TABLE public.users DROP COLUMN IF EXISTS city;
ALTER TABLE public.users DROP COLUMN IF EXISTS state;
ALTER TABLE public.users DROP COLUMN IF EXISTS postal_code;
-- +goose StatementEnd
