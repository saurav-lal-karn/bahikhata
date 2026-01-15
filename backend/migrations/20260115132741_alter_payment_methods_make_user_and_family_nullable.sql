-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
-- Make created_by_id and family_id nullable
ALTER TABLE public.payment_methods ALTER COLUMN created_by_id DROP NOT NULL;
ALTER TABLE public.payment_methods ALTER COLUMN family_id DROP NOT NULL;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
-- Note: We don't revert columns to NOT NULL in down migration as it could fail if NULL values exist
-- +goose StatementEnd
