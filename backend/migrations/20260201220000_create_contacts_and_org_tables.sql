-- +goose Up
-- +goose StatementBegin

-- 1. Contacts (Unified table for Vendors, Lenders, Employers, etc.)
CREATE TABLE IF NOT EXISTS public.contacts (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    family_id uuid NOT NULL,
    user_id uuid,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    address TEXT,
    type TEXT NOT NULL, -- VENDOR, LENDER, EMPLOYER, OTHER
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 2. Financial Institutions (Banks, Brokers)
CREATE TABLE IF NOT EXISTS public.financial_institutions (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    family_id uuid NOT NULL,
    name TEXT NOT NULL,
    code TEXT, -- Swift/IFSC
    website TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 3. Database Views for Contacts
CREATE OR REPLACE VIEW public.vendors AS SELECT * FROM public.contacts WHERE type = 'VENDOR';
CREATE OR REPLACE VIEW public.lenders AS SELECT * FROM public.contacts WHERE type = 'LENDER';
CREATE OR REPLACE VIEW public.income_sources AS SELECT * FROM public.contacts WHERE type = 'EMPLOYER';

-- 4. Tags and Semantic Organization
CREATE TABLE IF NOT EXISTS public.tags (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    family_id uuid NOT NULL,
    name TEXT NOT NULL,
    color TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(family_id, name)
);

CREATE TABLE IF NOT EXISTS public.entity_tags (
    entity_id uuid NOT NULL,
    tag_id uuid NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
    entity_type TEXT NOT NULL, -- TRANSACTION, DEBT, GOAL
    PRIMARY KEY (entity_id, tag_id, entity_type)
);

-- 5. Projects (Events, Trips)
CREATE TABLE IF NOT EXISTS public.projects (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    family_id uuid NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 6. Locations
CREATE TABLE IF NOT EXISTS public.locations (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    latitude NUMERIC,
    longitude NUMERIC,
    address TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 7. Schema Linking
ALTER TABLE public.transactions 
ADD COLUMN IF NOT EXISTS contact_id uuid REFERENCES public.contacts(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS location_id uuid REFERENCES public.locations(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS project_id uuid REFERENCES public.projects(id) ON DELETE SET NULL;

ALTER TABLE public.debts 
ADD COLUMN IF NOT EXISTS lender_contact_id uuid REFERENCES public.contacts(id) ON DELETE SET NULL;

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE public.debts DROP COLUMN IF EXISTS lender_contact_id;
ALTER TABLE public.transactions DROP COLUMN IF EXISTS project_id, DROP COLUMN IF EXISTS location_id, DROP COLUMN IF EXISTS contact_id;

DROP TABLE IF EXISTS public.locations;
DROP TABLE IF EXISTS public.projects;
DROP TABLE IF EXISTS public.entity_tags;
DROP TABLE IF EXISTS public.tags;
DROP VIEW IF EXISTS public.income_sources;
DROP VIEW IF EXISTS public.lenders;
DROP VIEW IF EXISTS public.vendors;
DROP TABLE IF EXISTS public.financial_institutions;
DROP TABLE IF EXISTS public.contacts;
-- +goose StatementEnd
