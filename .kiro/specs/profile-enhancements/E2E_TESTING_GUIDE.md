# Profile Enhancements - E2E Testing Guide

## Overview

This document outlines the end-to-end testing procedures for the Profile & My Space Enhancements feature. These tests verify complete user workflows from login to feature interaction.

## Test Environment Setup

### Prerequisites
- Backend server running on http://localhost:8000
- Frontend server running on http://localhost:3000
- Test database with sample data
- Test user accounts with different roles

### Test Data Setup

Run the following Django management commands to set up test data:

```bash
python manage.py setup_users
python manage.py setup_leave_data
```

## E2E Test Scenarios

### 1. Profile Page Tab Navigation

**Objective**: Verify profile page tab structure and navigation

**Steps**:
1. Login as an employee user
2. Navigate to Profile page from sidebar
3. Verify "Employee Profile" tab is active by default
4. Click on "Account Settings" tab
5. Verify tab switches within 200ms
6. Click back to "Employee Profile" tab
7. Verify tab switching maintains state

**Expected Results**:
- Employee Profile tab displays first (left position)
- Account Settings tab displays second (right position)
- Active tab has visual indicator (border/background)
- Tab switching is smooth and fast
- No data loss when switching tabs

### 2. Documents Section Workflow

**Objective**: Test document viewing and downloading

**Steps**:
1. Login as an employee user
2. Navigate to Profile > Employee Profile tab
3. Scroll to Documents section
4. Verify documents are grouped by category (Personal, Employment, Certificates)
5. Click on a category tab
6. Verify documents display with: name, type, size, date, status
7. Click on a document to download
8. Verify file downloads successfully

**Expected Results**:
- Documents grouped correctly by category
- File sizes displayed in human-readable format (KB, MB)
- Download functionality works
- Empty state displays when no documents exist
- Status indicators show correctly (Verified, Pending, Expired)

### 3. Notifications & Preferences Workflow

**Objective**: Test preference changes and persistence

**Steps**:
1. Login as a user
2. Navigate to Profile > Account Settings tab
3. Scroll to Notifications & Preferences section
4. Toggle Email Notifications off
5. Verify success message appears within 3 seconds
6. Change theme to "Dark"
7. Verify theme applies immediately without page reload
8. Refresh the page
9. Verify preferences persisted (Email off, Dark theme)
10. Change theme to "Light"
11. Verify theme changes back immediately

**Expected Results**:
- Toggle controls work smoothly
- Success message displays after save
- Theme changes apply immediately
- Preferences persist across page refreshes
- Auto-save works within 500ms

### 4. My Team Page Workflow

**Objective**: Test team member display and information

**Steps**:
1. Login as an employee user
2. Navigate to My Space > My Team from sidebar
3. Verify manager card displays at top with: name, designation, email, phone
4. Verify department name and member count display
5. Verify team members grid shows all department colleagues
6. Verify each team member card shows: photo, name, designation, email, phone
7. Test with user who has no team members
8. Verify empty state displays

**Expected Results**:
- Manager information displays correctly
- Team members from same department shown
- Team members from other departments not shown
- Empty state displays when no team members
- All contact information displays correctly

### 5. My Performance Page Workflow

**Objective**: Test performance metrics display

**Steps**:
1. Login as an employee user
2. Navigate to My Space > My Performance
3. Verify recent appraisal displays with: rating, date, reviewer
4. Verify goals section shows with progress bars
5. Verify achievements section displays awards
6. Verify training section shows completed courses
7. Test with user who has no performance data
8. Verify empty states display for each section

**Expected Results**:
- Appraisal data displays correctly
- Progress bars show accurate percentages
- Achievements display with dates
- Training courses show completion status
- Empty states display appropriately

### 6. My Attendance Page Workflow

**Objective**: Test attendance tracking and calendar

**Steps**:
1. Login as an employee user
2. Navigate to My Space > My Attendance
3. Verify attendance summary shows: total days, present, absent, late
4. Verify attendance percentage calculates correctly
5. Verify calendar displays current month
6. Verify color coding: green (present), red (absent), yellow (late)
7. Verify recent check-in/out times for last 7 days
8. Navigate to previous/next month
9. Verify calendar updates correctly

**Expected Results**:
- Summary statistics accurate
- Percentage calculation correct
- Calendar color coding clear
- Recent check-ins display correctly
- Month navigation works smoothly

### 7. My Leave Page Workflow

**Objective**: Test leave management functionality

**Steps**:
1. Login as an employee user
2. Navigate to My Space > My Leave
3. Verify leave balance cards show for each type (Casual, Sick, Vacation)
4. Verify remaining days calculate correctly (total - used)
5. Verify leave history table displays past requests
6. Click "Request Leave" button
7. Fill out leave request form:
   - Select leave type
   - Choose start date (future date)
   - Choose end date (after start date)
   - Enter reason
8. Submit form
9. Verify success message
10. Verify new request appears in pending requests
11. Verify status indicators: Pending (yellow), Approved (green), Rejected (red)
12. Verify upcoming holidays display

**Expected Results**:
- Leave balances accurate
- Leave history displays correctly
- Request form validates inputs
- Cannot select past dates
- End date must be after start date
- Success message displays after submission
- New request appears immediately
- Status colors display correctly
- Holidays show for current month

### 8. Sidebar Navigation Workflow

**Objective**: Test My Space navigation

**Steps**:
1. Login as an employee user
2. Verify "My Space" section appears in sidebar
3. Verify menu items in order: Profile, My Team, My Performance, My Attendance, My Leave
4. Click each menu item
5. Verify navigation occurs within 300ms
6. Verify active menu item highlights
7. Verify My Space section positioned between Dashboard and other modules

**Expected Results**:
- My Space section visible
- All menu items present and ordered correctly
- Navigation fast and smooth
- Active state highlights correctly
- Section positioned correctly in sidebar

### 9. Complete User Journey

**Objective**: Test complete employee self-service workflow

**Steps**:
1. Login as new employee
2. Navigate to Profile
3. View employee information
4. Check documents
5. Update notification preferences
6. Change theme to Dark
7. Navigate to My Team
8. View manager and team members
9. Navigate to My Performance
10. Review goals and achievements
11. Navigate to My Attendance
12. Check attendance percentage
13. Navigate to My Leave
14. Check leave balance
15. Submit leave request
16. Logout
17. Login again
18. Verify theme persisted (Dark)
19. Verify leave request shows as Pending

**Expected Results**:
- All pages load without errors
- Data displays correctly throughout
- Preferences persist across sessions
- Leave request successfully created
- User experience is smooth and intuitive

## Cross-Browser Testing

Test all workflows in:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Mobile Responsive Testing

Test all pages on:
- iPhone (iOS Safari)
- Android (Chrome)
- Tablet (iPad)

Verify:
- Layout adapts to screen size
- Touch interactions work
- Navigation accessible
- Forms usable on mobile

## Accessibility Testing

Verify:
- Keyboard navigation works (Tab, Enter, Arrow keys)
- Screen reader announces content correctly
- Focus indicators visible
- Color contrast meets WCAG AA standards
- ARIA labels present

## Performance Testing

Verify:
- Page load times < 2 seconds
- Tab switching < 200ms
- Navigation < 300ms
- API responses < 1 second
- Theme changes immediate

## Test Results Documentation

For each test scenario, document:
- Test date and tester name
- Browser/device used
- Pass/Fail status
- Screenshots of any issues
- Steps to reproduce issues
- Severity of issues (Critical, High, Medium, Low)

## Known Issues

Document any known issues or limitations discovered during testing.

## Sign-off

- [ ] All E2E test scenarios passed
- [ ] Cross-browser testing completed
- [ ] Mobile responsive testing completed
- [ ] Accessibility testing completed
- [ ] Performance testing completed
- [ ] Issues documented and prioritized

**Tested by**: _______________  
**Date**: _______________  
**Approved by**: _______________  
**Date**: _______________
