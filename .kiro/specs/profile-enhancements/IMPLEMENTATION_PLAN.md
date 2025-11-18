# Profile & My Space Enhancements - Implementation Plan

## Overview
This document outlines the implementation plan for enhancing the employee profile and adding new My Space sections.

## Changes Summary

### 1. ProfilePage Updates
- ✅ Swap tab order: Employee Profile (left) → Account Settings (right)
- ⏳ Add "Documents" section under Employee Profile tab
- ⏳ Add "Notifications & Preferences" section under Account Settings tab

### 2. New Pages to Create
- ⏳ My Team Page (`frontend/src/pages/MyTeamPage.js`)
- ⏳ My Performance Page (`frontend/src/pages/MyPerformancePage.js`)
- ⏳ My Attendance Page (`frontend/src/pages/MyAttendancePage.js`)
- ⏳ My Leave Page (`frontend/src/pages/MyLeavePage.js`)

### 3. Sidebar Updates
- ⏳ Add "My Space" section with new menu items
- ⏳ Reorganize menu structure

## Implementation Phases

### Phase 1: Profile Page Enhancements (Current)
**Files to Modify:**
- `frontend/src/pages/ProfilePage.js`

**Changes:**
1. Swap tab order (Employee Profile first)
2. Add Documents tab component
3. Add Notifications & Preferences component

### Phase 2: Create New Pages
**Files to Create:**
1. `frontend/src/pages/MyTeamPage.js`
2. `frontend/src/pages/MyPerformancePage.js`
3. `frontend/src/pages/MyAttendancePage.js`
4. `frontend/src/pages/MyLeavePage.js`

### Phase 3: Update Routing & Sidebar
**Files to Modify:**
1. `frontend/src/App.js` - Add new routes
2. `frontend/src/components/Sidebar.js` - Add new menu items

## Detailed Implementation

### ProfilePage Structure

```
ProfilePage
├── Header
├── Profile Header Card (Photo, Name, Roles)
└── Tabbed Interface
    ├── Employee Profile Tab (LEFT - DEFAULT)
    │   ├── Contact Information
    │   ├── Job Information
    │   └── Documents Section (NEW)
    └── Account Settings Tab (RIGHT)
        ├── Change Password
        ├── Two-Factor Authentication
        ├── Login History
        └── Notifications & Preferences (NEW)
```

### New Pages Structure

#### My Team Page
- Reporting Manager Card
- Team Members Grid
- Department Information
- Organizational Chart (optional)

#### My Performance Page
- Performance Summary Cards
- Recent Appraisals
- Goals & Objectives
- Achievements/Awards
- Training Completed

#### My Attendance Page
- Current Month Summary
- Attendance Percentage
- Calendar View
- Recent Check-in/Check-out Times
- Attendance History

#### My Leave Page
- Leave Balance Cards (by type)
- Request New Leave Button
- Leave History Table
- Pending Requests
- Upcoming Holidays

### Sidebar Menu Structure

```
Dashboard
Announcements

MY SPACE
├── Profile
├── My Team (NEW)
├── My Performance (NEW)
├── My Attendance (NEW)
└── My Leave (NEW)

JOB OPPORTUNITIES (existing)
```

## Next Steps

1. Complete ProfilePage enhancements
2. Create skeleton pages for new sections
3. Update Sidebar with new menu items
4. Add routing for new pages
5. Implement backend APIs if needed
6. Test all new features

## Notes

- All new pages should follow the existing design system
- Use existing UI components (Card, InfoRow, Button)
- Ensure accessibility (ARIA labels, keyboard navigation)
- Mobile responsive design
- Dark mode support
