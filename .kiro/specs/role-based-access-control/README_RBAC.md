# Role-Based Access Control (RBAC) System

## Overview

This module implements a comprehensive RBAC system for the HRMS application using Django's built-in authentication framework.

## Predefined Roles

The system includes four predefined roles with hierarchical permissions:

1. **Super Admin** - Full system access including user and role management
2. **HR Manager** - All HR operations across departments
3. **Department Head** - Department-scoped access for employee and leave management
4. **Employee** - Self-service access only

## Setup

### Initialize Roles and Permissions

Run the management command to create all predefined roles with their permissions:

```bash
python manage.py init_roles
```

This command:
- Creates the four predefined roles (if they don't exist)
- Assigns appropriate permissions to each role
- Can be run multiple times safely (idempotent)

## Utility Functions

The `authentication.utils` module provides helper functions for role management:

### Role Management

```python
from authentication.utils import (
    ensure_role_exists,
    ensure_all_roles_exist,
    get_role_by_name,
    assign_role_permissions,
)

# Ensure a specific role exists
role, created = ensure_role_exists('HR Manager')

# Ensure all predefined roles exist
results = ensure_all_roles_exist()

# Get a role by name
hr_role = get_role_by_name('HR Manager')

# Assign permissions to a role
permissions_count = assign_role_permissions(hr_role)
```

### User Role Checking

```python
from authentication.utils import (
    user_has_role,
    user_has_any_role,
    get_user_roles,
    get_user_role_names,
    get_highest_role,
)

# Check if user has a specific role
if user_has_role(user, 'HR Manager'):
    # User is an HR Manager
    pass

# Check if user has any of the specified roles
if user_has_any_role(user, ['HR Manager', 'Super Admin']):
    # User is either HR Manager or Super Admin
    pass

# Get all roles for a user
roles = get_user_roles(user)  # Returns QuerySet of Group objects
role_names = get_user_role_names(user)  # Returns list of role names

# Get the highest role in the hierarchy
highest = get_highest_role(user)  # Returns 'Super Admin', 'HR Manager', etc.
```

### Role Constants

```python
from authentication.utils import (
    ROLE_SUPER_ADMIN,
    ROLE_HR_MANAGER,
    ROLE_DEPARTMENT_HEAD,
    ROLE_EMPLOYEE,
    ROLE_HIERARCHY,
)

# Use constants instead of hardcoded strings
if user_has_role(user, ROLE_HR_MANAGER):
    pass
```

## Permission Matrix

### Super Admin
- All employee management permissions (view, add, change, delete)
- All leave management permissions (view, add, change, delete, approve)
- Custom permissions: view_all_employees, view_department_employees, manage_employees
- Custom permissions: view_all_leaves, view_department_leaves, approve_leaves, manage_own_leaves

### HR Manager
- All employee management permissions (view, add, change, delete)
- All leave management permissions (view, add, change, delete, approve)
- Custom permissions: view_all_employees, view_department_employees, manage_employees
- Custom permissions: view_all_leaves, view_department_leaves, approve_leaves

### Department Head
- View department employees
- View and approve department leave requests
- Manage own leave requests
- Custom permissions: view_department_employees, view_department_leaves, approve_leaves, manage_own_leaves

### Employee
- View own employee record
- Manage own leave requests
- Custom permissions: manage_own_leaves

## Assigning Roles to Users

```python
from django.contrib.auth.models import User
from authentication.utils import get_role_by_name

# Get the user and role
user = User.objects.get(username='john.doe')
hr_role = get_role_by_name('HR Manager')

# Assign the role
user.groups.add(hr_role)

# Remove a role
user.groups.remove(hr_role)
```

## Next Steps

After setting up roles and permissions:

1. Implement permission classes for DRF views (Task 3)
2. Create role-specific permission classes (Task 4)
3. Update authentication endpoints with role information (Task 5)
4. Protect API endpoints with permissions (Tasks 6-7)

## Notes

- Roles are implemented using Django's `Group` model
- Permissions use Django's built-in `Permission` model
- Custom permissions are defined in model `Meta` classes
- The system supports multiple roles per user
- Role hierarchy is enforced through the `get_highest_role()` function
