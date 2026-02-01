# BahiKhata - Entity Relationship & Database Diagram

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [Current State Analysis](#current-state-analysis)
3. [Identified Gaps](#identified-gaps)
4. [Enhanced Entity Relationship Diagram](#enhanced-entity-relationship-diagram)
5. [Database Schema Diagram](#database-schema-diagram)
6. [New Entities Proposed](#new-entities-proposed)
7. [Relationship Mapping](#relationship-mapping)
8. [Implementation Priority](#implementation-priority)

---

## Executive Summary

BahiKhata is a comprehensive family financial management platform. This document outlines the current entity structure, identifies relationship gaps, and proposes an enhanced architecture that properly links all financial operations for complete record-keeping.

### Core Domain Areas
- **Identity & Access**: Users, Families, Family Members
- **Financial Accounts**: Wallets, Bank Accounts, Credit Cards
- **Transactions**: Expenses, Income, Transfers
- **Contacts & Relationships**: Vendors, Lenders, Employers, Payees
- **Planning & Tracking**: Budgets, Goals, Recurring Transactions
- **Wealth Management**: Investments, Debts, Net Worth
- **Tax Management**: Tax Documents, Deductions
- **Organization**: Tags, Projects, Locations
- **Audit & Reporting**: Transaction Logs, Reports

---

## Current State Analysis

### Existing Entities (19 Core + 4 Supporting)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CURRENT STATE OVERVIEW                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────┐         ┌──────────────┐         ┌──────────┐                │
│   │  User   │◄────────│ FamilyMember │────────►│  Family  │                │
│   └────┬────┘         └──────────────┘         └────┬─────┘                │
│        │                                            │                       │
│        │ (loose coupling - issues identified)       │                       │
│        ▼                                            ▼                       │
│   ┌─────────────────────────────────────────────────────────────────┐      │
│   │                      FINANCIAL ENTITIES                          │      │
│   │  ┌────────┐  ┌────────┐  ┌──────┐  ┌────────┐  ┌──────────┐    │      │
│   │  │ Wallet │  │Expense │  │Income│  │ Budget │  │Investment│    │      │
│   │  └────────┘  └────────┘  └──────┘  └────────┘  └──────────┘    │      │
│   │  ┌────────┐  ┌────────┐  ┌──────┐  ┌────────────────────────┐  │      │
│   │  │  Debt  │  │  Goal  │  │ Tax  │  │ RecurringTransaction   │  │      │
│   │  └────────┘  └────────┘  └──────┘  └────────────────────────┘  │      │
│   └─────────────────────────────────────────────────────────────────┘      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Current Entity Details

| Entity | Description | Current Links |
|--------|-------------|---------------|
| User | Platform user | → Family (via FamilyMember) |
| Family | Household/group | ← Users (via FamilyMember) |
| FamilyMember | Junction table | → User, → Family |
| Wallet | Financial account | → WalletType, → User, → Family |
| WalletType | Account categories | → Family (optional) |
| WalletTransfer | Account transfers | → Wallet (from/to), → User, → Family |
| Expense | Money spent | → PaymentMethod, → ExpenseCategory |
| ExpenseCategory | Expense types | → Family (optional) |
| Income | Money received | → IncomeType, → Wallet (optional) |
| IncomeType | Income sources | → Family (optional) |
| Budget | Spending limits | → ExpenseCategory, → Family, → User |
| PaymentMethod | How payment made | → Family (optional) |
| Debt | Money owed | → Family, → User |
| Goal | Savings targets | → Family, → User |
| Investment | Assets held | → Family, → User |
| RecurringTransaction | Bills/subscriptions | → Family, → User |
| TaxDocument | Tax files | → Family, → User |
| TaxDeduction | Tax deductions | → Family, → User |

---

## Identified Gaps

### Critical Issues

```
┌────────────────────────────────────────────────────────────────────────────┐
│                         RELATIONSHIP GAPS                                   │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ❌ ISSUE 1: Expenses NOT linked to Wallets                                │
│     - Expenses use PaymentMethod but don't affect wallet balance           │
│     - No automatic balance tracking when expenses recorded                  │
│                                                                            │
│  ❌ ISSUE 2: Income-Wallet link is OPTIONAL                                │
│     - Income may not update wallet balance                                  │
│     - No clear money flow tracking                                         │
│                                                                            │
│  ❌ ISSUE 3: No Debt Repayment Tracking                                    │
│     - Debt has remaining_amount but no payment history                     │
│     - Can't track which wallet paid debt                                   │
│                                                                            │
│  ❌ ISSUE 4: No Investment Transaction History                             │
│     - Only tracks current state, not buy/sell history                      │
│     - Can't calculate cost basis properly                                  │
│                                                                            │
│  ❌ ISSUE 5: Goals have no Contribution Tracking                           │
│     - current_amount exists but no history                                 │
│     - Can't see contribution timeline                                      │
│                                                                            │
│  ❌ ISSUE 6: RecurringTransaction not linked to Generated Transactions     │
│     - No way to track which expenses came from recurring                   │
│     - Can't verify if bill was actually paid                               │
│                                                                            │
│  ❌ ISSUE 7: No Unified Transaction Ledger                                 │
│     - Expenses, Income, Transfers are separate                             │
│     - Hard to build complete transaction history                           │
│                                                                            │
│  ❌ ISSUE 8: No Audit Trail                                                │
│     - Can't track who changed what and when                                │
│     - Important for family financial transparency                          │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## Enhanced Entity Relationship Diagram

### Master ERD - Complete Financial Platform

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    BAHIKHATA - COMPLETE ERD                                              │
│                              Family Financial Record-Keeping Platform                                    │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────┘

                                    ┌─────────────────────┐
                                    │       FAMILY        │
                                    │─────────────────────│
                                    │ id (PK)             │
                                    │ name                │
                                    │ currency            │
                                    │ locale              │
                                    │ settings (JSONB)    │
                                    │ created_by (FK)     │
                                    └─────────┬───────────┘
                                              │
                           ┌──────────────────┼──────────────────┐
                           │                  │                  │
                           ▼                  ▼                  ▼
              ┌─────────────────────┐ ┌─────────────┐ ┌─────────────────────┐
              │    FAMILY_MEMBER    │ │    USER     │ │   FAMILY_SETTINGS   │
              │─────────────────────│ │─────────────│ │─────────────────────│
              │ id (PK)             │ │ id (PK)     │ │ id (PK)             │
              │ family_id (FK)      │ │ first_name  │ │ family_id (FK)      │
              │ user_id (FK)        │ │ last_name   │ │ budget_alerts       │
              │ role                │ │ email       │ │ weekly_report       │
              │ permissions (JSONB) │ │ password    │ │ notification_prefs  │
              │ created_by (FK)     │ │ avatar_url  │ └─────────────────────┘
              └─────────────────────┘ │ ...         │
                                      └──────┬──────┘
                                             │
            ┌────────────────────────────────┴────────────────────────────────┐
            │                           OWNED BY                              │
            ▼                              ▼                                  ▼
┌───────────────────────┐    ┌─────────────────────────┐    ┌───────────────────────┐
│        WALLET         │    │       TRANSACTION       │    │         GOAL          │
│───────────────────────│    │    (NEW - Unified)      │    │───────────────────────│
│ id (PK)               │    │─────────────────────────│    │ id (PK)               │
│ name                  │    │ id (PK)                 │    │ name                  │
│ wallet_type_id (FK)   │◄───│ wallet_id (FK)          │    │ target_amount         │
│ balance               │    │ type (ENUM)             │    │ current_amount        │
│ starting_balance      │    │ amount                  │    │ deadline              │
│ currency              │    │ category_id (FK)        │    │ linked_wallet_id (FK) │◄──┐
│ user_id (FK)          │    │ payment_method_id (FK)  │    │ family_id (FK)        │   │
│ family_id (FK)        │    │ description             │    │ user_id (FK)          │   │
│ is_active             │    │ transaction_date        │    └───────────────────────┘   │
│ credit_limit          │    │ family_id (FK)          │                                │
│ billing_cycle_day     │    │ user_id (FK)            │    ┌───────────────────────┐   │
│ linked_wallet_id (FK) │    │ created_by_id (FK)      │    │   GOAL_CONTRIBUTION   │   │
│ institution_name      │    │ recurring_id (FK)       │────│      (NEW)            │   │
└──────────┬────────────┘    │ transfer_ref_id         │    │───────────────────────│   │
           │                 │ tags (ARRAY)            │    │ id (PK)               │   │
           │                 │ attachments (JSONB)     │    │ goal_id (FK)          │   │
           │                 └────────────┬────────────┘    │ amount                │   │
           │                              │                 │ wallet_id (FK)        │───┘
           │                              │                 │ transaction_id (FK)   │
           │                              │                 │ contribution_date     │
           │                              │                 └───────────────────────┘
           │                              │
           ▼                              ▼
┌───────────────────────┐    ┌─────────────────────────┐
│     WALLET_TYPE       │    │   TRANSACTION_CATEGORY  │
│───────────────────────│    │       (UNIFIED)         │
│ id (PK)               │    │─────────────────────────│
│ name                  │    │ id (PK)                 │
│ description           │    │ name                    │
│ account_type (ENUM)   │    │ type (expense/income)   │
│  - BANK               │    │ parent_id (FK, self)    │
│  - CASH               │    │ icon                    │
│  - CREDIT_CARD        │    │ color                   │
│  - INVESTMENT         │    │ is_system               │
│  - LOAN               │    │ family_id (FK)          │
│  - DIGITAL_WALLET     │    │ budget_default          │
│ is_system             │    └─────────────────────────┘
│ family_id (FK)        │
└───────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                   DEBT MANAGEMENT                                        │
└─────────────────────────────────────────────────────────────────────────────────────────┘

┌───────────────────────┐         ┌─────────────────────────┐
│         DEBT          │         │    DEBT_REPAYMENT       │
│───────────────────────│         │        (NEW)            │
│ id (PK)               │◄────────│─────────────────────────│
│ lender                │         │ id (PK)                 │
│ total_amount          │         │ debt_id (FK)            │
│ remaining_amount      │         │ amount                  │
│ interest_rate         │         │ principal_amount        │
│ monthly_payment       │         │ interest_amount         │
│ start_date            │         │ payment_date            │
│ due_date              │         │ wallet_id (FK)          │
│ debt_type (ENUM)      │         │ transaction_id (FK)     │
│  - MORTGAGE           │         │ notes                   │
│  - PERSONAL_LOAN      │         └─────────────────────────┘
│  - CREDIT_CARD        │
│  - STUDENT_LOAN       │
│  - CAR_LOAN           │
│  - OTHER              │
│ linked_wallet_id (FK) │
│ family_id (FK)        │
│ user_id (FK)          │
└───────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                  INVESTMENT TRACKING                                     │
└─────────────────────────────────────────────────────────────────────────────────────────┘

┌───────────────────────┐         ┌─────────────────────────┐
│      INVESTMENT       │         │  INVESTMENT_TRANSACTION │
│───────────────────────│         │         (NEW)           │
│ id (PK)               │◄────────│─────────────────────────│
│ name                  │         │ id (PK)                 │
│ symbol/ticker         │         │ investment_id (FK)      │
│ type (ENUM)           │         │ type (BUY/SELL/DIVIDEND)│
│  - STOCK              │         │ quantity                │
│  - MUTUAL_FUND        │         │ price_per_unit          │
│  - ETF                │         │ total_amount            │
│  - BOND               │         │ fees                    │
│  - CRYPTO             │         │ transaction_date        │
│  - REAL_ESTATE        │         │ wallet_id (FK)          │
│  - GOLD               │         │ notes                   │
│  - PPF                │         └─────────────────────────┘
│  - FD                 │
│ quantity              │         ┌─────────────────────────┐
│ avg_buy_price         │         │  INVESTMENT_VALUATION   │
│ current_price         │         │         (NEW)           │
│ current_value         │         │─────────────────────────│
│ broker/platform       │         │ id (PK)                 │
│ account_number        │         │ investment_id (FK)      │
│ linked_wallet_id (FK) │         │ price                   │
│ family_id (FK)        │         │ valuation_date          │
│ user_id (FK)          │         │ source                  │
└───────────────────────┘         └─────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                  RECURRING & BUDGETS                                     │
└─────────────────────────────────────────────────────────────────────────────────────────┘

┌───────────────────────┐         ┌─────────────────────────┐
│ RECURRING_TRANSACTION │         │ RECURRING_INSTANCE      │
│───────────────────────│         │        (NEW)            │
│ id (PK)               │◄────────│─────────────────────────│
│ name                  │         │ id (PK)                 │
│ amount                │         │ recurring_id (FK)       │
│ frequency (ENUM)      │         │ scheduled_date          │
│  - DAILY              │         │ actual_date             │
│  - WEEKLY             │         │ status (ENUM)           │
│  - BIWEEKLY           │         │  - PENDING              │
│  - MONTHLY            │         │  - PAID                 │
│  - QUARTERLY          │         │  - SKIPPED              │
│  - YEARLY             │         │  - OVERDUE              │
│ type (ENUM)           │         │ transaction_id (FK)     │
│  - BILL               │         │ amount_paid             │
│  - SUBSCRIPTION       │         └─────────────────────────┘
│  - INCOME             │
│ next_due_date         │
│ category_id (FK)      │
│ wallet_id (FK)        │
│ auto_pay              │
│ reminder_days         │
│ family_id (FK)        │
│ user_id (FK)          │
└───────────────────────┘

┌───────────────────────┐         ┌─────────────────────────┐
│        BUDGET         │         │     BUDGET_ALERT        │
│───────────────────────│         │        (NEW)            │
│ id (PK)               │◄────────│─────────────────────────│
│ category_id (FK)      │         │ id (PK)                 │
│ amount_limit          │         │ budget_id (FK)          │
│ period (ENUM)         │         │ threshold_percent       │
│ alert_threshold       │         │ triggered_at            │
│ rollover_enabled      │         │ current_spent           │
│ rollover_amount       │         │ notification_sent       │
│ start_date            │         └─────────────────────────┘
│ family_id (FK)        │
│ user_id (FK)          │
└───────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                    AUDIT & TRACKING                                      │
└─────────────────────────────────────────────────────────────────────────────────────────┘

┌───────────────────────────────┐    ┌─────────────────────────┐
│        AUDIT_LOG (NEW)        │    │    NET_WORTH_SNAPSHOT   │
│───────────────────────────────│    │          (NEW)          │
│ id (PK)                       │    │─────────────────────────│
│ entity_type                   │    │ id (PK)                 │
│ entity_id                     │    │ family_id (FK)          │
│ action (CREATE/UPDATE/DELETE) │    │ user_id (FK)            │
│ old_values (JSONB)            │    │ snapshot_date           │
│ new_values (JSONB)            │    │ total_assets            │
│ changed_by_id (FK)            │    │ total_liabilities       │
│ changed_at                    │    │ net_worth               │
│ ip_address                    │    │ breakdown (JSONB)       │
│ user_agent                    │    │  - wallets              │
│ family_id (FK)                │    │  - investments          │
└───────────────────────────────┘    │  - debts                │
                                     │  - goals                │
                                     └─────────────────────────┘

┌───────────────────────────────┐
│      ATTACHMENT (NEW)         │
│───────────────────────────────│
│ id (PK)                       │
│ entity_type                   │
│ entity_id                     │
│ file_name                     │
│ file_url                      │
│ file_type                     │
│ file_size                     │
│ uploaded_by_id (FK)           │
│ family_id (FK)                │
└───────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 CONTACTS & RELATIONSHIPS ERD                                             │
│                         (Vendors, Lenders, Employers, Payees, etc.)                                     │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────┘

                                        ┌───────────────────────┐
                                        │       CONTACT         │
                                        │    (Unified Entity)   │
                                        │───────────────────────│
                                        │ id (PK)               │
                                        │ name                  │
                                        │ type (ENUM):          │
                                        │  • VENDOR             │
                                        │  • LENDER             │
                                        │  • EMPLOYER           │
                                        │  • PAYEE              │
                                        │  • BORROWER           │
                                        │  • SERVICE_PROVIDER   │
                                        │  • CLIENT             │
                                        │  • LANDLORD           │
                                        │  • TENANT             │
                                        │ email, phone          │
                                        │ address fields        │
                                        │ tax_id (GST/PAN)      │
                                        │ default_category_id   │
                                        │ default_wallet_id     │
                                        │ family_id (FK)        │
                                        └───────────┬───────────┘
                                                    │
                    ┌───────────────────────────────┼───────────────────────────────┐
                    │                               │                               │
                    ▼                               ▼                               ▼
    ┌───────────────────────────┐   ┌───────────────────────────┐   ┌───────────────────────────┐
    │    VENDOR (View)          │   │     LENDER (View)         │   │  INCOME_SOURCE (View)     │
    │───────────────────────────│   │───────────────────────────│   │───────────────────────────│
    │ WHERE type='VENDOR'       │   │ WHERE type='LENDER'       │   │ WHERE type='EMPLOYER'     │
    │                           │   │                           │   │                           │
    │ + total_spent             │   │ + total_borrowed          │   │ + total_income            │
    │ + transaction_count       │   │ + total_repaid            │   │ + income_count            │
    │ + last_transaction_date   │   │ + outstanding_balance     │   │ + avg_income              │
    │ + avg_transaction         │   │ + active_debts_count      │   │ + pay_frequency           │
    └───────────┬───────────────┘   └───────────┬───────────────┘   └───────────┬───────────────┘
                │                               │                               │
                ▼                               ▼                               ▼
    ┌───────────────────────────┐   ┌───────────────────────────┐   ┌───────────────────────────┐
    │     TRANSACTION           │   │         DEBT              │   │     TRANSACTION           │
    │    (Expenses)             │   │───────────────────────────│   │      (Income)             │
    │───────────────────────────│   │ lender_contact_id (FK)    │   │───────────────────────────│
    │ contact_id (FK)           │   │ Links debt to lender      │   │ contact_id (FK)           │
    │ Links expense to vendor   │   │ for tracking              │   │ Links income to employer  │
    └───────────────────────────┘   └───────────────────────────┘   └───────────────────────────┘


CONTACT RELATIONSHIPS WITH OTHER ENTITIES:
═══════════════════════════════════════════════════════════════════════════════════════════════════════════

┌─────────────┐         ┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│  CONTACT    │         │  CONTACT    │         │  CONTACT    │         │  CONTACT    │
│  (VENDOR)   │         │  (LENDER)   │         │  (EMPLOYER) │         │  (PAYEE)    │
└──────┬──────┘         └──────┬──────┘         └──────┬──────┘         └──────┬──────┘
       │                       │                       │                       │
       ▼                       ▼                       ▼                       ▼
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│  TRANSACTION    │   │     DEBT        │   │  TRANSACTION    │   │   RECURRING_    │
│  (Expenses)     │   │                 │   │  (Income)       │   │  TRANSACTION    │
├─────────────────┤   ├─────────────────┤   ├─────────────────┤   ├─────────────────┤
│ Where you spent │   │ Who you owe     │   │ Who paid you    │   │ Who you pay     │
│ your money      │   │ money to        │   │                 │   │ regularly       │
└─────────────────┘   └─────────────────┘   └─────────────────┘   └─────────────────┘
       │                       │                       │                       │
       ▼                       ▼                       ▼                       ▼
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              ANALYTICS ENABLED                                       │
├─────────────────────────────────────────────────────────────────────────────────────┤
│  📊 Vendor-wise spending   │  📊 Lender-wise debt    │  📊 Income by source        │
│  📊 Top merchants          │  📊 Interest by lender  │  📊 Salary vs freelance     │
│  📊 Vendor frequency       │  📊 Credit utilization  │  📊 Income diversification  │
└─────────────────────────────────────────────────────────────────────────────────────┘


ADDITIONAL CONTACT LINKS:
═══════════════════════════════════════════════════════════════════════════════════════════════════════════

┌───────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                                       │
│  CONTACT ◄─────── SUBSCRIPTION (vendor_id)                                                           │
│     │              └── Which service provider                                                         │
│     │                                                                                                 │
│  CONTACT ◄─────── INSURANCE_POLICY (provider_contact_id)                                             │
│     │              └── Which insurance company                                                        │
│     │                                                                                                 │
│  CONTACT ◄─────── LOCATION (contact_id)                                                              │
│     │              └── Link location to vendor/store                                                  │
│     │                                                                                                 │
│  CONTACT ◄─────── SPLIT_PARTICIPANTS (contact_id)                                                    │
│     │              └── Friends/external people in expense splits                                      │
│     │                                                                                                 │
│  CONTACT ◄─────── EXPENSE_SPLITS (paid_by_contact_id)                                                │
│                    └── When external person paid for group expense                                    │
│                                                                                                       │
└───────────────────────────────────────────────────────────────────────────────────────────────────────┘


ORGANIZATION ENTITIES ERD:
═══════════════════════════════════════════════════════════════════════════════════════════════════════════

                    ┌───────────────┐              ┌───────────────┐
                    │     TAGS      │              │   PROJECTS    │
                    │───────────────│              │───────────────│
                    │ id (PK)       │              │ id (PK)       │
                    │ name          │              │ name          │
                    │ color         │              │ type (EVENT,  │
                    │ icon          │              │  TRIP, etc.)  │
                    │ usage_count   │              │ budget_amount │
                    │ family_id     │              │ spent_amount  │
                    └───────┬───────┘              └───────┬───────┘
                            │                              │
                            ▼                              ▼
                    ┌───────────────┐              ┌───────────────────┐
                    │  ENTITY_TAGS  │              │PROJECT_TRANSACTIONS│
                    │───────────────│              │───────────────────│
                    │ tag_id (FK)   │              │ project_id (FK)   │
                    │ entity_type   │              │ transaction_id(FK)│
                    │ entity_id     │              │ allocation_amount │
                    └───────┬───────┘              └───────────────────┘
                            │                              
                            ▼                              
        ┌───────────────────────────────────────────────────────────────────┐
        │                    CAN TAG THESE ENTITIES                          │
        ├───────────────────────────────────────────────────────────────────┤
        │  transaction │ debt │ investment │ goal │ recurring │ contact    │
        │  project │ subscription │ insurance_policy │ location             │
        └───────────────────────────────────────────────────────────────────┘


                    ┌───────────────┐
                    │   LOCATIONS   │
                    │───────────────│
                    │ id (PK)       │
                    │ name          │
                    │ type (STORE,  │
                    │  RESTAURANT,  │
                    │  ONLINE, etc.)│
                    │ address       │
                    │ city, state   │
                    │ lat, lng      │
                    │ contact_id(FK)│◄──── Links to vendor
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────────┐
                    │    TRANSACTION    │
                    │ location_id (FK)  │
                    └───────────────────┘
```

---

## Database Schema Diagram

### Complete Database Schema with Relationships

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    DATABASE SCHEMA DIAGRAM                                               │
│                                    (PostgreSQL Compatible)                                               │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════════════════════════════════════
                                         CORE IDENTITY
═══════════════════════════════════════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────┐          ┌─────────────────────────────────┐
│            users                │          │            families             │
├─────────────────────────────────┤          ├─────────────────────────────────┤
│ id           UUID PK            │          │ id           UUID PK            │
│ first_name   VARCHAR(100)       │          │ name         VARCHAR(100) NN    │
│ last_name    VARCHAR(100)       │          │ currency     VARCHAR(3) = 'INR' │
│ user_name    VARCHAR(100) UQ    │          │ locale       VARCHAR(10)= 'en'  │
│ email        VARCHAR(255) UQ NN │          │ timezone     VARCHAR(50)        │
│ password     VARCHAR(255)       │◄─────────│ created_by   UUID FK            │
│ role         VARCHAR(20)='user' │          │ created_at   TIMESTAMP          │
│ avatar_url   TEXT               │          │ updated_at   TIMESTAMP          │
│ phone_number VARCHAR(20)        │          │ deleted_at   TIMESTAMP          │
│ country      VARCHAR(100)       │          └─────────────────────────────────┘
│ city         VARCHAR(100)       │                          │
│ state        VARCHAR(100)       │                          │
│ postal_code  VARCHAR(20)        │                          │
│ street       TEXT               │                          │
│ theme        VARCHAR(20)        │                          │
│ locale       VARCHAR(10)        │                          │
│ two_factor_enabled BOOLEAN      │                          │
│ email_verified     BOOLEAN      │                          │
│ email_verified_at  TIMESTAMP    │                          │
│ last_logged_in_at  TIMESTAMP    │                          │
│ created_at   TIMESTAMP          │                          │
│ updated_at   TIMESTAMP          │                          │
│ deleted_at   TIMESTAMP          │                          │
└─────────────────────────────────┘                          │
              │                                               │
              │              ┌────────────────────────────────┘
              │              │
              ▼              ▼
┌─────────────────────────────────────────────────────────────┐
│                      family_members                          │
├─────────────────────────────────────────────────────────────┤
│ id               UUID PK                                     │
│ family_id        UUID FK NN → families(id) ON DELETE CASCADE │
│ user_id          UUID FK NN → users(id) ON DELETE CASCADE    │
│ role             VARCHAR(20) = 'member'                      │
│ permissions      JSONB                                       │
│ created_by_user_id UUID FK → users(id)                       │
│ joined_at        TIMESTAMP                                   │
│ created_at       TIMESTAMP                                   │
│ updated_at       TIMESTAMP                                   │
│ deleted_at       TIMESTAMP                                   │
├─────────────────────────────────────────────────────────────┤
│ UNIQUE(family_id, user_id)                                   │
└─────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════════════════════════════════════
                                         FINANCIAL ACCOUNTS
═══════════════════════════════════════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────┐     ┌─────────────────────────────────┐
│         wallet_types            │     │           wallets               │
├─────────────────────────────────┤     ├─────────────────────────────────┤
│ id           UUID PK            │     │ id               UUID PK        │
│ name         VARCHAR(100) NN    │◄────│ wallet_type_id   UUID FK NN     │
│ description  TEXT               │     │ name             VARCHAR(100)NN │
│ account_type VARCHAR(30)        │     │ balance          DECIMAL(15,2)  │
│   CHECK IN ('BANK','CASH',      │     │ starting_balance DECIMAL(15,2)  │
│   'CREDIT_CARD','INVESTMENT',   │     │ currency         VARCHAR(3) NN  │
│   'LOAN','DIGITAL_WALLET')      │     │ description      TEXT           │
│ icon         VARCHAR(50)        │     │ institution_name VARCHAR(100)   │
│ color        VARCHAR(7)         │     │ account_number   VARCHAR(50)    │
│ is_system    BOOLEAN = false    │     │ credit_limit     DECIMAL(15,2)  │
│ family_id    UUID FK            │     │ billing_cycle_day INT           │
│ created_by_id UUID FK           │     │ is_active        BOOLEAN = true │
│ created_at   TIMESTAMP          │     │ user_id          UUID FK NN     │
│ updated_at   TIMESTAMP          │     │ family_id        UUID FK NN     │
│ deleted_at   TIMESTAMP          │     │ linked_wallet_id UUID FK (self) │
└─────────────────────────────────┘     │ created_at       TIMESTAMP      │
                                        │ updated_at       TIMESTAMP      │
                                        │ deleted_at       TIMESTAMP      │
                                        ├─────────────────────────────────┤
                                        │ IDX: (family_id, is_active)     │
                                        │ IDX: (user_id, wallet_type_id)  │
                                        └─────────────────────────────────┘
                                                       │
                                                       ▼
                                        ┌─────────────────────────────────┐
                                        │       wallet_transfers          │
                                        ├─────────────────────────────────┤
                                        │ id           UUID PK            │
                                        │ from_wallet_id UUID FK NN       │
                                        │ to_wallet_id   UUID FK NN       │
                                        │ amount       DECIMAL(15,2) NN   │
                                        │ exchange_rate DECIMAL(10,6)     │
                                        │ fees         DECIMAL(15,2)      │
                                        │ date         TIMESTAMP NN       │
                                        │ remarks      TEXT               │
                                        │ user_id      UUID FK NN         │
                                        │ family_id    UUID FK NN         │
                                        │ created_at   TIMESTAMP          │
                                        │ updated_at   TIMESTAMP          │
                                        │ deleted_at   TIMESTAMP          │
                                        └─────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════════════════════════════════════
                                    UNIFIED TRANSACTION SYSTEM
═══════════════════════════════════════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────┐     ┌─────────────────────────────────────────────────────────┐
│    transaction_categories       │     │                    transactions                          │
├─────────────────────────────────┤     ├─────────────────────────────────────────────────────────┤
│ id           UUID PK            │     │ id                 UUID PK                              │
│ name         VARCHAR(100) NN    │◄────│ category_id        UUID FK                              │
│ type         VARCHAR(10) NN     │     │ type               VARCHAR(20) NN                       │
│   CHECK IN ('expense','income') │     │   CHECK IN ('EXPENSE','INCOME','TRANSFER','ADJUSTMENT') │
│ parent_id    UUID FK (self)     │     │ wallet_id          UUID FK NN → wallets(id)             │
│ icon         VARCHAR(50)        │     │ amount             DECIMAL(15,2) NN                     │
│ color        VARCHAR(7)         │     │ running_balance    DECIMAL(15,2)                        │
│ is_system    BOOLEAN = false    │     │ description        TEXT                                 │
│ family_id    UUID FK            │     │ transaction_date   TIMESTAMP NN                         │
│ created_by_id UUID FK           │     │ payment_method_id  UUID FK                              │
│ sort_order   INT = 0            │     │ recurring_id       UUID FK → recurring_transactions     │
│ created_at   TIMESTAMP          │     │ transfer_pair_id   UUID FK (self) -- for transfers      │
│ updated_at   TIMESTAMP          │     │ reference_number   VARCHAR(100)                         │
│ deleted_at   TIMESTAMP          │     │ merchant_name      VARCHAR(200)                         │
├─────────────────────────────────┤     │ location           VARCHAR(200)                         │
│ IDX: (family_id, type)          │     │ tags               TEXT[]                               │
│ IDX: (parent_id)                │     │ is_reconciled      BOOLEAN = false                      │
└─────────────────────────────────┘     │ is_split           BOOLEAN = false                      │
                                        │ parent_transaction_id UUID FK (self)                    │
                                        │ user_id            UUID FK NN                           │
                                        │ family_id          UUID FK NN                           │
                                        │ created_by_id      UUID FK NN                           │
                                        │ created_at         TIMESTAMP                            │
                                        │ updated_at         TIMESTAMP                            │
                                        │ deleted_at         TIMESTAMP                            │
                                        ├─────────────────────────────────────────────────────────┤
                                        │ IDX: (family_id, transaction_date DESC)                 │
                                        │ IDX: (wallet_id, transaction_date DESC)                 │
                                        │ IDX: (category_id, family_id)                           │
                                        │ IDX: (recurring_id)                                     │
                                        │ IDX: (tags) USING GIN                                   │
                                        └─────────────────────────────────────────────────────────┘

┌─────────────────────────────────┐
│       payment_methods           │
├─────────────────────────────────┤
│ id           UUID PK            │
│ name         VARCHAR(100) NN    │
│ description  TEXT               │
│ icon         VARCHAR(50)        │
│ is_system    BOOLEAN = false    │
│ family_id    UUID FK            │
│ created_by_id UUID FK           │
│ created_at   TIMESTAMP          │
│ updated_at   TIMESTAMP          │
│ deleted_at   TIMESTAMP          │
└─────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════════════════════════════════════
                                         BUDGET MANAGEMENT
═══════════════════════════════════════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────┐     ┌─────────────────────────────────┐
│           budgets               │     │        budget_periods           │
├─────────────────────────────────┤     ├─────────────────────────────────┤
│ id           UUID PK            │◄────│ id           UUID PK            │
│ category_id  UUID FK NN         │     │ budget_id    UUID FK NN         │
│ amount_limit DECIMAL(15,2) NN   │     │ period_start DATE NN            │
│ period       VARCHAR(20) NN     │     │ period_end   DATE NN            │
│   CHECK IN ('WEEKLY','MONTHLY', │     │ allocated_amount DECIMAL(15,2)  │
│   'QUARTERLY','YEARLY')         │     │ spent_amount DECIMAL(15,2) = 0  │
│ alert_threshold DECIMAL(5,2)    │     │ rollover_from_previous DECIMAL  │
│ rollover_enabled BOOLEAN=false  │     │ created_at   TIMESTAMP          │
│ start_date   DATE               │     │ updated_at   TIMESTAMP          │
│ end_date     DATE               │     └─────────────────────────────────┘
│ is_active    BOOLEAN = true     │
│ user_id      UUID FK            │     ┌─────────────────────────────────┐
│ family_id    UUID FK            │     │        budget_alerts            │
│ created_at   TIMESTAMP          │◄────├─────────────────────────────────┤
│ updated_at   TIMESTAMP          │     │ id           UUID PK            │
│ deleted_at   TIMESTAMP          │     │ budget_id    UUID FK NN         │
├─────────────────────────────────┤     │ period_id    UUID FK            │
│ CHECK (family_id IS NOT NULL    │     │ alert_type   VARCHAR(20)        │
│   OR user_id IS NOT NULL)       │     │   ('THRESHOLD','EXCEEDED',      │
│ UNIQUE(category_id, period,     │     │    'APPROACHING')               │
│   family_id, user_id)           │     │ threshold_percent DECIMAL(5,2)  │
└─────────────────────────────────┘     │ spent_amount DECIMAL(15,2)      │
                                        │ triggered_at TIMESTAMP          │
                                        │ acknowledged BOOLEAN = false    │
                                        │ acknowledged_by UUID FK         │
                                        │ created_at   TIMESTAMP          │
                                        └─────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════════════════════════════════════
                                      RECURRING TRANSACTIONS
═══════════════════════════════════════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────┐     ┌─────────────────────────────────┐
│       recurring_transactions        │     │     recurring_instances         │
├─────────────────────────────────────┤     ├─────────────────────────────────┤
│ id             UUID PK              │◄────│ id           UUID PK            │
│ name           VARCHAR(200) NN      │     │ recurring_id UUID FK NN         │
│ amount         DECIMAL(15,2) NN     │     │ scheduled_date DATE NN          │
│ frequency      VARCHAR(20) NN       │     │ actual_date    DATE             │
│   CHECK IN ('DAILY','WEEKLY',       │     │ status       VARCHAR(20) NN     │
│   'BIWEEKLY','MONTHLY','QUARTERLY', │     │   CHECK IN ('PENDING','PAID',   │
│   'YEARLY')                         │     │   'SKIPPED','OVERDUE')          │
│ type           VARCHAR(20) NN       │     │ amount_paid  DECIMAL(15,2)      │
│   CHECK IN ('BILL','SUBSCRIPTION',  │     │ transaction_id UUID FK          │
│   'INCOME','SAVINGS')               │     │ notes        TEXT               │
│ transaction_type VARCHAR(10)        │     │ created_at   TIMESTAMP          │
│   CHECK IN ('EXPENSE','INCOME')     │     │ updated_at   TIMESTAMP          │
│ start_date     DATE NN              │     ├─────────────────────────────────┤
│ end_date       DATE                 │     │ IDX: (recurring_id, status)     │
│ next_due_date  DATE                 │     │ IDX: (scheduled_date)           │
│ last_processed DATE                 │     └─────────────────────────────────┘
│ category_id    UUID FK              │
│ wallet_id      UUID FK              │
│ payee          VARCHAR(200)         │
│ auto_create    BOOLEAN = false      │
│ reminder_days  INT = 3              │
│ is_active      BOOLEAN = true       │
│ user_id        UUID FK              │
│ family_id      UUID FK              │
│ created_at     TIMESTAMP            │
│ updated_at     TIMESTAMP            │
│ deleted_at     TIMESTAMP            │
├─────────────────────────────────────┤
│ CHECK (family_id IS NOT NULL        │
│   OR user_id IS NOT NULL)           │
└─────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════════════════════════════════════
                                         GOALS & SAVINGS
═══════════════════════════════════════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────┐     ┌─────────────────────────────────┐
│            goals                │     │      goal_contributions         │
├─────────────────────────────────┤     ├─────────────────────────────────┤
│ id           UUID PK            │◄────│ id           UUID PK            │
│ name         VARCHAR(200) NN    │     │ goal_id      UUID FK NN         │
│ description  TEXT               │     │ amount       DECIMAL(15,2) NN   │
│ target_amount DECIMAL(15,2) NN  │     │ wallet_id    UUID FK            │
│ current_amount DECIMAL(15,2)=0  │     │ transaction_id UUID FK          │
│ deadline     DATE               │     │ contribution_date DATE NN       │
│ icon_name    VARCHAR(50)        │     │ notes        TEXT               │
│ color        VARCHAR(7)         │     │ contributed_by UUID FK          │
│ priority     INT = 0            │     │ created_at   TIMESTAMP          │
│ status       VARCHAR(20)        │     │ updated_at   TIMESTAMP          │
│   CHECK IN ('ACTIVE','PAUSED',  │     ├─────────────────────────────────┤
│   'COMPLETED','CANCELLED')      │     │ IDX: (goal_id, contribution_date│
│ linked_wallet_id UUID FK        │     └─────────────────────────────────┘
│ auto_contribute BOOLEAN=false   │
│ contribute_amount DECIMAL(15,2) │
│ contribute_frequency VARCHAR(20)│
│ user_id      UUID FK            │
│ family_id    UUID FK            │
│ created_at   TIMESTAMP          │
│ updated_at   TIMESTAMP          │
│ deleted_at   TIMESTAMP          │
├─────────────────────────────────┤
│ CHECK (family_id IS NOT NULL    │
│   OR user_id IS NOT NULL)       │
└─────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════════════════════════════════════
                                         DEBT MANAGEMENT
═══════════════════════════════════════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────┐     ┌─────────────────────────────────┐
│            debts                │     │       debt_repayments           │
├─────────────────────────────────┤     ├─────────────────────────────────┤
│ id           UUID PK            │◄────│ id           UUID PK            │
│ lender       VARCHAR(200) NN    │     │ debt_id      UUID FK NN         │
│ debt_type    VARCHAR(30)        │     │ amount       DECIMAL(15,2) NN   │
│   CHECK IN ('MORTGAGE',         │     │ principal_amount DECIMAL(15,2)  │
│   'PERSONAL_LOAN','CREDIT_CARD',│     │ interest_amount DECIMAL(15,2)   │
│   'STUDENT_LOAN','CAR_LOAN',    │     │ payment_date DATE NN            │
│   'MEDICAL','OTHER')            │     │ wallet_id    UUID FK            │
│ total_amount DECIMAL(15,2) NN   │     │ transaction_id UUID FK          │
│ remaining_amount DECIMAL(15,2)  │     │ notes        TEXT               │
│ interest_rate DECIMAL(6,3)      │     │ created_at   TIMESTAMP          │
│ interest_type VARCHAR(20)       │     │ updated_at   TIMESTAMP          │
│   CHECK IN ('FIXED','VARIABLE', │     ├─────────────────────────────────┤
│   'COMPOUND')                   │     │ IDX: (debt_id, payment_date)    │
│ monthly_payment DECIMAL(15,2)   │     └─────────────────────────────────┘
│ start_date   DATE               │
│ due_date     DATE               │     ┌─────────────────────────────────┐
│ next_payment_date DATE          │     │     debt_schedule (NEW)         │
│ account_number VARCHAR(50)      │     ├─────────────────────────────────┤
│ linked_wallet_id UUID FK        │     │ id           UUID PK            │
│ status       VARCHAR(20)        │     │ debt_id      UUID FK NN         │
│   CHECK IN ('ACTIVE','PAID_OFF',│     │ due_date     DATE NN            │
│   'DEFAULT','RESTRUCTURED')     │     │ principal_due DECIMAL(15,2)     │
│ user_id      UUID FK            │     │ interest_due DECIMAL(15,2)      │
│ family_id    UUID FK            │     │ total_due    DECIMAL(15,2)      │
│ created_at   TIMESTAMP          │     │ is_paid      BOOLEAN = false    │
│ updated_at   TIMESTAMP          │     │ payment_id   UUID FK            │
│ deleted_at   TIMESTAMP          │     │ created_at   TIMESTAMP          │
├─────────────────────────────────┤     └─────────────────────────────────┘
│ CHECK (family_id IS NOT NULL    │
│   OR user_id IS NOT NULL)       │
└─────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════════════════════════════════════
                                        INVESTMENT TRACKING
═══════════════════════════════════════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────┐     ┌─────────────────────────────────────┐
│         investments             │     │      investment_transactions        │
├─────────────────────────────────┤     ├─────────────────────────────────────┤
│ id           UUID PK            │◄────│ id             UUID PK              │
│ name         VARCHAR(200) NN    │     │ investment_id  UUID FK NN           │
│ symbol       VARCHAR(20)        │     │ type           VARCHAR(20) NN       │
│ investment_type VARCHAR(30)     │     │   CHECK IN ('BUY','SELL','DIVIDEND',│
│   CHECK IN ('STOCK','MUTUAL_FUND│     │   'SPLIT','BONUS','REINVEST')       │
│   'ETF','BOND','CRYPTO',        │     │ quantity       DECIMAL(20,8)        │
│   'REAL_ESTATE','GOLD','PPF',   │     │ price_per_unit DECIMAL(15,4)        │
│   'FD','NPS','EPF','OTHER')     │     │ total_amount   DECIMAL(15,2) NN     │
│ quantity     DECIMAL(20,8) = 0  │     │ fees           DECIMAL(15,2) = 0    │
│ avg_buy_price DECIMAL(15,4)     │     │ taxes          DECIMAL(15,2) = 0    │
│ current_price DECIMAL(15,4)     │     │ transaction_date DATE NN            │
│ current_value DECIMAL(15,2)     │     │ wallet_id      UUID FK              │
│ broker       VARCHAR(100)       │     │ notes          TEXT                 │
│ account_number VARCHAR(50)      │     │ created_at     TIMESTAMP            │
│ linked_wallet_id UUID FK        │     │ updated_at     TIMESTAMP            │
│ maturity_date DATE              │     ├─────────────────────────────────────┤
│ interest_rate DECIMAL(6,3)      │     │ IDX: (investment_id, transaction_date│
│ user_id      UUID FK            │     └─────────────────────────────────────┘
│ family_id    UUID FK            │
│ created_at   TIMESTAMP          │     ┌─────────────────────────────────┐
│ updated_at   TIMESTAMP          │     │    investment_valuations        │
│ deleted_at   TIMESTAMP          │     ├─────────────────────────────────┤
├─────────────────────────────────┤     │ id           UUID PK            │
│ CHECK (family_id IS NOT NULL    │     │ investment_id UUID FK NN        │
│   OR user_id IS NOT NULL)       │     │ price        DECIMAL(15,4) NN   │
│ IDX: (family_id, investment_type│     │ valuation_date DATE NN          │
└─────────────────────────────────┘     │ source       VARCHAR(50)        │
                                        │ created_at   TIMESTAMP          │
                                        ├─────────────────────────────────┤
                                        │ UNIQUE(investment_id,           │
                                        │   valuation_date)               │
                                        └─────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════════════════════════════════════
                                         TAX MANAGEMENT
═══════════════════════════════════════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────┐     ┌─────────────────────────────────┐
│        tax_documents            │     │        tax_deductions           │
├─────────────────────────────────┤     ├─────────────────────────────────┤
│ id           UUID PK            │     │ id           UUID PK            │
│ family_id    UUID FK NN         │     │ family_id    UUID FK NN         │
│ user_id      UUID FK            │     │ user_id      UUID FK            │
│ name         VARCHAR(200) NN    │     │ name         VARCHAR(200) NN    │
│ category     VARCHAR(50)        │     │ category     VARCHAR(20) NN     │
│ document_type VARCHAR(50)       │     │   CHECK IN ('80C','80D','80E',  │
│ fiscal_year  VARCHAR(10) NN     │     │   '80G','80TTA','HRA','LTA',    │
│ file_url     TEXT               │     │   '80EE','80CCD','OTHER')       │
│ file_name    VARCHAR(255)       │     │ amount       DECIMAL(15,2) NN   │
│ file_size    BIGINT             │     │ max_limit    DECIMAL(15,2)      │
│ remarks      TEXT               │     │ fiscal_year  VARCHAR(10) NN     │
│ uploaded_by  UUID FK            │     │ proof_document_id UUID FK       │
│ created_at   TIMESTAMP          │     │ notes        TEXT               │
│ updated_at   TIMESTAMP          │     │ created_at   TIMESTAMP          │
│ deleted_at   TIMESTAMP          │     │ updated_at   TIMESTAMP          │
└─────────────────────────────────┘     │ deleted_at   TIMESTAMP          │
                                        └─────────────────────────────────┘

┌─────────────────────────────────┐
│       tax_summaries (NEW)       │
├─────────────────────────────────┤
│ id           UUID PK            │
│ family_id    UUID FK NN         │
│ user_id      UUID FK            │
│ fiscal_year  VARCHAR(10) NN     │
│ total_income DECIMAL(15,2)      │
│ taxable_income DECIMAL(15,2)    │
│ total_deductions DECIMAL(15,2)  │
│ tax_liability DECIMAL(15,2)     │
│ tax_paid     DECIMAL(15,2)      │
│ tax_refund   DECIMAL(15,2)      │
│ breakdown    JSONB              │
│ created_at   TIMESTAMP          │
│ updated_at   TIMESTAMP          │
└─────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════════════════════════════════════
                                      ANALYTICS & REPORTING
═══════════════════════════════════════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────┐     ┌─────────────────────────────────┐
│      net_worth_snapshots        │     │        monthly_summaries        │
├─────────────────────────────────┤     ├─────────────────────────────────┤
│ id           UUID PK            │     │ id           UUID PK            │
│ family_id    UUID FK NN         │     │ family_id    UUID FK NN         │
│ user_id      UUID FK            │     │ user_id      UUID FK            │
│ snapshot_date DATE NN           │     │ year_month   VARCHAR(7) NN      │
│ total_assets DECIMAL(15,2)      │     │ total_income DECIMAL(15,2)      │
│ total_liabilities DECIMAL(15,2) │     │ total_expenses DECIMAL(15,2)    │
│ net_worth    DECIMAL(15,2)      │     │ net_savings  DECIMAL(15,2)      │
│ breakdown    JSONB              │     │ savings_rate DECIMAL(5,2)       │
│   - wallet_totals               │     │ category_breakdown JSONB        │
│   - investment_totals           │     │ wallet_breakdown JSONB          │
│   - debt_totals                 │     │ created_at   TIMESTAMP          │
│   - goal_progress               │     │ updated_at   TIMESTAMP          │
│ created_at   TIMESTAMP          │     ├─────────────────────────────────┤
├─────────────────────────────────┤     │ UNIQUE(family_id, user_id,      │
│ UNIQUE(family_id, user_id,      │     │   year_month)                   │
│   snapshot_date)                │     └─────────────────────────────────┘
└─────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════════════════════════════════════
                                       AUDIT & ATTACHMENTS
═══════════════════════════════════════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────┐     ┌─────────────────────────────────┐
│            audit_logs               │     │          attachments            │
├─────────────────────────────────────┤     ├─────────────────────────────────┤
│ id           UUID PK                │     │ id           UUID PK            │
│ entity_type  VARCHAR(50) NN         │     │ entity_type  VARCHAR(50) NN     │
│ entity_id    UUID NN                │     │ entity_id    UUID NN            │
│ action       VARCHAR(20) NN         │     │ file_name    VARCHAR(255) NN    │
│   CHECK IN ('CREATE','UPDATE',      │     │ file_url     TEXT NN            │
│   'DELETE','VIEW','EXPORT')         │     │ file_type    VARCHAR(50)        │
│ old_values   JSONB                  │     │ file_size    BIGINT             │
│ new_values   JSONB                  │     │ uploaded_by_id UUID FK          │
│ changed_by_id UUID FK NN            │     │ family_id    UUID FK            │
│ changed_at   TIMESTAMP NN           │     │ created_at   TIMESTAMP          │
│ ip_address   INET                   │     │ deleted_at   TIMESTAMP          │
│ user_agent   TEXT                   │     ├─────────────────────────────────┤
│ family_id    UUID FK                │     │ IDX: (entity_type, entity_id)   │
│ request_id   UUID                   │     └─────────────────────────────────┘
├─────────────────────────────────────┤
│ IDX: (entity_type, entity_id)       │
│ IDX: (changed_by_id, changed_at)    │
│ IDX: (family_id, changed_at DESC)   │
│ PARTITION BY RANGE (changed_at)     │
└─────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════════════════════════════════════
                                      NOTIFICATIONS & CHAT
═══════════════════════════════════════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────┐     ┌─────────────────────────────────┐
│         notifications           │     │         chat_threads            │
├─────────────────────────────────┤     ├─────────────────────────────────┤
│ id           UUID PK            │     │ id           UUID PK            │
│ user_id      UUID FK NN         │     │ user_id      UUID FK NN         │
│ family_id    UUID FK            │     │ title        VARCHAR(200)       │
│ title        VARCHAR(200) NN    │     │ context_doc_id UUID             │
│ message      TEXT NN            │     │ created_at   TIMESTAMP          │
│ type         VARCHAR(30)        │     │ updated_at   TIMESTAMP          │
│   ('BUDGET_ALERT','BILL_DUE',   │     │ deleted_at   TIMESTAMP          │
│   'GOAL_ACHIEVED','SYSTEM')     │     └────────────────┬────────────────┘
│ priority     VARCHAR(10)        │                      │
│ status       VARCHAR(20)='unread│                      ▼
│ action_url   TEXT               │     ┌─────────────────────────────────┐
│ metadata     JSONB              │     │         chat_messages           │
│ read_at      TIMESTAMP          │     ├─────────────────────────────────┤
│ created_at   TIMESTAMP          │     │ id           UUID PK            │
│ updated_at   TIMESTAMP          │     │ thread_id    UUID FK NN         │
│ deleted_at   TIMESTAMP          │     │ role         VARCHAR(20) NN     │
├─────────────────────────────────┤     │ content      TEXT NN            │
│ IDX: (user_id, status)          │     │ tokens       BIGINT             │
│ IDX: (family_id, created_at)    │     │ created_at   TIMESTAMP          │
└─────────────────────────────────┘     │ updated_at   TIMESTAMP          │
                                        │ deleted_at   TIMESTAMP          │
                                        └─────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════════════════════════════════════
                                    CONTACTS & RELATIONSHIPS (NEW)
═══════════════════════════════════════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────┐     ┌─────────────────────────────────┐
│           contacts (NEW)            │     │      contact_categories         │
│   (Unified: Vendors, Lenders, etc)  │     │            (NEW)                │
├─────────────────────────────────────┤     ├─────────────────────────────────┤
│ id             UUID PK              │     │ id           UUID PK            │
│ name           VARCHAR(200) NN      │◄────│ contact_id   UUID FK NN         │
│ type           VARCHAR(30) NN       │     │ category_id  UUID FK NN         │
│   CHECK IN ('VENDOR','LENDER',      │     │ created_at   TIMESTAMP          │
│   'EMPLOYER','PAYEE','BORROWER',    │     └─────────────────────────────────┘
│   'CLIENT','TENANT','LANDLORD',     │
│   'SERVICE_PROVIDER','OTHER')       │
│ display_name   VARCHAR(200)         │
│ email          VARCHAR(255)         │
│ phone          VARCHAR(20)          │
│ website        TEXT                 │
│ address_line1  TEXT                 │
│ address_line2  TEXT                 │
│ city           VARCHAR(100)         │
│ state          VARCHAR(100)         │
│ postal_code    VARCHAR(20)          │
│ country        VARCHAR(100)         │
│ tax_id         VARCHAR(50)          │  -- GST/PAN for vendors
│ notes          TEXT                 │
│ is_favorite    BOOLEAN = false      │
│ is_active      BOOLEAN = true       │
│ default_category_id UUID FK         │  -- Default expense category
│ default_wallet_id UUID FK           │  -- Preferred payment wallet
│ metadata       JSONB                │  -- Flexible extra fields
│ family_id      UUID FK NN           │
│ created_by_id  UUID FK              │
│ created_at     TIMESTAMP            │
│ updated_at     TIMESTAMP            │
│ deleted_at     TIMESTAMP            │
├─────────────────────────────────────┤
│ UNIQUE(family_id, name, type)       │
│ IDX: (family_id, type)              │
│ IDX: (family_id, is_favorite)       │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐     ┌─────────────────────────────────┐
│        vendors (VIEW/Alias)         │     │        lenders (VIEW/Alias)     │
│  (Contacts WHERE type='VENDOR')     │     │  (Contacts WHERE type='LENDER') │
├─────────────────────────────────────┤     ├─────────────────────────────────┤
│ All vendor-specific fields from     │     │ All lender-specific fields from │
│ contacts table filtered by type     │     │ contacts table filtered by type │
│                                     │     │                                 │
│ Additional computed fields:         │     │ Additional computed fields:     │
│ - total_spent (from transactions)   │     │ - total_borrowed (from debts)   │
│ - transaction_count                 │     │ - total_repaid                  │
│ - last_transaction_date             │     │ - active_debts_count            │
│ - average_transaction_amount        │     │ - outstanding_balance           │
│ - favorite_categories               │     │ - relationship_since            │
└─────────────────────────────────────┘     └─────────────────────────────────┘

┌─────────────────────────────────────┐     ┌─────────────────────────────────┐
│     income_sources (VIEW/Alias)     │     │    financial_institutions       │
│ (Contacts WHERE type='EMPLOYER')    │     │            (NEW)                │
├─────────────────────────────────────┤     ├─────────────────────────────────┤
│ All employer-specific fields from   │     │ id           UUID PK            │
│ contacts table filtered by type     │     │ name         VARCHAR(200) NN    │
│                                     │     │ type         VARCHAR(30)        │
│ Additional computed fields:         │     │   CHECK IN ('BANK','NBFC',      │
│ - total_income (from transactions)  │     │   'CREDIT_UNION','BROKERAGE',   │
│ - income_count                      │     │   'INSURANCE','FINTECH','OTHER')│
│ - average_income                    │     │ short_name   VARCHAR(50)        │
│ - employment_type (metadata)        │     │ swift_code   VARCHAR(20)        │
│ - pay_frequency (metadata)          │     │ ifsc_prefix  VARCHAR(10)        │
└─────────────────────────────────────┘     │ logo_url     TEXT               │
                                            │ website      TEXT               │
                                            │ support_phone VARCHAR(20)       │
                                            │ support_email VARCHAR(255)      │
                                            │ is_system    BOOLEAN = false    │
                                            │ country      VARCHAR(100)       │
                                            │ family_id    UUID FK            │
                                            │ created_at   TIMESTAMP          │
                                            │ updated_at   TIMESTAMP          │
                                            │ deleted_at   TIMESTAMP          │
                                            └─────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════════════════════════════════════
                                    ORGANIZATION & TAGGING (NEW)
═══════════════════════════════════════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────┐     ┌─────────────────────────────────┐
│            tags (NEW)               │     │        entity_tags (NEW)        │
│    (Flexible labeling system)       │     │      (Junction table)           │
├─────────────────────────────────────┤     ├─────────────────────────────────┤
│ id           UUID PK                │◄────│ id           UUID PK            │
│ name         VARCHAR(100) NN        │     │ tag_id       UUID FK NN         │
│ color        VARCHAR(7)             │     │ entity_type  VARCHAR(50) NN     │
│ icon         VARCHAR(50)            │     │   ('transaction','debt',        │
│ description  TEXT                   │     │    'investment','goal',         │
│ usage_count  INT = 0                │     │    'recurring','contact')       │
│ is_system    BOOLEAN = false        │     │ entity_id    UUID NN            │
│ family_id    UUID FK NN             │     │ created_at   TIMESTAMP          │
│ created_by_id UUID FK               │     ├─────────────────────────────────┤
│ created_at   TIMESTAMP              │     │ UNIQUE(tag_id, entity_type,     │
│ updated_at   TIMESTAMP              │     │   entity_id)                    │
│ deleted_at   TIMESTAMP              │     │ IDX: (entity_type, entity_id)   │
├─────────────────────────────────────┤     └─────────────────────────────────┘
│ UNIQUE(family_id, name)             │
│ IDX: (family_id, usage_count DESC)  │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐     ┌─────────────────────────────────┐
│          projects (NEW)             │     │       project_transactions      │
│   (Group transactions by project)   │     │            (NEW)                │
├─────────────────────────────────────┤     ├─────────────────────────────────┤
│ id           UUID PK                │◄────│ id           UUID PK            │
│ name         VARCHAR(200) NN        │     │ project_id   UUID FK NN         │
│ description  TEXT                   │     │ transaction_id UUID FK NN       │
│ type         VARCHAR(30)            │     │ allocation_amount DECIMAL(15,2) │
│   CHECK IN ('EVENT','TRIP',         │     │ notes        TEXT               │
│   'RENOVATION','WEDDING','MEDICAL', │     │ created_at   TIMESTAMP          │
│   'EDUCATION','BUSINESS','OTHER')   │     ├─────────────────────────────────┤
│ status       VARCHAR(20) = 'ACTIVE' │     │ UNIQUE(project_id, transaction_id)
│   CHECK IN ('PLANNING','ACTIVE',    │     └─────────────────────────────────┘
│   'COMPLETED','CANCELLED','ON_HOLD')│
│ budget_amount DECIMAL(15,2)         │
│ spent_amount DECIMAL(15,2) = 0      │  -- Computed from transactions
│ start_date   DATE                   │
│ end_date     DATE                   │
│ icon         VARCHAR(50)            │
│ color        VARCHAR(7)             │
│ linked_goal_id UUID FK              │  -- Optional linked savings goal
│ family_id    UUID FK NN             │
│ created_by_id UUID FK               │
│ created_at   TIMESTAMP              │
│ updated_at   TIMESTAMP              │
│ deleted_at   TIMESTAMP              │
├─────────────────────────────────────┤
│ IDX: (family_id, status)            │
│ IDX: (family_id, type)              │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│          locations (NEW)            │
│   (Track where transactions happen) │
├─────────────────────────────────────┤
│ id           UUID PK                │
│ name         VARCHAR(200) NN        │
│ type         VARCHAR(30)            │
│   CHECK IN ('STORE','RESTAURANT',   │
│   'ONLINE','ATM','OFFICE','HOME',   │
│   'TRAVEL','OTHER')                 │
│ address      TEXT                   │
│ city         VARCHAR(100)           │
│ state        VARCHAR(100)           │
│ country      VARCHAR(100)           │
│ postal_code  VARCHAR(20)            │
│ latitude     DECIMAL(10,8)          │
│ longitude    DECIMAL(11,8)          │
│ google_place_id VARCHAR(100)        │
│ contact_id   UUID FK                │  -- Link to vendor/merchant
│ transaction_count INT = 0           │
│ last_visited TIMESTAMP              │
│ family_id    UUID FK NN             │
│ created_at   TIMESTAMP              │
│ updated_at   TIMESTAMP              │
│ deleted_at   TIMESTAMP              │
├─────────────────────────────────────┤
│ IDX: (family_id, city)              │
│ IDX: (contact_id)                   │
│ IDX: (latitude, longitude)          │
└─────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════════════════════════════════════
                                    INSURANCE & POLICIES (NEW)
═══════════════════════════════════════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────┐     ┌─────────────────────────────────┐
│      insurance_policies (NEW)       │     │    insurance_premiums (NEW)     │
├─────────────────────────────────────┤     ├─────────────────────────────────┤
│ id           UUID PK                │◄────│ id           UUID PK            │
│ policy_number VARCHAR(100) NN       │     │ policy_id    UUID FK NN         │
│ name         VARCHAR(200)           │     │ due_date     DATE NN            │
│ type         VARCHAR(30) NN         │     │ amount       DECIMAL(15,2) NN   │
│   CHECK IN ('LIFE','HEALTH','TERM', │     │ status       VARCHAR(20)        │
│   'VEHICLE','HOME','TRAVEL',        │     │   CHECK IN ('PENDING','PAID',   │
│   'ACCIDENT','CRITICAL_ILLNESS',    │     │   'OVERDUE','WAIVED')           │
│   'CHILD_PLAN','PENSION','OTHER')   │     │ payment_date DATE               │
│ provider     VARCHAR(200)           │     │ transaction_id UUID FK          │
│ provider_contact_id UUID FK         │  -- Link to contacts table            │ wallet_id    UUID FK            │
│ sum_assured  DECIMAL(15,2)          │     │ receipt_url  TEXT               │
│ premium_amount DECIMAL(15,2)        │     │ notes        TEXT               │
│ premium_frequency VARCHAR(20)       │     │ created_at   TIMESTAMP          │
│   CHECK IN ('MONTHLY','QUARTERLY',  │     │ updated_at   TIMESTAMP          │
│   'HALF_YEARLY','YEARLY','SINGLE')  │     └─────────────────────────────────┘
│ start_date   DATE NN                │
│ end_date     DATE                   │     ┌─────────────────────────────────┐
│ maturity_date DATE                  │     │    insurance_claims (NEW)       │
│ next_premium_date DATE              │     ├─────────────────────────────────┤
│ nominee      VARCHAR(200)           │     │ id           UUID PK            │
│ nominee_relation VARCHAR(50)        │     │ policy_id    UUID FK NN         │
│ insured_member_id UUID FK           │  -- Which family member is insured     │ claim_number VARCHAR(100)       │
│ status       VARCHAR(20)            │     │ claim_date   DATE NN            │
│   CHECK IN ('ACTIVE','LAPSED',      │     │ claim_amount DECIMAL(15,2)      │
│   'SURRENDERED','MATURED','CLAIMED')│     │ approved_amount DECIMAL(15,2)   │
│ surrender_value DECIMAL(15,2)       │     │ status       VARCHAR(20)        │
│ documents    JSONB                  │     │   CHECK IN ('SUBMITTED',        │
│ tax_benefit_section VARCHAR(20)     │  -- 80C, 80D, etc.                     │   'UNDER_REVIEW','APPROVED',    │
│ family_id    UUID FK NN             │     │   'REJECTED','SETTLED')         │
│ user_id      UUID FK                │     │ settlement_date DATE            │
│ created_at   TIMESTAMP              │     │ remarks      TEXT               │
│ updated_at   TIMESTAMP              │     │ documents    JSONB              │
│ deleted_at   TIMESTAMP              │     │ created_at   TIMESTAMP          │
├─────────────────────────────────────┤     │ updated_at   TIMESTAMP          │
│ UNIQUE(family_id, policy_number)    │     └─────────────────────────────────┘
│ IDX: (family_id, type, status)      │
│ IDX: (next_premium_date)            │
└─────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════════════════════════════════════
                                    SUBSCRIPTION MANAGEMENT (NEW)
═══════════════════════════════════════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────┐     ┌─────────────────────────────────┐
│        subscriptions (NEW)          │     │    subscription_payments (NEW)  │
│  (Detailed subscription tracking)   │     ├─────────────────────────────────┤
├─────────────────────────────────────┤     │ id           UUID PK            │
│ id           UUID PK                │◄────│ subscription_id UUID FK NN      │
│ name         VARCHAR(200) NN        │     │ billing_date DATE NN            │
│ description  TEXT                   │     │ amount       DECIMAL(15,2)      │
│ type         VARCHAR(30)            │     │ status       VARCHAR(20)        │
│   CHECK IN ('STREAMING','SOFTWARE', │     │   CHECK IN ('PENDING','PAID',   │
│   'NEWS','FITNESS','GAMING',        │     │   'FAILED','REFUNDED')          │
│   'CLOUD_STORAGE','EDUCATION',      │     │ transaction_id UUID FK          │
│   'MEMBERSHIP','SAAS','UTILITY',    │     │ failure_reason TEXT             │
│   'TELECOM','OTHER')                │     │ created_at   TIMESTAMP          │
│ vendor_id    UUID FK                │  -- Link to contacts table          │ updated_at   TIMESTAMP          │
│ amount       DECIMAL(15,2) NN       │     └─────────────────────────────────┘
│ currency     VARCHAR(3) = 'INR'     │
│ billing_cycle VARCHAR(20) NN        │
│   CHECK IN ('WEEKLY','MONTHLY',     │
│   'QUARTERLY','YEARLY','LIFETIME')  │
│ start_date   DATE NN                │
│ end_date     DATE                   │  -- NULL for ongoing
│ trial_end_date DATE                 │
│ next_billing_date DATE              │
│ last_billed_date DATE               │
│ status       VARCHAR(20)            │
│   CHECK IN ('ACTIVE','PAUSED',      │
│   'CANCELLED','EXPIRED','TRIAL')    │
│ auto_renew   BOOLEAN = true         │
│ cancellation_date DATE              │
│ cancel_reason TEXT                  │
│ wallet_id    UUID FK                │  -- Default payment wallet
│ category_id  UUID FK                │  -- Expense category
│ shared_with  UUID[]                 │  -- Family members sharing
│ login_email  VARCHAR(255)           │  -- Account email
│ account_url  TEXT                   │  -- Service login URL
│ notes        TEXT                   │
│ reminder_days INT = 3               │
│ recurring_id UUID FK                │  -- Link to recurring_transactions
│ family_id    UUID FK NN             │
│ user_id      UUID FK                │
│ created_at   TIMESTAMP              │
│ updated_at   TIMESTAMP              │
│ deleted_at   TIMESTAMP              │
├─────────────────────────────────────┤
│ IDX: (family_id, status)            │
│ IDX: (next_billing_date)            │
│ IDX: (vendor_id)                    │
└─────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════════════════════════════════════
                                    SPLIT EXPENSES (NEW)
═══════════════════════════════════════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────┐     ┌─────────────────────────────────┐
│      expense_splits (NEW)           │     │     split_settlements (NEW)     │
│  (Track shared expenses & IOUs)     │     ├─────────────────────────────────┤
├─────────────────────────────────────┤     │ id           UUID PK            │
│ id           UUID PK                │◄────│ split_id     UUID FK NN         │
│ transaction_id UUID FK NN           │     │ settled_amount DECIMAL(15,2)    │
│ total_amount DECIMAL(15,2) NN       │     │ settlement_date DATE NN         │
│ paid_by_user_id UUID FK NN          │     │ payment_method VARCHAR(50)      │
│ paid_by_contact_id UUID FK          │  -- If paid by external person       │ transaction_id UUID FK          │
│ split_type   VARCHAR(20)            │     │ notes        TEXT               │
│   CHECK IN ('EQUAL','PERCENTAGE',   │     │ created_at   TIMESTAMP          │
│   'EXACT_AMOUNTS','SHARES')         │     │ updated_at   TIMESTAMP          │
│ group_name   VARCHAR(100)           │  -- e.g., "Trip to Goa"            └─────────────────────────────────┘
│ is_settled   BOOLEAN = false        │
│ notes        TEXT                   │
│ family_id    UUID FK NN             │
│ created_at   TIMESTAMP              │
│ updated_at   TIMESTAMP              │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│     split_participants (NEW)        │
├─────────────────────────────────────┤
│ id           UUID PK                │
│ split_id     UUID FK NN             │
│ user_id      UUID FK                │  -- Family member
│ contact_id   UUID FK                │  -- External person (friend)
│ share_amount DECIMAL(15,2)          │
│ share_percentage DECIMAL(5,2)       │
│ is_paid      BOOLEAN = false        │
│ paid_amount  DECIMAL(15,2) = 0      │
│ notes        TEXT                   │
│ created_at   TIMESTAMP              │
│ updated_at   TIMESTAMP              │
├─────────────────────────────────────┤
│ CHECK (user_id IS NOT NULL OR       │
│   contact_id IS NOT NULL)           │
│ UNIQUE(split_id, user_id)           │
│ UNIQUE(split_id, contact_id)        │
└─────────────────────────────────────┘
```

---

## New Entities Proposed

### Summary of New Tables (27 New Tables)

#### Core Transaction & Tracking Tables
| # | Entity | Purpose | Priority |
|---|--------|---------|----------|
| 1 | `transactions` | Unified transaction ledger replacing separate expense/income | **Critical** |
| 2 | `transaction_categories` | Unified categories for both expense and income | **Critical** |
| 3 | `recurring_instances` | Track each instance of recurring transaction | **High** |
| 4 | `goal_contributions` | Track contributions to savings goals | **High** |
| 5 | `debt_repayments` | Track debt payment history | **High** |
| 6 | `debt_schedule` | Amortization schedule for debts | **Medium** |
| 7 | `investment_transactions` | Buy/sell/dividend history | **High** |
| 8 | `investment_valuations` | Historical price tracking | **Medium** |
| 9 | `budget_periods` | Track budget utilization per period | **High** |
| 10 | `budget_alerts` | Alert history for budgets | **Medium** |
| 11 | `net_worth_snapshots` | Historical net worth tracking | **High** |
| 12 | `monthly_summaries` | Pre-computed monthly aggregates | **Medium** |
| 13 | `audit_logs` | Complete change history | **High** |
| 14 | `attachments` | Receipt/document storage | **Medium** |
| 15 | `tax_summaries` | Tax computation summaries | **Low** |

#### Contacts & Relationships Tables (NEW)
| # | Entity | Purpose | Priority |
|---|--------|---------|----------|
| 16 | `contacts` | Unified entity for vendors, lenders, employers, payees | **Critical** |
| 17 | `contact_categories` | Link contacts to transaction categories | **Medium** |
| 18 | `financial_institutions` | Banks, NBFCs, brokerages for wallets/investments | **High** |

#### Organization & Tagging Tables (NEW)
| # | Entity | Purpose | Priority |
|---|--------|---------|----------|
| 19 | `tags` | Flexible labeling system for any entity | **High** |
| 20 | `entity_tags` | Junction table linking tags to entities | **High** |
| 21 | `projects` | Group transactions by project/event (wedding, trip, renovation) | **High** |
| 22 | `project_transactions` | Link transactions to projects | **High** |
| 23 | `locations` | Track where transactions happen (geo-tagging) | **Medium** |

#### Insurance & Policies Tables (NEW)
| # | Entity | Purpose | Priority |
|---|--------|---------|----------|
| 24 | `insurance_policies` | Track all insurance policies | **High** |
| 25 | `insurance_premiums` | Track premium payments | **High** |
| 26 | `insurance_claims` | Track claims history | **Medium** |

#### Subscription Management Tables (NEW)
| # | Entity | Purpose | Priority |
|---|--------|---------|----------|
| 27 | `subscriptions` | Detailed subscription tracking (Netflix, Spotify, etc.) | **High** |
| 28 | `subscription_payments` | Track each subscription payment | **High** |

#### Split Expenses Tables (NEW)
| # | Entity | Purpose | Priority |
|---|--------|---------|----------|
| 29 | `expense_splits` | Track shared expenses and IOUs | **High** |
| 30 | `split_participants` | Track who owes what in a split | **High** |
| 31 | `split_settlements` | Track settlements of splits | **High** |

### Detailed New Entity Definitions

#### 1. Unified Transaction System

The current system has separate `expenses` and `income` tables. This should be unified:

```sql
-- Replace expenses + income with unified transactions
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(20) NOT NULL CHECK (type IN ('EXPENSE', 'INCOME', 'TRANSFER', 'ADJUSTMENT')),
    wallet_id UUID NOT NULL REFERENCES wallets(id),
    amount DECIMAL(15,2) NOT NULL,
    running_balance DECIMAL(15,2),
    category_id UUID REFERENCES transaction_categories(id),
    payment_method_id UUID REFERENCES payment_methods(id),
    recurring_id UUID REFERENCES recurring_transactions(id),
    transfer_pair_id UUID REFERENCES transactions(id), -- For transfers, links the two sides
    
    -- Contact & Location linking (NEW)
    contact_id UUID REFERENCES contacts(id),  -- Vendor/Employer/Payee
    location_id UUID REFERENCES locations(id),  -- Where transaction happened
    project_id UUID REFERENCES projects(id),  -- Associated project/event
    
    description TEXT,
    merchant_name VARCHAR(200),  -- Quick entry without creating contact
    transaction_date TIMESTAMP NOT NULL,
    reference_number VARCHAR(100),
    tags TEXT[],
    is_reconciled BOOLEAN DEFAULT false,
    is_split BOOLEAN DEFAULT false,
    is_shared BOOLEAN DEFAULT false,  -- If expense is split with others
    parent_transaction_id UUID REFERENCES transactions(id), -- For split transactions
    user_id UUID REFERENCES users(id),
    family_id UUID REFERENCES families(id),
    created_by_id UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP,
    CONSTRAINT ownership_check CHECK (family_id IS NOT NULL OR user_id IS NOT NULL)
);

CREATE INDEX idx_transactions_contact ON transactions(contact_id);
CREATE INDEX idx_transactions_location ON transactions(location_id);
CREATE INDEX idx_transactions_project ON transactions(project_id);
```

#### 2. Goal Contributions

```sql
CREATE TABLE goal_contributions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    goal_id UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
    amount DECIMAL(15,2) NOT NULL,
    wallet_id UUID REFERENCES wallets(id),
    transaction_id UUID REFERENCES transactions(id),
    contribution_date DATE NOT NULL,
    notes TEXT,
    contributed_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Trigger to update goal.current_amount
CREATE FUNCTION update_goal_amount() RETURNS TRIGGER AS $$
BEGIN
    UPDATE goals SET current_amount = (
        SELECT COALESCE(SUM(amount), 0) FROM goal_contributions WHERE goal_id = NEW.goal_id
    ) WHERE id = NEW.goal_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

#### 3. Debt Repayments

```sql
CREATE TABLE debt_repayments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    debt_id UUID NOT NULL REFERENCES debts(id) ON DELETE CASCADE,
    amount DECIMAL(15,2) NOT NULL,
    principal_amount DECIMAL(15,2),
    interest_amount DECIMAL(15,2),
    payment_date DATE NOT NULL,
    wallet_id UUID REFERENCES wallets(id),
    transaction_id UUID REFERENCES transactions(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Trigger to update debt.remaining_amount
CREATE FUNCTION update_debt_remaining() RETURNS TRIGGER AS $$
BEGIN
    UPDATE debts SET remaining_amount = remaining_amount - NEW.principal_amount 
    WHERE id = NEW.debt_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

#### 4. Investment Transactions

```sql
CREATE TABLE investment_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    investment_id UUID NOT NULL REFERENCES investments(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('BUY', 'SELL', 'DIVIDEND', 'SPLIT', 'BONUS', 'REINVEST')),
    quantity DECIMAL(20,8),
    price_per_unit DECIMAL(15,4),
    total_amount DECIMAL(15,2) NOT NULL,
    fees DECIMAL(15,2) DEFAULT 0,
    taxes DECIMAL(15,2) DEFAULT 0,
    transaction_date DATE NOT NULL,
    wallet_id UUID REFERENCES wallets(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Trigger to recalculate investment quantity and avg_buy_price
```

#### 5. Recurring Instances

```sql
CREATE TABLE recurring_instances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recurring_id UUID NOT NULL REFERENCES recurring_transactions(id) ON DELETE CASCADE,
    scheduled_date DATE NOT NULL,
    actual_date DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' 
        CHECK (status IN ('PENDING', 'PAID', 'SKIPPED', 'OVERDUE')),
    amount_paid DECIMAL(15,2),
    transaction_id UUID REFERENCES transactions(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 6. Audit Logs

```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    action VARCHAR(20) NOT NULL CHECK (action IN ('CREATE', 'UPDATE', 'DELETE', 'VIEW', 'EXPORT')),
    old_values JSONB,
    new_values JSONB,
    changed_by_id UUID NOT NULL REFERENCES users(id),
    changed_at TIMESTAMP NOT NULL DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT,
    family_id UUID REFERENCES families(id),
    request_id UUID
) PARTITION BY RANGE (changed_at);

-- Create monthly partitions for efficient querying
```

#### 7. Contacts (Unified Vendors, Lenders, Employers, Payees)

```sql
-- Unified contacts table for all external parties
CREATE TABLE contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    type VARCHAR(30) NOT NULL CHECK (type IN (
        'VENDOR', 'LENDER', 'EMPLOYER', 'PAYEE', 'BORROWER',
        'CLIENT', 'TENANT', 'LANDLORD', 'SERVICE_PROVIDER', 'OTHER'
    )),
    display_name VARCHAR(200),
    email VARCHAR(255),
    phone VARCHAR(20),
    website TEXT,
    address_line1 TEXT,
    address_line2 TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100),
    tax_id VARCHAR(50),  -- GST/PAN number for vendors
    notes TEXT,
    is_favorite BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    default_category_id UUID REFERENCES transaction_categories(id),
    default_wallet_id UUID REFERENCES wallets(id),
    metadata JSONB,  -- Flexible extra fields per type
    family_id UUID NOT NULL REFERENCES families(id),
    created_by_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP,
    CONSTRAINT unique_contact UNIQUE(family_id, name, type)
);

CREATE INDEX idx_contacts_family_type ON contacts(family_id, type);
CREATE INDEX idx_contacts_favorites ON contacts(family_id, is_favorite) WHERE is_favorite = true;

-- Views for specific contact types
CREATE VIEW vendors AS
    SELECT c.*, 
           COALESCE(t.total_spent, 0) as total_spent,
           COALESCE(t.transaction_count, 0) as transaction_count,
           t.last_transaction_date
    FROM contacts c
    LEFT JOIN LATERAL (
        SELECT SUM(amount) as total_spent, 
               COUNT(*) as transaction_count,
               MAX(transaction_date) as last_transaction_date
        FROM transactions WHERE contact_id = c.id AND type = 'EXPENSE'
    ) t ON true
    WHERE c.type = 'VENDOR';

CREATE VIEW lenders AS
    SELECT c.*,
           COALESCE(d.total_borrowed, 0) as total_borrowed,
           COALESCE(d.total_repaid, 0) as total_repaid,
           COALESCE(d.active_debts, 0) as active_debts_count,
           COALESCE(d.outstanding, 0) as outstanding_balance
    FROM contacts c
    LEFT JOIN LATERAL (
        SELECT SUM(total_amount) as total_borrowed,
               SUM(total_amount - remaining_amount) as total_repaid,
               COUNT(*) FILTER (WHERE status = 'ACTIVE') as active_debts,
               SUM(remaining_amount) as outstanding
        FROM debts WHERE lender_contact_id = c.id
    ) d ON true
    WHERE c.type = 'LENDER';

CREATE VIEW income_sources AS
    SELECT c.*,
           COALESCE(i.total_income, 0) as total_income,
           COALESCE(i.income_count, 0) as income_count
    FROM contacts c
    LEFT JOIN LATERAL (
        SELECT SUM(amount) as total_income, COUNT(*) as income_count
        FROM transactions WHERE contact_id = c.id AND type = 'INCOME'
    ) i ON true
    WHERE c.type = 'EMPLOYER';
```

#### 8. Financial Institutions

```sql
CREATE TABLE financial_institutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    type VARCHAR(30) CHECK (type IN (
        'BANK', 'NBFC', 'CREDIT_UNION', 'BROKERAGE', 
        'INSURANCE', 'FINTECH', 'OTHER'
    )),
    short_name VARCHAR(50),
    swift_code VARCHAR(20),
    ifsc_prefix VARCHAR(10),  -- For Indian banks
    logo_url TEXT,
    website TEXT,
    support_phone VARCHAR(20),
    support_email VARCHAR(255),
    is_system BOOLEAN DEFAULT false,  -- System-provided institutions
    country VARCHAR(100) DEFAULT 'India',
    family_id UUID REFERENCES families(id),  -- NULL for system institutions
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);

-- Seed with common banks
INSERT INTO financial_institutions (name, short_name, type, ifsc_prefix, is_system) VALUES
    ('State Bank of India', 'SBI', 'BANK', 'SBIN', true),
    ('HDFC Bank', 'HDFC', 'BANK', 'HDFC', true),
    ('ICICI Bank', 'ICICI', 'BANK', 'ICIC', true),
    ('Axis Bank', 'Axis', 'BANK', 'UTIB', true),
    ('Kotak Mahindra Bank', 'Kotak', 'BANK', 'KKBK', true),
    ('Yes Bank', 'Yes', 'BANK', 'YESB', true),
    ('Punjab National Bank', 'PNB', 'BANK', 'PUNB', true),
    ('Bank of Baroda', 'BoB', 'BANK', 'BARB', true),
    ('Paytm Payments Bank', 'Paytm', 'FINTECH', NULL, true),
    ('Zerodha', 'Zerodha', 'BROKERAGE', NULL, true),
    ('Groww', 'Groww', 'BROKERAGE', NULL, true);
```

#### 9. Tags and Entity Tags

```sql
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    color VARCHAR(7) DEFAULT '#6B7280',  -- Default gray
    icon VARCHAR(50),
    description TEXT,
    usage_count INT DEFAULT 0,
    is_system BOOLEAN DEFAULT false,
    family_id UUID NOT NULL REFERENCES families(id),
    created_by_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP,
    CONSTRAINT unique_tag UNIQUE(family_id, name)
);

CREATE INDEX idx_tags_usage ON tags(family_id, usage_count DESC);

CREATE TABLE entity_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    entity_type VARCHAR(50) NOT NULL CHECK (entity_type IN (
        'transaction', 'debt', 'investment', 'goal', 
        'recurring', 'contact', 'project', 'subscription'
    )),
    entity_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT unique_entity_tag UNIQUE(tag_id, entity_type, entity_id)
);

CREATE INDEX idx_entity_tags_lookup ON entity_tags(entity_type, entity_id);

-- Trigger to update usage count
CREATE FUNCTION update_tag_usage() RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE tags SET usage_count = usage_count + 1 WHERE id = NEW.tag_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE tags SET usage_count = usage_count - 1 WHERE id = OLD.tag_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tag_usage_trigger
AFTER INSERT OR DELETE ON entity_tags
FOR EACH ROW EXECUTE FUNCTION update_tag_usage();
```

#### 10. Projects

```sql
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    type VARCHAR(30) CHECK (type IN (
        'EVENT', 'TRIP', 'RENOVATION', 'WEDDING', 'MEDICAL',
        'EDUCATION', 'BUSINESS', 'VEHICLE', 'OTHER'
    )),
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN (
        'PLANNING', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'ON_HOLD'
    )),
    budget_amount DECIMAL(15,2),
    spent_amount DECIMAL(15,2) DEFAULT 0,  -- Computed from transactions
    income_amount DECIMAL(15,2) DEFAULT 0, -- For projects with income (rental)
    start_date DATE,
    end_date DATE,
    icon VARCHAR(50),
    color VARCHAR(7),
    linked_goal_id UUID REFERENCES goals(id),  -- Optional savings goal
    family_id UUID NOT NULL REFERENCES families(id),
    created_by_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);

CREATE INDEX idx_projects_family_status ON projects(family_id, status);
CREATE INDEX idx_projects_family_type ON projects(family_id, type);

CREATE TABLE project_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    allocation_amount DECIMAL(15,2),  -- If only part of transaction is for this project
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT unique_project_transaction UNIQUE(project_id, transaction_id)
);

-- Trigger to update project spent_amount
CREATE FUNCTION update_project_amounts() RETURNS TRIGGER AS $$
BEGIN
    UPDATE projects SET 
        spent_amount = (
            SELECT COALESCE(SUM(COALESCE(pt.allocation_amount, t.amount)), 0)
            FROM project_transactions pt
            JOIN transactions t ON t.id = pt.transaction_id
            WHERE pt.project_id = COALESCE(NEW.project_id, OLD.project_id)
            AND t.type = 'EXPENSE'
        ),
        income_amount = (
            SELECT COALESCE(SUM(COALESCE(pt.allocation_amount, t.amount)), 0)
            FROM project_transactions pt
            JOIN transactions t ON t.id = pt.transaction_id
            WHERE pt.project_id = COALESCE(NEW.project_id, OLD.project_id)
            AND t.type = 'INCOME'
        )
    WHERE id = COALESCE(NEW.project_id, OLD.project_id);
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER project_amounts_trigger
AFTER INSERT OR UPDATE OR DELETE ON project_transactions
FOR EACH ROW EXECUTE FUNCTION update_project_amounts();
```

#### 11. Locations

```sql
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    type VARCHAR(30) CHECK (type IN (
        'STORE', 'RESTAURANT', 'ONLINE', 'ATM', 'OFFICE',
        'HOME', 'TRAVEL', 'HOSPITAL', 'SCHOOL', 'OTHER'
    )),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    google_place_id VARCHAR(100),
    contact_id UUID REFERENCES contacts(id),  -- Link to vendor/merchant
    transaction_count INT DEFAULT 0,
    total_spent DECIMAL(15,2) DEFAULT 0,
    last_visited TIMESTAMP,
    family_id UUID NOT NULL REFERENCES families(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);

CREATE INDEX idx_locations_family_city ON locations(family_id, city);
CREATE INDEX idx_locations_contact ON locations(contact_id);
CREATE INDEX idx_locations_geo ON locations(latitude, longitude);
```

#### 12. Insurance Policies

```sql
CREATE TABLE insurance_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_number VARCHAR(100) NOT NULL,
    name VARCHAR(200),
    type VARCHAR(30) NOT NULL CHECK (type IN (
        'LIFE', 'HEALTH', 'TERM', 'VEHICLE', 'HOME', 'TRAVEL',
        'ACCIDENT', 'CRITICAL_ILLNESS', 'CHILD_PLAN', 'PENSION', 'OTHER'
    )),
    provider VARCHAR(200),
    provider_contact_id UUID REFERENCES contacts(id),
    sum_assured DECIMAL(15,2),
    premium_amount DECIMAL(15,2),
    premium_frequency VARCHAR(20) CHECK (premium_frequency IN (
        'MONTHLY', 'QUARTERLY', 'HALF_YEARLY', 'YEARLY', 'SINGLE'
    )),
    start_date DATE NOT NULL,
    end_date DATE,
    maturity_date DATE,
    next_premium_date DATE,
    nominee VARCHAR(200),
    nominee_relation VARCHAR(50),
    insured_member_id UUID REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN (
        'ACTIVE', 'LAPSED', 'SURRENDERED', 'MATURED', 'CLAIMED'
    )),
    surrender_value DECIMAL(15,2),
    documents JSONB,  -- Array of document URLs
    tax_benefit_section VARCHAR(20),  -- 80C, 80D, etc.
    family_id UUID NOT NULL REFERENCES families(id),
    user_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP,
    CONSTRAINT unique_policy UNIQUE(family_id, policy_number)
);

CREATE INDEX idx_policies_family_type ON insurance_policies(family_id, type, status);
CREATE INDEX idx_policies_premium_date ON insurance_policies(next_premium_date) 
    WHERE status = 'ACTIVE';

CREATE TABLE insurance_premiums (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_id UUID NOT NULL REFERENCES insurance_policies(id) ON DELETE CASCADE,
    due_date DATE NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN (
        'PENDING', 'PAID', 'OVERDUE', 'WAIVED'
    )),
    payment_date DATE,
    transaction_id UUID REFERENCES transactions(id),
    wallet_id UUID REFERENCES wallets(id),
    receipt_url TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE insurance_claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_id UUID NOT NULL REFERENCES insurance_policies(id) ON DELETE CASCADE,
    claim_number VARCHAR(100),
    claim_date DATE NOT NULL,
    claim_amount DECIMAL(15,2),
    approved_amount DECIMAL(15,2),
    status VARCHAR(20) DEFAULT 'SUBMITTED' CHECK (status IN (
        'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'SETTLED'
    )),
    settlement_date DATE,
    remarks TEXT,
    documents JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 13. Subscriptions

```sql
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    type VARCHAR(30) CHECK (type IN (
        'STREAMING', 'SOFTWARE', 'NEWS', 'FITNESS', 'GAMING',
        'CLOUD_STORAGE', 'EDUCATION', 'MEMBERSHIP', 'SAAS',
        'UTILITY', 'TELECOM', 'OTHER'
    )),
    vendor_id UUID REFERENCES contacts(id),
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    billing_cycle VARCHAR(20) NOT NULL CHECK (billing_cycle IN (
        'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY', 'LIFETIME'
    )),
    start_date DATE NOT NULL,
    end_date DATE,  -- NULL for ongoing
    trial_end_date DATE,
    next_billing_date DATE,
    last_billed_date DATE,
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN (
        'ACTIVE', 'PAUSED', 'CANCELLED', 'EXPIRED', 'TRIAL'
    )),
    auto_renew BOOLEAN DEFAULT true,
    cancellation_date DATE,
    cancel_reason TEXT,
    wallet_id UUID REFERENCES wallets(id),
    category_id UUID REFERENCES transaction_categories(id),
    shared_with UUID[],  -- Family member IDs sharing this subscription
    login_email VARCHAR(255),
    account_url TEXT,
    notes TEXT,
    reminder_days INT DEFAULT 3,
    recurring_id UUID REFERENCES recurring_transactions(id),
    family_id UUID NOT NULL REFERENCES families(id),
    user_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);

CREATE INDEX idx_subscriptions_family_status ON subscriptions(family_id, status);
CREATE INDEX idx_subscriptions_billing ON subscriptions(next_billing_date) 
    WHERE status = 'ACTIVE';
CREATE INDEX idx_subscriptions_vendor ON subscriptions(vendor_id);

CREATE TABLE subscription_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
    billing_date DATE NOT NULL,
    amount DECIMAL(15,2),
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN (
        'PENDING', 'PAID', 'FAILED', 'REFUNDED'
    )),
    transaction_id UUID REFERENCES transactions(id),
    failure_reason TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 14. Expense Splits (Shared Expenses & IOUs)

```sql
CREATE TABLE expense_splits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    total_amount DECIMAL(15,2) NOT NULL,
    paid_by_user_id UUID REFERENCES users(id),  -- Family member who paid
    paid_by_contact_id UUID REFERENCES contacts(id),  -- External person who paid
    split_type VARCHAR(20) DEFAULT 'EQUAL' CHECK (split_type IN (
        'EQUAL', 'PERCENTAGE', 'EXACT_AMOUNTS', 'SHARES'
    )),
    group_name VARCHAR(100),  -- e.g., "Goa Trip", "Dinner with friends"
    is_settled BOOLEAN DEFAULT false,
    settlement_deadline DATE,
    notes TEXT,
    family_id UUID NOT NULL REFERENCES families(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT paid_by_check CHECK (
        paid_by_user_id IS NOT NULL OR paid_by_contact_id IS NOT NULL
    )
);

CREATE TABLE split_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    split_id UUID NOT NULL REFERENCES expense_splits(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),  -- Family member
    contact_id UUID REFERENCES contacts(id),  -- External person (friend)
    share_amount DECIMAL(15,2),
    share_percentage DECIMAL(5,2),
    share_units INT,  -- For shares-based splitting
    is_paid BOOLEAN DEFAULT false,
    paid_amount DECIMAL(15,2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT participant_check CHECK (
        user_id IS NOT NULL OR contact_id IS NOT NULL
    ),
    CONSTRAINT unique_user_split UNIQUE(split_id, user_id),
    CONSTRAINT unique_contact_split UNIQUE(split_id, contact_id)
);

CREATE TABLE split_settlements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    split_id UUID REFERENCES expense_splits(id),
    participant_id UUID NOT NULL REFERENCES split_participants(id) ON DELETE CASCADE,
    settled_amount DECIMAL(15,2) NOT NULL,
    settlement_date DATE NOT NULL,
    payment_method VARCHAR(50),  -- UPI, Cash, Bank Transfer
    reference_number VARCHAR(100),
    transaction_id UUID REFERENCES transactions(id),  -- If recorded as transaction
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Trigger to update participant paid status
CREATE FUNCTION update_split_settlement() RETURNS TRIGGER AS $$
BEGIN
    -- Update participant paid_amount and is_paid
    UPDATE split_participants 
    SET paid_amount = (
        SELECT COALESCE(SUM(settled_amount), 0) 
        FROM split_settlements 
        WHERE participant_id = NEW.participant_id
    ),
    is_paid = (
        SELECT COALESCE(SUM(settled_amount), 0) >= share_amount
        FROM split_settlements s
        JOIN split_participants p ON p.id = s.participant_id
        WHERE s.participant_id = NEW.participant_id
    )
    WHERE id = NEW.participant_id;
    
    -- Update expense_split is_settled
    UPDATE expense_splits SET is_settled = (
        SELECT bool_and(is_paid) FROM split_participants WHERE split_id = NEW.split_id
    ) WHERE id = (SELECT split_id FROM split_participants WHERE id = NEW.participant_id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER settlement_update_trigger
AFTER INSERT OR UPDATE ON split_settlements
FOR EACH ROW EXECUTE FUNCTION update_split_settlement();
```

---

## Relationship Mapping

### Complete Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                              COMPLETE RELATIONSHIP MAP                                                   │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────┘

LEGEND:
───────────────────────────────────────────────────────────────────────────────────────────────────────────
  ──────►  One-to-Many (FK on the "many" side)
  ◄──────► Many-to-Many (via junction table)
  - - - -► Optional relationship (nullable FK)
  ════════ Core relationship
  ────────  Supporting relationship
───────────────────────────────────────────────────────────────────────────────────────────────────────────


                                    ┌──────────────┐
                                    │    USER      │
                                    └──────┬───────┘
                                           │
          ┌────────────────────────────────┼────────────────────────────────┐
          │                                │                                │
          │                    ┌───────────┴───────────┐                    │
          │                    │     FAMILY_MEMBER     │                    │
          │                    └───────────┬───────────┘                    │
          │                                │                                │
          │                        ┌───────┴───────┐                        │
          │                        │    FAMILY     │                        │
          │                        └───────┬───────┘                        │
          │                                │                                │
          │          ┌─────────────────────┴─────────────────────┐          │
          │          │                                           │          │
          │          ▼                                           ▼          │
          │   ┌────────────┐                              ┌────────────┐    │
          │   │   WALLET   │════════════════════════════►│TRANSACTION │    │
          │   └─────┬──────┘                              └─────┬──────┘    │
          │         │                                           │          │
          │    ┌────┴────┐                               ┌──────┴──────┐   │
          │    ▼         ▼                               ▼             ▼   │
          │ WALLET   WALLET                          CATEGORY    PAYMENT   │
          │  TYPE   TRANSFER                                     METHOD    │
          │                                                                │
          │                                                                │
          │   ┌─────────────────────────────────────────────────────────┐  │
          │   │                    FINANCIAL MODULES                     │  │
          │   └─────────────────────────────────────────────────────────┘  │
          │         │              │              │              │         │
          │         ▼              ▼              ▼              ▼         │
          │    ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌───────────────┐│
          │    │ BUDGET  │   │  GOAL   │   │  DEBT   │   │  INVESTMENT   ││
          │    └────┬────┘   └────┬────┘   └────┬────┘   └───────┬───────┘│
          │         │             │             │                │        │
          │         ▼             ▼             ▼                ▼        │
          │    BUDGET        GOAL          DEBT             INVESTMENT   │
          │    PERIOD    CONTRIBUTION   REPAYMENT          TRANSACTION   │
          │    ALERT                    SCHEDULE           VALUATION     │
          │                                                               │
          │   ┌─────────────────────────────────────────────────────────┐ │
          │   │                    RECURRING MODULE                      │ │
          │   └─────────────────────────────────────────────────────────┘ │
          │                            │                                  │
          │                            ▼                                  │
          │                    RECURRING_TRANSACTION                      │
          │                            │                                  │
          │                            ▼                                  │
          │                   RECURRING_INSTANCE ──────► TRANSACTION      │
          │                                                               │
          └───────────────────────────────────────────────────────────────┘


DETAILED RELATIONSHIPS:
═══════════════════════════════════════════════════════════════════════════════════════════════════════════

CORE RELATIONSHIPS:
───────────────────────────────────────────────────────────────────────────────────────────────────────────

1. USER ◄──────► FAMILY (via FAMILY_MEMBER)
   - Users can belong to multiple families
   - Families have multiple members with roles (admin, member, viewer)

2. WALLET ──────► WALLET_TYPE
   - Each wallet has exactly one type
   - Types can be system-wide or family-specific

3. WALLET ──────► FINANCIAL_INSTITUTION (NEW)
   - Links wallet to bank/NBFC/brokerage
   - Enables bank-wise reporting

4. TRANSACTION ──────► WALLET
   - Every transaction MUST be linked to a wallet
   - Wallet balance is updated automatically

5. TRANSACTION ──────► CATEGORY
   - Transactions are categorized
   - Categories support hierarchy (parent_id)

6. TRANSACTION ──────► RECURRING_TRANSACTION
   - Optional: links to source recurring rule
   - Enables tracking of recurring payment execution

CONTACT RELATIONSHIPS (NEW):
───────────────────────────────────────────────────────────────────────────────────────────────────────────

7. TRANSACTION ──────► CONTACT (Vendor/Employer)
   - Links expense to vendor where money was spent
   - Links income to employer/source
   - Enables vendor-wise spending analysis

8. TRANSACTION ──────► LOCATION
   - Where the transaction occurred
   - Enables location-based spending patterns

9. DEBT ──────► CONTACT (Lender)
   - Links debt to the lender entity
   - Enables lender-wise debt tracking
   - Shows total borrowed per lender

10. RECURRING_TRANSACTION ──────► CONTACT (Payee)
    - Links bill/subscription to payee
    - Enables payee-wise recurring expense tracking

11. SUBSCRIPTION ──────► CONTACT (Vendor)
    - Links subscription to service provider
    - Enables vendor-wise subscription tracking

12. CONTACT ──────► TRANSACTION_CATEGORY
    - Default category for transactions with this contact
    - Auto-categorization based on vendor

ORGANIZATION RELATIONSHIPS (NEW):
───────────────────────────────────────────────────────────────────────────────────────────────────────────

13. TRANSACTION ──────► PROJECT
    - Group transactions by event/project
    - Enables project budget tracking

14. ANY ENTITY ──────► TAG (via ENTITY_TAGS)
    - Flexible tagging for any entity
    - Enables custom grouping and filtering

15. PROJECT ──────► GOAL
    - Optional: link project to savings goal
    - Track saving progress for projects

16. LOCATION ──────► CONTACT
    - Location can be linked to a vendor
    - Enables store-level tracking

FINANCIAL TRACKING RELATIONSHIPS:
───────────────────────────────────────────────────────────────────────────────────────────────────────────

17. BUDGET ──────► CATEGORY
    - Budgets are per category
    - One budget per category per period

18. BUDGET ──────► BUDGET_PERIOD
    - Tracks actual spending per period
    - Enables rollover functionality

19. GOAL ──────► GOAL_CONTRIBUTION
    - Multiple contributions per goal
    - Contributions can link to transactions

20. DEBT ──────► DEBT_REPAYMENT
    - Tracks all payments made
    - Updates remaining_amount automatically

21. DEBT ──────► DEBT_SCHEDULE
    - Pre-computed amortization schedule
    - Helps with payment planning

22. INVESTMENT ──────► INVESTMENT_TRANSACTION
    - All buy/sell/dividend history
    - Calculates avg_buy_price automatically

23. INVESTMENT ──────► INVESTMENT_VALUATION
    - Historical price tracking
    - Enables performance analysis

24. RECURRING_TRANSACTION ──────► RECURRING_INSTANCE
    - Each occurrence tracked separately
    - Links to actual transaction when paid

INSURANCE & SUBSCRIPTION RELATIONSHIPS (NEW):
───────────────────────────────────────────────────────────────────────────────────────────────────────────

25. INSURANCE_POLICY ──────► CONTACT (Provider)
    - Links policy to insurance company
    - Enables provider-wise policy tracking

26. INSURANCE_POLICY ──────► INSURANCE_PREMIUM
    - Tracks all premium payments
    - Auto-generates reminders

27. INSURANCE_POLICY ──────► INSURANCE_CLAIM
    - Tracks all claims history
    - Shows claim settlement status

28. SUBSCRIPTION ──────► SUBSCRIPTION_PAYMENT
    - Tracks all payments
    - Links to actual transactions

SPLIT EXPENSE RELATIONSHIPS (NEW):
───────────────────────────────────────────────────────────────────────────────────────────────────────────

29. TRANSACTION ──────► EXPENSE_SPLIT
    - Shared expenses with friends/family
    - IOU tracking

30. EXPENSE_SPLIT ──────► SPLIT_PARTICIPANT
    - Who owes what
    - Tracks individual settlements

31. SPLIT_PARTICIPANT ──────► CONTACT (Friend)
    - External participants in splits
    - Track IOUs with friends

32. SPLIT_PARTICIPANT ──────► SPLIT_SETTLEMENT
    - How splits were settled
    - Payment tracking

AUDIT & ATTACHMENT RELATIONSHIPS:
───────────────────────────────────────────────────────────────────────────────────────────────────────────

33. ALL ENTITIES ──────► AUDIT_LOG
    - Every change tracked
    - Full history for transparency

34. ALL ENTITIES ──────► ATTACHMENT
    - Receipts, documents, proofs
    - Generic attachment system
```

---

## Implementation Priority

### Phase 1: Critical Foundation (Week 1-2)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  PHASE 1: TRANSACTION UNIFICATION                                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. Create unified transactions table                                       │
│  2. Create unified transaction_categories table                             │
│  3. Migrate existing expenses to transactions (type='EXPENSE')              │
│  4. Migrate existing income to transactions (type='INCOME')                 │
│  5. Update wallet balance triggers                                          │
│  6. Update all services to use unified transaction system                   │
│                                                                             │
│  BREAKING CHANGES:                                                          │
│  - expenses table deprecated → transactions                                 │
│  - income table deprecated → transactions                                   │
│  - expense_categories + income_types merged → transaction_categories        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Phase 2: Tracking Enhancements (Week 3-4)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  PHASE 2: PAYMENT & CONTRIBUTION TRACKING                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. Create recurring_instances table                                        │
│  2. Create goal_contributions table                                         │
│  3. Create debt_repayments table                                            │
│  4. Create investment_transactions table                                    │
│  5. Add triggers for automatic calculations                                 │
│  6. Update services for new tracking                                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Phase 3: Analytics & Audit (Week 5-6)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  PHASE 3: ANALYTICS & AUDIT                                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. Create audit_logs table (partitioned)                                   │
│  2. Create net_worth_snapshots table                                        │
│  3. Create monthly_summaries table                                          │
│  4. Create budget_periods and budget_alerts tables                          │
│  5. Implement audit logging middleware                                      │
│  6. Create scheduled jobs for snapshots                                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Phase 4: Contacts & Organization (Week 7-8)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  PHASE 4: CONTACTS & RELATIONSHIPS                                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. Create contacts table (unified vendors, lenders, employers)             │
│  2. Create financial_institutions table                                     │
│  3. Create tags and entity_tags tables                                      │
│  4. Create projects and project_transactions tables                         │
│  5. Create locations table                                                  │
│  6. Update transactions table with contact_id, location_id, project_id      │
│  7. Update debts table with lender_contact_id                               │
│  8. Create contact views (vendors, lenders, income_sources)                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Phase 5: Insurance & Subscriptions (Week 9-10)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  PHASE 5: INSURANCE & SUBSCRIPTION MANAGEMENT                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. Create insurance_policies table                                         │
│  2. Create insurance_premiums table                                         │
│  3. Create insurance_claims table                                           │
│  4. Create subscriptions table                                              │
│  5. Create subscription_payments table                                      │
│  6. Link to recurring_transactions for auto-generation                      │
│  7. Create premium/subscription reminders                                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Phase 6: Split Expenses & Advanced Features (Week 11-12)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  PHASE 6: SPLIT EXPENSES & ADVANCED FEATURES                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. Create expense_splits table                                             │
│  2. Create split_participants table                                         │
│  3. Create split_settlements table                                          │
│  4. Create investment_valuations table                                      │
│  5. Create debt_schedule table                                              │
│  6. Create attachments table                                                │
│  7. Create tax_summaries table                                              │
│  8. Implement transaction reconciliation                                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Analytics & Insights Enabled

### With the new supporting entities, the platform can generate these powerful analytics:

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    ANALYTICS DASHBOARD CAPABILITIES                                      │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────┘

VENDOR ANALYTICS (from contacts + transactions):
───────────────────────────────────────────────────────────────────────────────────────────────────────────
  📊 Top 10 Vendors by Spending
  📊 Vendor-wise Monthly Spending Trend
  📊 Average Transaction Amount per Vendor
  📊 Most Frequent Vendors
  📊 Category-wise Vendor Distribution
  📊 New vs Returning Vendor Analysis
  📊 Vendor Loyalty Score (based on frequency)

LENDER ANALYTICS (from contacts + debts):
───────────────────────────────────────────────────────────────────────────────────────────────────────────
  📊 Lender-wise Outstanding Balance
  📊 Total Borrowed per Lender (Lifetime)
  📊 Interest Paid per Lender
  📊 Debt Distribution by Lender Type (Bank vs Personal)
  📊 Repayment History per Lender
  📊 Credit Utilization by Lender

INCOME SOURCE ANALYTICS (from contacts + transactions):
───────────────────────────────────────────────────────────────────────────────────────────────────────────
  📊 Income by Employer/Source
  📊 Monthly Income Trend per Source
  📊 Income Diversification Index
  📊 Primary vs Secondary Income Split
  📊 Freelance vs Salary Income Ratio

LOCATION ANALYTICS (from locations + transactions):
───────────────────────────────────────────────────────────────────────────────────────────────────────────
  📊 Spending Heatmap by City/Area
  📊 Top Spending Locations
  📊 Online vs Offline Spending Ratio
  📊 Spending by Location Type (Restaurant, Store, etc.)
  📊 Travel Expense Analysis

PROJECT/EVENT ANALYTICS (from projects + transactions):
───────────────────────────────────────────────────────────────────────────────────────────────────────────
  📊 Project Budget vs Actual Spending
  📊 Cost per Event Type (Wedding, Trip, etc.)
  📊 Project Timeline Analysis
  📊 Overspent vs Underspent Projects
  📊 Historical Event Cost Comparison

TAG-BASED ANALYTICS (from tags + entity_tags):
───────────────────────────────────────────────────────────────────────────────────────────────────────────
  📊 Spending by Custom Tags
  📊 Tag Cloud Visualization
  📊 Cross-Category Tag Analysis
  📊 Trending Tags by Month

INSURANCE ANALYTICS (from insurance_policies + premiums):
───────────────────────────────────────────────────────────────────────────────────────────────────────────
  📊 Total Insurance Coverage Summary
  📊 Premium Payment Calendar
  📊 Insurance by Type Distribution
  📊 Claim Success Rate
  📊 Tax Benefit Utilization (80C, 80D)
  📊 Policy Renewal Alerts

SUBSCRIPTION ANALYTICS (from subscriptions + payments):
───────────────────────────────────────────────────────────────────────────────────────────────────────────
  📊 Total Monthly Subscription Cost
  📊 Subscription by Category (Streaming, Software, etc.)
  📊 Unused/Underused Subscriptions (based on last use)
  📊 Subscription Cost Trend
  📊 Trial Expiration Alerts
  📊 Subscription per Family Member

SPLIT EXPENSE ANALYTICS (from expense_splits + settlements):
───────────────────────────────────────────────────────────────────────────────────────────────────────────
  📊 Outstanding IOUs Summary
  📊 Most Frequent Split Partners
  📊 Average Split Amount per Group
  📊 Settlement Time Analysis
  📊 You Owe vs Owed to You Balance

FINANCIAL INSTITUTION ANALYTICS (from financial_institutions + wallets):
───────────────────────────────────────────────────────────────────────────────────────────────────────────
  📊 Balance Distribution by Bank
  📊 Bank-wise Transaction Volume
  📊 Credit Card Utilization by Bank
  📊 Investment Platform Distribution
```

### Sample Dashboard Queries

```sql
-- Top 10 Vendors by Spending (Last 3 Months)
SELECT 
    c.name as vendor_name,
    COUNT(t.id) as transaction_count,
    SUM(t.amount) as total_spent,
    AVG(t.amount) as avg_transaction,
    MAX(t.transaction_date) as last_transaction
FROM transactions t
JOIN contacts c ON c.id = t.contact_id
WHERE t.type = 'EXPENSE'
  AND t.transaction_date >= NOW() - INTERVAL '3 months'
  AND t.family_id = :family_id
GROUP BY c.id, c.name
ORDER BY total_spent DESC
LIMIT 10;

-- Spending by Location City
SELECT 
    l.city,
    COUNT(t.id) as transaction_count,
    SUM(t.amount) as total_spent
FROM transactions t
JOIN locations l ON l.id = t.location_id
WHERE t.type = 'EXPENSE' AND t.family_id = :family_id
GROUP BY l.city
ORDER BY total_spent DESC;

-- Project Budget Utilization
SELECT 
    p.name,
    p.type,
    p.budget_amount,
    p.spent_amount,
    p.budget_amount - p.spent_amount as remaining,
    ROUND((p.spent_amount / NULLIF(p.budget_amount, 0)) * 100, 2) as utilization_pct,
    p.status
FROM projects p
WHERE p.family_id = :family_id
ORDER BY utilization_pct DESC;

-- Lender-wise Debt Summary
SELECT 
    c.name as lender_name,
    COUNT(d.id) as active_loans,
    SUM(d.total_amount) as total_borrowed,
    SUM(d.remaining_amount) as outstanding,
    SUM(d.total_amount - d.remaining_amount) as total_repaid
FROM debts d
JOIN contacts c ON c.id = d.lender_contact_id
WHERE d.status = 'ACTIVE' AND d.family_id = :family_id
GROUP BY c.id, c.name
ORDER BY outstanding DESC;

-- Subscription Cost by Category
SELECT 
    s.type as category,
    COUNT(*) as subscription_count,
    SUM(s.amount) as monthly_cost,
    STRING_AGG(s.name, ', ') as subscriptions
FROM subscriptions s
WHERE s.status = 'ACTIVE' AND s.family_id = :family_id
GROUP BY s.type
ORDER BY monthly_cost DESC;

-- Outstanding IOUs
SELECT 
    COALESCE(u.first_name || ' ' || u.last_name, c.name) as person,
    CASE 
        WHEN sp.user_id IS NOT NULL THEN 'Family Member'
        ELSE 'Friend'
    END as person_type,
    SUM(sp.share_amount - sp.paid_amount) as amount_owed
FROM split_participants sp
LEFT JOIN users u ON u.id = sp.user_id
LEFT JOIN contacts c ON c.id = sp.contact_id
JOIN expense_splits es ON es.id = sp.split_id
WHERE es.is_settled = false AND es.family_id = :family_id
GROUP BY sp.user_id, sp.contact_id, u.first_name, u.last_name, c.name
HAVING SUM(sp.share_amount - sp.paid_amount) > 0
ORDER BY amount_owed DESC;
```

---

## Migration Scripts Summary

### Required Migrations (in order)

```sql
-- PHASE 1: Core Transaction System
-- 001_create_transaction_categories.sql
-- 002_create_financial_institutions.sql
-- 003_create_contacts.sql
-- 004_create_locations.sql
-- 005_create_tags.sql
-- 006_create_entity_tags.sql
-- 007_create_projects.sql
-- 008_create_transactions.sql
-- 009_create_project_transactions.sql
-- 010_migrate_expenses_to_transactions.sql
-- 011_migrate_income_to_transactions.sql

-- PHASE 2: Payment & Contribution Tracking
-- 012_create_recurring_instances.sql
-- 013_create_goal_contributions.sql
-- 014_create_debt_repayments.sql
-- 015_create_debt_schedule.sql
-- 016_create_investment_transactions.sql
-- 017_create_investment_valuations.sql
-- 018_create_budget_periods.sql
-- 019_create_budget_alerts.sql

-- PHASE 3: Analytics & Audit
-- 020_create_audit_logs.sql
-- 021_create_net_worth_snapshots.sql
-- 022_create_monthly_summaries.sql
-- 023_create_attachments.sql
-- 024_create_tax_summaries.sql

-- PHASE 4: Insurance & Subscriptions
-- 025_create_insurance_policies.sql
-- 026_create_insurance_premiums.sql
-- 027_create_insurance_claims.sql
-- 028_create_subscriptions.sql
-- 029_create_subscription_payments.sql

-- PHASE 5: Split Expenses
-- 030_create_expense_splits.sql
-- 031_create_split_participants.sql
-- 032_create_split_settlements.sql

-- PHASE 6: Triggers & Views
-- 033_add_wallet_balance_triggers.sql
-- 034_add_goal_contribution_triggers.sql
-- 035_add_debt_repayment_triggers.sql
-- 036_add_investment_calculation_triggers.sql
-- 037_add_project_amount_triggers.sql
-- 038_add_tag_usage_triggers.sql
-- 039_add_split_settlement_triggers.sql
-- 040_create_vendor_view.sql
-- 041_create_lender_view.sql
-- 042_create_income_sources_view.sql
-- 043_update_debts_add_lender_contact_id.sql
-- 044_seed_financial_institutions.sql
-- 045_seed_system_tags.sql
```

---

## Conclusion

This enhanced ERD and database design addresses all identified gaps:

### Core Issues Resolved

| Gap | Solution |
|-----|----------|
| Expenses not linked to Wallets | Unified `transactions` table with required `wallet_id` |
| Optional Income-Wallet link | Unified `transactions` makes `wallet_id` required |
| No Debt Repayment Tracking | New `debt_repayments` table with transaction links |
| No Investment History | New `investment_transactions` table |
| No Goal Contribution Tracking | New `goal_contributions` table |
| Recurring not linked to actual transactions | New `recurring_instances` table |
| No Unified Transaction Ledger | Single `transactions` table for all financial movements |
| No Audit Trail | New `audit_logs` table with full change history |

### New Supporting Entities Added

| Entity Type | Entities | Benefits |
|-------------|----------|----------|
| **Contacts & Relationships** | `contacts`, `financial_institutions` | Track vendors, lenders, employers, payees - enables vendor/lender analytics |
| **Organization** | `tags`, `projects`, `locations` | Flexible organization - enables tag-based, project-based, location-based analytics |
| **Insurance** | `insurance_policies`, `insurance_premiums`, `insurance_claims` | Complete insurance tracking with premium reminders |
| **Subscriptions** | `subscriptions`, `subscription_payments` | Detailed subscription management with renewal tracking |
| **Split Expenses** | `expense_splits`, `split_participants`, `split_settlements` | IOU tracking with friends and family |

### Analytics Capabilities Unlocked

The new entities enable powerful analytics:

1. **Vendor Analytics**: Top vendors, spending patterns, vendor loyalty
2. **Lender Analytics**: Outstanding debt by lender, interest paid, credit utilization
3. **Location Analytics**: Spending heatmaps, online vs offline spending
4. **Project Analytics**: Event budget tracking, cost comparisons
5. **Tag Analytics**: Custom grouping and cross-category analysis
6. **Insurance Analytics**: Coverage summary, premium calendar, tax benefits
7. **Subscription Analytics**: Monthly costs, unused subscriptions
8. **Split Analytics**: Outstanding IOUs, settlement tracking

### Entity Count Summary

| Category | Count |
|----------|-------|
| Existing Entities | 19 |
| New Core Entities | 15 |
| New Supporting Entities | 16 |
| **Total Entities** | **50** |

The proposed architecture transforms BahiKhata from a basic expense tracker into a **comprehensive family financial management platform** with:

- Complete double-entry accounting capabilities
- Rich relationship tracking (vendors, lenders, employers)
- Flexible organization (tags, projects, locations)
- Insurance and subscription management
- Split expense and IOU tracking
- Proper audit trails
- Rich analytics and reporting support

This positions BahiKhata as a complete "BahiKhata" (account book) that can track every aspect of a family's financial life.
