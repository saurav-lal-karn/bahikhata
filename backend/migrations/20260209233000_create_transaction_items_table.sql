-- +goose Up
-- +goose StatementBegin
CREATE TABLE public.transaction_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID NOT NULL REFERENCES public.transactions(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    quantity NUMERIC(15,2) DEFAULT 1,
    unit_price NUMERIC(15,2) DEFAULT 0,
    amount NUMERIC(15,2) NOT NULL,
    category_id UUID REFERENCES public.transaction_categories(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Index for performance
CREATE INDEX idx_transaction_items_transaction_id ON public.transaction_items(transaction_id);

-- Trigger for updated_at
CREATE TRIGGER tr_transaction_items_updated_at BEFORE UPDATE ON public.transaction_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS public.transaction_items;
-- +goose StatementEnd
