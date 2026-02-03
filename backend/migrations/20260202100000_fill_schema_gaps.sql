-- +goose Up
-- +goose StatementBegin

-- 1. Create Tax Summaries Table
CREATE TABLE IF NOT EXISTS public.tax_summaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID NOT NULL REFERENCES public.family(id) ON DELETE CASCADE,
    fiscal_year INT NOT NULL,
    total_income NUMERIC(15,2) NOT NULL DEFAULT 0,
    taxable_income NUMERIC(15,2) NOT NULL DEFAULT 0,
    total_deductions NUMERIC(15,2) NOT NULL DEFAULT 0,
    tax_liability NUMERIC(15,2) NOT NULL DEFAULT 0,
    tax_paid NUMERIC(15,2) NOT NULL DEFAULT 0,
    breakdown JSONB, -- detailed breakdown of tax calculations
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(family_id, fiscal_year)
);

-- 2. Create Contact Categories Junction Table
CREATE TABLE IF NOT EXISTS public.contact_categories (
    contact_id UUID NOT NULL REFERENCES public.contacts(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES public.transaction_categories(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    PRIMARY KEY (contact_id, category_id)
);

-- 3. Enhance Contacts Table
ALTER TABLE public.contacts
ADD COLUMN IF NOT EXISTS display_name TEXT,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS address_line1 TEXT,
ADD COLUMN IF NOT EXISTS address_line2 TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS postal_code TEXT,
ADD COLUMN IF NOT EXISTS country TEXT,
ADD COLUMN IF NOT EXISTS tax_id TEXT,
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS default_category_id UUID REFERENCES public.transaction_categories(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS default_wallet_id UUID REFERENCES public.wallets(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS metadata JSONB,
ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS created_by_id UUID REFERENCES public.users(id) ON DELETE SET NULL;

-- 4. Enhance Locations Table
ALTER TABLE public.locations
ADD COLUMN IF NOT EXISTS family_id UUID REFERENCES public.family(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS type TEXT, -- STORE, RESTAURANT, ONLINE, etc.
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS country TEXT,
ADD COLUMN IF NOT EXISTS postal_code TEXT,
ADD COLUMN IF NOT EXISTS google_place_id TEXT,
ADD COLUMN IF NOT EXISTS contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS transaction_count INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_visited TIMESTAMP WITH TIME ZONE;

-- Backfill family_id for locations if possible (optional, maybe set to a default or leave null if not critical)
-- For now, we allow nulls initially if data exists, but ideally it should be scoped. 
-- Since we don't know the family context for existing locations easily without more logic, we keep it nullable or rely on app logic.
-- However, the requirement says "ensure family_id for scoping". If table is empty, we can make it NOT NULL.
-- Let's check if we can enforce it later. For now, just add the column.

-- 5. Enhance Projects Table
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS type TEXT, -- EVENT, TRIP, RENOVATION, WEDDING
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'ACTIVE',
ADD COLUMN IF NOT EXISTS budget_amount NUMERIC(15,2),
ADD COLUMN IF NOT EXISTS spent_amount NUMERIC(15,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS icon TEXT,
ADD COLUMN IF NOT EXISTS color TEXT,
ADD COLUMN IF NOT EXISTS linked_goal_id UUID REFERENCES public.goals(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS created_by_id UUID REFERENCES public.users(id) ON DELETE SET NULL;

-- 6. Enhance Tags Table
ALTER TABLE public.tags
ADD COLUMN IF NOT EXISTS icon TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS usage_count INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_system BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS created_by_id UUID REFERENCES public.users(id) ON DELETE SET NULL;

-- 7. Enhance Subscriptions Table
ALTER TABLE public.subscriptions
ADD COLUMN IF NOT EXISTS vendor_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL;

-- 8. Enhance Entity Tags
-- entity_type check constraint might need update if implemented as check.
-- If it's just text, no change needed in DDL, but logic should handle SUBSCRIPTION, INSURANCE_POLICY, LOCATION.
-- Here we'll just ensure the column supports the values (it's TEXT, so it does).

-- Update timestamps trigger for tax_summaries
DROP TRIGGER IF EXISTS tr_tax_summaries_updated_at ON public.tax_summaries;
CREATE TRIGGER tr_tax_summaries_updated_at BEFORE UPDATE ON public.tax_summaries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE public.subscriptions DROP COLUMN IF EXISTS vendor_id;
ALTER TABLE public.tags 
    DROP COLUMN IF EXISTS created_by_id,
    DROP COLUMN IF EXISTS is_system,
    DROP COLUMN IF EXISTS usage_count,
    DROP COLUMN IF EXISTS description,
    DROP COLUMN IF EXISTS icon;
ALTER TABLE public.projects
    DROP COLUMN IF EXISTS created_by_id,
    DROP COLUMN IF EXISTS linked_goal_id,
    DROP COLUMN IF EXISTS color,
    DROP COLUMN IF EXISTS icon,
    DROP COLUMN IF EXISTS spent_amount,
    DROP COLUMN IF EXISTS budget_amount,
    DROP COLUMN IF EXISTS status,
    DROP COLUMN IF EXISTS type;
ALTER TABLE public.locations
    DROP COLUMN IF EXISTS last_visited,
    DROP COLUMN IF EXISTS transaction_count,
    DROP COLUMN IF EXISTS contact_id,
    DROP COLUMN IF EXISTS google_place_id,
    DROP COLUMN IF EXISTS postal_code,
    DROP COLUMN IF EXISTS country,
    DROP COLUMN IF EXISTS state,
    DROP COLUMN IF EXISTS city,
    DROP COLUMN IF EXISTS type,
    DROP COLUMN IF EXISTS family_id;
ALTER TABLE public.contacts
    DROP COLUMN IF EXISTS created_by_id,
    DROP COLUMN IF EXISTS is_favorite,
    DROP COLUMN IF EXISTS metadata,
    DROP COLUMN IF EXISTS default_wallet_id,
    DROP COLUMN IF EXISTS default_category_id,
    DROP COLUMN IF EXISTS notes,
    DROP COLUMN IF EXISTS tax_id,
    DROP COLUMN IF EXISTS country,
    DROP COLUMN IF EXISTS postal_code,
    DROP COLUMN IF EXISTS state,
    DROP COLUMN IF EXISTS city,
    DROP COLUMN IF EXISTS address_line2,
    DROP COLUMN IF EXISTS address_line1,
    DROP COLUMN IF EXISTS website,
    DROP COLUMN IF EXISTS display_name;
DROP TABLE IF EXISTS public.contact_categories;
DROP TABLE IF EXISTS public.tax_summaries;
-- +goose StatementEnd
