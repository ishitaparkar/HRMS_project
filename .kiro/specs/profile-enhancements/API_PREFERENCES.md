# User Preferences API Documentation

## Overview
The User Preferences API allows authenticated users to manage their notification settings and UI preferences.

## Base URL
```
/api/auth/preferences/
```

## Authentication
All endpoints require authentication via token in the Authorization header:
```
Authorization: Token <your-auth-token>
```

---

## Endpoints

### 1. Get User Preferences

**GET** `/api/auth/preferences/`

Retrieves the current user's preferences. If no preferences exist, default preferences are automatically created.

#### Request
```http
GET /api/auth/preferences/ HTTP/1.1
Authorization: Token abc123...
```

#### Response (200 OK)
```json
{
  "id": 1,
  "email_notifications": true,
  "sms_notifications": false,
  "push_notifications": true,
  "theme": "system",
  "language": "en",
  "timezone": "UTC",
  "updated_at": "2025-11-18T10:48:10.918546Z"
}
```

#### Response (401 Unauthorized)
```json
{
  "detail": "Authentication credentials were not provided."
}
```

---

### 2. Update User Preferences

**PATCH** `/api/auth/preferences/`

Updates the current user's preferences. Supports partial updates - only send the fields you want to change.

#### Request
```http
PATCH /api/auth/preferences/ HTTP/1.1
Authorization: Token abc123...
Content-Type: application/json

{
  "email_notifications": false,
  "theme": "dark"
}
```

#### Response (200 OK)
```json
{
  "id": 1,
  "email_notifications": false,
  "sms_notifications": false,
  "push_notifications": true,
  "theme": "dark",
  "language": "en",
  "timezone": "UTC",
  "updated_at": "2025-11-18T10:50:15.123456Z"
}
```

#### Response (400 Bad Request)
```json
{
  "theme": ["Invalid theme. Must be one of: light, dark, system"]
}
```

#### Response (401 Unauthorized)
```json
{
  "detail": "Authentication credentials were not provided."
}
```

---

## Data Model

### UserPreferences Object

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `id` | integer | read-only | - | Unique identifier |
| `email_notifications` | boolean | no | `true` | Enable/disable email notifications |
| `sms_notifications` | boolean | no | `false` | Enable/disable SMS notifications |
| `push_notifications` | boolean | no | `true` | Enable/disable push notifications |
| `theme` | string | no | `"system"` | UI theme preference |
| `language` | string | no | `"en"` | Language code |
| `timezone` | string | no | `"UTC"` | Timezone string |
| `updated_at` | datetime | read-only | - | Last update timestamp |

### Theme Options
- `"light"` - Light theme
- `"dark"` - Dark theme
- `"system"` - Follow system preference

---

## Frontend Integration Example

### React/JavaScript Example

```javascript
// Get preferences
const getPreferences = async () => {
  const response = await fetch('/api/auth/preferences/', {
    headers: {
      'Authorization': `Token ${authToken}`,
    },
  });
  
  if (response.ok) {
    const preferences = await response.json();
    return preferences;
  }
  throw new Error('Failed to fetch preferences');
};

// Update preferences
const updatePreferences = async (updates) => {
  const response = await fetch('/api/auth/preferences/', {
    method: 'PATCH',
    headers: {
      'Authorization': `Token ${authToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  
  if (response.ok) {
    const preferences = await response.json();
    return preferences;
  }
  
  const errors = await response.json();
  throw new Error(JSON.stringify(errors));
};

// Usage
try {
  // Get current preferences
  const prefs = await getPreferences();
  console.log('Current theme:', prefs.theme);
  
  // Update theme
  const updated = await updatePreferences({ theme: 'dark' });
  console.log('Updated theme:', updated.theme);
} catch (error) {
  console.error('Error:', error);
}
```

---

## Error Handling

### Common Error Responses

#### 401 Unauthorized
User is not authenticated. Redirect to login page.

#### 400 Bad Request
Invalid data provided. Check the response body for field-specific errors.

Example:
```json
{
  "theme": ["Invalid theme. Must be one of: light, dark, system"],
  "language": ["Invalid language code."]
}
```

---

## Notes

1. **Auto-creation**: If a user has no preferences, they are automatically created with default values on first GET request.

2. **Partial Updates**: You can update individual fields without sending all fields. Only include the fields you want to change.

3. **Immediate Application**: Theme changes should be applied immediately in the UI without page reload.

4. **Success Messages**: Show a success message for 3 seconds after saving preferences (as per requirements).

5. **Validation**: All fields are validated on the backend. Invalid values will return a 400 error with details.

---

## Testing

### cURL Examples

```bash
# Get preferences
curl -X GET http://localhost:8000/api/auth/preferences/ \
  -H "Authorization: Token your-token-here"

# Update theme
curl -X PATCH http://localhost:8000/api/auth/preferences/ \
  -H "Authorization: Token your-token-here" \
  -H "Content-Type: application/json" \
  -d '{"theme": "dark"}'

# Update multiple fields
curl -X PATCH http://localhost:8000/api/auth/preferences/ \
  -H "Authorization: Token your-token-here" \
  -H "Content-Type: application/json" \
  -d '{
    "email_notifications": false,
    "theme": "light",
    "language": "en"
  }'
```

---

## Related Requirements

- **Requirement 3.1**: Notifications & Preferences section
- **Requirement 3.2**: Toggle controls for notifications
- **Requirement 3.3**: Theme selection options
- **Requirement 3.4**: Auto-save within 500ms
- **Requirement 3.5**: Success message display
- **Requirement 3.6**: Immediate theme application
