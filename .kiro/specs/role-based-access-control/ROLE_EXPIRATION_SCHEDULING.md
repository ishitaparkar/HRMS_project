# Role Expiration Scheduling Guide

This document explains how to set up periodic execution of the temporary role expiration mechanism.

## Overview

The role expiration system automatically revokes temporary role assignments that have passed their expiration date. This is implemented through:

1. **Management Command**: `python manage.py expire_roles`
2. **Utility Function**: `expire_temporary_roles()` in `authentication/utils.py`

## Scheduling Options

### Option 1: Unix Cron Job (Recommended for Simple Deployments)

Add a cron job to run the management command periodically.

**Run every hour:**
```bash
0 * * * * cd /path/to/project && /path/to/venv/bin/python manage.py expire_roles >> /var/log/role_expiration.log 2>&1
```

**Run every 15 minutes:**
```bash
*/15 * * * * cd /path/to/project && /path/to/venv/bin/python manage.py expire_roles >> /var/log/role_expiration.log 2>&1
```

**Run daily at 2 AM:**
```bash
0 2 * * * cd /path/to/project && /path/to/venv/bin/python manage.py expire_roles >> /var/log/role_expiration.log 2>&1
```

To edit your crontab:
```bash
crontab -e
```

### Option 2: Celery Beat (Recommended for Production)

If you're using Celery for asynchronous tasks, you can use Celery Beat for periodic tasks.

#### Step 1: Install Celery
```bash
pip install celery redis
```

#### Step 2: Configure Celery in `hrms_core/celery.py`
```python
import os
from celery import Celery
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hrms_core.settings')

app = Celery('hrms_core')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

# Periodic task schedule
app.conf.beat_schedule = {
    'expire-temporary-roles': {
        'task': 'authentication.tasks.expire_temporary_roles_task',
        'schedule': crontab(minute='*/15'),  # Run every 15 minutes
    },
}
```

#### Step 3: Create `authentication/tasks.py`
```python
from celery import shared_task
from .utils import expire_temporary_roles

@shared_task
def expire_temporary_roles_task():
    """
    Celery task to expire temporary role assignments.
    """
    result = expire_temporary_roles()
    return f"Expired {result['expired_count']} roles, {result['error_count']} errors"
```

#### Step 4: Update `hrms_core/settings.py`
```python
# Celery Configuration
CELERY_BROKER_URL = 'redis://localhost:6379/0'
CELERY_RESULT_BACKEND = 'redis://localhost:6379/0'
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TIMEZONE = 'UTC'
```

#### Step 5: Run Celery Worker and Beat
```bash
# Terminal 1: Start Celery worker
celery -A hrms_core worker -l info

# Terminal 2: Start Celery beat scheduler
celery -A hrms_core beat -l info
```

### Option 3: Django-Crontab

A Django-specific solution that integrates with Django management commands.

#### Step 1: Install django-crontab
```bash
pip install django-crontab
```

#### Step 2: Add to `INSTALLED_APPS` in `settings.py`
```python
INSTALLED_APPS = [
    # ... other apps
    'django_crontab',
]
```

#### Step 3: Configure in `settings.py`
```python
CRONJOBS = [
    # Run every 15 minutes
    ('*/15 * * * *', 'django.core.management.call_command', ['expire_roles']),
    
    # Or run every hour
    # ('0 * * * *', 'django.core.management.call_command', ['expire_roles']),
]
```

#### Step 4: Add cron jobs
```bash
python manage.py crontab add
```

#### Step 5: Manage cron jobs
```bash
# Show current cron jobs
python manage.py crontab show

# Remove cron jobs
python manage.py crontab remove
```

### Option 4: APScheduler (For Development/Testing)

A lightweight scheduler that runs within the Django process.

#### Step 1: Install APScheduler
```bash
pip install apscheduler
```

#### Step 2: Create `authentication/scheduler.py`
```python
from apscheduler.schedulers.background import BackgroundScheduler
from .utils import expire_temporary_roles

def start_scheduler():
    scheduler = BackgroundScheduler()
    scheduler.add_job(
        expire_temporary_roles,
        'interval',
        minutes=15,
        id='expire_roles',
        replace_existing=True
    )
    scheduler.start()
```

#### Step 3: Start scheduler in `authentication/apps.py`
```python
from django.apps import AppConfig

class AuthenticationConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'authentication'

    def ready(self):
        # Only run scheduler in production, not during migrations
        import os
        if os.environ.get('RUN_MAIN') == 'true':
            from .scheduler import start_scheduler
            start_scheduler()
```

**Note**: This option is not recommended for production as it runs within the Django process.

## Testing the Expiration

### Manual Testing

Run the management command manually:
```bash
python manage.py expire_roles
```

Use dry-run mode to see what would be expired without making changes:
```bash
python manage.py expire_roles --dry-run
```

### Programmatic Testing

Use the utility function in Python shell:
```python
python manage.py shell

>>> from authentication.utils import expire_temporary_roles
>>> result = expire_temporary_roles()
>>> print(f"Expired: {result['expired_count']}, Errors: {result['error_count']}")
```

### Create Test Data

Create a temporary role assignment that expires immediately:
```python
from django.contrib.auth.models import User, Group
from django.utils import timezone
from datetime import timedelta
from authentication.models import RoleAssignment

user = User.objects.get(username='testuser')
role = Group.objects.get(name='HR Manager')

# Create assignment that expires in 1 minute
assignment = RoleAssignment.objects.create(
    user=user,
    role=role,
    assigned_by=User.objects.get(username='admin'),
    expires_at=timezone.now() + timedelta(minutes=1),
    is_active=True,
    notes='Test temporary assignment'
)

# Add user to group
user.groups.add(role)

# Wait 1 minute, then run:
# python manage.py expire_roles
```

## Monitoring

### Check Audit Logs

Expired roles are logged in the AuditLog table:
```python
from authentication.models import AuditLog

# Get recent role expirations
expirations = AuditLog.objects.filter(
    action='ROLE_REVOKED',
    details__reason='Automatic expiration'
).order_by('-timestamp')[:10]

for log in expirations:
    print(f"{log.timestamp}: {log.target_user.username} - {log.details['role_name']}")
```

### Check Active Temporary Roles

See which temporary roles are currently active and when they expire:
```python
from authentication.models import RoleAssignment
from django.utils import timezone

active_temp_roles = RoleAssignment.objects.filter(
    is_active=True,
    expires_at__isnull=False
).order_by('expires_at')

for assignment in active_temp_roles:
    time_left = assignment.expires_at - timezone.now()
    print(f"{assignment.user.username} - {assignment.role.name} - Expires in: {time_left}")
```

## Recommended Schedule

- **Development**: Run manually or every 5 minutes for testing
- **Production**: Run every 15-30 minutes depending on requirements
- **High Security**: Run every 5-10 minutes for faster revocation

## Troubleshooting

### Cron job not running
- Check cron logs: `grep CRON /var/log/syslog`
- Verify crontab: `crontab -l`
- Check file permissions and paths

### Celery not executing
- Verify Redis is running: `redis-cli ping`
- Check Celery worker logs
- Ensure beat scheduler is running

### Roles not expiring
- Check if `expires_at` is set correctly
- Verify timezone settings match between database and Django
- Run with `--dry-run` to see what would be expired
- Check for errors in logs

## Security Considerations

1. **Audit Logging**: All automatic expirations are logged with full details
2. **No Actor**: System-initiated expirations have `actor=None` in audit logs
3. **Graceful Failure**: Errors in one expiration don't stop others from processing
4. **Idempotent**: Safe to run multiple times - already expired roles are skipped

## Performance

The expiration query is optimized with:
- Index on `expires_at` field (recommended to add)
- `select_related()` to minimize database queries
- Batch processing of all expired assignments

For large deployments with many temporary roles, consider:
- Adding database index: `db_index=True` on `expires_at` field
- Running more frequently with smaller batches
- Monitoring query performance
