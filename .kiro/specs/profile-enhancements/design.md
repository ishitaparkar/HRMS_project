# Profile & My Space Enhancements - Design Document

## Overview

This document outlines the technical design for enhancing the employee profile page and implementing new My Space sections. The design focuses on creating a cohesive self-service experience for employees while maintaining consistency with the existing HRMS design system.

## Architecture

### Frontend Architecture

```
frontend/src/
├── pages/
│   ├── ProfilePage.js (Enhanced)
│   ├── MyTeamPage.js (New)
│   ├── MyPerformancePage.js (New)
│   ├── MyAttendancePage.js (New)
│   └── MyLeavePage.js (New)
├── components/
│   ├── profile/
│   │   ├── DocumentsSection.js (New)
│   │   └── NotificationsPreferences.js (New)
│   ├── team/
│   │   ├── TeamMemberCard.js (New)
│   │   └── ManagerCard.js (New)
│   ├── performance/
│   │   ├── AppraisalCard.js (New)
│   │   ├── GoalsSection.js (New)
│   │   └── AchievementsSection.js (New)
│   ├── attendance/
│   │   ├── AttendanceCalendar.js (New)
│   │   └── AttendanceSummary.js (New)
│   └── leave/
│       ├── LeaveBalanceCard.js (New)
│       ├── LeaveHistoryTable.js (New)
│       └── LeaveRequestForm.js (New)
└── contexts/
    └── PreferencesContext.js (New)
```

### Backend Architecture

```
backend/
├── employee_management/
│   ├── models.py (Enhanced - add Document model)
│   ├── views.py (Enhanced - add document endpoints)
│   └── serializers.py (Enhanced)
├── authentication/
│   ├── models.py (Enhanced - add UserPreferences)
│   ├── views.py (Enhanced - add preferences endpoints)
│   └── serializers.py (Enhanced)
├── attendance/
│   ├── models.py (New app)
│   ├── views.py (New)
│   └── serializers.py (New)
└── performance/
    ├── models.py (New app)
    ├── views.py (New)
    └── serializers.py (New)
```

## Components and Interfaces

### 1. Enhanced Profile Page

#### Component Structure
```javascript
ProfilePage
├── ProfileHeader (Photo, Name, Roles)
└── TabContainer
    ├── EmployeeProfileTab (Default Active)
    │   ├── ContactInformation
    │   ├── JobInformation
    │   └── DocumentsSection (New)
    └── AccountSettingsTab
        ├── ChangePassword
        ├── TwoFactorAuth
        ├── LoginHistory
        └── NotificationsPreferences (New)
```

#### State Management
```javascript
const [activeTab, setActiveTab] = useState('employee');
const [documents, setDocuments] = useState([]);
const [preferences, setPreferences] = useState({});
```

### 2. Documents Section Component

#### Props Interface
```typescript
interface DocumentsSectionProps {
  employeeId: number;
}

interface Document {
  id: number;
  name: string;
  category: 'Personal' | 'Employment' | 'Certificates';
  fileType: string;
  fileSize: number;
  uploadDate: string;
  status: 'Verified' | 'Pending' | 'Expired';
  downloadUrl: string;
}
```

#### API Endpoints
```
GET /api/employees/{id}/documents/
Response: { documents: Document[] }

GET /api/employees/{id}/documents/{doc_id}/download/
Response: File download
```

### 3. Notifications & Preferences Component

#### Props Interface
```typescript
interface NotificationsPreferencesProps {
  userId: number;
}

interface UserPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
}
```

#### API Endpoints
```
GET /api/auth/preferences/
Response: UserPreferences

PATCH /api/auth/preferences/
Request: Partial<UserPreferences>
Response: UserPreferences
```

### 4. My Team Page

#### Component Structure
```javascript
MyTeamPage
├── PageHeader
├── ManagerCard
├── DepartmentInfo
└── TeamMembersGrid
    └── TeamMemberCard[]
```

#### Data Models
```typescript
interface TeamMember {
  id: number;
  firstName: string;
  lastName: string;
  designation: string;
  email: string;
  phone: string;
  profileImage: string;
}

interface Manager extends TeamMember {
  isManager: true;
}
```

#### API Endpoints
```
GET /api/employees/my-team/
Response: {
  manager: Manager,
  department: string,
  teamMembers: TeamMember[]
}
```

### 5. My Performance Page

#### Component Structure
```javascript
MyPerformancePage
├── PageHeader
├── PerformanceSummary
├── RecentAppraisals
├── GoalsAndObjectives
├── Achievements
└── TrainingCompleted
```

#### Data Models
```typescript
interface Appraisal {
  id: number;
  rating: number;
  date: string;
  reviewer: string;
  comments: string;
}

interface Goal {
  id: number;
  title: string;
  description: string;
  targetDate: string;
  completionPercentage: number;
  status: 'In Progress' | 'Completed' | 'Overdue';
}

interface Achievement {
  id: number;
  title: string;
  description: string;
  date: string;
  awardedBy: string;
}
```

#### API Endpoints
```
GET /api/performance/my-performance/
Response: {
  appraisals: Appraisal[],
  goals: Goal[],
  achievements: Achievement[],
  trainings: Training[]
}
```

### 6. My Attendance Page

#### Component Structure
```javascript
MyAttendancePage
├── PageHeader
├── AttendanceSummaryCards
├── AttendanceCalendar
└── RecentCheckInOut
```

#### Data Models
```typescript
interface AttendanceRecord {
  date: string;
  checkIn: string;
  checkOut: string;
  status: 'Present' | 'Absent' | 'Late' | 'Half Day';
  workHours: number;
}

interface AttendanceSummary {
  month: string;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  attendancePercentage: number;
}
```

#### API Endpoints
```
GET /api/attendance/my-attendance/?month=2025-11
Response: {
  summary: AttendanceSummary,
  records: AttendanceRecord[]
}
```

### 7. My Leave Page

#### Component Structure
```javascript
MyLeavePage
├── PageHeader
├── LeaveBalanceCards
├── RequestLeaveButton
├── PendingRequests
├── LeaveHistoryTable
└── UpcomingHolidays
```

#### Data Models
```typescript
interface LeaveBalance {
  leaveType: string;
  total: number;
  used: number;
  remaining: number;
}

interface LeaveRequest {
  id: number;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedDate: string;
  approvedBy?: string;
}
```

#### API Endpoints
```
GET /api/leave/my-leave/
Response: {
  balances: LeaveBalance[],
  requests: LeaveRequest[],
  holidays: Holiday[]
}

POST /api/leave/request/
Request: {
  leaveType: string,
  startDate: string,
  endDate: string,
  reason: string
}
Response: LeaveRequest
```

## Data Models

### New Database Models

#### Document Model
```python
class EmployeeDocument(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=50, choices=[
        ('Personal', 'Personal'),
        ('Employment', 'Employment'),
        ('Certificates', 'Certificates')
    ])
    file = models.FileField(upload_to='employee_documents/')
    file_type = models.CharField(max_length=50)
    file_size = models.IntegerField()
    upload_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=[
        ('Verified', 'Verified'),
        ('Pending', 'Pending'),
        ('Expired', 'Expired')
    ])
    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
```

#### UserPreferences Model
```python
class UserPreferences(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    email_notifications = models.BooleanField(default=True)
    sms_notifications = models.BooleanField(default=False)
    push_notifications = models.BooleanField(default=True)
    theme = models.CharField(max_length=20, default='system')
    language = models.CharField(max_length=10, default='en')
    timezone = models.CharField(max_length=50, default='UTC')
    updated_at = models.DateTimeField(auto_now=True)
```

#### AttendanceRecord Model
```python
class AttendanceRecord(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    date = models.DateField()
    check_in = models.TimeField(null=True, blank=True)
    check_out = models.TimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=[
        ('Present', 'Present'),
        ('Absent', 'Absent'),
        ('Late', 'Late'),
        ('Half Day', 'Half Day')
    ])
    work_hours = models.DecimalField(max_digits=4, decimal_places=2, default=0)
    notes = models.TextField(blank=True)
```

#### Performance Models
```python
class Appraisal(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    rating = models.DecimalField(max_digits=3, decimal_places=1)
    date = models.DateField()
    reviewer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    comments = models.TextField()
    period_start = models.DateField()
    period_end = models.DateField()

class Goal(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField()
    target_date = models.DateField()
    completion_percentage = models.IntegerField(default=0)
    status = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)

class Achievement(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField()
    date = models.DateField()
    awarded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
```

## Error Handling

### Frontend Error Handling
- Display user-friendly error messages for API failures
- Show loading states during data fetching
- Implement retry mechanisms for failed requests
- Validate form inputs before submission

### Backend Error Handling
- Return appropriate HTTP status codes
- Provide descriptive error messages
- Log errors for debugging
- Handle file upload errors gracefully

## Testing Strategy

### Unit Tests
- Test individual components in isolation
- Test API endpoints with mock data
- Test data transformations and calculations

### Integration Tests
- Test complete user flows (e.g., requesting leave)
- Test API integration with frontend
- Test file upload and download functionality

### E2E Tests
- Test navigation between My Space pages
- Test preference changes and persistence
- Test document download functionality

## Performance Considerations

- Lazy load documents and large datasets
- Implement pagination for leave history and attendance records
- Cache user preferences in local storage
- Optimize calendar rendering for attendance view
- Use React.memo for expensive components

## Security Considerations

- Validate file types and sizes for document uploads
- Implement access control for document downloads
- Sanitize user inputs in preferences
- Use HTTPS for all API calls
- Implement CSRF protection for state-changing operations

## Accessibility

- Ensure keyboard navigation for all interactive elements
- Provide ARIA labels for screen readers
- Maintain sufficient color contrast ratios
- Support screen reader announcements for dynamic content
- Ensure focus management in modals and forms