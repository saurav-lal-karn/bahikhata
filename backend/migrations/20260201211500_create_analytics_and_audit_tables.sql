-- +goose Up
-- +goose StatementBegin

-- 1. Audit Logs (Partitioned by Month)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    family_id uuid,
    action TEXT NOT NULL, -- CREATE, UPDATE, DELETE, LOGIN, etc.
    entity_type TEXT NOT NULL, -- Transaction, Wallet, Budget, etc.
    entity_id uuid,
    old_values JSONB,
    new_values JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

-- Create initial partitions for 2026
CREATE TABLE IF NOT EXISTS audit_logs_y2026m01 PARTITION OF audit_logs FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');
CREATE TABLE IF NOT EXISTS audit_logs_y2026m02 PARTITION OF audit_logs FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');
CREATE TABLE IF NOT EXISTS audit_logs_y2026m03 PARTITION OF audit_logs FOR VALUES FROM ('2026-03-01') TO ('2026-04-01');

-- 2. Snapshots & Summaries
CREATE TABLE IF NOT EXISTS public.net_worth_snapshots (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    user_id uuid,
    family_id uuid,
    snapshot_date DATE NOT NULL DEFAULT CURRENT_DATE,
    total_assets NUMERIC NOT NULL DEFAULT 0,
    total_liabilities NUMERIC NOT NULL DEFAULT 0,
    net_worth NUMERIC NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.monthly_summaries (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    user_id uuid,
    family_id uuid,
    month DATE NOT NULL, -- First day of the month
    total_income NUMERIC NOT NULL DEFAULT 0,
    total_expense NUMERIC NOT NULL DEFAULT 0,
    savings NUMERIC NOT NULL DEFAULT 0,
    top_expense_category_id uuid,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, family_id, month)
);

-- 3. Advanced Budgeting
CREATE TABLE IF NOT EXISTS public.budget_periods (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    budget_id uuid NOT NULL REFERENCES public.budgets(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    spent_amount NUMERIC NOT NULL DEFAULT 0,
    is_closed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.budget_alerts (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    budget_id uuid NOT NULL REFERENCES public.budgets(id) ON DELETE CASCADE,
    period_id uuid REFERENCES public.budget_periods(id) ON DELETE CASCADE,
    threshold_percentage NUMERIC NOT NULL,
    triggered_at TIMESTAMP,
    message TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS public.budget_alerts;
DROP TABLE IF EXISTS public.budget_periods;
DROP TABLE IF EXISTS public.monthly_summaries;
DROP TABLE IF EXISTS public.net_worth_snapshots;
DROP TABLE IF EXISTS public.audit_logs;
-- +goose StatementEnd
