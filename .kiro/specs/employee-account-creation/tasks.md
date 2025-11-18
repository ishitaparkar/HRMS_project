# Implementation Plan

- [x] 1. Create account creation service and utilities
  - Create `backend/authentication/services.py` with `AccountCreationService` class
  - Implement `create_user_account()` method to create User, link to Employee via UserProfile, and assign default Employee role
  - Implement `generate_temporary_password()` using Python's `secrets` module with 12+ characters
  - Implement `send_welcome_email()` to send credentials via email
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 2. Add password tracking to UserProfile model
  - [x] 2.1 Create migration to add `password_changed` BooleanField to UserProfile model
    - Add field with `default=False`
    - Set existing records to `True` to avoid forcing password change for existing users
    - _Requirements: 4.3_
  
  - [x] 2.2 Update UserProfile model in `backend/authentication/models.py`
    - Add `password_changed = models.BooleanField(default=False)` field
    - _Requirements: 4.3_

- [x] 3. Enhance employee creation to auto-create user accounts
  - [x] 3.1 Update EmployeeSerializer in `backend/employee_management/serializers.py`
    - Add `has_user_account` SerializerMethodField to show account status
    - Add `username` SerializerMethodField to display linked username
    - Override `create()` method to call `AccountCreationService.create_user_account()`
    - Handle errors and provide clear error messages
    - _Requirements: 1.1, 1.5, 3.1_
  
  - [x] 3.2 Update EmployeeListCreateAPIView in `backend/employee_management/views.py`
    - Ensure proper error handling for account creation failures
    - Add success notification with account details in response
    - _Requirements: 1.5, 3.1_

- [x] 4. Enhance authentication responses with employee name data
  - [x] 4.1 Update CustomAuthToken view in `backend/authentication/views.py`
    - Add `first_name`, `last_name`, `full_name` fields from linked Employee record
    - Add `employee_id` field
    - Add `requires_password_change` flag based on UserProfile.password_changed
    - Handle cases where employee link doesn't exist (return null values)
    - _Requirements: 2.1, 5.1, 5.4_
  
  - [x] 4.2 Update CurrentUserView in `backend/authentication/views.py`
    - Include employee name fields in response
    - Add `requires_password_change` flag
    - Ensure response includes all data needed for personalized UI
    - _Requirements: 2.1, 5.2, 5.4_

- [x] 5. Create first-time password change endpoint
  - Create `FirstTimePasswordChangeView` in `backend/authentication/views.py`
  - Validate old password matches current password
  - Validate new password meets security requirements (min 8 chars, letters + numbers)
  - Update user password and set `password_changed = True` in UserProfile
  - Add URL route in `backend/authentication/urls.py`
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 6. Create audit logging for account creation
  - Update account creation service to log account creation events
  - Include employee name, username, and timestamp in audit log
  - Use existing `audit_log()` utility function
  - _Requirements: 3.2_

- [x] 7. Enhance frontend auth context with employee name
  - [x] 7.1 Update PermissionContext in `frontend/src/contexts/PermissionContext.js`
    - Add `firstName`, `lastName`, `fullName`, `employeeId` to userData state
    - Update login function to extract and store employee name from auth response
    - Update fetchUserData function to extract employee name from /api/auth/me/
    - Add `requiresPasswordChange` flag to state
    - _Requirements: 2.1, 5.1, 5.2_
  
  - [x] 7.2 Update context to handle missing employee data
    - Provide fallback values when employee data is not available
    - Ensure context doesn't break if employee link is missing
    - _Requirements: 2.4, 5.4_

- [x] 8. Create personalized greeting component
  - Create `frontend/src/components/PersonalizedGreeting.js`
  - Support two variants: 'short' ("Hi, FirstName") and 'full' ("Welcome Back, FirstName LastName")
  - Use `usePermission()` hook to access employee name from context
  - Implement fallback to "Hi, User" when name is unavailable
  - Add proper styling with Tailwind CSS classes
  - _Requirements: 2.2, 2.4_

- [x] 9. Update Sidebar with personalized greeting
  - Update `frontend/src/components/Sidebar.js` to import and use PersonalizedGreeting component
  - Display greeting at the top of the sidebar navigation
  - Use 'short' variant for compact display
  - Ensure greeting is visible on all pages
  - _Requirements: 2.3, 2.5_

- [x] 10. Update Dashboard with personalized greeting
  - Update `frontend/src/pages/DashboardPage.js` to use employee name from context
  - Replace hardcoded "HR Manager" with actual name for HR Manager dashboard
  - Ensure employee dashboard already uses employee name correctly
  - Use 'full' variant for dashboard header
  - _Requirements: 2.2, 2.5_

- [x] 11. Create first login password change page
  - [x] 11.1 Create `frontend/src/pages/FirstLoginPasswordChange.js`
    - Create form with old password and new password fields
    - Implement password validation (min 8 chars, letters + numbers)
    - Show validation errors clearly
    - Call POST /api/auth/first-login-password-change/ endpoint
    - Redirect to dashboard on success
    - _Requirements: 4.1, 4.2, 4.3_
  
  - [x] 11.2 Add route in `frontend/src/App.js`
    - Add route for /first-login-password-change
    - Make route accessible to authenticated users only
    - _Requirements: 4.1_

- [x] 12. Implement first login redirect logic
  - Update login flow in PermissionContext to check `requiresPasswordChange` flag
  - Redirect to /first-login-password-change if flag is true
  - Prevent access to other pages until password is changed
  - _Requirements: 4.1_

- [x] 13. Create management command for existing employees
  - Create `backend/authentication/management/commands/create_accounts_for_existing_employees.py`
  - Iterate through employees without linked user accounts
  - Create accounts using AccountCreationService
  - Provide summary of accounts created
  - _Requirements: 1.1_

- [x] 14. Write backend tests for account creation
  - Write unit tests for AccountCreationService methods
  - Write integration tests for employee creation with account creation
  - Test authentication responses include employee name
  - Test first-time password change flow
  - Test error handling for duplicate emails and missing roles
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 4.1, 4.2, 4.3, 4.4_

- [x] 15. Write frontend tests for personalized greeting
  - Test PersonalizedGreeting component renders correctly with name
  - Test fallback when name is unavailable
  - Test context stores and provides employee name correctly
  - Test first login password change page
  - _Requirements: 2.2, 2.4, 4.1_

- [x] 16. Create email template
  - Create HTML email template for welcome email
  - Include employee name, username, temporary password, and portal URL
  - Add security disclaimer about changing password
  - Test email rendering in different email clients
  - _Requirements: 1.2_

- [x] 17. Add email configuration
  - Configure Django email settings in settings.py
  - Set up SMTP server credentials (use environment variables)
  - Test email delivery in development and production
  - _Requirements: 1.2_
