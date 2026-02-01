-- +goose Up
-- +goose StatementBegin
ALTER TABLE public.recurring_transactions
ADD COLUMN IF NOT EXISTS start_date DATE NOT NULL DEFAULT CURRENT_DATE,
ADD COLUMN IF NOT EXISTS end_date DATE,
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.transaction_categories(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS wallet_id UUID REFERENCES public.wallets(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE;

CREATE INDEX IF NOT EXISTS idx_recurring_category_id ON public.recurring_transactions(category_id);
CREATE INDEX IF NOT EXISTS idx_recurring_wallet_id ON public.recurring_transactions(wallet_id);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE public.recurring_transactions
DROP COLUMN IF EXISTS start_date,
DROP COLUMN IF EXISTS end_date,
DROP COLUMN IF EXISTS category_id,
DROP COLUMN IF EXISTS wallet_id,
DROP COLUMN IF EXISTS description,
DROP COLUMN IF EXISTS is_active;
-- +goose StatementEnd
