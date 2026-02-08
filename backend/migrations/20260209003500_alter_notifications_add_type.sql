-- +goose Up
-- +goose StatementBegin
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS type text NOT NULL DEFAULT 'notification';
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE public.notifications DROP COLUMN IF EXISTS type;
-- +goose StatementEnd
