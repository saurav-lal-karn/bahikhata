-- +goose Up
-- +goose StatementBegin
DO $$ BEGIN
    CREATE TYPE public.enum_recurring_frequency AS ENUM (
        'DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create update_updated_at_column function if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create Insurance Policy Types
DO $$ BEGIN
    CREATE TYPE public.enum_insurance_policy_type AS ENUM (
        'LIFE', 'HEALTH', 'MOTOR', 'TRAVEL', 'PROPERTY', 'OTHER'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create Insurance Policy Status
DO $$ BEGIN
    CREATE TYPE public.enum_insurance_policy_status AS ENUM (
        'ACTIVE', 'EXPIRED', 'LAPSED', 'CANCELLED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create Insurance Policies Table
CREATE TABLE IF NOT EXISTS public.insurance_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID NOT NULL REFERENCES public.family(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL, -- The Provider
    policy_name TEXT NOT NULL,
    policy_number TEXT,
    type public.enum_insurance_policy_type NOT NULL DEFAULT 'OTHER',
    status public.enum_insurance_policy_status NOT NULL DEFAULT 'ACTIVE',
    premium_amount NUMERIC(15,2) NOT NULL DEFAULT 0,
    premium_frequency public.enum_recurring_frequency NOT NULL DEFAULT 'MONTHLY',
    sum_assured NUMERIC(15,2) NOT NULL DEFAULT 0,
    start_date DATE NOT NULL,
    end_date DATE,
    next_due_date DATE,
    policy_document_id UUID, -- Link to generic attachments later
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create Insurance Premiums Table (Links to Transactions)
CREATE TABLE IF NOT EXISTS public.insurance_premiums (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_id UUID NOT NULL REFERENCES public.insurance_policies(id) ON DELETE CASCADE,
    transaction_id UUID REFERENCES public.transactions(id) ON DELETE SET NULL,
    amount NUMERIC(15,2) NOT NULL,
    due_date DATE NOT NULL,
    payment_date DATE,
    status TEXT DEFAULT 'PENDING', -- PENDING, PAID, OVERDUE
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create Insurance Claims Table
CREATE TABLE IF NOT EXISTS public.insurance_claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_id UUID NOT NULL REFERENCES public.insurance_policies(id) ON DELETE CASCADE,
    claim_number TEXT,
    amount_claimed NUMERIC(15,2) NOT NULL,
    amount_received NUMERIC(15,2),
    claim_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'SUBMITTED', -- SUBMITTED, IN_PROGRESS, SETTLED, REJECTED
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create Subscriptions Table
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID NOT NULL REFERENCES public.family(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    amount NUMERIC(15,2) NOT NULL,
    frequency public.enum_recurring_frequency NOT NULL DEFAULT 'MONTHLY',
    category_id UUID REFERENCES public.transaction_categories(id) ON DELETE SET NULL,
    wallet_id UUID REFERENCES public.wallets(id) ON DELETE SET NULL,
    next_billing_date DATE,
    start_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, PAUSED, CANCELLED
    recurring_transaction_id UUID REFERENCES public.recurring_transactions(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create Subscription Payments Table
CREATE TABLE IF NOT EXISTS public.subscription_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID NOT NULL REFERENCES public.subscriptions(id) ON DELETE CASCADE,
    transaction_id UUID NOT NULL REFERENCES public.transactions(id) ON DELETE CASCADE,
    billing_period_start DATE,
    billing_period_end DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_insurance_policies_family ON public.insurance_policies(family_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_family ON public.subscriptions(family_id);
CREATE INDEX IF NOT EXISTS idx_insurance_premiums_policy ON public.insurance_premiums(policy_id);
CREATE INDEX IF NOT EXISTS idx_subscription_payments_sub ON public.subscription_payments(subscription_id);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS tr_insurance_policies_updated_at ON public.insurance_policies;
CREATE TRIGGER tr_insurance_policies_updated_at BEFORE UPDATE ON public.insurance_policies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS tr_insurance_claims_updated_at ON public.insurance_claims;
CREATE TRIGGER tr_insurance_claims_updated_at BEFORE UPDATE ON public.insurance_claims FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS tr_subscriptions_updated_at ON public.subscriptions;
CREATE TRIGGER tr_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS public.subscription_payments;
DROP TABLE IF EXISTS public.subscriptions;
DROP TABLE IF EXISTS public.insurance_claims;
DROP TABLE IF EXISTS public.insurance_premiums;
DROP TABLE IF EXISTS public.insurance_policies;
DROP TYPE IF EXISTS public.enum_insurance_policy_status;
DROP TYPE IF EXISTS public.enum_insurance_policy_type;
-- recurring_frequency might be used by other tables now or later, so be careful dropping it. 
-- But if this migration created it, we should drop it unless IF EXISTS check protects it.
-- Since we used DO block to create it safe, dropping it might break others if they depend on it.
-- However, for correctness of Down, we usually drop what Up created.
-- Given 'enhance_recurring_transactions' might use it (it uses it in 'frequency' column), we should check dependency.
-- If we assume this migration ran first, we can drop it.

-- +goose StatementEnd