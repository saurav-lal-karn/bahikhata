-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
ALTER TABLE wallet_types ADD COLUMN IF NOT EXISTS is_system BOOLEAN DEFAULT FALSE;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
ALTER TABLE wallet_types DROP IF EXISTS COLUMN is_system;
-- +goose StatementEnd
