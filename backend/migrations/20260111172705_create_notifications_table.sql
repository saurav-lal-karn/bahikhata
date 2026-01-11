-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
CREATE TABLE IF NOT EXISTS public.notifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
    family_id uuid NOT NULL REFERENCES public.family (id) ON DELETE CASCADE,
    title text NOT NULL,
    message text NOT NULL,
    status text NOT NULL DEFAULT 'unread',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP NULL
);

CREATE INDEX idx_notifications_user_id ON public.notifications (user_id);
CREATE INDEX idx_notifications_family_id ON public.notifications (family_id);

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
DROP INDEX idx_notifications_user_id;
DROP INDEX idx_notifications_family_id;
DROP TABLE IF EXISTS public.notifications;
-- +goose StatementEnd
