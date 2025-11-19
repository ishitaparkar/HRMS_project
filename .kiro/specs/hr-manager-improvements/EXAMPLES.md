# UI Component Library - Usage Examples

This document provides practical examples of using the UI component library in real-world scenarios.

## Example 1: Simple Page with Header and Cards

```javascript
import React from 'react';
import { PageHeader, Card, Button } from '../components/ui';

const EmployeeListPage = () => {
  return (
    <div className="flex flex-col h-full">
      <PageHeader 
        title="Employee Management" 
        description="Manage all employee records and information"
        icon="people"
        actions={
          <>
            <Button variant="secondary" icon="filter_list">Filter</Button>
            <Button variant="primary" icon="add">Add Employee</Button>
          </>
        }
      />
      
      <div className="p-6 space-y-6">
        <Card title="Active Employees" icon="person">
          <p>Total: 2,456 employees</p>
        </Card>
        
        <Card title="Recent Hires" icon="person_add">
          <p>15 new employees this month</p>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeListPage;
```

## Example 2: Profile Page with InfoCards

```javascript
import React from 'react';
import { PageHeader, InfoCard, InfoRow, Button } from '../components/ui';

const ProfilePage = () => {
  return (
    <div className="flex flex-col h-full">
      <PageHeader 
        title="My Profile" 
        description="View and manage your profile information"
        actions={<Button variant="primary" icon="edit">Edit Profile</Button>}
      />
      
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <InfoCard title="Contact Information" icon="contact_mail">
            <InfoRow icon="email" label="Email" value="john.doe@university.edu" />
            <InfoRow icon="phone" label="Phone" value="+1 234 567 8900" />
            <InfoRow icon="home" label="Address" value="123 University Ave" />
          </InfoCard>
          
          <InfoCard title="Job Information" icon="work">
            <InfoRow icon="badge" label="Employee ID" value="EMP001" />
            <InfoRow icon="person" label="Designation" value="Senior Developer" />
            <InfoRow icon="school" label="Department" value="Engineering" />
            <InfoRow 
              icon="work" 
              label="Status" 
              value={
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                  Active
                </span>
              } 
            />
          </InfoCard>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
```

## Example 3: Dashboard with Multiple Card Types

```javascript
import React from 'react';
import { PageHeader, Card, Button } from '../components/ui';

const DashboardPage = () => {
  return (
    <div className="flex flex-col h-full">
      <PageHeader 
        title="Dashboard" 
        description="Welcome back! Here's what's happening today."
        icon="dashboard"
      />
      
      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card hover>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">2,456</p>
              <p className="text-sm text-subtext-light">Total Employees</p>
            </div>
          </Card>
          
          <Card hover>
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-500">23</p>
              <p className="text-sm text-subtext-light">Pending Requests</p>
            </div>
          </Card>
          
          <Card hover>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-500">8</p>
              <p className="text-sm text-subtext-light">Open Positions</p>
            </div>
          </Card>
          
          <Card hover>
            <div className="text-center">
              <p className="text-3xl font-bold text-red-500">3</p>
              <p className="text-sm text-subtext-light">Resignations</p>
            </div>
          </Card>
        </div>
        
        {/* Recent Activity */}
        <Card 
          title="Recent Activity" 
          icon="history"
          actions={<Button variant="outline" size="sm">View All</Button>}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
              <div>
                <p className="font-medium">New employee onboarded</p>
                <p className="text-sm text-subtext-light">John Smith joined as Developer</p>
              </div>
              <span className="text-xs text-subtext-light">2h ago</span>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
              <div>
                <p className="font-medium">Leave request approved</p>
                <p className="text-sm text-subtext-light">5 requests approved</p>
              </div>
              <span className="text-xs text-subtext-light">4h ago</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
```

## Example 4: Form Page with Buttons

```javascript
import React, { useState } from 'react';
import { PageHeader, Card, Button } from '../components/ui';

const AddEmployeePage = () => {
  const [formData, setFormData] = useState({});
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
  };
  
  return (
    <div className="flex flex-col h-full">
      <PageHeader 
        title="Add New Employee" 
        description="Fill in the details to add a new employee to the system"
        icon="person_add"
      />
      
      <div className="p-6">
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">First Name</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Enter first name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Last Name</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Enter last name"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input 
                type="email" 
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Enter email address"
              />
            </div>
            
            <div className="flex gap-3 justify-end">
              <Button variant="secondary" to="/employees">
                Cancel
              </Button>
              <Button variant="primary" type="submit" icon="save">
                Save Employee
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AddEmployeePage;
```

## Example 5: Data Table with Card

```javascript
import React from 'react';
import { PageHeader, Card, Button } from '../components/ui';

const LeaveRequestsPage = () => {
  const requests = [
    { id: 1, employee: 'John Doe', type: 'Casual', days: 3, status: 'Pending' },
    { id: 2, employee: 'Jane Smith', type: 'Sick', days: 2, status: 'Approved' },
  ];
  
  return (
    <div className="flex flex-col h-full">
      <PageHeader 
        title="Leave Requests" 
        description="Review and manage employee leave requests"
        icon="event_note"
        actions={<Button variant="primary" icon="add">New Request</Button>}
      />
      
      <div className="p-6">
        <Card title="Pending Requests" icon="pending_actions" noPadding>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase">Days</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light dark:divide-border-dark">
                {requests.map(request => (
                  <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4">{request.employee}</td>
                    <td className="px-6 py-4">{request.type}</td>
                    <td className="px-6 py-4">{request.days}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        request.status === 'Approved' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button variant="success" size="sm" icon="check">Approve</Button>
                        <Button variant="danger" size="sm" icon="close">Reject</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LeaveRequestsPage;
```

## Example 6: Responsive Grid Layout

```javascript
import React from 'react';
import { PageHeader, Card, Button } from '../components/ui';

const ReportsPage = () => {
  return (
    <div className="flex flex-col h-full">
      <PageHeader 
        title="Reports & Analytics" 
        description="View system reports and analytics"
        icon="assessment"
      />
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card title="Employee Report" icon="people" hover>
            <p className="text-sm text-subtext-light mb-4">
              Comprehensive employee data and statistics
            </p>
            <Button variant="primary" size="sm" fullWidth icon="download">
              Download Report
            </Button>
          </Card>
          
          <Card title="Attendance Report" icon="event_available" hover>
            <p className="text-sm text-subtext-light mb-4">
              Monthly attendance records and trends
            </p>
            <Button variant="primary" size="sm" fullWidth icon="download">
              Download Report
            </Button>
          </Card>
          
          <Card title="Payroll Report" icon="receipt" hover>
            <p className="text-sm text-subtext-light mb-4">
              Salary disbursement and payroll data
            </p>
            <Button variant="primary" size="sm" fullWidth icon="download">
              Download Report
            </Button>
          </Card>
          
          <Card title="Leave Report" icon="beach_access" hover>
            <p className="text-sm text-subtext-light mb-4">
              Leave balance and utilization statistics
            </p>
            <Button variant="primary" size="sm" fullWidth icon="download">
              Download Report
            </Button>
          </Card>
          
          <Card title="Performance Report" icon="grade" hover>
            <p className="text-sm text-subtext-light mb-4">
              Employee performance and appraisal data
            </p>
            <Button variant="primary" size="sm" fullWidth icon="download">
              Download Report
            </Button>
          </Card>
          
          <Card title="Custom Report" icon="tune" hover>
            <p className="text-sm text-subtext-light mb-4">
              Create your own custom reports
            </p>
            <Button variant="outline" size="sm" fullWidth icon="add">
              Create Report
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
```

## Tips for Using Components

### 1. Consistent Spacing
Use Tailwind's spacing utilities consistently:
```javascript
<div className="p-6 space-y-6">  {/* Page padding and vertical spacing */}
  <Card>...</Card>
  <Card>...</Card>
</div>
```

### 2. Responsive Grids
Use responsive grid classes for layouts:
```javascript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Cards will be 1 column on mobile, 2 on tablet, 3 on desktop */}
</div>
```

### 3. Button Groups
Group related buttons together:
```javascript
<div className="flex gap-2">
  <Button variant="secondary">Cancel</Button>
  <Button variant="primary">Save</Button>
</div>
```

### 4. Loading States
Show loading states in cards:
```javascript
<Card title="Data Loading">
  {isLoading ? (
    <div className="flex items-center justify-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  ) : (
    <div>{data}</div>
  )}
</Card>
```

### 5. Empty States
Handle empty states gracefully:
```javascript
<Card title="Recent Activity">
  {activities.length === 0 ? (
    <div className="text-center py-8">
      <span className="material-icons text-4xl text-subtext-light mb-2">inbox</span>
      <p className="text-subtext-light">No recent activity</p>
    </div>
  ) : (
    <div>{activities.map(...)}</div>
  )}
</Card>
```
