# Django-Crontab Setup Example

This guide shows how to set up automatic role expiration using django-crontab.

## Installation

```bash
pip install django-crontab
```

## Configuration

### Step 1: Add to INSTALLED_APPS

Edit `hrms_core/settings.py`:

```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third-party apps
    'rest_framework',
    'rest_framework.authtoken',
    'corsheaders',
    'django_crontab',  # Add this line

    # Your apps
    'employee_management',
    'attendance_leave',
    'authentication',
    'dashboard',
    'payroll',
    'leave_management',
]
```

### Step 2: Configure Cron Jobs

Add to `hrms_core/settings.py`:

```python
# Cron jobs configuration
CRONJOBS = [
    # Expire temporary roles every 15 minutes
    ('*/15 * * * *', 'django.core.management.call_command', ['expire_roles'], {}, '>> /tmp/role_expiration.log 2>&1'),
]

# Optional: Configure crontab settings
CRONTAB_LOCK_JOBS = True  # Prevent multiple instances from running simultaneously
CRONTAB_COMMAND_SUFFIX = '2>&1'  # Redirect stderr to stdout
```

### Step 3: Add Cron Jobs to System

```bash
# Add the cron jobs
python manage.py crontab add

# Verify they were added
python manage.py crontab show

# Check system crontab
crontab -l
```

## Cron Schedule Examples

```python
CRONJOBS = [
    # Every 15 minutes
    ('*/15 * * * *', 'django.core.management.call_command', ['expire_roles']),
    
    # Every hour
    ('0 * * * *', 'django.core.management.call_command', ['expire_roles']),
    
    # Every 30 minutes
    ('*/30 * * * *', 'django.core.management.call_command', ['expire_roles']),
    
    # Every day at 2 AM
    ('0 2 * * *', 'django.core.management.call_command', ['expire_roles']),
    
    # Every Monday at 3 AM
    ('0 3 * * 1', 'django.core.management.call_command', ['expire_roles']),
]
```

## Management Commands

```bash
# Add cron jobs to system crontab
python manage.py crontab add

# Show current cron jobs
python manage.py crontab show

# Remove cron jobs from system crontab
python manage.py crontab remove

# Remove and re-add (useful after configuration changes)
python manage.py crontab remove
python manage.py crontab add
```

## Logging

### Option 1: Log to File

```python
CRONJOBS = [
    ('*/15 * * * *', 'django.core.management.call_command', ['expire_roles'], {}, '>> /var/log/hrms/role_expiration.log 2>&1'),
]
```

Make sure the log directory exists and is writable:
```bash
sudo mkdir -p /var/log/hrms
sudo chown $USER:$USER /var/log/hrms
```

### Option 2: Use Django Logging

Configure Django logging in `settings.py`:

```python
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': '/var/log/hrms/django.log',
        },
    },
    'loggers': {
        'authentication': {
            'handlers': ['file'],
            'level': 'INFO',
            'propagate': True,
        },
    },
}
```

## Troubleshooting

### Cron jobs not running

1. **Check if jobs were added:**
   ```bash
   python manage.py crontab show
   crontab -l
   ```

2. **Check cron service is running:**
   ```bash
   # On Ubuntu/Debian
   sudo service cron status
   
   # On CentOS/RHEL
   sudo service crond status
   ```

3. **Check logs:**
   ```bash
   # System cron logs
   grep CRON /var/log/syslog
   
   # Application logs
   tail -f /tmp/role_expiration.log
   ```

4. **Test command manually:**
   ```bash
   python manage.py expire_roles
   ```

### Permission issues

Make sure the user running cron has permission to:
- Access the Django project directory
- Write to log files
- Access the database

### Virtual environment issues

If using a virtual environment, specify the full path:

```python
CRONJOBS = [
    ('*/15 * * * *', '/path/to/venv/bin/python', ['/path/to/project/manage.py', 'expire_roles']),
]
```

### Database connection issues

Ensure the cron job has access to the same database configuration:
- Check DATABASE settings in settings.py
- Verify database credentials
- Test database connection manually

## Production Deployment

### Using Environment Variables

```python
import os

CRONJOBS = [
    ('*/15 * * * *', 'django.core.management.call_command', ['expire_roles'], {}, 
     f'>> {os.getenv("LOG_DIR", "/tmp")}/role_expiration.log 2>&1'),
]
```

### Deployment Checklist

1. ✅ Install django-crontab: `pip install django-crontab`
2. ✅ Add to INSTALLED_APPS
3. ✅ Configure CRONJOBS in settings.py
4. ✅ Create log directory with proper permissions
5. ✅ Test command manually: `python manage.py expire_roles`
6. ✅ Add cron jobs: `python manage.py crontab add`
7. ✅ Verify: `python manage.py crontab show`
8. ✅ Monitor logs for first few runs
9. ✅ Set up log rotation if needed

### Log Rotation

Create `/etc/logrotate.d/hrms`:

```
/var/log/hrms/*.log {
    daily
    rotate 30
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
}
```

## Monitoring

### Check Recent Expirations

```python
from authentication.models import AuditLog

# Get recent automatic expirations
recent = AuditLog.objects.filter(
    action='ROLE_REVOKED',
    details__reason='Automatic expiration'
).order_by('-timestamp')[:10]

for log in recent:
    print(f"{log.timestamp}: {log.target_user.username} - {log.details['role_name']}")
```

### Check Upcoming Expirations

```python
from authentication.models import RoleAssignment
from django.utils import timezone
from datetime import timedelta

# Roles expiring in next 24 hours
soon = RoleAssignment.objects.filter(
    is_active=True,
    expires_at__isnull=False,
    expires_at__lte=timezone.now() + timedelta(hours=24)
).order_by('expires_at')

for assignment in soon:
    time_left = assignment.expires_at - timezone.now()
    print(f"{assignment.user.username} - {assignment.role.name} - {time_left}")
```

## Alternative: System Crontab

If you prefer not to use django-crontab, you can add directly to system crontab:

```bash
crontab -e
```

Add:
```
*/15 * * * * cd /path/to/project && /path/to/venv/bin/python manage.py expire_roles >> /var/log/hrms/role_expiration.log 2>&1
```

This approach:
- ✅ No additional Python package needed
- ✅ More control over execution environment
- ❌ Requires manual setup on each server
- ❌ Not tracked in version control
