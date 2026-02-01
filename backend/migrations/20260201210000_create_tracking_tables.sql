-- +goose Up
-- +goose StatementBegin
-- 1. Recurring Transactions Execution History
CREATE TABLE IF NOT EXISTS public.recurring_instances (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    recurring_id uuid NOT NULL REFERENCES public.recurring_transactions(id) ON DELETE CASCADE,
    transaction_id uuid REFERENCES public.transactions(id) ON DELETE SET NULL,
    execution_date TIMESTAMP NOT NULL DEFAULT NOW(),
    status TEXT NOT NULL, -- SUCCESS, FAILED
    error_message TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 2. Goal Contributions
CREATE TABLE IF NOT EXISTS public.goal_contributions (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    goal_id uuid NOT NULL REFERENCES public.goals(id) ON DELETE CASCADE,
    transaction_id uuid REFERENCES public.transactions(id) ON DELETE SET NULL,
    amount NUMERIC NOT NULL,
    contribution_date TIMESTAMP NOT NULL DEFAULT NOW(),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 3. Debt Repayments
CREATE TABLE IF NOT EXISTS public.debt_repayments (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    debt_id uuid NOT NULL REFERENCES public.debts(id) ON DELETE CASCADE,
    transaction_id uuid REFERENCES public.transactions(id) ON DELETE SET NULL,
    amount NUMERIC NOT NULL,
    repayment_date TIMESTAMP NOT NULL DEFAULT NOW(),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 4. Investment Transactions
CREATE TYPE public.enum_investment_transaction_type AS ENUM ('BUY', 'SELL', 'DIVIDEND');

CREATE TABLE IF NOT EXISTS public.investment_transactions (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    investment_id uuid NOT NULL REFERENCES public.investments(id) ON DELETE CASCADE,
    transaction_id uuid REFERENCES public.transactions(id) ON DELETE SET NULL,
    type public.enum_investment_transaction_type NOT NULL,
    quantity NUMERIC NOT NULL,
    price_per_unit NUMERIC NOT NULL,
    transaction_date TIMESTAMP NOT NULL DEFAULT NOW(),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Triggers for auto-updating parent records (per TODO.md)

-- Trigger for Goals
CREATE OR REPLACE FUNCTION update_goal_amount()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE goals SET current_amount = current_amount + NEW.amount WHERE id = NEW.goal_id;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE goals SET current_amount = current_amount - OLD.amount WHERE id = OLD.goal_id;
    ELSIF (TG_OP = 'UPDATE') THEN
        UPDATE goals SET current_amount = current_amount - OLD.amount + NEW.amount WHERE id = NEW.goal_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_goal_amount
AFTER INSERT OR UPDATE OR DELETE ON goal_contributions
FOR EACH ROW EXECUTE FUNCTION update_goal_amount();

-- Trigger for Debts
CREATE OR REPLACE FUNCTION update_debt_amount()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE debts SET remaining_amount = remaining_amount - NEW.amount WHERE id = NEW.debt_id;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE debts SET remaining_amount = remaining_amount + OLD.amount WHERE id = OLD.debt_id;
    ELSIF (TG_OP = 'UPDATE') THEN
        UPDATE debts SET remaining_amount = remaining_amount + OLD.amount - NEW.amount WHERE id = NEW.debt_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_debt_amount
AFTER INSERT OR UPDATE OR DELETE ON debt_repayments
FOR EACH ROW EXECUTE FUNCTION update_debt_amount();

-- Trigger for Investments (Simplified for auto-calc quantity)
CREATE OR REPLACE FUNCTION update_investment_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        IF (NEW.type = 'BUY') THEN
            UPDATE investments 
            SET quantity = quantity + NEW.quantity,
                avg_buy_price = (avg_buy_price * quantity + NEW.price_per_unit * NEW.quantity) / (quantity + NEW.quantity)
            WHERE id = NEW.investment_id;
        ELSIF (NEW.type = 'SELL') THEN
            UPDATE investments SET quantity = quantity - NEW.quantity WHERE id = NEW.investment_id;
        END IF;
    -- Note: Scaling back on complex UPDATE/DELETE logic for avg_buy_price in triggers as it's hard to get right without full history re-calc.
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_investment_stats
AFTER INSERT ON investment_transactions
FOR EACH ROW EXECUTE FUNCTION update_investment_stats();

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TRIGGER IF EXISTS trg_update_investment_stats ON investment_transactions;
DROP FUNCTION IF EXISTS update_investment_stats();
DROP TRIGGER IF EXISTS trg_update_debt_amount ON debt_repayments;
DROP FUNCTION IF EXISTS update_debt_amount();
DROP TRIGGER IF EXISTS trg_update_goal_amount ON goal_contributions;
DROP FUNCTION IF EXISTS update_goal_amount();

DROP TABLE IF EXISTS public.investment_transactions;
DROP TYPE IF EXISTS public.enum_investment_transaction_type;
DROP TABLE IF EXISTS public.debt_repayments;
DROP TABLE IF EXISTS public.goal_contributions;
DROP TABLE IF EXISTS public.recurring_instances;
-- +goose StatementEnd
