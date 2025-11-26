# Email Configuration for Whiteboard Invitations

This guide explains how to configure email invitations for the collaborative whiteboard application.

## Quick Setup

1. **Copy the example environment file:**
   ```bash
   cd backend
   cp .env.example .env
   ```

2. **Edit the `.env` file with your SMTP credentials:**
   ```bash
   nano .env  # or use your preferred editor
   ```

## Configuration Options

### Option 1: Gmail (Recommended for Testing)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password:**
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the generated 16-character password

3. **Update `.env` file:**
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-16-char-app-password
   FRONTEND_URL=http://localhost:5173
   ```

### Option 2: Other Email Services

#### Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

#### SendGrid
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

#### Mailgun
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=your-mailgun-smtp-username
SMTP_PASS=your-mailgun-smtp-password
```

## Testing Email Configuration

After configuring your SMTP settings:

1. **Restart the backend server:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Test sending an invitation:**
   - Create a whiteboard session
   - Click the "Invite" button in the toolbar
   - Enter your own email address
   - Click "Send Invitation"
   - Check your inbox for the invitation email

## Troubleshooting

### "Authentication failed" error
- Verify your email and password are correct
- For Gmail, ensure you're using an App Password, not your regular password
- Check if 2FA is enabled (required for Gmail App Passwords)

### "Connection timeout" error
- Check your firewall settings
- Verify the SMTP host and port are correct
- Some networks block SMTP ports - try a different network

### Email not received
- Check your spam/junk folder
- Verify the recipient email address is correct
- Check backend console logs for errors

## Production Deployment

For production, consider using a dedicated email service:
- **SendGrid**: Free tier includes 100 emails/day
- **Mailgun**: Free tier includes 5,000 emails/month
- **AWS SES**: Pay-as-you-go pricing

Update `FRONTEND_URL` in `.env` to your production domain:
```env
FRONTEND_URL=https://your-domain.com
```

## Security Notes

- Never commit `.env` file to version control
- Use environment variables in production
- Rotate SMTP credentials regularly
- Consider rate limiting for invitation emails
