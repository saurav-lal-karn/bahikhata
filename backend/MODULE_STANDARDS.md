# Backend Module Standards & Best Practices

This document outlines the industry-standard practices to follow when creating new modules or updating existing modules in the bahikhata backend.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Layer Responsibilities](#layer-responsibilities)
3. [Model Layer](#model-layer)
4. [DTO Layer](#dto-layer)
5. [Repository Layer](#repository-layer)
6. [Service Layer](#service-layer)
7. [Controller Layer](#controller-layer)
8. [Route Layer](#route-layer)
9. [Constants](#constants)
10. [Error Handling](#error-handling)
11. [Logging](#logging)
12. [Testing](#testing)
13. [Documentation](#documentation)
14. [Security](#security)

---

## Architecture Overview

We follow a **layered architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────┐
│                   HTTP Request                          │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                   Route Layer                           │
│   (Route registration, middleware, DI setup)            │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                 Controller Layer                        │
│   (HTTP handling, request parsing, response formatting) │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                   Service Layer                         │
│   (Business logic, validation, orchestration)           │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                 Repository Layer                        │
│   (Data access, query building, database operations)    │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    Database                             │
└─────────────────────────────────────────────────────────┘
```

---

## Layer Responsibilities

| Layer      | Responsibility                                                   | Should NOT Do                                     |
|------------|------------------------------------------------------------------|---------------------------------------------------|
| Model      | Define data structures, table mappings, relationships            | Contain business logic                            |
| DTO        | Define API contracts (request/response shapes), validation rules | Contain business logic, database operations       |
| Repository | Data access, CRUD operations, query building                     | Business logic, HTTP handling                     |
| Service    | Business logic, validation, orchestration, authorization         | HTTP handling, direct database access             |
| Controller | Parse requests, call services, format responses                  | Business logic, direct database access            |
| Route      | Register routes, apply middleware, wire dependencies             | Business logic, data access                       |

---

## Model Layer

### File Location
`internal/model/{entity}.go`

### Standards

1. **UUID Primary Keys**: Use UUID for all primary keys
2. **GORM Tags**: Include proper GORM tags for database mapping
3. **JSON Tags**: Include JSON tags for serialization (with `omitempty` where appropriate)
4. **Relationships**: Define GORM relationships with proper foreign keys
5. **Soft Delete**: Use `gorm.DeletedAt` for soft deletes
6. **Timestamps**: Include `CreatedAt` and `UpdatedAt`
7. **TableName Method**: Always define `TableName()` method explicitly
8. **Documentation**: Add godoc comments describing the entity

### Example

```go
package model

import (
    "time"
    "github.com/google/uuid"
    "gorm.io/gorm"
)

// Wallet represents a financial wallet/account in the system.
// It belongs to a user within a family and has an associated wallet type.
type Wallet struct {
    ID               uuid.UUID      `json:"id" gorm:"type:uuid;primaryKey"`
    Name             string         `json:"name" gorm:"type:varchar(100);not null"`
    StartingBalance  float64        `json:"starting_balance" gorm:"type:decimal(15,2);not null;default:0"`
    Balance          float64        `json:"balance" gorm:"type:decimal(15,2);not null;default:0"`
    Currency         string         `json:"currency" gorm:"type:varchar(3);not null"`
    Description      string         `json:"description,omitempty" gorm:"type:varchar(500)"`
    WalletIssuerName string         `json:"wallet_issuer_name" gorm:"type:varchar(100)"`
    ProviderWalletID string         `json:"provider_wallet_id" gorm:"type:varchar(100)"`
    WalletTypeID     uuid.UUID      `json:"wallet_type_id" gorm:"type:uuid;not null"`
    UserID           uuid.UUID      `json:"user_id" gorm:"type:uuid;not null"`
    FamilyID         uuid.UUID      `json:"family_id" gorm:"type:uuid;not null"`
    CreatedAt        time.Time      `json:"created_at"`
    UpdatedAt        time.Time      `json:"updated_at"`
    DeletedAt        gorm.DeletedAt `json:"-" gorm:"index"`

    // Relationships (use pointers to allow nil values)
    User       *User       `json:"-" gorm:"foreignKey:UserID"`
    Family     *Family     `json:"-" gorm:"foreignKey:FamilyID"`
    WalletType *WalletType `json:"wallet_type,omitempty" gorm:"foreignKey:WalletTypeID"`
}

// TableName returns the table name for the Wallet model.
func (Wallet) TableName() string {
    return "wallets"
}
```

### Money Handling Note

For financial applications, consider using:
- `decimal.Decimal` from `shopspring/decimal` package for exact decimal arithmetic
- Store amounts in smallest currency unit (cents/paise) as integers
- Current implementation uses `float64` which is acceptable for display purposes

---

## DTO Layer

### File Location
`internal/dto/{entity}.go`

### Standards

1. **Separate Create/Update DTOs**: Use distinct DTOs for create and update operations
2. **Response DTOs**: Never expose internal models directly; create response DTOs
3. **Validation Tags**: Use binding tags for input validation
4. **Documentation**: Add godoc comments and field-level comments
5. **Constants Reference**: Reference constants for validation limits
6. **Field Documentation**: Use comments to explain validation rules
7. **Pagination Support**: Include pagination DTOs for list operations

### Example

```go
package dto

import (
    "github.com/google/uuid"
    "github.com/sauravkarn541/bahikhata/internal/model"
)

// ==================== Request DTOs ====================

// CreateWalletRequest represents the payload for creating a new wallet.
type CreateWalletRequest struct {
    // Name of the wallet (max 100 characters)
    Name string `json:"name" binding:"required,max=100"`

    // StartingBalance is the initial balance (must be >= 0)
    StartingBalance float64 `json:"starting_balance" binding:"gte=0"`

    // Currency code (ISO 4217, e.g., USD, INR)
    Currency string `json:"currency" binding:"required,len=3"`

    // Description of the wallet (max 500 characters)
    Description string `json:"description" binding:"max=500"`

    // WalletIssuerName is the name of the bank/provider
    WalletIssuerName string `json:"wallet_issuer_name" binding:"required,max=100"`

    // ProviderWalletID is the external account/card number
    ProviderWalletID string `json:"provider_wallet_id" binding:"required,max=100"`

    // WalletTypeID is required when IsCustomType is false
    WalletTypeID string `json:"wallet_type_id" binding:"omitempty,uuid"`

    // IsCustomType indicates if a new wallet type should be created
    IsCustomType bool `json:"is_custom_type"`

    // CustomTypeName is required when IsCustomType is true
    CustomTypeName string `json:"custom_type_name" binding:"max=50"`

    // FamilyID the wallet belongs to
    FamilyID string `json:"family_id" binding:"required,uuid"`
}

// UpdateWalletRequest represents the payload for updating an existing wallet.
// Note: StartingBalance cannot be updated as it represents historical data.
type UpdateWalletRequest struct {
    Name             string `json:"name" binding:"required,max=100"`
    Currency         string `json:"currency" binding:"required,len=3"`
    Description      string `json:"description" binding:"max=500"`
    WalletIssuerName string `json:"wallet_issuer_name" binding:"max=100"`
    ProviderWalletID string `json:"provider_wallet_id" binding:"max=100"`
    WalletTypeID     string `json:"wallet_type_id" binding:"omitempty,uuid"`
    IsCustomType     bool   `json:"is_custom_type"`
    CustomTypeName   string `json:"custom_type_name" binding:"max=50"`
}

// ==================== Response DTOs ====================

// WalletResponse represents the API response for a wallet.
type WalletResponse struct {
    ID               string              `json:"id"`
    Name             string              `json:"name"`
    StartingBalance  float64             `json:"starting_balance"`
    Balance          float64             `json:"balance"`
    Currency         string              `json:"currency"`
    Description      string              `json:"description,omitempty"`
    WalletIssuerName string              `json:"wallet_issuer_name"`
    ProviderWalletID string              `json:"provider_wallet_id"`
    WalletType       *WalletTypeResponse `json:"wallet_type,omitempty"`
    CreatedAt        string              `json:"created_at"`
    UpdatedAt        string              `json:"updated_at"`
}

// WalletTypeResponse represents wallet type in API responses.
type WalletTypeResponse struct {
    ID   string `json:"id"`
    Name string `json:"name"`
}

// WalletListResponse represents a paginated list of wallets.
type WalletListResponse struct {
    Wallets    []WalletResponse `json:"wallets"`
    TotalCount int64            `json:"total_count"`
    Page       int              `json:"page"`
    PageSize   int              `json:"page_size"`
}

// ==================== Mappers ====================

// ToWalletResponse converts a model.Wallet to WalletResponse.
func ToWalletResponse(w *model.Wallet) WalletResponse {
    resp := WalletResponse{
        ID:               w.ID.String(),
        Name:             w.Name,
        StartingBalance:  w.StartingBalance,
        Balance:          w.Balance,
        Currency:         w.Currency,
        Description:      w.Description,
        WalletIssuerName: w.WalletIssuerName,
        ProviderWalletID: w.ProviderWalletID,
        CreatedAt:        w.CreatedAt.Format("2006-01-02T15:04:05Z"),
        UpdatedAt:        w.UpdatedAt.Format("2006-01-02T15:04:05Z"),
    }

    if w.WalletType != nil {
        resp.WalletType = &WalletTypeResponse{
            ID:   w.WalletType.ID.String(),
            Name: w.WalletType.Name,
        }
    }

    return resp
}

// ToWalletListResponse converts a slice of wallets to WalletListResponse.
func ToWalletListResponse(wallets []model.Wallet, total int64, page, pageSize int) WalletListResponse {
    responses := make([]WalletResponse, len(wallets))
    for i, w := range wallets {
        responses[i] = ToWalletResponse(&w)
    }
    return WalletListResponse{
        Wallets:    responses,
        TotalCount: total,
        Page:       page,
        PageSize:   pageSize,
    }
}
```

---

## Repository Layer

### File Location
`internal/repository/{entity}.go`

### Standards

1. **Interface Definition**: Define interface at the top of the file
2. **Context Propagation**: All methods must accept `context.Context` as first parameter
3. **Error Wrapping**: Wrap errors with context using `fmt.Errorf` with `%w`
4. **Preloading**: Use `Preload` for relationships when needed
5. **Transaction Support**: Provide `WithTx` variants for transactional operations
6. **Pagination**: Support pagination for list operations
7. **Existence Checks**: Use efficient existence checks (SELECT 1 with LIMIT 1)
8. **Documentation**: Add godoc comments for all interface methods

### Example

```go
package repository

import (
    "context"
    "fmt"

    "github.com/google/uuid"
    "github.com/sauravkarn541/bahikhata/internal/model"
    "gorm.io/gorm"
)

// WalletRepository defines the interface for wallet data access operations.
type WalletRepository interface {
    // Create creates a new wallet in the database.
    Create(ctx context.Context, wallet *model.Wallet) (*model.Wallet, error)

    // CreateWithTx creates a new wallet within a transaction.
    CreateWithTx(ctx context.Context, tx *gorm.DB, wallet *model.Wallet) (*model.Wallet, error)

    // GetByID retrieves a wallet by its ID with related entities preloaded.
    GetByID(ctx context.Context, id uuid.UUID) (*model.Wallet, error)

    // List retrieves wallets for a family/user with pagination.
    List(ctx context.Context, familyID, userID uuid.UUID, page, pageSize int) ([]model.Wallet, int64, error)

    // Update updates an existing wallet.
    Update(ctx context.Context, id uuid.UUID, wallet *model.Wallet) (*model.Wallet, error)

    // Delete soft-deletes a wallet by its ID.
    Delete(ctx context.Context, id uuid.UUID) error

    // ExistsByNameAndFamily checks if a wallet with the given name exists in the family.
    // excludeID is optional; if provided, excludes that wallet from the check (for updates).
    ExistsByNameAndFamily(ctx context.Context, name string, familyID uuid.UUID, excludeID *uuid.UUID) (bool, error)
}

type walletRepository struct {
    db *gorm.DB
}

// NewWalletRepository creates a new WalletRepository instance.
func NewWalletRepository(db *gorm.DB) WalletRepository {
    return &walletRepository{db: db}
}

func (r *walletRepository) Create(ctx context.Context, wallet *model.Wallet) (*model.Wallet, error) {
    if err := r.db.WithContext(ctx).Create(wallet).Error; err != nil {
        return nil, fmt.Errorf("wallet repository: create: %w", err)
    }
    return wallet, nil
}

func (r *walletRepository) CreateWithTx(ctx context.Context, tx *gorm.DB, wallet *model.Wallet) (*model.Wallet, error) {
    if err := tx.WithContext(ctx).Create(wallet).Error; err != nil {
        return nil, fmt.Errorf("wallet repository: create with tx: %w", err)
    }
    return wallet, nil
}

func (r *walletRepository) GetByID(ctx context.Context, id uuid.UUID) (*model.Wallet, error) {
    var wallet model.Wallet
    if err := r.db.WithContext(ctx).
        Preload("WalletType").
        First(&wallet, id).Error; err != nil {
        return nil, fmt.Errorf("wallet repository: get by id: %w", err)
    }
    return &wallet, nil
}

func (r *walletRepository) List(ctx context.Context, familyID, userID uuid.UUID, page, pageSize int) ([]model.Wallet, int64, error) {
    var wallets []model.Wallet
    var total int64

    query := r.db.WithContext(ctx).
        Model(&model.Wallet{}).
        Where("family_id = ? AND user_id = ?", familyID, userID)

    // Get total count
    if err := query.Count(&total).Error; err != nil {
        return nil, 0, fmt.Errorf("wallet repository: list count: %w", err)
    }

    // Get paginated results
    offset := (page - 1) * pageSize
    if err := query.
        Preload("WalletType").
        Order("created_at DESC").
        Offset(offset).
        Limit(pageSize).
        Find(&wallets).Error; err != nil {
        return nil, 0, fmt.Errorf("wallet repository: list: %w", err)
    }

    return wallets, total, nil
}

func (r *walletRepository) Update(ctx context.Context, id uuid.UUID, wallet *model.Wallet) (*model.Wallet, error) {
    result := r.db.WithContext(ctx).
        Model(&model.Wallet{}).
        Where("id = ?", id).
        Updates(wallet)

    if result.Error != nil {
        return nil, fmt.Errorf("wallet repository: update: %w", result.Error)
    }
    if result.RowsAffected == 0 {
        return nil, gorm.ErrRecordNotFound
    }

    return r.GetByID(ctx, id)
}

func (r *walletRepository) Delete(ctx context.Context, id uuid.UUID) error {
    result := r.db.WithContext(ctx).Delete(&model.Wallet{}, id)
    if result.Error != nil {
        return fmt.Errorf("wallet repository: delete: %w", result.Error)
    }
    if result.RowsAffected == 0 {
        return gorm.ErrRecordNotFound
    }
    return nil
}

func (r *walletRepository) ExistsByNameAndFamily(ctx context.Context, name string, familyID uuid.UUID, excludeID *uuid.UUID) (bool, error) {
    query := r.db.WithContext(ctx).
        Model(&model.Wallet{}).
        Where("name = ? AND family_id = ?", name, familyID)

    // Exclude specific wallet ID (useful for update operations)
    if excludeID != nil {
        query = query.Where("id != ?", *excludeID)
    }

    var count int64
    if err := query.Limit(1).Count(&count).Error; err != nil {
        return false, fmt.Errorf("wallet repository: exists check: %w", err)
    }

    return count > 0, nil
}
```

---

## Service Layer

### File Location
`internal/service/{entity}.go`

### Standards

1. **Interface Definition**: Define interface at the top with full method signatures
2. **Context Propagation**: All methods must accept `context.Context`
3. **Typed Errors**: Use `ServiceError` types for all errors
4. **Validation**: Implement comprehensive business validation
5. **Authorization**: Check ownership/permissions before operations
6. **Logging**: Log important operations with structured logging
7. **Transaction Management**: Handle transactions for multi-step operations
8. **Documentation**: Add godoc comments for all interface methods

### Service Error Types

| Error Type    | When to Use                              | HTTP Status |
|---------------|------------------------------------------|-------------|
| ErrNotFound   | Resource doesn't exist                   | 404         |
| ErrUnauthorized | User doesn't have permission           | 403         |
| ErrValidation | Input validation failed                  | 400         |
| ErrConflict   | Duplicate or conflicting data            | 409         |
| ErrInternal   | Unexpected internal errors               | 500         |

### Example

```go
package service

import (
    "context"
    "errors"
    "fmt"

    "github.com/google/uuid"
    "github.com/sirupsen/logrus"
    "github.com/sauravkarn541/bahikhata/internal/dto"
    "github.com/sauravkarn541/bahikhata/internal/model"
    "github.com/sauravkarn541/bahikhata/internal/repository"
    "gorm.io/gorm"
)

// WalletService defines the interface for wallet business operations.
type WalletService interface {
    // Create creates a new wallet for the user.
    Create(ctx context.Context, req *dto.CreateWalletRequest, userID uuid.UUID) (*dto.WalletResponse, error)

    // List retrieves wallets for a family with pagination.
    List(ctx context.Context, familyID, userID uuid.UUID, page, pageSize int) (*dto.WalletListResponse, error)

    // GetByID retrieves a wallet by its ID.
    GetByID(ctx context.Context, id, userID uuid.UUID) (*dto.WalletResponse, error)

    // Update updates an existing wallet.
    Update(ctx context.Context, id uuid.UUID, req *dto.UpdateWalletRequest, userID uuid.UUID) (*dto.WalletResponse, error)

    // Delete soft-deletes a wallet.
    Delete(ctx context.Context, id, userID uuid.UUID) error
}

type walletService struct {
    walletRepo     repository.WalletRepository
    walletTypeRepo repository.WalletTypeRepository
    familyRepo     repository.FamilyRepository
    logger         *logrus.Logger
}

// NewWalletService creates a new WalletService instance.
func NewWalletService(
    walletRepo repository.WalletRepository,
    walletTypeRepo repository.WalletTypeRepository,
    familyRepo repository.FamilyRepository,
    logger *logrus.Logger,
) WalletService {
    return &walletService{
        walletRepo:     walletRepo,
        walletTypeRepo: walletTypeRepo,
        familyRepo:     familyRepo,
        logger:         logger,
    }
}

func (s *walletService) Create(ctx context.Context, req *dto.CreateWalletRequest, userID uuid.UUID) (*dto.WalletResponse, error) {
    s.logger.WithFields(logrus.Fields{
        "service":     "wallet",
        "user_id":     userID,
        "wallet_name": req.Name,
        "family_id":   req.FamilyID,
    }).Info("creating wallet")

    // 1. Validate request
    if err := s.validateCreateRequest(req); err != nil {
        return nil, err
    }

    // 2. Parse family ID
    familyID, err := uuid.Parse(req.FamilyID)
    if err != nil {
        return nil, NewValidationError("invalid family_id format")
    }

    // 3. Verify family exists
    if _, err := s.familyRepo.GetByID(ctx, familyID); err != nil {
        if errors.Is(err, gorm.ErrRecordNotFound) {
            return nil, NewNotFoundError("family", familyID)
        }
        return nil, NewInternalError("verify family", err)
    }

    // 4. Check for duplicate wallet name
    exists, err := s.walletRepo.ExistsByNameAndFamily(ctx, req.Name, familyID, nil)
    if err != nil {
        return nil, NewInternalError("check duplicate name", err)
    }
    if exists {
        return nil, NewConflictError(fmt.Sprintf("wallet with name '%s' already exists in family", req.Name))
    }

    // 5. Resolve wallet type ID
    walletTypeID, err := s.resolveWalletTypeID(ctx, req.IsCustomType, req.WalletTypeID, req.CustomTypeName, familyID, userID)
    if err != nil {
        return nil, err
    }

    // 6. Create wallet
    wallet := &model.Wallet{
        ID:               uuid.New(),
        Name:             req.Name,
        StartingBalance:  req.StartingBalance,
        Balance:          req.StartingBalance,
        Currency:         req.Currency,
        Description:      req.Description,
        WalletIssuerName: req.WalletIssuerName,
        ProviderWalletID: req.ProviderWalletID,
        WalletTypeID:     walletTypeID,
        FamilyID:         familyID,
        UserID:           userID,
    }

    created, err := s.walletRepo.Create(ctx, wallet)
    if err != nil {
        s.logger.WithFields(logrus.Fields{
            "service": "wallet",
            "error":   err,
        }).Error("failed to create wallet")
        return nil, NewInternalError("create wallet", err)
    }

    s.logger.WithFields(logrus.Fields{
        "service":   "wallet",
        "wallet_id": created.ID,
    }).Info("wallet created successfully")

    // Fetch with preloaded relations for response
    wallet, err = s.walletRepo.GetByID(ctx, created.ID)
    if err != nil {
        return nil, NewInternalError("fetch created wallet", err)
    }

    response := dto.ToWalletResponse(wallet)
    return &response, nil
}

// validateCreateRequest validates the create wallet request.
func (s *walletService) validateCreateRequest(req *dto.CreateWalletRequest) error {
    if req.IsCustomType {
        if req.CustomTypeName == "" {
            return NewValidationError("custom_type_name is required when is_custom_type is true")
        }
    } else {
        if req.WalletTypeID == "" {
            return NewValidationError("wallet_type_id is required when is_custom_type is false")
        }
    }

    if req.StartingBalance < 0 {
        return NewValidationError("starting_balance cannot be negative")
    }

    return nil
}

// resolveWalletTypeID resolves or creates the wallet type based on request.
func (s *walletService) resolveWalletTypeID(ctx context.Context, isCustom bool, typeID, customName string, familyID, userID uuid.UUID) (uuid.UUID, error) {
    if isCustom {
        // Check if custom type already exists
        walletType, err := s.walletTypeRepo.GetByName(ctx, customName, familyID)
        if err != nil {
            if errors.Is(err, gorm.ErrRecordNotFound) {
                // Create new custom type
                walletType, err = s.walletTypeRepo.Create(ctx, &model.WalletType{
                    ID:          uuid.New(),
                    Name:        customName,
                    FamilyID:    &familyID,
                    CreatedByID: &userID,
                    IsSystem:    false,
                })
                if err != nil {
                    return uuid.Nil, NewInternalError("create custom wallet type", err)
                }
            } else {
                return uuid.Nil, NewInternalError("check custom wallet type", err)
            }
        }
        return walletType.ID, nil
    }

    // Validate existing wallet type
    walletTypeUUID, err := uuid.Parse(typeID)
    if err != nil {
        return uuid.Nil, NewValidationError("invalid wallet_type_id format")
    }

    if _, err := s.walletTypeRepo.GetByID(ctx, walletTypeUUID); err != nil {
        if errors.Is(err, gorm.ErrRecordNotFound) {
            return uuid.Nil, NewNotFoundError("wallet_type", walletTypeUUID)
        }
        return uuid.Nil, NewInternalError("verify wallet type", err)
    }

    return walletTypeUUID, nil
}

// checkOwnership verifies the user owns the wallet.
func (s *walletService) checkOwnership(wallet *model.Wallet, userID uuid.UUID) error {
    if wallet.UserID != userID {
        return NewUnauthorizedError("you don't have permission to access this wallet")
    }
    return nil
}
```

---

## Controller Layer

### File Location
`internal/controller/{entity}.go`

### Standards

1. **Thin Controllers**: Keep controllers thin; delegate logic to services
2. **Helper Functions**: Use shared helper functions for common operations
3. **Request Binding**: Use `ShouldBindJSON` for body, helpers for params
4. **Error Handling**: Use `handleServiceError` for service errors
5. **Consistent Responses**: Use `helper.SuccessResponse` and `helper.ErrorResponse`
6. **HTTP Status Codes**: Use appropriate status codes (201 for create, 200 for success, 204 for delete if no content)
7. **Documentation**: Add godoc comments for all handler methods

### Example

```go
package controller

import (
    "net/http"

    "github.com/gin-gonic/gin"
    "github.com/sauravkarn541/bahikhata/internal/dto"
    "github.com/sauravkarn541/bahikhata/internal/helper"
    "github.com/sauravkarn541/bahikhata/internal/service"
)

// WalletController handles HTTP requests for wallet operations.
type WalletController struct {
    svc service.WalletService
}

// NewWalletController creates a new WalletController instance.
func NewWalletController(svc service.WalletService) *WalletController {
    return &WalletController{svc: svc}
}

// Create handles POST /wallets - creates a new wallet.
// @Summary Create a new wallet
// @Tags Wallets
// @Accept json
// @Produce json
// @Param request body dto.CreateWalletRequest true "Create Wallet Request"
// @Success 201 {object} helper.Response{data=dto.WalletResponse}
// @Failure 400 {object} helper.Response
// @Failure 401 {object} helper.Response
// @Failure 409 {object} helper.Response
// @Router /wallets [post]
func (ctrl *WalletController) Create(c *gin.Context) {
    userID, err := getUserIDFromContext(c)
    if err != nil {
        helper.ErrorResponse(c, http.StatusUnauthorized, err.Error())
        return
    }

    var req dto.CreateWalletRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        helper.ErrorResponse(c, http.StatusBadRequest, helper.FormatValidationError(err))
        return
    }

    wallet, err := ctrl.svc.Create(c.Request.Context(), &req, userID)
    if err != nil {
        handleServiceError(c, err)
        return
    }

    helper.SuccessResponse(c, http.StatusCreated, "Wallet created successfully", wallet)
}

// List handles GET /wallets/family/:family_id - lists wallets for a family.
// @Summary List wallets for a family
// @Tags Wallets
// @Produce json
// @Param family_id path string true "Family ID"
// @Param page query int false "Page number" default(1)
// @Param page_size query int false "Page size" default(10)
// @Success 200 {object} helper.Response{data=dto.WalletListResponse}
// @Failure 400 {object} helper.Response
// @Failure 401 {object} helper.Response
// @Router /wallets/family/{family_id} [get]
func (ctrl *WalletController) List(c *gin.Context) {
    userID, err := getUserIDFromContext(c)
    if err != nil {
        helper.ErrorResponse(c, http.StatusUnauthorized, err.Error())
        return
    }

    familyID, err := parseUUIDParam(c, "family_id")
    if err != nil {
        helper.ErrorResponse(c, http.StatusBadRequest, err.Error())
        return
    }

    // Parse pagination params with defaults
    page := parseIntQueryParam(c, "page", 1)
    pageSize := parseIntQueryParam(c, "page_size", 10)

    wallets, err := ctrl.svc.List(c.Request.Context(), familyID, userID, page, pageSize)
    if err != nil {
        handleServiceError(c, err)
        return
    }

    helper.SuccessResponse(c, http.StatusOK, "Wallets fetched successfully", wallets)
}

// GetByID handles GET /wallets/:wallet_id - gets a wallet by ID.
func (ctrl *WalletController) GetByID(c *gin.Context) {
    userID, err := getUserIDFromContext(c)
    if err != nil {
        helper.ErrorResponse(c, http.StatusUnauthorized, err.Error())
        return
    }

    walletID, err := parseUUIDParam(c, "wallet_id")
    if err != nil {
        helper.ErrorResponse(c, http.StatusBadRequest, err.Error())
        return
    }

    wallet, err := ctrl.svc.GetByID(c.Request.Context(), walletID, userID)
    if err != nil {
        handleServiceError(c, err)
        return
    }

    helper.SuccessResponse(c, http.StatusOK, "Wallet fetched successfully", wallet)
}

// Update handles PUT /wallets/:wallet_id - updates a wallet.
func (ctrl *WalletController) Update(c *gin.Context) {
    userID, err := getUserIDFromContext(c)
    if err != nil {
        helper.ErrorResponse(c, http.StatusUnauthorized, err.Error())
        return
    }

    walletID, err := parseUUIDParam(c, "wallet_id")
    if err != nil {
        helper.ErrorResponse(c, http.StatusBadRequest, err.Error())
        return
    }

    var req dto.UpdateWalletRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        helper.ErrorResponse(c, http.StatusBadRequest, helper.FormatValidationError(err))
        return
    }

    wallet, err := ctrl.svc.Update(c.Request.Context(), walletID, &req, userID)
    if err != nil {
        handleServiceError(c, err)
        return
    }

    helper.SuccessResponse(c, http.StatusOK, "Wallet updated successfully", wallet)
}

// Delete handles DELETE /wallets/:wallet_id - deletes a wallet.
func (ctrl *WalletController) Delete(c *gin.Context) {
    userID, err := getUserIDFromContext(c)
    if err != nil {
        helper.ErrorResponse(c, http.StatusUnauthorized, err.Error())
        return
    }

    walletID, err := parseUUIDParam(c, "wallet_id")
    if err != nil {
        helper.ErrorResponse(c, http.StatusBadRequest, err.Error())
        return
    }

    if err := ctrl.svc.Delete(c.Request.Context(), walletID, userID); err != nil {
        handleServiceError(c, err)
        return
    }

    helper.SuccessResponse(c, http.StatusOK, "Wallet deleted successfully", nil)
}
```

---

## Route Layer

### File Location
`internal/route/{entity}.go`

### Standards

1. **Dependency Injection**: Create repository → service → controller chain
2. **Route Grouping**: Use route groups for related endpoints
3. **Middleware**: Apply authentication middleware at group level
4. **RESTful Design**: Follow REST conventions for URLs
5. **Documentation**: Add godoc comments for the registration function

### Example

```go
package route

import (
    "github.com/gin-gonic/gin"
    "github.com/sauravkarn541/bahikhata/internal/config"
    "github.com/sauravkarn541/bahikhata/internal/controller"
    "github.com/sauravkarn541/bahikhata/internal/repository"
    "github.com/sauravkarn541/bahikhata/internal/service"
)

// RegisterWalletRoutes registers all wallet-related routes.
// Routes:
//   - GET    /family/:family_id  - List wallets for a family
//   - POST   /                   - Create a new wallet
//   - GET    /:wallet_id         - Get wallet by ID
//   - PUT    /:wallet_id         - Update wallet
//   - DELETE /:wallet_id         - Delete wallet
func RegisterWalletRoutes(app *config.Application, router *gin.RouterGroup) {
    // Get the shared Logrus logger from config
    logger := config.GetLogger()

    // Initialize repositories
    walletRepo := repository.NewWalletRepository(app.DB)
    walletTypeRepo := repository.NewWalletTypeRepository(app.DB)
    familyRepo := repository.NewFamilyRepository(app.DB)

    // Initialize service with logger
    walletService := service.NewWalletService(walletRepo, walletTypeRepo, familyRepo, logger)

    // Initialize controller
    walletController := controller.NewWalletController(walletService)

    // Register routes
    router.GET("/family/:family_id", walletController.List)
    router.POST("", walletController.Create)
    router.GET("/:wallet_id", walletController.GetByID)
    router.PUT("/:wallet_id", walletController.Update)
    router.DELETE("/:wallet_id", walletController.Delete)
}
```

---

## Constants

### File Location
`internal/constants/{entity}.go`

### Standards

1. **Grouped Constants**: Use `const` blocks for related constants
2. **Documentation**: Add comments explaining each constant
3. **Naming**: Use descriptive names with entity prefix
4. **Usage**: Reference constants in DTOs, services, and validators

### Example

```go
package constants

// Wallet validation constants
const (
    // WalletNameMinLength is the minimum allowed length for wallet names.
    WalletNameMinLength = 1

    // WalletNameMaxLength is the maximum allowed length for wallet names.
    WalletNameMaxLength = 100

    // WalletDescriptionMaxLength is the maximum allowed length for wallet descriptions.
    WalletDescriptionMaxLength = 500

    // WalletCurrencyLength is the required length for currency codes (ISO 4217).
    WalletCurrencyLength = 3

    // WalletIssuerNameMaxLength is the maximum length for wallet issuer names.
    WalletIssuerNameMaxLength = 100

    // WalletProviderIDMaxLength is the maximum length for provider wallet IDs.
    WalletProviderIDMaxLength = 100
)

// Wallet pagination defaults
const (
    // WalletDefaultPageSize is the default number of wallets per page.
    WalletDefaultPageSize = 10

    // WalletMaxPageSize is the maximum allowed page size.
    WalletMaxPageSize = 100
)
```

---

## Error Handling

### Principles

1. **Typed Errors**: Use `ServiceError` for all business logic errors
2. **Error Wrapping**: Use `%w` verb to wrap errors and preserve stack
3. **Error Mapping**: Map service errors to HTTP status codes in controllers
4. **User-Friendly Messages**: Provide clear, actionable error messages
5. **Logging**: Log internal errors with full context

### Error Flow

```
Repository Error → wrap with context → Service Layer
    → check error type → return ServiceError
        → Controller receives ServiceError → map to HTTP response
```

---

## Logging

### Standards

1. **Structured Logging**: Use Logrus (`github.com/sirupsen/logrus`) for structured logging
2. **Context Fields**: Include relevant context using `WithFields` (service, user_id, entity_id, operation)
3. **Log Levels**:
   - `Debug`: Detailed debugging information
   - `Info`: Normal operations (create, update, delete)
   - `Warn`: Potentially problematic situations
   - `Error`: Errors that need attention
4. **Sensitive Data**: Never log passwords, tokens, or PII
5. **Service Context**: Always include "service" field to identify the module

### Example

```go
// Get the logger from config
logger := config.GetLogger()

// Log with structured fields
s.logger.WithFields(logrus.Fields{
    "service":     "wallet",
    "user_id":     userID,
    "wallet_name": req.Name,
    "family_id":   req.FamilyID,
}).Info("creating wallet")

s.logger.WithFields(logrus.Fields{
    "service": "wallet",
    "user_id": userID,
    "error":   err,
}).Error("failed to create wallet")
```

---

## Testing

### File Location
- Unit tests: `internal/{layer}/{entity}_test.go`
- Integration tests: `tests/integration/{entity}_test.go`

### Standards

1. **Table-Driven Tests**: Use table-driven tests for multiple scenarios
2. **Mocking**: Use interfaces to mock dependencies
3. **Test Coverage**: Aim for >80% coverage on service layer
4. **Test Naming**: Use descriptive test names (`Test{Function}_{Scenario}_{Expected}`)
5. **Isolation**: Each test should be independent

### Example

```go
func TestWalletService_Create_Success(t *testing.T) {
    // Arrange
    mockRepo := &MockWalletRepository{}
    svc := NewWalletService(mockRepo, nil, nil, slog.Default())

    req := &dto.CreateWalletRequest{
        Name:     "Test Wallet",
        Currency: "INR",
    }

    // Act
    result, err := svc.Create(context.Background(), req, uuid.New())

    // Assert
    assert.NoError(t, err)
    assert.NotNil(t, result)
    assert.Equal(t, "Test Wallet", result.Name)
}
```

---

## Documentation

### Standards

1. **Godoc Comments**: Add godoc comments to all exported types, functions, and methods
2. **Interface Documentation**: Document all interface methods with purpose and parameters
3. **Swagger Annotations**: Add swagger annotations to controller methods (optional)
4. **README**: Include module-specific README if complex

### Godoc Format

```go
// WalletService defines the interface for wallet business operations.
// It handles creation, retrieval, update, and deletion of wallets
// with proper authorization and validation.
type WalletService interface {
    // Create creates a new wallet for the user.
    // It validates the request, checks for duplicate names,
    // and resolves the wallet type before creating.
    //
    // Returns:
    //   - *dto.WalletResponse: The created wallet
    //   - error: ErrValidation, ErrConflict, ErrNotFound, or ErrInternal
    Create(ctx context.Context, req *dto.CreateWalletRequest, userID uuid.UUID) (*dto.WalletResponse, error)
}
```

---

## Security

### Standards

1. **Authorization**: Always verify resource ownership in service layer
2. **Input Validation**: Validate all inputs in DTO and service layer
3. **SQL Injection**: Use parameterized queries (GORM handles this)
4. **Sensitive Data**: Never expose internal IDs or sensitive data in errors
5. **Rate Limiting**: Apply rate limiting at API gateway level
6. **Audit Logging**: Log security-relevant operations

### Authorization Check Pattern

```go
func (s *walletService) GetByID(ctx context.Context, id, userID uuid.UUID) (*dto.WalletResponse, error) {
    wallet, err := s.walletRepo.GetByID(ctx, id)
    if err != nil {
        // Handle error
    }

    // Always check ownership BEFORE returning data
    if wallet.UserID != userID {
        return nil, NewUnauthorizedError("you don't have permission to access this wallet")
    }

    return dto.ToWalletResponse(wallet), nil
}
```

---

## Checklist for New Modules

Use this checklist when creating a new module:

- [ ] **Model**: Entity struct with GORM tags, TableName method, relationships
- [ ] **DTO**: CreateRequest, UpdateRequest, Response DTOs with validation tags
- [ ] **Repository**: Interface, implementation, all CRUD methods, context propagation
- [ ] **Service**: Interface, implementation, validation, authorization, logging
- [ ] **Controller**: Thin handlers using shared helpers, proper error handling
- [ ] **Routes**: Route registration with dependency injection
- [ ] **Constants**: Validation limits and defaults
- [ ] **Migration**: SQL migration file for database schema
- [ ] **Tests**: Unit tests for service layer (minimum)
- [ ] **Documentation**: Godoc comments on all exports

---

## Checklist for Updating Modules

Use this checklist when updating an existing module:

- [ ] Separate Create and Update DTOs if using single DTO for both
- [ ] Add Response DTO if returning model directly
- [ ] Add pagination support to List operations
- [ ] Add structured logging to service layer
- [ ] Check for duplicate name validation on both create AND update
- [ ] Ensure authorization checks on all operations
- [ ] Update constants if validation limits changed
- [ ] Add tests for new functionality
- [ ] Update documentation

---

*Last Updated: January 2026*
