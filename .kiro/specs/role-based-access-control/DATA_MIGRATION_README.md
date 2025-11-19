# Data Migration for Existing Users

## Overview

This document explains the data migration that was performed to create UserProfile records for all existing users and the management command available for assigning admin roles.

## What Was Done

### Migration 0003_populate_user_profiles

This data migration automatically:

1. **Created UserProfile records** for all existing Django User instances
2. **Linked Employee records** to UserProfiles based on email matching:
   - First tries to match User.username (if it's an email) with Employee.personalEmail
   - Then tries to match User.email with Employee.personalEmail
   - If a match is found, links the Employee and copies the department to UserProfile
3. **Assigned default "Employee" role** to all existing users who didn't have any roles
4. **Created RoleAssignment records** for audit trail purposes

### Migration Results

The migration provides a summary showing:
- Number of UserProfiles created
- Number of UserProfiles successfully linked to Employee records
- Number of default "Employee" roles assigned

## Management Command: assign_admin_roles

A management command is available to help identify and assign admin roles to users.

### Usage

#### 1. List All Users and Their Roles

```bash
python manage.py assign_admin_roles --list
```

This displays:
- Username and email
- Current roles
- Linked employee information (if available)

#### 2. Auto-Detect Potential Admin Users

```bash
python manage.py assign_admin_roles --auto-detect
```

This automatically identifies potential admin users based on:
- Username or email contains "admin"
- Django superuser flag is set
- Django staff flag is set
- Employee designation contains "HR", "Manager", "Head", "Director", or "Chief"

The command will suggest appropriate roles for each detected user.

#### 3. Manually Assign a Role

```bash
python manage.py assign_admin_roles --assign <username> --role "<role_name>" --notes "Optional notes"
```

**Available roles:**
- `Super Admin` - Full system access including role management
- `HR Manager` - Access to all HR operations across departments
- `Department Head` - Access to department-scoped data
- `Employee` - Self-service access only

**Examples:**

```bash
# Assign Super Admin role
python manage.py assign_admin_roles --assign john.doe --role "Super Admin" --notes "System administrator"

# Assign HR Manager role
python manage.py assign_admin_roles --assign jane.smith --role "HR Manager" --notes "HR department lead"

# Assign Department Head role
python manage.py assign_admin_roles --assign bob.jones --role "Department Head" --notes "Computer Science department head"
```

## Post-Migration Steps

After running the migration, you should:

1. **Review all users and their roles:**
   ```bash
   python manage.py assign_admin_roles --list
   ```

2. **Auto-detect potential admin users:**
   ```bash
   python manage.py assign_admin_roles --auto-detect
   ```

3. **Assign appropriate admin roles** to users who need elevated permissions:
   ```bash
   python manage.py assign_admin_roles --assign <username> --role "<role_name>"
   ```

4. **Verify role assignments** by listing users again

## Important Notes

- All users start with the default "Employee" role
- Users can have multiple roles simultaneously
- Role assignments are tracked in the RoleAssignment model for audit purposes
- The migration is reversible, but manual cleanup may be required for UserProfiles

## Troubleshooting

### UserProfile Not Linked to Employee

If a UserProfile was not automatically linked to an Employee record:

1. Check if the email addresses match between User and Employee
2. Manually link them through Django admin or shell:
   ```python
   from django.contrib.auth.models import User
   from authentication.models import UserProfile
   from employee_management.models import Employee
   
   user = User.objects.get(username='username')
   employee = Employee.objects.get(personalEmail='email@example.com')
   
   profile = user.profile
   profile.employee = employee
   profile.department = employee.department
   profile.save()
   ```

### Role Not Assigned

If a role assignment fails:

1. Ensure the role exists by running:
   ```bash
   python manage.py init_roles
   ```

2. Check if the user already has the role:
   ```bash
   python manage.py assign_admin_roles --list
   ```

3. Try assigning the role again

## Related Documentation

- [RBAC README](README_RBAC.md) - Overview of the Role-Based Access Control system
- [Permissions README](PERMISSIONS_README.md) - Detailed permission documentation
- [Role Expiration](ROLE_EXPIRATION_SCHEDULING.md) - Temporary role management
