# Gmail SMTP Setup Instructions

Follow these steps to send real emails to ishitaparkar04@gmail.com (or any Gmail address).

## Step 1: Enable 2-Factor Authentication on Gmail

1. Go to your Google Account: https://myaccount.google.com/
2. Click on "Security" in the left sidebar
3. Under "Signing in to Google", enable "2-Step Verification"
4. Follow the prompts to set it up

## Step 2: Generate an App Password

1. Go to: https://myaccount.google.com/apppasswords
2. You may need to sign in again
3. In the "Select app" dropdown, choose "Mail"
4. In the "Select device" dropdown, choose "Other (Custom name)"
5. Enter "HRMS Django" as the name
6. Click "Generate"
7. **Copy the 16-character password** (it will look like: `abcd efgh ijkl mnop`)
8. Save this password - you won't be able to see it again!

## Step 3: Configure Environment Variables

Create a `.env` file in the `backend` directory with these settings:

```bash
# Email Configuration for Gmail
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_USE_SSL=False
EMAIL_HOST_USER=your-gmail-address@gmail.com
EMAIL_HOST_PASSWORD=your-16-char-app-password-here
DEFAULT_FROM_EMAIL=your-gmail-address@gmail.com
```

**Replace:**
- `your-gmail-address@gmail.com` with your actual Gmail address
- `your-16-char-app-password-here` with the App Password from Step 2 (remove spaces)

## Step 4: Install python-dotenv (if not already installed)

```bash
pip install python-dotenv
```

## Step 5: Update settings.py to load .env file

Add this at the top of `backend/hrms_core/settings.py` (after imports):

```python
from dotenv import load_dotenv
load_dotenv()
```

## Step 6: Test the Email

Run the test command:

```bash
cd backend
python manage.py send_test_welcome_email --email ishitaparkar04@gmail.com
```

You should receive an email at ishitaparkar04@gmail.com within a few seconds!

## Alternative: Quick Test Without .env File

You can also set environment variables directly in your terminal:

```bash
export EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
export EMAIL_HOST=smtp.gmail.com
export EMAIL_PORT=587
export EMAIL_USE_TLS=True
export EMAIL_HOST_USER=your-gmail@gmail.com
export EMAIL_HOST_PASSWORD=your-app-password
export DEFAULT_FROM_EMAIL=your-gmail@gmail.com

python manage.py send_test_welcome_email --email ishitaparkar04@gmail.com
```

## Troubleshooting

### "Username and Password not accepted"
- Make sure you're using an App Password, not your regular Gmail password
- Verify 2-Factor Authentication is enabled
- Check that you copied the App Password correctly (no spaces)

### "Connection timeout"
- Check your internet connection
- Verify port 587 is not blocked by your firewall
- Try using port 465 with EMAIL_USE_SSL=True instead

### "Sender address rejected"
- Make sure DEFAULT_FROM_EMAIL matches your EMAIL_HOST_USER
- Gmail requires the FROM address to be your authenticated email

## Security Notes

- Never commit your `.env` file to git (it's already in `.gitignore`)
- Keep your App Password secure
- Rotate App Passwords periodically
- Use different App Passwords for different applications
