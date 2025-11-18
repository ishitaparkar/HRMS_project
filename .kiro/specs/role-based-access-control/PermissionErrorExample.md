# Permission Error Handling - Usage Guide

This guide explains how to use the permission error handling system in the HRMS application.

## Overview

The permission error handling system provides:
- **Backend**: Custom exception handler that enhances 403 Forbidden responses with detailed context
- **Frontend**: Reusable components and hooks for displaying user-friendly permission error messages

## Backend Implementation

### Custom Exception Handler

The custom exception handler (`authentication/exceptions.py`) automatically enhances all 403 Forbidden responses with:
- User's current roles
- Required roles/permissions
- User's department (if applicable)
- User-friendly error messages

**Configuration** (already set in `settings.py`):
```python
REST_FRAMEWORK = {
    'EXCEPTION_HANDLER': 'authentication.exceptions.custom_exception_handler',
}
```

### Enhanced 403 Response Format

When a permission is denied, the API returns:
```json
{
  "detail": "You do not have permission to perform this action.",
  "status_code": 403,
  "error_type": "PermissionDenied",
  "user_roles": ["Employee"],
  "user_department": "Computer Science",
  "required_roles": ["HR Manager", "Super Admin"],
  "required_permissions": ["manage_employees"],
  "message": "This action requires one of the following roles: HR Manager, Super Admin. Your current role(s): Employee."
}
```

## Frontend Implementation

### 1. Using the `usePermissionError` Hook

The `usePermissionError` hook provides a simple way to handle permission errors:

```javascript
import usePermissionError from '../hooks/usePermissionError';
import PermissionError from '../components/PermissionError';

const MyComponent = () => {
  const { permissionError, handleApiError, clearPermissionError } = usePermissionError();

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/employees/');
      // Handle success
    } catch (error) {
      // Handle permission errors automatically
      if (!handleApiError(error)) {
        // Handle other types of errors
        console.error('Non-permission error:', error);
      }
    }
  };

  return (
    <div>
      {/* Display permission error modal */}
      <PermissionError error={permissionError} onClose={clearPermissionError} />
      
      {/* Your component content */}
    </div>
  );
};
```

### 2. PermissionError Component

The `PermissionError` component displays a modal with detailed permission information:

**Props:**
- `error` (object): The permission error object from `usePermissionError`
- `onClose` (function): Callback to close the modal

**Features:**
- Displays user's current roles with badges
- Shows required roles/permissions
- Includes department information when relevant
- Provides helpful guidance for users
- Responsive design with smooth animations

### 3. Complete Example

Here's a complete example showing all features:

```javascript
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { usePermission } from '../contexts/PermissionContext';
import PermissionError from '../components/PermissionError';
import usePermissionError from '../hooks/usePermissionError';

const EmployeeListPage = () => {
  const { hasPermission, hasRole } = usePermission();
  const { permissionError, handleApiError, clearPermissionError } = usePermissionError();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/employees/');
        setEmployees(response.data);
      } catch (error) {
        handleApiError(error); // Automatically handles 403 errors
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Delete employee
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/employees/${id}/`);
      setEmployees(employees.filter(emp => emp.id !== id));
    } catch (error) {
      if (!handleApiError(error)) {
        alert('Failed to delete employee');
      }
    }
  };

  // Update employee
  const handleUpdate = async (id, data) => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/employees/${id}/`, data);
      // Handle success
    } catch (error) {
      if (!handleApiError(error)) {
        alert('Failed to update employee');
      }
    }
  };

  return (
    <div>
      {/* Permission Error Modal - Always include this */}
      <PermissionError error={permissionError} onClose={clearPermissionError} />

      <h1>Employee Management</h1>

      {/* Conditionally show actions based on permissions */}
      {hasPermission('authentication.manage_employees') && (
        <button onClick={() => navigate('/add-employee')}>
          Add Employee
        </button>
      )}

      {/* Employee list */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {employees.map(employee => (
            <li key={employee.id}>
              {employee.firstName} {employee.lastName}
              
              {/* Show delete button only if user has permission */}
              {hasPermission('authentication.manage_employees') && (
                <button onClick={() => handleDelete(employee.id)}>
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EmployeeListPage;
```

## Best Practices

### 1. Always Use Both Approaches

Combine permission checking with error handling:

```javascript
// Check permission before showing UI
{hasPermission('manage_employees') && (
  <button onClick={handleDelete}>Delete</button>
)}

// Handle permission errors from API
try {
  await axios.delete(`/api/employees/${id}/`);
} catch (error) {
  handleApiError(error); // Shows detailed error if 403
}
```

### 2. Include PermissionError in All Protected Pages

Add the `PermissionError` component to any page that makes API calls:

```javascript
return (
  <div>
    <PermissionError error={permissionError} onClose={clearPermissionError} />
    {/* Page content */}
  </div>
);
```

### 3. Handle Non-Permission Errors

The `handleApiError` function returns `true` if it was a permission error:

```javascript
try {
  await axios.get('/api/data/');
} catch (error) {
  if (!handleApiError(error)) {
    // Handle other errors (network, validation, etc.)
    console.error('Error:', error);
    alert('An error occurred');
  }
}
```

### 4. Provide Context in Error Messages

The backend automatically includes context, but you can add more in your API calls:

```javascript
try {
  await axios.delete(`/api/employees/${id}/`);
} catch (error) {
  if (!handleApiError(error)) {
    alert(`Failed to delete employee ${id}`);
  }
}
```

## Testing Permission Errors

### Manual Testing

1. Log in as an Employee
2. Try to access HR Manager features (e.g., delete an employee)
3. Verify the permission error modal appears with:
   - Your current role (Employee)
   - Required role (HR Manager)
   - User-friendly message
   - Department information (if applicable)

### Testing Different Scenarios

**Scenario 1: Role-based denial**
- User: Employee
- Action: Delete employee
- Expected: Modal shows "This action requires the 'HR Manager' role"

**Scenario 2: Department scope denial**
- User: Department Head (Computer Science)
- Action: View employee from Math department
- Expected: Modal shows "You can only access resources within your department (Computer Science)"

**Scenario 3: Permission-based denial**
- User: Department Head
- Action: Manage payroll
- Expected: Modal shows "You do not have the required permission: 'manage_payroll'"

## Customization

### Styling the Modal

Edit `PermissionError.css` to customize the appearance:

```css
.permission-error-modal {
  /* Customize modal appearance */
  border-radius: 12px;
  max-width: 600px;
}

.permission-badge.user-role {
  /* Customize role badge colors */
  background-color: #e7f3ff;
  color: #0066cc;
}
```

### Custom Error Messages

Modify the `_generate_user_friendly_message` function in `authentication/exceptions.py`:

```python
def _generate_user_friendly_message(error_data):
    # Add custom logic for specific scenarios
    if 'payroll' in error_data.get('required_permissions', []):
        return "Payroll management requires HR Manager or Super Admin role."
    
    # Default behavior
    return "You do not have permission..."
```

## Troubleshooting

### Modal Not Appearing

1. Verify `PermissionError` component is imported and rendered
2. Check that `usePermissionError` hook is being used
3. Ensure `handleApiError` is called in catch blocks

### Wrong Error Information

1. Check backend permission classes have `required_roles` and `required_permissions` set
2. Verify custom exception handler is configured in settings
3. Check that user profile has correct role assignments

### Styling Issues

1. Ensure `PermissionError.css` is imported
2. Check for CSS conflicts with other components
3. Verify z-index is high enough (default: 9999)

## Summary

The permission error handling system provides:
- ✅ Automatic enhancement of 403 responses with context
- ✅ Reusable React components and hooks
- ✅ User-friendly error messages
- ✅ Role and department information
- ✅ Consistent error handling across the application

Always include both permission checking (to hide UI) and error handling (to catch API errors) for the best user experience.
