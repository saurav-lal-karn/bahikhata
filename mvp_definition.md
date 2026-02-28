# Bahikhata - MVP Definition

The Minimum Viable Product (MVP) for Bahikhata focuses on providing a stable, multi-user financial tracking experience with a core "smart" feature (OCR) to differentiate it from basic spreadsheets or simple apps.

## ✅ Included in MVP

### 1. User & Family Management
- Secure Login/Register (JWT-based).
- Family creation and member invitation (enabling shared household tracking).
- Role-based basic access (Owner/Member).

### 2. Core Financial Tracking
- **Expenses**: Log expense with amount, category, date, payment method, and tags.
- **Income**: Log income source and amount.
- **Ledger**: A paginated view of all transactions for the family.
- **Wallets/Accounts**: Basic management of physical wallets, bank accounts, or cards.

### 3. Smart Data Entry (The "Hook")
- **OCR Scanner**: Upload receipt images and auto-extract merchant, amount, and date.
- **Auto-Categorization**: Basic prediction of categories based on merchant names.

### 4. Bahi-Bot (RAG System)
- Chat interface where users can ask questions about their financial data in plain English.
- Natural language querying (e.g., "How much did I spend on groceries last week?").

### 5. Basic Insights & Exports
- **Financial Dashboard**: Sum of Income vs. Expense for the current month.
- **Balance Tracking**: Net balance across all family accounts.
- **Category Breakdown**: Simple pie chart or list of spending by category.
- **Data Export**: Generate PDF summaries and basic Excel/CSV exports for external record-keeping.

### 5. Technical Foundations
- Stable PostgreSQL schema with migrations.
- Modern, responsive React/Next.js frontend.
- Go backend with clean architecture.

## ❌ Excluded from MVP (Post-MVP)

- **AI Forecasting**: Predictive spending based on history.
- **Multi-Currency**: Handling transactions in multiple international currencies.
- **Investment Portfolio**: Tracking stocks, crypto, or mutual funds.
- **Complex Budgeting**: Real-time over-budget alerts and smart suggestions.
