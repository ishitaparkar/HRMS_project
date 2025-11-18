# Permission Checking Utilities and Decorators

This document describes the permission checking utilities, decorators, and permission classes implemented for the RBAC system.

## Overview

The permission system consists of three main components:

1. **Permission Classes** (`permissions.py`) - DRF permission classes for API endpoint protection
2. **Decorators** (`decorators.py`) - Function decorators for permission checking and audit logging
3. **Utility Functions** (`utils.py`) - Helper functions for role and permission checks

## Permission Classes

### BaseRolePermission

Base class for all role-based permissions. Provides core functionality for checking roles and permissions.

**Attributes:**
- `required_roles`: List of role names that are allowed
- `required_permissions`: List of permission codenames required

**Methods:**
- `has_permission(request, view)`: Checks if user has required roles/permissions
- `has_object_permission(request, view, obj)`: Checks object-level permissions

**Usage:**
```python
from authentication.permissions import BaseRolePermission

class MyCustomPermission(BaseRolePermission):
    required_roles = ['HR Manager', 'Super Admin']
    required_permissions = ['view_all_employees']
```

### IsEmployee

Permission class for Employee role. Allows access only to user's own data.

**Usage:**
```python
from rest_framework import viewsets
from authentication.permissions import IsEmployee

class MyViewSet(viewsets.ModelViewSet):
    permission_classes = [IsEmployee]
```

### IsDepartmentHead

Permission class for Department Head role. Allows access to department-scoped data.

**Features:**
- Validates department scope for objects
- HR Manager and Super Admin bypass department restrictions
- Logs access denials with department information

### IsHRManager

Permission class for HR Manager role. Allows access to all HR-related resources.

**Allowed Roles:**
- HR Manager
- Super Admin

### IsSuperAdmin

Permission class for Super Admin role. Allows full system access.

**Allowed Roles:**
- Super Admin only

## Utility Functions

### has_role(user, role_name)

Check if a user has a specific role.

**Parameters:**
- `user` (User): The user to check
- `role_name` (str): Name of the role

**Returns:** `bool`

**Example:**
```python
from authentication.permissions import has_role

if has_role(request.user, 'HR Manager'):
    # User is an HR Manager
    pass
```

### has_permission(user, permission_codename)

Check if a user has a specific permission.

**Parameters:**
- `user` (User): The user to check
- `permission_codename` (str): Codename of the permission (e.g., 'view_all_employees')

**Returns:** `bool`

**Example:**
```python
from authentication.permissions import has_permission

if has_permission(request.user, 'view_all_employees'):
    # User can view all employees
    pass
```

### get_user_department(user)

Get the department of a user from their profile.

**Parameters:**
- `user` (User): The user to get department for

**Returns:** `str` or `None`

**Example:**
```python
from authentication.permissions import get_user_department

department = get_user_department(request.user)
if department == 'Computer Science':
    # User is in Computer Science department
    pass
```

### validate_department_scope(user, obj)

Validate if a user can access an object based on department scope.

**Parameters:**
- `user` (User): The user requesting access
- `obj`: The object being accessed (must have 'department' attribute or related employee)

**Returns:** `bool`

**Example:**
```python
from authentication.permissions import validate_department_scope

if validate_department_scope(request.user, employee):
    # User can access this employee (same department)
    pass
```

### log_access_denied(request, resource_type, resource_id, required_permission, details)

Create an audit log entry for access denied events.

**Parameters:**
- `request`: Django/DRF request object
- `resource_type` (str): Type of resource being accessed
- `resource_id` (int, optional): ID of the specific resource
- `required_permission` (str, optional): Permission that was required
- `details` (dict, optional): Additional details to log

**Example:**
```python
from authentication.permissions import log_access_denied

log_access_denied(
    request,
    resource_type='Employee',
    resource_id=employee.id,
    required_permission='view_all_employees',
    details={'reason': 'Outside department scope'}
)
```

## Decorators

### @audit_permission_check(resource_type, action)

Decorator to audit permission checks and denials. Automatically logs 403 responses.

**Parameters:**
- `resource_type` (str): Type of resource being accessed
- `action` (str): Action being performed (default: 'ACCESS')

**Usage:**
```python
from authentication.decorators import audit_permission_check

@audit_permission_check('Employee', 'VIEW')
def my_view(request):
    # View logic
    return Response(data)
```

### @require_role(*role_names)

Decorator to require specific roles for accessing a view.

**Parameters:**
- `*role_names`: Variable number of role names that are allowed

**Usage:**
```python
from authentication.decorators import require_role

@require_role('HR Manager', 'Super Admin')
def my_view(request):
    # Only HR Manager and Super Admin can access
    return Response(data)
```

### @require_permission(*permission_codenames)

Decorator to require specific permissions for accessing a view.

**Parameters:**
- `*permission_codenames`: Variable number of permission codenames required

**Usage:**
```python
from authentication.decorators import require_permission

@require_permission('view_all_employees', 'manage_employees')
def my_view(request):
    # User must have both permissions
    return Response(data)
```

### @log_audit(action, resource_type)

Decorator to automatically log successful actions in the audit log.

**Parameters:**
- `action` (str): Action being performed (e.g., 'ROLE_ASSIGNED')
- `resource_type` (str): Type of resource being modified

**Usage:**
```python
from authentication.decorators import log_audit

@log_audit('ROLE_ASSIGNED', 'User')
def assign_role_view(request, user_id):
    # Successful role assignments will be logged
    return Response(data)
```

## Audit Logging

All permission denials are automatically logged to the `AuditLog` model with the following information:

- **action**: 'ACCESS_DENIED'
- **actor**: User who attempted access
- **resource_type**: Type of resource being accessed
- **resource_id**: ID of the specific resource (if applicable)
- **details**: JSON field containing:
  - `required_permission` or `required_roles`
  - `user_roles`: List of roles the user has
  - `path`: Request path
  - `method`: HTTP method
  - Additional context-specific information
- **ip_address**: IP address of the client
- **timestamp**: When the access was denied

## Integration with DRF Views

### Using Permission Classes

```python
from rest_framework import viewsets
from authentication.permissions import IsHRManager, IsDepartmentHead

class EmployeeViewSet(viewsets.ModelViewSet):
    permission_classes = [IsHRManager | IsDepartmentHead]
    
    def get_queryset(self):
        user = self.request.user
        
        if has_role(user, 'HR Manager') or has_role(user, 'Super Admin'):
            # Return all employees
            return Employee.objects.all()
        elif has_role(user, 'Department Head'):
            # Return department employees only
            dept = get_user_department(user)
            return Employee.objects.filter(department=dept)
        else:
            # Return own employee record only
            if hasattr(user, 'profile') and user.profile.employee:
                return Employee.objects.filter(id=user.profile.employee.id)
            return Employee.objects.none()
```

### Using Decorators with APIView

```python
from rest_framework.views import APIView
from rest_framework.response import Response
from authentication.decorators import require_role, audit_permission_check

class MyAPIView(APIView):
    @require_role('HR Manager', 'Super Admin')
    @audit_permission_check('Employee', 'CREATE')
    def post(self, request):
        # Only HR Manager and Super Admin can create employees
        # Access attempts are audited
        return Response({'status': 'created'})
```

## Error Responses

### 401 Unauthorized
Returned when user is not authenticated.

```json
{
    "detail": "Authentication credentials were not provided."
}
```

### 403 Forbidden (Missing Role)
Returned when user lacks required role.

```json
{
    "detail": "You do not have permission to perform this action.",
    "required_roles": ["HR Manager", "Super Admin"]
}
```

### 403 Forbidden (Missing Permission)
Returned when user lacks required permission.

```json
{
    "detail": "You do not have permission to perform this action.",
    "required_permissions": ["view_all_employees"],
    "missing_permissions": ["view_all_employees"]
}
```

### 403 Forbidden (Department Scope)
Returned when user attempts to access data outside their department.

```json
{
    "detail": "You can only access resources within your department.",
    "your_department": "Computer Science"
}
```

## Testing

Comprehensive tests are provided in `authentication/tests.py`:

- **PermissionUtilityTests**: Tests for utility functions
- **BaseRolePermissionTests**: Tests for base permission class
- **RoleSpecificPermissionTests**: Tests for role-specific permission classes
- **AuditLoggingTests**: Tests for audit logging functionality

Run tests with:
```bash
python manage.py test authentication.tests
```

## Requirements Satisfied

This implementation satisfies the following requirements from the design document:

- **7.1**: API endpoints verify authentication token
- **7.2**: Authenticated requests retrieve user roles and permissions
- **7.3**: Users lacking permissions receive 403 Forbidden with descriptive error
- **7.4**: Permission checks execute before database queries/modifications
- **7.5**: All permission denials are logged with user, resource, and timestamp

## Next Steps

After implementing these utilities, the next tasks are:

1. Create role-specific permission classes (Task 4)
2. Update authentication endpoints with role information (Task 5)
3. Protect employee management endpoints (Task 6)
4. Protect leave management endpoints (Task 7)
5. Create role management API endpoints (Task 8)
