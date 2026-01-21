# Backend Code Review: Feedback & Todo List

Following a review of the `internal` directory (controllers, services, repositories, DTOs, and config), here is a summary of findings and a prioritized todo list for technical improvements.

## Architectural Feedback

### 1. Context & User Identification
- **Observation**: Controllers repeatedly extract `userId` from `gin.Context` with manual type assertions and parsing (e.g., `userId.(string)`).
- **Impact**: Code duplication and potential runtime panics if type assertions fail.
- **Todo**: [ ] Create a `helper/context.go` utility to safely extract `userId`, `familyId`, and `role` with proper error handling.

### 2. Error Handling Consistency
- **Observation**: `ErrorResponse` often passes `err.Error()` directly to the client.
- **Impact**: Potential leakage of internal implementation details (e.g., database table names or GORM error specifics).
- **Todo**: [ ] Implement domain-specific error types and map them to appropriate HTTP status codes and user-friendly messages in the controller layer.

### 3. DTO & Model Mapping
- **Observation**: Mapping between DTOs and Models is inconsistent. Some DTOs have `ToModel()` methods, while others are manually mapped in the service layer (e.g., `IncomeDTO` vs `CreateUserRequest`).
- **Impact**: harder to maintain and less predictable codebase.
- **Todo**: [ ] Standardize DTO mapping. Recommended: DTOs should provide a `ToModel()` method for "Input" DTOs, and Services should use "Response" DTOs for output mapping.

### 4. GORM Model tagging
- **Observation**: Some models (like `Wallet` and `IncomeType`) previously lacked explicit `primaryKey` tags, leading to preloading issues.
- **Impact**: Unreliable associations and debugging overhead.
- **Todo**: [ ] Audit all files in `internal/model` to ensure `gorm:"primaryKey"` and `gorm:"type:uuid"` are present where appropriate.

## Priority Todo List

### High Priority
- [ ] **Context Helpers**: Refactor `userId` extraction in all controllers to use a shared helper.
- [ ] **Model Audit**: Standardize primary key and association tags across all GORM models to prevent preloading bugs.
- [ ] **Validation Consistency**: Ensure all "Create" DTOs use Gin's `binding:"required"` tags consistently.

### Medium Priority
- [ ] **Interface Cleanup**: Audit `IncomeService` and other service interfaces for redundant or incomplete return types (e.g., `GetIncomeStats`).
- [ ] **Repository standard**: Ensure `WithContext(ctx)` is used in every repository method to support cancellation and timeouts.
- [ ] **Response Metadata**: Consider adding pagination metadata to the `SuccessResponse` helper for list endpoints.

### Low Priority / Tech Debt
- [ ] **Logger consistency**: Ensure the custom GormLogger is used across all environments with appropriate levels.
- [ ] **Unit Testing**: Expand coverage for the `service` layer using mocks for repositories.
- [ ] **DSN Construction**: Use `url.URL` for DSN building in `config/database.go` for better robustness.

## Conclusion
The overall architecture is solid and follows a clean layered approach. Addressing these consistency issues will make the codebase more robust and significantly easier to debug as it scales.
