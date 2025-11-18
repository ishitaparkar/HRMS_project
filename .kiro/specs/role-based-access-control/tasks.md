# Implementation Plan: Role-Based Access Control

- [x] 1. Create core RBAC models and database schema
  - Create UserProfile model with one-to-one relationships to User and Employee models
  - Create RoleAssignment model to track role assignments with metadata (assigned_by, expires_at, is_active)
  - Create AuditLog model to record all permission and role changes
  - Define custom permissions in Employee and LeaveRequest model Meta classes
  - Generate and apply Django migrations for new models
  - _Requirements: 1.3, 2.3, 9.1, 9.2, 9.3, 9.4_

- [x] 2. Set up predefined roles and permissions
  - Create management command to initialize four predefined roles (Super Admin, HR Manager, Department Head, Employee)
  - Define permission sets for each role according to the permission matrix
  - Assign permissions to roles using Django's Group.permissions.add()
  - Create utility function to check if roles exist and create them if missing
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 3. Implement permission checking utilities and decorators
  - Create BaseRolePermission class extending DRF's BasePermission
  - Implement has_permission() method with role and permission validation
  - Create audit logging decorator to log permission checks and denials
  - Implement helper functions: has_role(), has_permission(), get_user_department()
  - Create department scope validation utility for Department Head role
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 4. Create role-specific permission classes
- [x] 4.1 Implement IsEmployee permission class
  - Override has_object_permission() to allow access only to user's own Employee record
  - Add logic to check if obj.employee matches request.user.profile.employee
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 4.2 Implement IsDepartmentHead permission class
  - Override has_object_permission() to check department scope
  - Add logic to compare obj.department with request.user.profile.department
  - Implement queryset filtering for department-scoped resources
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 4.3 Implement IsHRManager permission class
  - Set required_roles to ['HR Manager', 'Super Admin']
  - Allow access to all employee, leave, payroll, and attendance resources
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 4.4 Implement IsSuperAdmin permission class
  - Set required_roles to ['Super Admin']
  - Allow full system access including role management and audit logs
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 5. Update authentication endpoints with role information
  - Modify CustomAuthToken view to include roles, permissions, and department in response
  - Add serialization logic to extract user.groups.all() as roles list
  - Add user.get_all_permissions() to response as permissions list
  - Create /api/auth/me/ endpoint to return current user's profile with roles and permissions
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 6. Protect employee management endpoints with permissions
  - Add permission_classes to EmployeeListCreateAPIView (IsHRManager for POST, filtered GET)
  - Add permission_classes to EmployeeDetailAPIView (role-based access)
  - Implement get_queryset() override to filter employees by role (all/department/self)
  - Add permission check in perform_create() and perform_update() methods
  - Update serializers to include permission metadata in responses
  - _Requirements: 3.1, 3.2, 4.1, 4.2, 5.1, 5.2, 7.4_

- [x] 7. Protect leave management endpoints with permissions
  - Add permission_classes to leave request views (role-based access)
  - Implement get_queryset() to filter leave requests by role (all/department/self)
  - Add approval permission check for PUT requests that change status
  - Allow employees to create leave requests for themselves only
  - Restrict leave request deletion to own requests or users with manage permission
  - _Requirements: 3.3, 4.2, 4.3, 5.3_

- [x] 8. Create role management API endpoints
- [x] 8.1 Implement role listing and creation endpoints
  - Create RoleListCreateAPIView with IsSuperAdmin permission
  - Implement GET /api/roles/ to list all roles with their permissions
  - Implement POST /api/roles/ to create custom roles
  - Add serializer to include permission details in role responses
  - _Requirements: 6.2, 6.3_

- [x] 8.2 Implement role assignment endpoints
  - Create POST /api/users/{id}/assign-role/ endpoint with IsSuperAdmin permission
  - Implement role assignment logic with RoleAssignment model creation
  - Add validation for role_id, expires_at, and notes fields
  - Create audit log entry when role is assigned
  - _Requirements: 1.1, 1.2, 1.5, 9.1, 10.1, 10.3_

- [x] 8.3 Implement role revocation endpoint
  - Create POST /api/users/{id}/revoke-role/ endpoint with IsSuperAdmin permission
  - Implement role revocation logic by setting RoleAssignment.is_active to False
  - Remove user from Django Group
  - Create audit log entry when role is revoked
  - _Requirements: 9.2, 10.2_

- [x] 8.4 Implement user roles listing endpoint
  - Create GET /api/users/{id}/roles/ endpoint
  - Return all active RoleAssignments for the user with expiration info
  - Include temporary role indicators and expiration dates
  - _Requirements: 10.5_

- [x] 9. Implement audit logging system
  - Create audit_log() utility function to create AuditLog entries
  - Add audit logging to role assignment and revocation operations
  - Add audit logging to permission denial events (403 responses)
  - Capture IP address from request in audit logs
  - Store detailed information in JSONField including before/after states
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 10. Create audit log viewing endpoints
  - Create AuditLogListAPIView with IsSuperAdmin permission
  - Implement filtering by action, date range, user_id, and resource_type
  - Add pagination for large audit log datasets
  - Create export functionality for audit logs (CSV format)
  - _Requirements: 6.4, 9.5_

- [x] 11. Implement temporary role expiration mechanism
  - Create management command to check and expire temporary roles
  - Add logic to query RoleAssignments where expires_at < now() and is_active = True
  - Set is_active to False and remove user from Group for expired roles
  - Create audit log entries for automatic role expirations
  - Add Django cron job or Celery task to run expiration check periodically
  - _Requirements: 10.1, 10.2_

- [x] 12. Create data migration for existing users
  - Write data migration to create UserProfile for all existing Django User instances
  - Link existing Employee records to UserProfile based on email matching
  - Assign default "Employee" role to all existing users
  - Create script to identify and manually assign admin roles based on criteria
  - _Requirements: 1.1, 1.2, 1.4_

- [x] 13. Update frontend authentication flow
  - Modify login API call to store roles, permissions, and department in localStorage
  - Update token storage to include role and permission data
  - Create PermissionContext with roles, permissions, hasPermission(), and hasRole() methods
  - Wrap App component with PermissionProvider
  - Update /api/auth/me/ call to refresh user permissions on app load
  - _Requirements: 8.1, 8.2, 8.3_

- [x] 14. Implement frontend permission-based UI rendering
  - Create usePermission() hook to access permission context
  - Add conditional rendering to employee management page (hide Add Employee button for non-managers)
  - Add conditional rendering to leave management page (hide approval buttons for employees)
  - Update navigation sidebar to show/hide menu items based on roles
  - Add role badges to user profile display
  - _Requirements: 8.4, 8.5_

- [x] 15. Implement frontend route protection
  - Update ProtectedRoute component to accept requiredRole and requiredPermission props
  - Add role/permission checking logic before rendering route component
  - Redirect to unauthorized page if user lacks required role/permission
  - Create UnauthorizedPage component with helpful message
  - Protect admin routes with Super Admin role requirement
  - _Requirements: 8.4_

- [x] 16. Add error handling for authorization failures
  - Create custom exception handler for 403 Forbidden responses
  - Return structured error messages with required_permission field
  - Add department scope information to 403 responses when applicable
  - Create frontend error display component for permission errors
  - Add user-friendly messages explaining why access was denied
  - _Requirements: 7.3, 7.5_

- [x] 17. Implement role management UI for Super Admin
  - Create RoleManagementPage component accessible only to Super Admin
  - Add user listing with current roles displayed
  - Implement role assignment form with role selection, expiration date, and notes
  - Add role revocation button with confirmation dialog
  - Display active temporary roles with expiration countdown
  - _Requirements: 6.2, 6.3, 10.1, 10.5_

- [x] 18. Create audit log viewer UI for Super Admin
  - Create AuditLogPage component accessible only to Super Admin
  - Implement table view with columns: timestamp, action, actor, target user, details
  - Add filtering controls for action type, date range, and user
  - Implement pagination for large datasets
  - Add export to CSV functionality
  - _Requirements: 6.4, 9.5_

- [x] 19. Write unit tests for models and utilities
  - Write tests for UserProfile model creation and relationships
  - Write tests for RoleAssignment expiration logic
  - Write tests for AuditLog entry creation
  - Write tests for permission checking utility functions
  - Write tests for department scope validation
  - _Requirements: All requirements_

- [x] 20. Write integration tests for API endpoints
  - Write tests for authentication endpoint returning role data
  - Write tests for employee endpoints with different roles (Employee, Department Head, HR Manager, Super Admin)
  - Write tests for leave management endpoints with role-based filtering
  - Write tests for role assignment and revocation endpoints
  - Write tests for audit log endpoints
  - Write tests for 403 Forbidden responses with proper error messages
  - _Requirements: All requirements_

- [x] 21. Perform end-to-end testing
  - Test employee self-service workflow (login, view profile, submit leave request)
  - Test Department Head workflow (login, view department employees, approve department leave)
  - Test HR Manager workflow (login, create employee, approve all leaves, manage payroll)
  - Test Super Admin workflow (login, create role, assign role, view audit logs, revoke role)
  - Test permission denial scenarios and error messages
  - Test temporary role expiration
  - _Requirements: All requirements_
