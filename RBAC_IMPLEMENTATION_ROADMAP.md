# RBAC Implementation Roadmap

Complete step-by-step guide to implement Role-Based Access Control (RBAC) in BahiKhata.

---

## Phase 1: Database Schema & Models (Foundation)

### Step 1: Create Database Models

- [ ] Create `internal/model/role.go`
  ```go
  type Role struct {
      ID          uuid.UUID
      Name        string
      Description string
      FamilyID    *uuid.UUID  // null for system roles
      IsSystem    bool
      CreatedAt   time.Time
      UpdatedAt   time.Time
  }
  ```

- [ ] Create `internal/model/permission.go`
  ```go
  type Permission struct {
      ID          uuid.UUID
      Resource    string  // "wallet", "income", "expense"
      Action      string  // "create", "read", "update", "delete"
      Name        string  // "wallet:create", "wallet:update"
      Description string
      CreatedAt   time.Time
  }
  ```

- [ ] Create `internal/model/role_permission.go`
  ```go
  type RolePermission struct {
      RoleID       uuid.UUID
      PermissionID uuid.UUID
      Role         *Role       `gorm:"foreignKey:RoleID"`
      Permission   *Permission `gorm:"foreignKey:PermissionID"`
  }
  ```

- [ ] Create `internal/model/family_member_role.go`
  ```go
  type FamilyMemberRole struct {
      ID             uuid.UUID
      FamilyMemberID uuid.UUID
      RoleID         uuid.UUID
      FamilyMember   *FamilyMember `gorm:"foreignKey:FamilyMemberID"`
      Role           *Role         `gorm:"foreignKey:RoleID"`
      CreatedAt      time.Time
  }
  ```

### Step 2: Create Database Migration

- [ ] Create migration file `migrations/YYYYMMDDHHMMSS_add_rbac_tables.sql`
  ```sql
  -- Create roles table
  CREATE TABLE roles (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(100) NOT NULL,
      description TEXT,
      family_id UUID REFERENCES families(id) ON DELETE CASCADE,
      is_system BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(name, family_id)
  );
  
  -- Create permissions table
  CREATE TABLE permissions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      resource VARCHAR(50) NOT NULL,
      action VARCHAR(50) NOT NULL,
      name VARCHAR(100) NOT NULL UNIQUE,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  
  -- Create role_permissions junction table
  CREATE TABLE role_permissions (
      role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
      permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
      PRIMARY KEY (role_id, permission_id)
  );
  
  -- Create family_member_roles table
  CREATE TABLE family_member_roles (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      family_member_id UUID REFERENCES family_members(id) ON DELETE CASCADE,
      role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(family_member_id, role_id)
  );
  
  -- Create indexes
  CREATE INDEX idx_roles_family_id ON roles(family_id);
  CREATE INDEX idx_roles_is_system ON roles(is_system);
  CREATE INDEX idx_family_member_roles_member ON family_member_roles(family_member_id);
  CREATE INDEX idx_family_member_roles_role ON family_member_roles(role_id);
  ```

### Step 3: Seed Default Data

- [ ] Create `scripts/seed_rbac.go` or add to existing seed file
  ```go
  // Seed Permissions
  permissions := []model.Permission{
      // Wallet permissions
      {ID: uuid.New(), Resource: "wallet", Action: "create", Name: "wallet:create"},
      {ID: uuid.New(), Resource: "wallet", Action: "read", Name: "wallet:read"},
      {ID: uuid.New(), Resource: "wallet", Action: "update", Name: "wallet:update"},
      {ID: uuid.New(), Resource: "wallet", Action: "delete", Name: "wallet:delete"},
      
      // Income permissions
      {ID: uuid.New(), Resource: "income", Action: "create", Name: "income:create"},
      {ID: uuid.New(), Resource: "income", Action: "read", Name: "income:read"},
      {ID: uuid.New(), Resource: "income", Action: "update", Name: "income:update"},
      {ID: uuid.New(), Resource: "income", Action: "delete", Name: "income:delete"},
      
      // Expense permissions
      {ID: uuid.New(), Resource: "expense", Action: "create", Name: "expense:create"},
      {ID: uuid.New(), Resource: "expense", Action: "read", Name: "expense:read"},
      {ID: uuid.New(), Resource: "expense", Action: "update", Name: "expense:update"},
      {ID: uuid.New(), Resource: "expense", Action: "delete", Name: "expense:delete"},
      
      // ... add more for budget, goal, etc.
  }
  
  // Seed System Roles
  adminRole := model.Role{
      ID: uuid.New(),
      Name: "Family Admin",
      Description: "Full access to all family resources",
      IsSystem: true,
  }
  
  editorRole := model.Role{
      ID: uuid.New(),
      Name: "Editor",
      Description: "Can create, read, and update but not delete",
      IsSystem: true,
  }
  
  memberRole := model.Role{
      ID: uuid.New(),
      Name: "Member",
      Description: "Can create and read resources",
      IsSystem: true,
  }
  
  viewerRole := model.Role{
      ID: uuid.New(),
      Name: "Viewer",
      Description: "Read-only access",
      IsSystem: true,
  }
  ```

- [ ] Map permissions to roles in seed script
  ```go
  // Admin gets all permissions
  // Editor gets create, read, update (not delete)
  // Member gets create, read
  // Viewer gets read only
  ```

---

## Phase 2: Repository Layer

### Step 4: Create Permission Repository

- [ ] Create `internal/repository/permission.go`
  ```go
  type PermissionRepository interface {
      GetByName(ctx context.Context, name string) (*model.Permission, error)
      List(ctx context.Context) ([]model.Permission, error)
  }
  ```

### Step 5: Create Role Repository

- [ ] Create `internal/repository/role.go`
  ```go
  type RoleRepository interface {
      GetByID(ctx context.Context, id uuid.UUID) (*model.Role, error)
      List(ctx context.Context, familyID *uuid.UUID) ([]model.Role, error)
      Create(ctx context.Context, role *model.Role) (*model.Role, error)
      Update(ctx context.Context, id uuid.UUID, role *model.Role) (*model.Role, error)
      Delete(ctx context.Context, id uuid.UUID) error
      GetPermissions(ctx context.Context, roleID uuid.UUID) ([]model.Permission, error)
      AssignPermission(ctx context.Context, roleID, permissionID uuid.UUID) error
      RemovePermission(ctx context.Context, roleID, permissionID uuid.UUID) error
  }
  ```

### Step 6: Create Family Member Role Repository

- [ ] Create `internal/repository/family_member_role.go`
  ```go
  type FamilyMemberRoleRepository interface {
      AssignRole(ctx context.Context, familyMemberID, roleID uuid.UUID) error
      RemoveRole(ctx context.Context, familyMemberID, roleID uuid.UUID) error
      GetUserRoles(ctx context.Context, familyMemberID uuid.UUID) ([]model.Role, error)
      GetRoleMembers(ctx context.Context, roleID uuid.UUID) ([]model.FamilyMember, error)
  }
  ```

---

## Phase 3: Authorization Service

### Step 7: Create Authorization Service

- [ ] Create `internal/service/authorization.go`
  ```go
  type AuthorizationService interface {
      // Check if user has specific permission
      HasPermission(ctx context.Context, userID uuid.UUID, familyID uuid.UUID, permission string) (bool, error)
      
      // Check if user has any of the permissions
      HasAnyPermission(ctx context.Context, userID uuid.UUID, familyID uuid.UUID, permissions []string) (bool, error)
      
      // Get all user permissions in a family
      GetUserPermissions(ctx context.Context, userID uuid.UUID, familyID uuid.UUID) ([]string, error)
      
      // Check if user is family admin
      IsFamilyAdmin(ctx context.Context, userID uuid.UUID, familyID uuid.UUID) (bool, error)
  }
  
  type authorizationService struct {
      familyMemberRepo     repository.FamilyMemberRepository
      familyMemberRoleRepo repository.FamilyMemberRoleRepository
      roleRepo             repository.RoleRepository
  }
  ```

- [ ] Implement `HasPermission` method
  ```go
  func (s *authorizationService) HasPermission(ctx context.Context, userID uuid.UUID, familyID uuid.UUID, permission string) (bool, error) {
      // 1. Get user's family member record
      // 2. Get all roles assigned to this family member
      // 3. For each role, get permissions
      // 4. Check if permission exists in the list
      // 5. Return true/false
  }
  ```

- [ ] Implement caching (optional but recommended)
  ```go
  // Use Redis or in-memory cache for permissions
  // Cache key: "user:{userID}:family:{familyID}:permissions"
  // TTL: 5-15 minutes
  ```

---

## Phase 4: Middleware & Integration

### Step 8: Create Permission Middleware

- [ ] Create `internal/middleware/permission.go`
  ```go
  func RequirePermission(authzService service.AuthorizationService, permission string) gin.HandlerFunc {
      return func(c *gin.Context) {
          userID := c.GetString("userId")
          familyID := c.Param("family_id") // or from request body
          
          hasPermission, err := authzService.HasPermission(c.Request.Context(), userID, familyID, permission)
          if err != nil {
              c.JSON(500, gin.H{"error": "Authorization check failed"})
              c.Abort()
              return
          }
          
          if !hasPermission {
              c.JSON(403, gin.H{"error": "Insufficient permissions"})
              c.Abort()
              return
          }
          
          c.Next()
      }
  }
  ```

### Step 9: Update Wallet Service (Example Module)

- [ ] Add authz service to wallet service
  ```go
  type walletService struct {
      walletRepo     repository.WalletRepository
      authzService   service.AuthorizationService
      // ... other repos
  }
  ```

- [ ] Update Create method
  ```go
  func (s *walletService) Create(ctx context.Context, req *dto.CreateWalletRequest, userID uuid.UUID) (*model.Wallet, error) {
      // Check permission
      hasPermission, err := s.authzService.HasPermission(ctx, userID, req.FamilyID, "wallet:create")
      if err != nil {
          return nil, NewInternalError("check permission", err)
      }
      if !hasPermission {
          return nil, NewUnauthorizedError("user lacks permission to create wallets")
      }
      
      // ... rest of logic
  }
  ```

- [ ] Update Update method
  ```go
  // Replace ownership check with permission check
  hasPermission, err := s.authzService.HasPermission(ctx, userID, existingWallet.FamilyID, "wallet:update")
  if !hasPermission {
      return NewUnauthorizedError("user lacks permission to update wallets")
  }
  ```

- [ ] Update Delete method similarly

### Step 10: Apply to Routes (Optional Alternative)

- [ ] Update `internal/route/wallet.go` to use middleware
  ```go
  func RegisterWalletRoutes(router *gin.RouterGroup, db *gorm.DB, authzService service.AuthorizationService) {
      // ... initialize controllers
      
      router.POST("", 
          middleware.RequirePermission(authzService, "wallet:create"),
          walletController.Create)
          
      router.GET("/family/:family_id", 
          middleware.RequirePermission(authzService, "wallet:read"),
          walletController.List)
          
      router.PUT("/:wallet_id", 
          middleware.RequirePermission(authzService, "wallet:update"),
          walletController.Update)
          
      router.DELETE("/:wallet_id", 
          middleware.RequirePermission(authzService, "wallet:delete"),
          walletController.Delete)
  }
  ```

---

## Phase 5: Role Management (Admin Features)

### Step 11: Create Role Service

- [ ] Create `internal/service/role.go`
  ```go
  type RoleService interface {
      Create(ctx context.Context, role *dto.CreateRoleRequest, adminUserID uuid.UUID) (*model.Role, error)
      Update(ctx context.Context, id uuid.UUID, role *dto.UpdateRoleRequest, adminUserID uuid.UUID) (*model.Role, error)
      Delete(ctx context.Context, id uuid.UUID, adminUserID uuid.UUID) error
      AssignPermission(ctx context.Context, roleID, permissionID uuid.UUID, adminUserID uuid.UUID) error
      RemovePermission(ctx context.Context, roleID, permissionID uuid.UUID, adminUserID uuid.UUID) error
      AssignToUser(ctx context.Context, familyMemberID, roleID uuid.UUID, adminUserID uuid.UUID) error
      RemoveFromUser(ctx context.Context, familyMemberID, roleID uuid.UUID, adminUserID uuid.UUID) error
  }
  ```

- [ ] Implement with admin checks
  ```go
  func (s *roleService) Create(ctx context.Context, req *dto.CreateRoleRequest, adminUserID uuid.UUID) (*model.Role, error) {
      // Verify admin has permission (only family admins can manage roles)
      isAdmin, err := s.authzService.IsFamilyAdmin(ctx, adminUserID, req.FamilyID)
      if !isAdmin {
          return nil, NewUnauthorizedError("only family admins can create roles")
      }
      
      // ... create role
  }
  ```

### Step 12: Create Role Controller

- [ ] Create `internal/controller/role.go`
  ```go
  type RoleController struct {
      svc service.RoleService
  }
  
  func (c *RoleController) Create(ctx *gin.Context) { }
  func (c *RoleController) List(ctx *gin.Context) { }
  func (c *RoleController) Update(ctx *gin.Context) { }
  func (c *RoleController) Delete(ctx *gin.Context) { }
  func (c *RoleController) AssignPermission(ctx *gin.Context) { }
  func (c *RoleController) RemovePermission(ctx *gin.Context) { }
  ```

### Step 13: Create Role Routes

- [ ] Create `internal/route/role.go`
  ```go
  router.GET("/families/:family_id/roles", roleController.List)
  router.POST("/families/:family_id/roles", roleController.Create)
  router.PUT("/roles/:id", roleController.Update)
  router.DELETE("/roles/:id", roleController.Delete)
  router.POST("/roles/:id/permissions", roleController.AssignPermission)
  router.DELETE("/roles/:id/permissions/:permission_id", roleController.RemovePermission)
  ```

### Step 14: Create Family Member Role Management

- [ ] Add endpoints to assign/remove roles from users
  ```go
  router.POST("/family-members/:id/roles", memberRoleController.AssignRole)
  router.DELETE("/family-members/:id/roles/:role_id", memberRoleController.RemoveRole)
  router.GET("/family-members/:id/roles", memberRoleController.ListUserRoles)
  ```

---

## Phase 6: Migration & Testing

### Step 15: Auto-assign Admin Role on Family Creation

- [ ] Update `family.go` service to assign admin role
  ```go
  func (s *familyService) Create(ctx context.Context, family *model.Family, creatorUserID uuid.UUID) error {
      // ... create family
      
      // Get "Family Admin" role
      adminRole := // fetch system admin role
      
      // Assign to creator
      s.familyMemberRoleRepo.AssignRole(ctx, familyMember.ID, adminRole.ID)
  }
  ```

### Step 16: Migrate Existing Users

- [ ] Create migration script to assign default roles to existing family members
  ```go
  // For each existing family:
  //   - Creator gets "Family Admin" role
  //   - Others get "Member" role (or prompt admin to assign)
  ```

### Step 17: Test Suite

- [ ] Test permission checks work correctly
- [ ] Test middleware authorization
- [ ] Test role assignment/removal
- [ ] Test permission inheritance
- [ ] Test admin-only operations

---

## Phase 7: Apply to Other Modules

### Step 18: Apply RBAC to Income Module

- [ ] Update income service with authorization checks
- [ ] Update routes or add middleware
- [ ] Test

### Step 19: Apply RBAC to Expense Module

- [ ] Same as income

### Step 20: Apply RBAC to Budget, Goals, etc.

- [ ] Repeat for all modules

---

## Phase 8: Frontend Integration (Future)

### Step 21: Create Frontend Permission Utilities

- [ ] Add permissions to user context
- [ ] Create `usePermission()` hook
- [ ] Hide/disable UI elements based on permissions

### Step 22: Admin Settings Page

- [ ] Create role management UI
- [ ] Create user role assignment UI
- [ ] Create permission matrix view

---

## Best Practices & Tips

### Permission Naming Convention
- Use format: `{resource}:{action}`
- Examples: `wallet:create`, `income:read`, `expense:delete`

### Caching Strategy
- Cache user permissions for 5-15 minutes
- Invalidate cache on role assignment/removal
- Use Redis for distributed systems

### Testing Checklist
- ✅ Admin can do everything
- ✅ Editor cannot delete
- ✅ Member cannot update/delete
- ✅ Viewer can only read
- ✅ Custom roles work correctly

### Security Considerations
- Always verify family membership before checking permissions
- Don't expose system role IDs to clients
- Log permission denials for audit
- Rate limit role management endpoints

---

## Estimated Timeline

| Phase | Estimated Time |
|-------|---------------|
| Phase 1: Database & Models | 2-3 hours |
| Phase 2: Repositories | 2-3 hours |
| Phase 3: Authorization Service | 3-4 hours |
| Phase 4: Integration | 2-3 hours |
| Phase 5: Role Management | 3-4 hours |
| Phase 6: Migration & Testing | 2-3 hours |
| Phase 7: Apply to Modules | 4-6 hours |
| **Total** | **18-26 hours** |

---

## Next Steps After Implementation

1. Monitor permission check performance
2. Add audit logging for sensitive operations
3. Create analytics dashboard for role usage
4. Consider implementing row-level security for advanced use cases
5. Add bulk role assignment features
6. Implement role templates for common scenarios

Good luck with implementation! 🚀
