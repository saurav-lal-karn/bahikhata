-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
ALTER TABLE public.goals ADD COLUMN IF NOT EXISTS user_id UUID NOT NULL;
ALTER TABLE public.goals ADD COLUMN IF NOT EXISTS icon_name TEXT;
ALTER TABLE public.goals ADD COLUMN IF NOT EXISTS description TEXT;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
ALTER TABLE public.goals DROP COLUMN IF EXISTS user_id;
ALTER TABLE public.goals DROP COLUMN IF EXISTS icon_name;
ALTER TABLE public.goals DROP COLUMN IF EXISTS description;
-- +goose StatementEnd
