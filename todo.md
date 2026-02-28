# Bahikhata Project - Comprehensive Todo List

This document centralizes all pending features, bugs, and technical tasks for the Bahikhata project.

## 🚀 High-Priority Features (Missing)

- [ ] **Bahi-Bot (RAG System)**: Chat interface for natural language communication with financial data.
- [ ] **Data Exports (PDF & Excel)**: Generating PDF monthly summaries and basic Excel exports.
- [ ] **Smart Budget Forecasting**: End-of-month spending predictions and recurring bill forecasting.
- [ ] **Multi-Currency Support**: Dual currency tracking and exchange rate integration.
- [ ] **Anomaly Detection**: Identifying price hikes, double charges, and hidden subscriptions.
- [ ] **Family Goals Feasibility**: AI-driven analysis of savings goals vs. income/expense capability.

## 🛠 Backend & API Tasks

### Infrastructure & Refactoring
- [ ] **Context Helper Migration**: Standardize `userId` and `familyId` extraction using `helper/context.go`.
- [ ] **Error Handling Overhaul**: Implement domain-specific error types and consistent HTTP mapping.
- [ ] **DTO Standardization**: Ensure all modules use dedicated Create/Update/Response DTOs with `ToModel` methods.
- [ ] **Repository Context Propagation**: Pass `context.Context` to all repository methods and use `WithContext(ctx)`.
- [ ] **Model Audit**: Standardize GORM tags (`primaryKey`, `type:uuid`, `foreignKey`) across all entities.

### Feature Enhancements
- [ ] **Soft Deletes**: Implement `gorm.DeletedAt` for critical financial records.
- [ ] **Pagination Metadata**: Add total count and page info to all list endpoint responses.
- [ ] **Service Layer Validation**: Move business logic validation from controllers to services.

## 🎨 Frontend & UI Tasks

### Dashboard & Analytics
- [ ] **Enhanced Charts**: Implement interactive monthly trends (Bar/Line) and category distribution (Pie).
- [ ] **Global Search & Semantic Search**: Integration with AI server for natural language querying.
- [ ] **Real-time Overview**: Improve dashboard widgets for current balance and monthly spending.

### Form & Interaction Improvements
- [ ] **Bulk Import UI Polish**: Ensure robust error reporting and row-level validation for CSV imports.
- [ ] **OCR Confirmation Flow**: Optimize the split-view for file preview and form pre-filling.
- [ ] **Global Filter System**: Implement advanced filtering by date, category, and payment method across ledger views.

## 🤖 AI Server Tasks

- [ ] **LLM Integration**: Complete the `llm_service.py` for RAG and general financial chat.
- [ ] **Forecasting Logic**: Implement the core logic in `forecast_service.py` using historical data.
- [ ] **Vector DB Implementation**: Finalize the ChromaDB/Vector store setup for semantic search.
- [ ] **Document Type Detection**: Enhance OCR to distinguish between receipts, bills, and invoices automatically.

## 🐞 Known Bugs & Verification

- [ ] **Tag Population Issue**: Verify and fix tag population during expense editing (AddExpenseForm).
- [ ] **Toaster Notifications**: Audit all success/error toasts to ensure they appear correctly on the screen.
- [ ] **Form Scrolling**: Fix scrolling behavior in MultiSelect components to prevent whole-form scrolling.
- [ ] **WebSocket Port Verification**: Ensure real-time notifications use the correct backend port (3080).

## 📄 Documentation & DevOps
- [ ] **Interactive Swagger**: Ensure all endpoints have accurate Gin-Swagger annotations.
- [ ] **Unit Test Coverage**: Reach >80% coverage for core service layers.
- [ ] **User Guide**: Detailed documentation for family management and budget setup.
