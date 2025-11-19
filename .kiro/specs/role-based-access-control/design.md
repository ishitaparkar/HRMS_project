# Design Document: Role-Based Access Control for HRMS

## Overview

This design implements a comprehensive Role-Based Access Control (RBAC) system for the university HRMS application using Django's built-in authentication framework extended with custom models and Django REST Framework permissions. The solution provides hierarchical roles, granular permissions, department-scoped access, and audit logging while maintaining backward compatibility with existing Employee and LeaveRequest models.

The implementation leverages Django's Group model for roles, custom Permission objects for fine-grained access control, and DRF's permission classes for API endpoint protection. The frontend will receive role and permission data during authentication to enable conditional UI rendering.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     React Frontend                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Role-based   │  │ Permission   │  │ Conditional  │     │
│  │ Routing      │  │ Context      │  │ UI Rendering │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                    ┌───────▼────────┐
                    │   REST API     │
                    │  (DRF Views)   │
                    └───────┬────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────▼────────┐  ┌──────▼──────┐  ┌────────▼────────┐
│  Permission    │  │  Role       │  │  Audit          │
│  Middleware    │  │  Manager    │  │  Logger         │
└───────┬────────┘  └──────┬──────┘  └────────┬────────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                            │
                ┌───────────▼───────────┐
                │   Django ORM Layer    │
                └───────────┬───────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────▼────────┐  ┌──────▼──────┐  ┌────────▼────────┐
│  User/Profile  │  │  Role &     │  │  Audit Log      │
│  Models        │  │  Permission │  │  Models         │
└────────────────┘  └─────────────┘  └─────────────────┘
```

### Component Interaction Flow

1. **Authentication Flow**: User logs in → Backend validates credentials → Returns token + role + permissions
2. **Authorization Flow**: API request → Token validation → Role/permission check → Resource access control → Response
3. **Audit Flow**: Permission change → Audit log creation → Timestamp + user + action recorded

## Components and Interfaces

### 1. Database Models

#### UserProfile Model (New)
Extends Django's User model with HRMS-specific fields and links to Employee model.

```python
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    employee = models.OneToOneField(Employee, on_delete=models.SET_NULL, null=True, blank=True)
    department = models.CharField(max_length=100, blank=True)
    phone_number = models.CharField(max_length=15, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

**Relationships:**
- One-to-One with Django User (authentication)
- One-to-One with Employee (HR data)
- Many-to-Many with Role through User.groups

#### Role Model (Django Group)
Uses Django's built-in Group model, renamed conceptually as "Role".

```python
# Django's Group model (used as Role)
# We'll use this directly but refer to it as "Role" in documentation
```

**Predefined Roles:**
- Super Admin (full system access)
- HR Manager (all HR operations)
- Department Head (department-scoped access)
- Employee (self-service only)

#### Permission Model (Django Permission)
Uses Django's built-in Permission model with custom permissions.

```python
# Custom permissions defined in Meta classes of models
class Employee(models.Model):
    # ... existing fields ...
    
    class Meta:
        permissions = [
            ("view_all_employees", "Can view all employees"),
            ("view_department_employees", "Can view department employees"),
            ("manage_employees", "Can manage employees"),
        ]
```

**Permission Categories:**
- employee_management: view_all_employees, view_department_employees, manage_employees
- leave_management: view_all_leaves, view_department_leaves, approve_leaves, manage_own_leaves
- payroll_management: view_all_payroll, manage_payroll
- attendance_management: view_all_attendance, view_department_attendance, manage_own_attendance
- system_administration: manage_roles, manage_users, view_audit_logs

#### RoleAssignment Model (New)
Tracks role assignments with metadata for auditing and temporary assignments.

```python
class RoleAssignment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    role = models.ForeignKey(Group, on_delete=models.CASCADE)
    assigned_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='assigned_roles')
    assigned_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    notes = models.TextField(blank=True)
```

#### AuditLog Model (New)
Records all permission and role changes for security compliance.

```python
class AuditLog(models.Model):
    ACTION_CHOICES = [
        ('ROLE_ASSIGNED', 'Role Assigned'),
        ('ROLE_REVOKED', 'Role Revoked'),
        ('PERMISSION_CHANGED', 'Permission Changed'),
        ('ACCESS_DENIED', 'Access Denied'),
    ]
    
    action = models.CharField(max_length=50, choices=ACTION_CHOICES)
    actor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='audit_actions')
    target_user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='audit_targets')
    resource_type = models.CharField(max_length=100)
    resource_id = models.IntegerField(null=True, blank=True)
    details = models.JSONField()
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
```

### 2. Permission Classes (DRF)

#### BaseRolePermission
Base class for all role-based permissions.

```python
class BaseRolePermission(permissions.BasePermission):
    required_roles = []
    required_permissions = []
    
    def has_permission(self, request, view):
        # Check if user is authenticated
        # Check if user has required roles
        # Check if user has required permissions
        # Log access attempts
```

#### IsEmployee
Allows access to own data only.

```python
class IsEmployee(BaseRolePermission):
    def has_object_permission(self, request, view, obj):
        # Allow if obj.employee == request.user.profile.employee
```

#### IsDepartmentHead
Allows access to department-scoped data.

```python
class IsDepartmentHead(BaseRolePermission):
    required_roles = ['Department Head']
    
    def has_object_permission(self, request, view, obj):
        # Allow if obj.department == request.user.profile.department
```

#### IsHRManager
Allows access to all HR data.

```python
class IsHRManager(BaseRolePermission):
    required_roles = ['HR Manager', 'Super Admin']
```

#### IsSuperAdmin
Allows full system access.

```python
class IsSuperAdmin(BaseRolePermission):
    required_roles = ['Super Admin']
```

### 3. API Endpoints

#### Authentication Endpoints

**POST /api/auth/login/**
- Request: `{ "username": "string", "password": "string" }`
- Response: `{ "token": "string", "user_id": int, "email": "string", "roles": ["string"], "permissions": ["string"], "department": "string" }`

**GET /api/auth/me/**
- Response: `{ "user": {...}, "roles": [...], "permissions": [...], "employee": {...} }`

#### Role Management Endpoints (Super Admin only)

**GET /api/roles/**
- Lists all available roles with permissions

**POST /api/roles/**
- Creates a new custom role

**PUT /api/roles/{id}/**
- Updates role permissions

**DELETE /api/roles/{id}/**
- Deletes a custom role

#### User Role Assignment Endpoints

**POST /api/users/{id}/assign-role/**
- Request: `{ "role_id": int, "expires_at": "datetime", "notes": "string" }`
- Assigns a role to a user

**POST /api/users/{id}/revoke-role/**
- Request: `{ "role_id": int }`
- Revokes a role from a user

**GET /api/users/{id}/roles/**
- Lists all roles assigned to a user

#### Audit Log Endpoints (Super Admin only)

**GET /api/audit-logs/**
- Query parameters: `?action=ROLE_ASSIGNED&start_date=...&end_date=...&user_id=...`
- Returns filtered audit logs

### 4. Modified Existing Endpoints

All existing endpoints will be updated with permission classes:

**Employee Management:**
- GET /api/employees/ - Filtered by role (all, department, or self)
- POST /api/employees/ - Requires manage_employees permission
- GET /api/employees/{id}/ - Filtered by role
- PUT /api/employees/{id}/ - Requires manage_employees permission
- DELETE /api/employees/{id}/ - Requires manage_employees permission

**Leave Management:**
- GET /api/leave-requests/ - Filtered by role
- POST /api/leave-requests/ - Employees can create for self
- PUT /api/leave-requests/{id}/ - Requires approve_leaves permission
- DELETE /api/leave-requests/{id}/ - Own requests or manage permission

## Data Models

### Entity Relationship Diagram

```
┌─────────────────┐         ┌─────────────────┐
│   Django User   │◄───────►│  UserProfile    │
│                 │  1:1    │                 │
│ - username      │         │ - department    │
│ - email         │         │ - phone_number  │
│ - password      │         └────────┬────────┘
└────────┬────────┘                  │ 1:1
         │ M:N                       │
         │                           ▼
┌────────▼────────┐         ┌─────────────────┐
│  Django Group   │         │    Employee     │
│   (Role)        │         │                 │
│ - name          │         │ - firstName     │
└────────┬────────┘         │ - department    │
         │ M:N              │ - designation   │
         │                  └─────────────────┘
┌────────▼────────┐
│ Django          │
│ Permission      │
│ - codename      │
│ - name          │
└─────────────────┘

┌─────────────────┐         ┌─────────────────┐
│ RoleAssignment  │         │   AuditLog      │
│                 │         │                 │
│ - user_id       │         │ - action        │
│ - role_id       │         │ - actor_id      │
│ - assigned_by   │         │ - target_user   │
│ - expires_at    │         │ - details       │
│ - is_active     │         │ - timestamp     │
└─────────────────┘         └─────────────────┘
```

### Permission Matrix

| Role | View All Employees | View Dept Employees | Manage Employees | Approve Leaves | View All Payroll | Manage Roles |
|------|-------------------|---------------------|------------------|----------------|------------------|--------------|
| Employee | ❌ (Self only) | ❌ | ❌ | ❌ | ❌ (Self only) | ❌ |
| Department Head | ❌ | ✅ | ❌ | ✅ (Dept) | ❌ | ❌ |
| HR Manager | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Super Admin | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

## Error Handling

### Authentication Errors

**401 Unauthorized**
- Missing or invalid token
- Response: `{ "detail": "Authentication credentials were not provided." }`

### Authorization Errors

**403 Forbidden**
- User lacks required permissions
- Response: `{ "detail": "You do not have permission to perform this action.", "required_permission": "manage_employees" }`

**403 Forbidden (Department Scope)**
- User attempting to access data outside their department
- Response: `{ "detail": "You can only access resources within your department.", "your_department": "Computer Science" }`

### Validation Errors

**400 Bad Request**
- Invalid role assignment (e.g., role doesn't exist)
- Response: `{ "role_id": ["Invalid role ID."] }`

**400 Bad Request**
- Attempting to assign conflicting roles
- Response: `{ "detail": "Cannot assign both Employee and HR Manager roles simultaneously." }`

### Audit Logging for Errors

All 403 Forbidden responses will create an AuditLog entry with action='ACCESS_DENIED' including:
- Actor (requesting user)
- Resource type and ID
- Required permission
- Timestamp and IP address

## Testing Strategy

### Unit Tests

**Model Tests:**
- UserProfile creation and relationships
- RoleAssignment expiration logic
- AuditLog entry creation
- Permission checking methods

**Permission Class Tests:**
- BaseRolePermission.has_permission() with various roles
- IsEmployee.has_object_permission() for self-access
- IsDepartmentHead.has_object_permission() for department scope
- IsHRManager and IsSuperAdmin permission checks

**Serializer Tests:**
- UserSerializer includes roles and permissions
- Role filtering in EmployeeSerializer based on user role

### Integration Tests

**Authentication Flow:**
- Login returns correct role and permission data
- Token includes necessary claims
- /api/auth/me/ returns complete user profile

**Authorization Flow:**
- Employee can only access own data
- Department Head can access department data
- HR Manager can access all data
- Super Admin has full access

**Role Assignment:**
- Super Admin can assign roles
- Non-admin cannot assign roles
- Temporary roles expire correctly
- Audit logs are created for assignments

**API Endpoint Protection:**
- Each endpoint respects permission requirements
- Filtered querysets return appropriate data
- 403 responses for unauthorized access

### End-to-End Tests

**Employee Self-Service:**
1. Employee logs in
2. Views own profile
3. Submits leave request
4. Cannot view other employees

**Department Head Workflow:**
1. Department Head logs in
2. Views department employees
3. Approves department leave request
4. Cannot access other departments

**HR Manager Workflow:**
1. HR Manager logs in
2. Creates new employee
3. Approves leave requests across departments
4. Manages payroll for all employees

**Super Admin Workflow:**
1. Super Admin logs in
2. Creates custom role
3. Assigns role to user
4. Views audit logs
5. Revokes role from user

### Security Tests

**Permission Bypass Attempts:**
- Direct API calls without proper permissions
- Token manipulation attempts
- Department scope bypass attempts

**Audit Log Integrity:**
- All permission changes are logged
- Logs cannot be modified or deleted by non-admins
- Timestamp accuracy

## Frontend Integration

### Authentication Response Enhancement

The existing `CustomAuthToken` view will be modified to include:
```python
return Response({
    'token': token.key,
    'user_id': user.pk,
    'email': user.email,
    'roles': [group.name for group in user.groups.all()],
    'permissions': list(user.get_all_permissions()),
    'department': user.profile.department if hasattr(user, 'profile') else None,
})
```

### React Context for Permissions

Create a `PermissionContext` to store and access user permissions throughout the app:

```javascript
// contexts/PermissionContext.js
const PermissionContext = createContext({
  roles: [],
  permissions: [],
  hasPermission: (permission) => false,
  hasRole: (role) => false,
});
```

### Conditional Rendering

Components will use the permission context to conditionally render UI elements:

```javascript
const { hasPermission, hasRole } = usePermission();

{hasPermission('manage_employees') && (
  <button onClick={handleAddEmployee}>Add Employee</button>
)}

{hasRole('Department Head') && (
  <DepartmentDashboard />
)}
```

### Route Protection

Update `ProtectedRoute` component to check for specific roles:

```javascript
<ProtectedRoute 
  path="/admin" 
  component={AdminPanel} 
  requiredRole="Super Admin"
/>
```

## Implementation Phases

### Phase 1: Backend Foundation
1. Create UserProfile, RoleAssignment, and AuditLog models
2. Create and run migrations
3. Define custom permissions on existing models
4. Create predefined roles with permissions

### Phase 2: Permission Classes
1. Implement BaseRolePermission and role-specific classes
2. Create utility functions for permission checking
3. Implement audit logging decorator

### Phase 3: API Protection
1. Add permission classes to existing views
2. Implement filtered querysets based on roles
3. Update authentication endpoint to return role data
4. Create role management endpoints

### Phase 4: Frontend Integration
1. Update login flow to store role/permission data
2. Create PermissionContext and provider
3. Implement conditional rendering in components
4. Update routing with role requirements

### Phase 5: Testing & Refinement
1. Write and run unit tests
2. Perform integration testing
3. Conduct security testing
4. Fix bugs and optimize performance

## Security Considerations

1. **Token Security**: Ensure tokens are transmitted over HTTPS only
2. **Permission Caching**: Cache user permissions to reduce database queries, invalidate on role changes
3. **SQL Injection**: Use Django ORM parameterized queries (already handled)
4. **Audit Log Protection**: Restrict audit log access to Super Admin only
5. **Role Hierarchy**: Enforce role hierarchy in permission checks
6. **Department Validation**: Validate department assignments to prevent unauthorized access
7. **Temporary Role Cleanup**: Implement scheduled task to expire temporary roles
8. **Password Policy**: Enforce strong passwords for admin roles
9. **Session Management**: Implement token expiration and refresh mechanism
10. **Rate Limiting**: Add rate limiting to authentication endpoints

## Migration Strategy

### Data Migration

1. Create UserProfile for all existing Django users
2. Link existing Employee records to UserProfile
3. Assign default "Employee" role to all existing users
4. Identify and manually assign admin roles

### Backward Compatibility

- Existing API endpoints will continue to work
- Unauthenticated access will be denied (breaking change)
- Frontend must be updated to handle role-based rendering

### Rollout Plan

1. Deploy backend changes to staging
2. Test all endpoints with different roles
3. Update frontend with permission context
4. Deploy to production during maintenance window
5. Communicate changes to users
6. Provide training for role management

## Performance Considerations

1. **Permission Caching**: Cache user permissions in session/token to avoid repeated database queries
2. **Queryset Optimization**: Use select_related() and prefetch_related() for role/permission queries
3. **Index Creation**: Add database indexes on UserProfile.department and RoleAssignment.user_id
4. **Audit Log Archival**: Implement periodic archival of old audit logs
5. **Role Check Optimization**: Use Django's permission caching mechanism

## Monitoring and Maintenance

1. **Metrics to Track**:
   - Permission denial rate by endpoint
   - Role assignment frequency
   - Audit log growth rate
   - API response times with permission checks

2. **Alerts**:
   - Unusual number of permission denials
   - Failed role assignment attempts
   - Audit log tampering attempts

3. **Regular Reviews**:
   - Quarterly review of role assignments
   - Annual review of permission matrix
   - Regular audit log analysis for security incidents
