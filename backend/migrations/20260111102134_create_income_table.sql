-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
CREATE TABLE IF NOT EXISTS public.income (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    amount DECIMAL(20, 2) NOT NULL,
    description TEXT,
    source TEXT NOT NULL,
    family_id UUID NOT NULL REFERENCES family(id),
    created_by_id UUID NOT NULL REFERENCES users(id),
    transaction_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP,
    CONSTRAINT fk_income_family FOREIGN KEY (family_id) REFERENCES family(id) ON DELETE CASCADE,
    CONSTRAINT fk_income_user FOREIGN KEY (created_by_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX idx_income_family_id ON income(family_id);
CREATE INDEX idx_income_created_by_id ON income(created_by_id);
CREATE INDEX idx_income_deleted_at ON income(deleted_at);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
DROP INDEX IF EXISTS idx_income_family_id;
DROP INDEX IF EXISTS idx_income_created_by_id;
DROP INDEX IF EXISTS idx_income_deleted_at;
DROP TABLE IF EXISTS income;
-- +goose StatementEnd
