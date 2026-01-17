-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
ALTER TABLE wallet_types ADD COLUMN IF NOT EXISTS family_id UUID REFERENCES family(id) ON DELETE CASCADE;
ALTER TABLE wallet_types ADD COLUMN IF NOT EXISTS created_by_id UUID REFERENCES users(id) ON DELETE CASCADE;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
ALTER TABLE wallet_types DROP COLUMN IF EXISTS family_id;
ALTER TABLE wallet_types DROP COLUMN IF EXISTS created_by_id;
-- +goose StatementEnd
