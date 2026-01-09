-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
CREATE TABLE IF NOT EXISTS public.family_members (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
	family_id UUID NOT NULL,
	user_id UUID NOT NULL,
    role VARCHAR(255) NOT NULL DEFAULT 'member',
	created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP,
	FOREIGN KEY (family_id) REFERENCES family(id) on delete cascade,
	FOREIGN KEY (user_id) REFERENCES users(id) on delete cascade
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
DROP TABLE IF EXISTS public.family_members;
-- +goose StatementEnd
