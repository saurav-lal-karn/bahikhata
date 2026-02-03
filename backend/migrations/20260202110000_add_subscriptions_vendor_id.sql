-- +goose Up
-- +goose StatementBegin
ALTER TABLE public.subscriptions
ADD COLUMN IF NOT EXISTS vendor_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_subscriptions_vendor_id ON public.subscriptions(vendor_id);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP INDEX IF EXISTS idx_subscriptions_vendor_id;
ALTER TABLE public.subscriptions DROP COLUMN IF EXISTS vendor_id;
-- +goose StatementEnd
