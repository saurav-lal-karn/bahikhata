-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
ALTER TABLE public.family ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD';
ALTER TABLE public.family ADD COLUMN IF NOT EXISTS locale TEXT DEFAULT 'en';
ALTER TABLE public.family ADD COLUMN IF NOT EXISTS budget_alerts BOOLEAN DEFAULT true;
ALTER TABLE public.family ADD COLUMN IF NOT EXISTS weekly_report BOOLEAN DEFAULT true;
ALTER TABLE public.family ADD COLUMN IF NOT EXISTS hide_portfolio BOOLEAN DEFAULT false;
ALTER TABLE public.family ADD COLUMN IF NOT EXISTS restrict_deletion BOOLEAN DEFAULT false;
ALTER TABLE public.family ADD COLUMN IF NOT EXISTS hide_income BOOLEAN DEFAULT false;
ALTER TABLE public.family ADD COLUMN IF NOT EXISTS created_by UUID;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
ALTER TABLE public.family DROP COLUMN IF EXISTS currency;
ALTER TABLE public.family DROP COLUMN IF EXISTS locale;
ALTER TABLE public.family DROP COLUMN IF EXISTS budget_alerts;
ALTER TABLE public.family DROP COLUMN IF EXISTS weekly_report;
ALTER TABLE public.family DROP COLUMN IF EXISTS hide_portfolio;
ALTER TABLE public.family DROP COLUMN IF EXISTS restrict_deletion;
ALTER TABLE public.family DROP COLUMN IF EXISTS hide_income;
ALTER TABLE public.family DROP COLUMN IF EXISTS created_by;
-- +goose StatementEnd
