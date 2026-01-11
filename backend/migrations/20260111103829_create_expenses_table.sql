-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
CREATE TABLE IF NOT EXISTS expenses (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    amount DECIMAL(20, 2) NOT NULL,
    description TEXT,
    payment_method TEXT NOT NULL,
    category_id UUID NOT NULL REFERENCES expense_categories(id),
    family_id UUID NOT NULL REFERENCES family(id),
    created_by_id UUID NOT NULL REFERENCES users(id),
    transaction_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP,
    CONSTRAINT fk_expenses_category FOREIGN KEY (category_id) REFERENCES expense_categories(id),
    CONSTRAINT fk_expenses_family FOREIGN KEY (family_id) REFERENCES family(id),
    CONSTRAINT fk_expenses_user FOREIGN KEY (created_by_id) REFERENCES users(id)
);

CREATE INDEX idx_expenses_family_id ON expenses(family_id);
CREATE INDEX idx_expenses_created_by_id ON expenses(created_by_id);
CREATE INDEX idx_expenses_deleted_at ON expenses(deleted_at);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
DROP INDEX IF EXISTS idx_expenses_family_id;
DROP INDEX IF EXISTS idx_expenses_created_by_id;
DROP INDEX IF EXISTS idx_expenses_deleted_at;
DROP TABLE IF EXISTS expenses;
-- +goose StatementEnd
