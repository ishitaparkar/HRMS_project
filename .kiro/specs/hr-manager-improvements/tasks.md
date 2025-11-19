# Implementation Plan: HR Manager Improvements

- [x] 1. Create unified Profile page component
  - Merge ProfilePage and MyProfilePage into a single component with tabbed interface
  - Implement tab switching between "Account Settings" and "Employee Profile" sections
  - Migrate all functionality from both pages (password change, 2FA, login history, contact info, job info, assets)
  - Add role-based content display using PermissionContext
  - Ensure responsive design and dark mode support
  - _Requirements: 1.1, 1.2, 1.3, 1.5_

- [x] 2. Update routing and navigation for unified profile
  - Update App.js to use unified ProfilePage for both /profile and /my-profile routes
  - Add redirect from /my-profile to /profile for backward compatibility
  - Update Sidebar.js to remove duplicate profile menu items
  - Test all profile navigation paths
  - _Requirements: 1.4_

- [x] 3. Reorganize Sidebar menu structure for HR Manager
  - Rename "Employee" dropdown to "Employee Management" for HR Manager and Super Admin
  - Create new "My Space" dropdown menu for personal items
  - Move Profile, Payroll, Assets, Attendance, Leaves, Time Tracker, and Performance into "My Space"
  - Keep Staff Directory and Add New Staff in "Employee Management"
  - Update menu icons to distinguish personal vs management functions
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 4. Create reusable UI component library
  - Extract PageHeader component with consistent styling
  - Create standardized Card component for content display
  - Define Button component variants (primary, secondary, danger)
  - Create InfoCard and InfoRow components for profile-like pages
  - Document component usage and props
  - _Requirements: 2.1, 2.2, 2.4_

- [x] 5. Apply UI consistency to Employee Management page
  - Update EmployeeManagementPage.js with consistent header pattern
  - Standardize card components for employee list
  - Apply uniform button styles
  - Ensure dark mode works correctly
  - Test responsive layout
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 6. Apply UI consistency to Leave Tracker page
  - Update LeaveTrackerPage.js with consistent header pattern
  - Standardize card components for leave requests
  - Apply uniform button styles and status badges
  - Ensure dark mode works correctly
  - Test responsive layout
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 7. Apply UI consistency to Payroll page
  - Update PayrollPage.js with consistent header pattern
  - Standardize card components for payroll records
  - Apply uniform button styles
  - Ensure dark mode works correctly
  - Test responsive layout
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 8. Apply UI consistency to Attendance page
  - Update AttendancePage.js with consistent header pattern
  - Standardize card components for attendance records
  - Apply uniform button styles
  - Ensure dark mode works correctly
  - Test responsive layout
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 9. Apply UI consistency to Time Tracker page
  - Update TimeTrackerPage.js with consistent header pattern
  - Standardize card components for time entries
  - Apply uniform button styles
  - Ensure dark mode works correctly
  - Test responsive layout
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 10. Apply UI consistency to Appraisal page
  - Update AppraisalPage.js with consistent header pattern
  - Standardize card components for performance reviews
  - Apply uniform button styles
  - Ensure dark mode works correctly
  - Test responsive layout
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 11. Apply UI consistency to Announcement page
  - Update AnnouncementPage.js with consistent header pattern
  - Standardize card components for announcements
  - Apply uniform button styles
  - Ensure dark mode works correctly
  - Test responsive layout
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 12. Apply UI consistency to Resignation page
  - Update ResignationPage.js with consistent header pattern
  - Standardize card components for resignation requests
  - Apply uniform button styles
  - Ensure dark mode works correctly
  - Test responsive layout
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 13. Apply UI consistency to Recruitment page
  - Update RecruitmentPage.js with consistent header pattern
  - Standardize card components for job postings
  - Apply uniform button styles
  - Ensure dark mode works correctly
  - Test responsive layout
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 14. Apply UI consistency to Employee Assets page
  - Update EmployeeAssetsPage.js with consistent header pattern
  - Standardize card components for asset listings
  - Apply uniform button styles
  - Ensure dark mode works correctly
  - Test responsive layout
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 15. Reorganize backend employee management module
  - Create employee_management folder structure if not exists
  - Move Employee, Department, Designation models to employee_management/models.py
  - Update all imports across the codebase
  - Verify API endpoints function correctly
  - Run backend tests to ensure no breakage
  - _Requirements: 4.1, 4.3, 4.4_

- [x] 16. Reorganize backend leave management module
  - Create leave_management folder structure if not exists
  - Move LeaveRequest, LeaveType models to leave_management/models.py
  - Update all imports across the codebase
  - Verify API endpoints function correctly
  - Run backend tests to ensure no breakage
  - _Requirements: 4.2, 4.3, 4.4_

- [x] 17. Update documentation
  - Update user guide with new menu structure
  - Document unified profile page usage
  - Create UI component library documentation
  - Update developer documentation for backend module organization
  - _Requirements: 4.5_

- [x] 18. Perform cross-browser testing
  - Test on Chrome, Firefox, Safari, and Edge
  - Test on mobile browsers (iOS Safari, Chrome Mobile)
  - Verify all features work across browsers
  - Document any browser-specific issues
  - _Requirements: All requirements_

- [x] 19. Perform responsive design testing
  - Test at mobile breakpoints (375px, 414px)
  - Test at tablet breakpoints (768px, 1024px)
  - Test at desktop breakpoints (1280px, 1920px)
  - Verify all pages are responsive
  - Fix any layout issues
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 20. Perform accessibility testing
  - Test keyboard navigation on all pages
  - Verify screen reader compatibility
  - Check color contrast ratios (WCAG AA)
  - Ensure proper ARIA labels
  - Test focus indicators
  - _Requirements: All requirements_

