# Backend Standards Compliance & Refactor Todo List

This document tracks the tasks required to bring the `bahikhata` backend codebase in line with the [Module Standards & Best Practices](./MODULE_STANDARDS.md).

## 🛠 Project-Wide Infrastructure
- [ ] **Constants**: Move hardcoded validation limits to `internal/constants/{entity}.go`.
- [ ] **Context Helpers**: Implement/Refactor `helper/context.go` for safe extraction of `userId` and `familyId`.
- [ ] **Standard Errors**: Implement shared `ServiceError` types (ErrNotFound, ErrUnauthorized, ErrValidation, etc.).
- [ ] **Unified Responses**: Audit all controllers to ensure `helper.SuccessResponse` and `helper.ErrorResponse` are the only ways responses are sent.

## 📦 Model Layer Compliance (`internal/model/`)
- [ ] **UUID Audit**: Verify `uuid.UUID` is used for all primary keys with `gorm:"type:uuid;primaryKey"`.
- [ ] **Explicit Table Names**: Ensure `TableName() string` method exists for all models.
- [ ] **Relationship Tags**: Standardize GORM relationship tags (`foreignKey`, `references`, `many2many`).
- [ ] **Timestamp Consistency**: Ensure `CreatedAt` and `UpdatedAt` are present; add `DeletedAt` for soft deletes.
- [ ] **JSON Tags**: Audit tags for proper serialization; use `omitempty` for optional fields and `-` for internal state.

## ✉️ DTO Layer Compliance (`internal/dto/`)
- [ ] **DTO Separation**: Split combined request DTOs into distinct `Create` and `Update` versions.
- [ ] **Response DTOs**: Create dedicated response shapes for all entities to avoid exposing internal models.
- [ ] **Validation Overhaul**: Add comprehensive Gin `binding` tags based on requirements in `MODULE_STANDARDS.md`.
- [ ] **Mapping Functions**: Standardize mapper functions (e.g., `ToResponse`, `ToListResponse`) within the DTO files.

## 💾 Repository Layer Compliance (`internal/repository/`)
- [ ] **Interface Definition**: Define interfaces for all repositories at the top of their respective files.
- [ ] **Context Propagation**: Ensure `context.Context` is the first parameter in all methods and passed to GORM via `WithContext(ctx)`.
- [ ] **Error Wrapping**: Wrap all database errors using `fmt.Errorf("name: op: %w", err)`.
- [ ] **Pagination Support**: Implement standard pagination (limit/offset) for all `List` methods.

## ⚙️ Service Layer Compliance (`internal/service/`)
- [ ] **Interface Patterns**: Standardize service interfaces with clear method signatures and Godoc comments.
- [ ] **Authorization Enforcement**: Add resource ownership checks (e.g., `resource.UserID == currentUserID`) to all operations.
- [ ] **Structured Logging**: Ensure `logrus.Logger` is injected and used with `WithFields` for all business events.
- [ ] **Business Validation**: Move validation logic from controllers into dedicated service-level validation methods.
- [ ] **Transaction Management**: Audit multi-step operations (like transfers) to ensure they use repository transactions correctly.

## 🎮 Controller & Route Layer Compliance
- [ ] **Controller Thinning**: Audit all controllers to ensure they only handle request parsing, service calls, and response formatting.
- [ ] **Error Mapping**: Use a consistent `handleServiceError` utility to map typed service errors to HTTP status codes.
- [ ] **RESTful Routes**: Verify all route paths follow standard REST conventions.
- [ ] **Dependency Injection**: Ensure `internal/route/` registration functions wire up dependencies (Repo -> Service -> Controller) correctly.

## 📝 Documentation & Quality Assurance
- [ ] **Godoc Comments**: Add documentation to all exported types and methods.
- [ ] **Swagger Annotations**: Update Swagger/OpenAPI tags in controllers for accurate API documentation.
- [ ] **Unit Testing**: Achieve >80% coverage on service layers using table-driven tests and mocks.
- [ ] **Integration Tests**: Implement basic "happy path" integration tests for core modules.

---

## 📅 Roadmap for Existing Modules
- [ ] **Common/Auth**: Audit authentication and user management.
- [ ] **Family**: Align family and membership logic.
- [ ] **Wallets**: Refactor wallet and wallet type management.
- [ ] **Transactions**: Update Income, Expense, and Transfer modules.
- [ ] **Budgets/Categories**: Align budget tracking and category management.

---
*Created based on MODULE_STANDARDS.md - January 2026*
