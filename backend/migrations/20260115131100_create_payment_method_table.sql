-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
CREATE TABLE IF NOT EXISTS public.payment_methods (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NULL,
    icon_name TEXT NULL, -- For UI display (e.g., "cash", "credit-card", "upi")
    family_id UUID NULL REFERENCES family(id) ON DELETE CASCADE, -- Nullable for system payment methods
    created_by_id UUID NULL REFERENCES users(id) ON DELETE SET NULL, -- Who created this (for custom methods)
    is_system BOOLEAN NOT NULL DEFAULT FALSE, -- System defaults (Cash, UPI, etc.) vs custom
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP NULL -- Soft delete
);

CREATE INDEX idx_payment_methods_name ON public.payment_methods(name);
CREATE INDEX idx_payment_methods_family_id ON public.payment_methods(family_id);
CREATE INDEX idx_payment_methods_deleted_at ON public.payment_methods(deleted_at);
CREATE INDEX idx_payment_methods_is_system ON public.payment_methods(is_system);

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
DROP INDEX IF EXISTS public.idx_payment_methods_is_system;
DROP INDEX IF EXISTS public.idx_payment_methods_deleted_at;
DROP INDEX IF EXISTS public.idx_payment_methods_family_id;
DROP INDEX IF EXISTS public.idx_payment_methods_name;
DROP TABLE IF EXISTS public.payment_methods;
-- +goose StatementEnd      
