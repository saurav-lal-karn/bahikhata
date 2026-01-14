-- +goose Up
-- +goose StatementBegin
ALTER TABLE public.family_members ADD COLUMN IF NOT EXISTS created_by_user_id UUID;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE public.family_members DROP COLUMN IF EXISTS created_by_user_id;
-- +goose StatementEnd
