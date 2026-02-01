-- +goose Up
-- +goose StatementBegin

-- Create Split Method Enum
CREATE TYPE public.enum_split_method AS ENUM (
    'EQUAL', 'PERCENTAGE', 'EXACT'
);

-- Create Expense Splits Table
CREATE TABLE public.expense_splits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID NOT NULL REFERENCES public.transactions(id) ON DELETE CASCADE,
    total_amount NUMERIC(15,2) NOT NULL,
    split_method public.enum_split_method NOT NULL DEFAULT 'EQUAL',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create Split Participants Table
CREATE TABLE public.split_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    split_id UUID NOT NULL REFERENCES public.expense_splits(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL, -- Internal User
    contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL, -- External Contact (IOU)
    amount_owed NUMERIC(15,2) NOT NULL,
    amount_paid NUMERIC(15,2) NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'UNPAID', -- UNPAID, PARTIAL, SETTLED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    CONSTRAINT participant_check CHECK (user_id IS NOT NULL OR contact_id IS NOT NULL)
);

-- Create Split Settlements Table
CREATE TABLE public.split_settlements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_id UUID NOT NULL REFERENCES public.split_participants(id) ON DELETE CASCADE,
    transaction_id UUID REFERENCES public.transactions(id) ON DELETE SET NULL, -- Recording the payment
    amount NUMERIC(15,2) NOT NULL,
    settlement_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create Investment Valuations Table
CREATE TABLE public.investment_valuations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    investment_id UUID NOT NULL REFERENCES public.investments(id) ON DELETE CASCADE,
    price_per_unit NUMERIC(15,2) NOT NULL,
    valuation_date DATE NOT NULL,
    source TEXT, -- Manual, API, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create Attachments Table
CREATE TABLE public.attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID NOT NULL REFERENCES public.family(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_type TEXT, -- PDF, IMAGE, etc.
    file_size INTEGER,
    entity_type TEXT NOT NULL, -- TRANSACTION, INSURANCE, GOAL, etc.
    entity_id UUID NOT NULL, -- Polymorphic relation (manual check)
    uploaded_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create Debt Schedules Table (Amortization)
CREATE TABLE public.debt_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    debt_id UUID NOT NULL REFERENCES public.debts(id) ON DELETE CASCADE,
    installment_number INTEGER NOT NULL,
    due_date DATE NOT NULL,
    principal_amount NUMERIC(15,2) NOT NULL,
    interest_amount NUMERIC(15,2) NOT NULL,
    total_installment NUMERIC(15,2) NOT NULL,
    remaining_balance NUMERIC(15,2) NOT NULL,
    status TEXT DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create Indexes
CREATE INDEX idx_expense_splits_transaction ON public.expense_splits(transaction_id);
CREATE INDEX idx_split_participants_split ON public.split_participants(split_id);
CREATE INDEX idx_split_participants_user ON public.split_participants(user_id);
CREATE INDEX idx_split_participants_contact ON public.split_participants(contact_id);
CREATE INDEX idx_attachments_entity ON public.attachments(entity_type, entity_id);
CREATE INDEX idx_investment_valuations_inv ON public.investment_valuations(investment_id);

-- Triggers
CREATE TRIGGER tr_expense_splits_updated_at BEFORE UPDATE ON public.expense_splits FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER tr_split_participants_updated_at BEFORE UPDATE ON public.split_participants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS public.debt_schedules;
DROP TABLE IF EXISTS public.attachments;
DROP TABLE IF EXISTS public.investment_valuations;
DROP TABLE IF EXISTS public.split_settlements;
DROP TABLE IF EXISTS public.split_participants;
DROP TABLE IF EXISTS public.expense_splits;
DROP TYPE IF EXISTS public.enum_split_method;
-- +goose StatementEnd
