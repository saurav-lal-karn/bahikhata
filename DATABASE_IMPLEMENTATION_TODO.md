# BahiKhata - Database Implementation TODO

This document tracks the progress of the database schema enhancements and migration as outlined in the [ENTITY_RELATIONSHIP_DIAGRAM.md](../ENTITY_RELATIONSHIP_DIAGRAM.md).

## Phase 1: Critical Foundation (Week 1-2) - **PRIORITY: CRITICAL** [COMPLETED]
*Focus: Unifying individual financial records into a single transaction ledger.*

- [x] **Unified Schema Setup**
    - [x] Create `transaction_categories` table (Unified for income/expense)
    - [x] Create `transactions` table (Unified ledger replacing separate tables)
    - [x] Create `payment_methods` (already exists)
- [x] **Data Migration**
    - [x] Migrate existing `expenses` to `transactions` (set `type='EXPENSE'`)
    - [x] Migrate existing `income` to `transactions` (set `type='INCOME'`)
    - [x] Migrate `expense_categories` and `income_types` to `transaction_categories`
- [x] **Business Logic Updates**
    - [x] Update GORM models for `Transaction` and `TransactionCategory`
    - [x] Refactor Wallet balance calculation triggers/logic (Handled via unified service)
    - [x] Update all API services to point to the new unified tables
- [x] **Cleanup**
    - [x] Deprecate/Drop `expenses` and `income` tables
    - [x] Deprecate/Drop `expense_categories` and `income_types` tables

---

## Phase 2: Tracking Enhancements (Week 3-4) - **PRIORITY: HIGH** [COMPLETED]
*Focus: Adding historical tracking for debts, goals, investments, and recurring payments.*

- [x] **Recurring Transactions**
    - [x] Create `recurring_instances` table to track execution history
- [x] **Goal Management**
    - [x] Create `goal_contributions` table
    - [x] Implement trigger to auto-update `goals.current_amount`
- [x] **Debt Management**
    - [x] Create `debt_repayments` table
    - [x] Implement trigger to auto-update `debts.remaining_amount`
- [x] **Investment Tracking**
    - [x] Create `investment_transactions` table (Buy/Sell/Dividend)
    - [x] Implement logic/triggers for `avg_buy_price` and `quantity` calculation

---

## Phase 3: Analytics & Audit (Week 5-6) - **PRIORITY: HIGH** [COMPLETED]
*Focus: Transparency, performance optimization, and historical snapshots.*

- [x] **Audit System**
    - [x] Create `audit_logs` table (Partitioned by month)
    - [x] Implement audit logging middleware in the backend
- [x] **Snapshots & Summaries**
    - [x] Create `net_worth_snapshots` table
    - [x] Create `monthly_summaries` table (Pre-computed aggregates)
    - [x] Set up scheduled jobs (cron) for automatic snapshot generation
- [x] **Advanced Budgeting**
    - [x] Create `budget_periods` table (Tracking utilization per cycle)
    - [x] Create `budget_alerts` table

---

## Phase 4: Contacts & Organization (Week 7-8) - **PRIORITY: MEDIUM** [COMPLETED]
*Focus: Categorizing transactions by external entities, tags, and projects.*

- [x] **Entity Unified Contacts**
    - [x] Create `contacts` table (Unified Vendors, Lenders, Employers, etc.)
    - [x] Create `financial_institutions` table
    - [x] Create database views: `vendors`, `lenders`, `income_sources`
- [x] **Semantic Organization**
    - [x] Create `tags` and `entity_tags` tables (Flexible labeling)
    - [x] Create `projects` and `project_transactions` tables (Trip/Event grouping)
    - [x] Create `locations` table (Geo-tagging transactions)
- [x] **Schema Linking**
    - [x] Update `transactions` with `contact_id`, `location_id`, `project_id`
    - [x] Update `debts` with `lender_contact_id`

---

## Phase 5: Insurance & Subscriptions (Week 9-10) - **PRIORITY: MEDIUM**
*Focus: Dedicated modules for recurring life expenses.*

- [ ] **Insurance Module**
    - [ ] Create `insurance_policies` table
    - [ ] Create `insurance_premiums` table
    - [ ] Create `insurance_claims` table
- [ ] **Subscription Module**
    - [ ] Create `subscriptions` table (Detailed tracking)
    - [ ] Create `subscription_payments` table
    - [ ] Link Subscriptions to `recurring_transactions` for automation

---

## Phase 6: Split Expenses & Advanced Features (Week 11-12) - **PRIORITY: MEDIUM**
*Focus: Collaboration and specialized financial tools.*

- [ ] **Split Expenses (IOU)**
    - [ ] Create `expense_splits` table
    - [ ] Create `split_participants` table
    - [ ] Create `split_settlements` table
- [ ] **Advanced Tracking**
    - [ ] Create `investment_valuations` table (Price history)
    - [ ] Create `debt_schedule` table (Amortization)
    - [ ] Create `attachments` table (Generic file storage for receipts/documents)
    - [ ] Create `tax_summaries` table
- [ ] **System Refinement**
    - [ ] Implement manual/automatic Transaction Reconciliation logic
