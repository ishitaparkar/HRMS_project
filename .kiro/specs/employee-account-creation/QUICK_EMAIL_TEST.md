# Quick Email Test Guide

Follow these steps to send a test email to ishitaparkar04@gmail.com

## Step 1: Get Your Gmail App Password

1. Go to: https://myaccount.google.com/apppasswords
2. Sign in to your Gmail account
3. If you don't see the App Passwords option, you need to enable 2-Factor Authentication first:
   - Go to: https://myaccount.google.com/security
   - Enable "2-Step Verification"
   - Then return to the App Passwords page
4. Select "Mail" as the app
5. Select "Other (Custom name)" as the device
6. Enter "HRMS Django" as the name
7. Click "Generate"
8. **Copy the 16-character password** (looks like: `abcd efgh ijkl mnop`)

## Step 2: Edit the .env File

Open the file: `backend/.env`

Replace these lines with your actual credentials:

```bash
EMAIL_HOST_USER=your-actual-gmail@gmail.com
EMAIL_HOST_PASSWORD=abcdefghijklmnop
DEFAULT_FROM_EMAIL=your-actual-gmail@gmail.com
SERVER_EMAIL=your-actual-gmail@gmail.com
```

**Example:**
```bash
EMAIL_HOST_USER=ishitaparkar04@gmail.com
EMAIL_HOST_PASSWORD=abcdefghijklmnop
DEFAULT_FROM_EMAIL=ishitaparkar04@gmail.com
SERVER_EMAIL=ishitaparkar04@gmail.com
```

**Important:** 
- Remove all spaces from the App Password
- Use the App Password, NOT your regular Gmail password

## Step 3: Test the Email

Run this command from the backend directory:

```bash
python manage.py send_test_welcome_email --email ishitaparkar04@gmail.com
```

## Expected Output

You should see:

```
Looking for employee with email: ishitaparkar04@gmail.com
✓ Found employee: Ishita Parkar (ID: 001)
✓ User account exists: ishitaparkar04@gmail.com

Sending test welcome email...
To: ishitaparkar04@gmail.com
Employee: Ishita Parkar
Employee ID: 001
Username: ishitaparkar04@gmail.com
Temporary Password: TestPass123!

✓ Test welcome email sent successfully!
Check the inbox for ishitaparkar04@gmail.com
```

Then check your Gmail inbox - you should receive the welcome email!

## Troubleshooting

### Error: "Username and Password not accepted"
- Make sure you're using the App Password (16 characters, no spaces)
- Verify 2-Factor Authentication is enabled on your Gmail
- Double-check you copied the password correctly

### Error: "Connection timeout"
- Check your internet connection
- Make sure port 587 is not blocked by your firewall

### Error: "SMTPAuthenticationError"
- The App Password might be incorrect
- Try generating a new App Password
- Make sure you're using the correct Gmail address

### Still not working?
Try the basic test command first:
```bash
python manage.py test_email --to ishitaparkar04@gmail.com
```

This will show you the exact SMTP configuration being used.
