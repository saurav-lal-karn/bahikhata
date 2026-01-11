# Backend API Implementation TODO

This list tracks the APIs needed by the frontend, categorized by feature area.

## 🔐 Authentication & User Management
- [x] `POST /api/auth/register` - User registration
- [x] `POST /api/auth/login` - User login (issue JWT/Cookies)
- [x] `POST /api/auth/logout` - User logout
- [x] `POST /api/auth/refresh` - Refresh access token
- [x] `GET /api/users/me` - Get current user profile
- [x] `PUT /api/users/me` - Update current user profile
- [ ] `DELETE /api/users/:id` - Delete user
- [ ] `POST /api/users` - Create a new user
- [] `PUT /api/users/:id` - Update user profile

## 👨‍👩‍👧 Family Management
- [x] `GET /api/family` - Get family details
- [x] `POST /api/family` - Create a new family group
- [x] `GET /api/family/members` - List all family members and their roles
- [x] `POST /api/family/invite` - Invite a new member to the family
- [ ] `PUT /api/family/members/:userId` - Update member role/access levels
- [ ] `DELETE /api/family/members/:userId` - Remove a member from the family
- [ ] `GET /api/family/audit` - Get family ledger audit logs

## 💸 Expenses
- [ ] `GET /api/expenses` - List expenses with filtering (search, category, date, method) and pagination
- [ ] `POST /api/expenses` - Record a new expense
- [ ] `PUT /api/expenses/:id` - Update an existing expense
- [ ] `DELETE /api/expenses/:id` - Delete an expense
- [ ] `GET /api/expenses/stats` - Summary statistics for expenses (category-wise, weekly/monthly)
- [ ] `POST /api/expenses/bulk` - Bulk import expenses from CSV/Excel

## 💰 Income
- [ ] `GET /api/income` - List income records with filtering and pagination
- [ ] `POST /api/income` - Record a new income entry
- [ ] `PUT /api/income/:id` - Update an income entry
- [ ] `DELETE /api/income/:id` - Delete an income entry
- [ ] `GET /api/income/stats` - Summary statistics for income sources
- [ ] `POST /api/income/bulk` - Bulk import income from CSV/Excel

## 📊 Budgets
- [ ] `GET /api/budgets` - List active category budgets
- [ ] `POST /api/budgets` - Set a new category budget
- [ ] `PUT /api/budgets/:id` - Update a budget limit or configuration
- [ ] `DELETE /api/budgets/:id` - Remove a budget
- [ ] `GET /api/budgets/suggestions` - AI-powered budget suggestions based on history
- [ ] `GET /api/budgets/archives` - Historical budget performance data
- [ ] `GET /api/budgets/stats` - Overall budget health and overspent alerts

## 🏦 Accounts & Wallets
- [ ] `GET /api/accounts` - List all linked bank accounts and wallets
- [ ] `POST /api/accounts` - Link a new bank account or add a liquid asset
- [ ] `PUT /api/accounts/:id` - Update account details
- [ ] `DELETE /api/accounts/:id` - Unlink/Remove an account
- [ ] `POST /api/accounts/transfer` - Record internal transfers between accounts
- [ ] `GET /api/accounts/transfers` - Get recent internal transfer history
- [ ] `GET /api/accounts/stats` - Net liquid value and trends

## 🛡️ Debts & Liabilities
- [ ] `GET /api/debts/loans` - List all active loans
- [ ] `GET /api/debts/credit-cards` - List credit card status and dues
- [ ] `POST /api/debts` - Record a new loan or liability
- [ ] `PUT /api/debts/:id` - Update debt details
- [ ] `DELETE /api/debts/:id` - Remove a debt record
- [ ] `GET /api/debts/dues` - Upcoming repayment dates and amounts
- [ ] `GET /api/debts/stats` - Debt-to-income ratio and risk analysis

## 🎯 Wealth & Goals
- [ ] `GET /api/goals` - List active savings goals with progress percentages
- [ ] `POST /api/goals` - Create a new savings target
- [ ] `PUT /api/goals/:id` - Update goal target, deadline, or status
- [ ] `DELETE /api/goals/:id` - Remove a goal
- [ ] `GET /api/goals/diversity` - Portfolio diversity analysis
- [ ] `GET /api/goals/emergency-fund` - Status of emergency fund runway
- [ ] `GET /api/goals/stats` - General financial health and savings rate metrics

## 📈 Investments
- [ ] `GET /api/investments` - List investment portfolio with current market values
- [ ] `POST /api/investments` - Add a new asset/stock/mutual fund
- [ ] `PUT /api/investments/:id` - Update investment details
- [ ] `DELETE /api/investments/:id` - Remove an investment record
- [ ] `GET /api/investments/stats` - Overall portfolio returns (P&L), capital allocation
- [ ] `POST /api/investments/bulk` - Bulk import investment history
- [ ] `GET /api/investments/prices` - Fetch/Update latest market prices for assets

## 🔄 Recurring Transactions
- [ ] `GET /api/recurring` - List active subscriptions and recurring bills
- [ ] `POST /api/recurring` - Set up a new recurring transaction
- [ ] `PUT /api/recurring/:id` - Update billing cycle or amount
- [ ] `DELETE /api/recurring/:id` - Cancel/Stop tracking a recurring bill
- [ ] `GET /api/recurring/reminders` - Upcoming automated payment reminders
- [ ] `GET /api/recurring/savings` - Identity unused/wasteful subscriptions

## 📑 Reports & Analytics
- [ ] `GET /api/reports/stats` - High-level financial summary
- [ ] `GET /api/reports/net-worth-timeline` - Monthly net worth growth data
- [ ] `GET /api/reports/financial-health-score` - Proprietary financial health scoring
- [ ] `GET /api/reports/spending-insights` - Deep-dive patterns and anomalies
- [ ] `GET /api/reports/summaries` - List of archived monthly PDF/CSV reports
- [ ] `GET /api/reports/download/:id` - Download a specific report
- [ ] `POST /api/reports/generate` - Manually trigger report generation

## ⚖️ Tax & Compliance
- [ ] `GET /api/tax/saving-tracker` - Track utilization under various tax sections (80C, 80D, etc.)
- [ ] `GET /api/tax/documents` - List uploaded tax/financial documents in vault
- [ ] `POST /api/tax/documents` - Upload a new document to secure vault
- [ ] `DELETE /api/tax/documents/:id` - Remove a document from vault
- [ ] `GET /api/tax/summary` - Regional tax status and deadlines
- [ ] `GET /api/tax/calculator` - Simulate tax liability based on current data

## 🤖 BahiAssistant (Chatbot)
- [ ] `GET /api/chatbot/threads` - List user conversation threads
- [ ] `POST /api/chatbot/threads` - Start a new AI conversation
- [ ] `GET /api/chatbot/threads/:id` - Fetch all messages for a thread
- [ ] `POST /api/chatbot/threads/:id/messages` - Send a message and get AI response
- [ ] `DELETE /api/chatbot/threads/:id` - Delete a conversation thread

## 🔔 Miscellaneous
- [ ] `GET /api/notifications` - Get user notifications/alerts
- [ ] `POST /api/notifications/mark-read` - Mark specific or all notifications as read
- [ ] `GET /api/dashboard/summary` - Aggregated data for the main dashboard view
