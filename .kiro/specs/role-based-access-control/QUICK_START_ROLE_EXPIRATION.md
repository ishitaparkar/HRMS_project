# Quick Start: Role Expiration

## TL;DR

Temporary roles now automatically expire! Here's how to enable it:

## Simplest Setup (Unix Cron)

1. **Edit your crontab**:
   ```bash
   crontab -e
   ```

2. **Add this line** (runs every 15 minutes):
   ```
   */15 * * * * cd /path/to/hrms && /path/to/venv/bin/python manage.py expire_roles >> /tmp/role_expiration.log 2>&1
   ```

3. **Done!** Roles will now expire automatically.

## Test It

```bash
# See what would be expired (safe, no changes)
python manage.py expire_roles --dry-run

# Actually expire roles
python manage.py expire_roles
```

## How It Works

1. When you assign a temporary role with an expiration date
2. The system checks periodically (every 15 minutes by default)
3. Expired roles are automatically revoked
4. Users are removed from the role's group
5. Everything is logged in the audit log

## Check Audit Logs

```python
from authentication.models import AuditLog

# See recent expirations
AuditLog.objects.filter(
    action='ROLE_REVOKED',
    details__reason='Automatic expiration'
).order_by('-timestamp')[:5]
```

## Need More?

- **Full scheduling guide**: See `ROLE_EXPIRATION_SCHEDULING.md`
- **Django-crontab setup**: See `CRONTAB_SETUP_EXAMPLE.md`
- **Celery setup**: See `hrms_core/celery_example.py`
- **Complete details**: See `TASK_11_SUMMARY.md`

## Common Schedules

```bash
# Every 15 minutes (recommended)
*/15 * * * * ...

# Every hour
0 * * * * ...

# Every 30 minutes
*/30 * * * * ...

# Daily at 2 AM
0 2 * * * ...
```

## Troubleshooting

**Not expiring?**
- Check cron is running: `sudo service cron status`
- Check logs: `tail -f /tmp/role_expiration.log`
- Test manually: `python manage.py expire_roles`

**Need help?**
- Read the full documentation in `ROLE_EXPIRATION_SCHEDULING.md`
- Check the implementation summary in `TASK_11_SUMMARY.md`
