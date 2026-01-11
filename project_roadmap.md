# Project Roadmap: Bahikhata

This document serves as a step-by-step guide to completing the Bahikhata project.

## Phase 1: Project Initialization & Setup
- [x] **Repository Setup**: Initialize Git repository and ignore files.
- [x] **Backend Structure**: Set up Go module, directory structure (`cmd`, `internal`, `pkg`).
- [x] **Frontend Structure**: Initialize Next.js app with Tailwind CSS.
- [x] **Database Setup**: configure PostgreSQL and environment variables (`.env`).
- [x] **Migration System**: Set up Goose or Make-based migration commands.

## Phase 2: Authentication & User Management
- [x] **User Model**: Define User struct and DB schema (`internal/models/user.go`).
- [x] **Auth Routes**: Setup login/register endpoints (`internal/routes/auth.go`).
- [x] **JWT Implementation**: Implement token generation and validation middleware.
- [ ] **Family Management**:
  - [x] Define Family struct (`internal/models/family.go`).
  - [x] Implement "Create Family" logic.
  - [x] Implement "Invite Member" logic.
  - [x] Implement "Join Family" logic.
- [ ] **Frontend Auth**:
  - [x] Create Login Page. 
  - [x] Create Register Page.
  - [x] Implement Auth Context/Hooks for session management.

## Phase 3: Core Financial Features
- [x] **Financial Models**:
  - [x] **Expense Schema**: Amount, Category, Payment Method (String), Family ID, Created By (`internal/models/expenses.go`).
  - [x] **Income Schema**: Source, Amount, Date, Family ID (`internal/models/income.go`).
  - [x] **Categories & Tags**: Custom category management scoped to families, with support for global system categories.
- [ ] **Transaction APIs**:
  - [ ] **Expense API**: CRUD for expenses with family-level access control.
  - [ ] **Income API**: CRUD for income streams.    
  - [ ] **Search & Filters**: Filter by date range, category, and payment method.
- [ ] **Budgeting Engine**:
  - [ ] **Category Budgets**: Set and track monthly limits per category.
  - [ ] **Family-wide Budget**: Aggregate budget for the entire household.
- [ ] **Payments & Methods**:
  - [ ] Track payment modes (UPI, Cash, Bank, Credit Card).
  - [ ] Support for multiple accounts/wallets per family.
- [ ] **Frontend Financial Dashboard**:
  - [ ] **Real-time Overview**: Current balance, monthly spending, and income summary.
  - [ ] **Interactive Charts**: Category-wise distribution (Pie) and Monthly trends (Bar/Line).
  - [ ] **Ledger View**: paginated list of all transactions with advanced filtering.
  - [ ] **Transaction Forms**: Dynamic forms for adding/edit income and expenses.

## Phase 4: Files & AI Integration
- [ ] **File Upload System**:
  - [ ] Backend handler for file storage (Local/S3).
  - [ ] DB schema for file metadata.
- [ ] **OCR Service**:
  - [ ] Integration with OCR provider (e.g., Tesseract or Cloud Vision).
  - [ ] Logic to parse OCR text to JSON.
- [ ] **LLM/Chatbot**:
  - [ ] Integration with LLM API (Gemini/OpenAI).
  - [ ] Chat interface on Frontend.
  - [ ] RAG (Retrieval-Augmented Generation) pipeline for document querying.

## Phase 5: Advanced Features
- [ ] **Advanced Budgeting**:
  - [ ] Real-time Over-budget Alert System (Push/Email).
  - [ ] Smart Budget Suggestions based on history.
- [ ] **Recurring Transactions**:
  - [ ] Subscription Models.
  - [ ] Scheduler (Cron job) to auto-create transactions.
- [ ] **Multi-Currency**:
  - [ ] DB Schema update for Currency codes.
  - [ ] External API integration or static rates.
- [ ] **Reporting**:
  - [ ] Generate PDF Report endpoint.
  - [ ] CSV Export endpoint.
- [ ] **Investment Portfolio**:
  - [ ] Investment Models (Stock, Crypto, Quantity, Buy Price).
  - [ ] Real-time price fetching.

## Phase 6: Deployment & Polish
- [ ] **Deployment**:
  - [ ] Dockerfile for Backend.
  - [ ] Dockerfile for Frontend.
  - [ ] Docker Compose for full stack.
- [ ] **Testing**:
  - [ ] Unit tests for Critical Business Logic.
  - [ ] E2E tests for Main User Flows.
- [ ] **Documentation**:
  - [x] API Documentation (README updated).
  - [ ] User Guide.
