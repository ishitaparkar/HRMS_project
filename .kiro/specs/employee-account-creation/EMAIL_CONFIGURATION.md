# Email Configuration Guide

This guide explains how to configure email settings for the HRMS system to send welcome emails when new employee accounts are created.

## Overview

The HRMS system sends automated welcome emails to new employees containing their login credentials. The email configuration supports both development and production environments.

## Configuration Options

### Development Mode (Console Backend)

By default, the system uses Django's console backend, which prints emails to the console instead of sending them. This is useful for development and testing.

**No configuration required** - this is the default behavior.

### Production Mode (SMTP Backend)

For production, configure SMTP settings to send real emails through an email service provider.

## Environment Variables

Create a `.env` file in the `backend` directory (or set environment variables in your deployment platform) with the following settings:

```bash
# Email Backend
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend

# SMTP Server Settings
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_USE_SSL=False

# Authentication
EMAIL_HOST_USER=your-email@example.com
EMAIL_HOST_PASSWORD=your-app-password-here

# Sender Information
DEFAULT_FROM_EMAIL=noreply@hrms.example.com
SERVER_EMAIL=noreply@hrms.example.com

# Timeout (optional)
EMAIL_TIMEOUT=10
```

## Provider-Specific Configuration

### Gmail

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the generated 16-character password
3. Configure settings:
   ```bash
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USE_TLS=True
   EMAIL_HOST_USER=your-email@gmail.com
   EMAIL_HOST_PASSWORD=your-16-char-app-password
   ```

### Outlook/Office 365

```bash
EMAIL_HOST=smtp.office365.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@outlook.com
EMAIL_HOST_PASSWORD=your-password
```

### SendGrid

```bash
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=apikey
EMAIL_HOST_PASSWORD=your-sendgrid-api-key
```

### Mailgun

```bash
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=postmaster@your-domain.mailgun.org
EMAIL_HOST_PASSWORD=your-mailgun-password
```

### Amazon SES

```bash
EMAIL_HOST=email-smtp.us-east-1.amazonaws.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-ses-smtp-username
EMAIL_HOST_PASSWORD=your-ses-smtp-password
```

## Testing Email Configuration

### Test Command

Use the management command to test your email configuration:

```bash
python manage.py test_email --to recipient@example.com
```

This will:
- Display your current email configuration
- Send a test email to the specified address
- Show success or error messages

### Console Backend Test

```bash
# Default - prints to console
python manage.py test_email --to test@example.com
```

You should see the email content printed in the console.

### SMTP Backend Test

```bash
# Set environment variables first
export EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
export EMAIL_HOST=smtp.gmail.com
export EMAIL_HOST_USER=your-email@gmail.com
export EMAIL_HOST_PASSWORD=your-app-password

# Run test
python manage.py test_email --to your-email@gmail.com
```

Check your inbox for the test email.

## Welcome Email Template

The system uses two email templates:

1. **HTML Template**: `backend/authentication/templates/authentication/emails/welcome_email.html`
2. **Plain Text Template**: `backend/authentication/templates/authentication/emails/welcome_email.txt`

Both templates include:
- Employee name and ID
- Username (email)
- Temporary password
- Portal URL
- Security instructions

## Troubleshooting

### Common Issues

#### 1. Authentication Failed

**Error**: `SMTPAuthenticationError: Username and Password not accepted`

**Solutions**:
- Verify EMAIL_HOST_USER and EMAIL_HOST_PASSWORD are correct
- For Gmail, use an App Password instead of your regular password
- Check if 2-factor authentication is enabled (required for Gmail)
- Ensure "Less secure app access" is enabled (if not using App Passwords)

#### 2. Connection Timeout

**Error**: `SMTPServerDisconnected: Connection unexpectedly closed`

**Solutions**:
- Check EMAIL_HOST and EMAIL_PORT are correct
- Verify your firewall allows outbound connections on the SMTP port
- Try increasing EMAIL_TIMEOUT value
- Check if your email provider requires SSL instead of TLS

#### 3. TLS/SSL Issues

**Error**: `SMTPException: STARTTLS extension not supported`

**Solutions**:
- Try EMAIL_USE_SSL=True and EMAIL_PORT=465
- Or use EMAIL_USE_TLS=True and EMAIL_PORT=587
- Check your email provider's documentation for correct settings

#### 4. Sender Address Rejected

**Error**: `SMTPSenderRefused: Sender address rejected`

**Solutions**:
- Ensure DEFAULT_FROM_EMAIL matches your authenticated email domain
- Some providers require the FROM address to match EMAIL_HOST_USER
- Verify your email account has permission to send emails

### Debug Mode

To see detailed SMTP communication, temporarily add to settings.py:

```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

## Security Best Practices

1. **Never commit credentials**: Use environment variables, never hardcode passwords
2. **Use App Passwords**: For Gmail and similar services, use app-specific passwords
3. **Enable TLS**: Always use EMAIL_USE_TLS=True for secure connections
4. **Rotate passwords**: Regularly update email credentials
5. **Limit permissions**: Use email accounts with minimal necessary permissions
6. **Monitor usage**: Track email sending to detect unauthorized use

## Production Deployment

### Using Environment Variables

Most deployment platforms support environment variables:

**Heroku**:
```bash
heroku config:set EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
heroku config:set EMAIL_HOST=smtp.gmail.com
heroku config:set EMAIL_HOST_USER=your-email@gmail.com
heroku config:set EMAIL_HOST_PASSWORD=your-app-password
```

**AWS Elastic Beanstalk**:
Add to `.ebextensions/environment.config`:
```yaml
option_settings:
  - option_name: EMAIL_BACKEND
    value: django.core.mail.backends.smtp.EmailBackend
  - option_name: EMAIL_HOST
    value: smtp.gmail.com
```

**Docker**:
Add to `docker-compose.yml`:
```yaml
environment:
  - EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
  - EMAIL_HOST=smtp.gmail.com
  - EMAIL_HOST_USER=${EMAIL_HOST_USER}
  - EMAIL_HOST_PASSWORD=${EMAIL_HOST_PASSWORD}
```

### Using Django Settings

For simple deployments, you can also configure directly in `settings.py`:

```python
if not DEBUG:
    EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
    EMAIL_HOST = 'smtp.gmail.com'
    EMAIL_PORT = 587
    EMAIL_USE_TLS = True
    EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER')
    EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD')
```

## Email Sending Flow

1. Super Admin creates new employee record
2. `EmployeeSerializer.create()` is called
3. `AccountCreationService.create_user_account()` creates user
4. `AccountCreationService.send_welcome_email()` sends email
5. Email is queued/sent based on EMAIL_BACKEND configuration
6. Success/failure is logged in audit log

## Monitoring and Logging

The system logs email-related events:

- Account creation with email status
- Email sending failures
- SMTP connection errors

Check Django logs for email-related issues:

```bash
# View recent logs
tail -f /path/to/django.log | grep -i email
```

## Rate Limiting

Consider implementing rate limiting for email sending:

1. **Provider limits**: Most email providers have sending limits
   - Gmail: 500 emails/day for free accounts
   - SendGrid: Varies by plan
   - Amazon SES: Varies by account

2. **Implement throttling**: Use Django's cache framework to limit email sending rate

3. **Queue emails**: For bulk operations, use Celery to queue emails

## Additional Resources

- [Django Email Documentation](https://docs.djangoproject.com/en/stable/topics/email/)
- [Gmail App Passwords](https://support.google.com/accounts/answer/185833)
- [SendGrid Django Integration](https://docs.sendgrid.com/for-developers/sending-email/django)
- [Amazon SES Setup](https://docs.aws.amazon.com/ses/latest/dg/send-email-smtp.html)
