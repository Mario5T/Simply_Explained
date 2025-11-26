import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

interface InvitationEmailData {
    recipientEmail: string;
    senderName: string;
    sessionId: string;
    sessionUrl: string;
}

export async function sendInvitationEmail(data: InvitationEmailData): Promise<void> {
    const { recipientEmail, senderName, sessionId, sessionUrl } = data;

    const mailOptions = {
        from: `"Collaborative Whiteboard" <${process.env.SMTP_USER}>`,
        to: recipientEmail,
        subject: `${senderName} invited you to collaborate on a whiteboard`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                    .session-info { background: white; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0; }
                    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🎨 Whiteboard Invitation</h1>
                    </div>
                    <div class="content">
                        <p>Hi there!</p>
                        <p><strong>${senderName}</strong> has invited you to collaborate on a whiteboard session.</p>
                        
                        <div class="session-info">
                            <strong>Session ID:</strong> <code>${sessionId}</code>
                        </div>
                        
                        <p>Click the button below to join the session:</p>
                        
                        <a href="${sessionUrl}" class="button">Join Whiteboard Session</a>
                        
                        <p>Or copy and paste this link into your browser:</p>
                        <p><a href="${sessionUrl}">${sessionUrl}</a></p>
                        
                        <div class="footer">
                            <p>This is an automated email from the Collaborative Whiteboard application.</p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `,
        text: `
${senderName} invited you to collaborate on a whiteboard

Session ID: ${sessionId}

Join the session by visiting: ${sessionUrl}

This is an automated email from the Collaborative Whiteboard application.
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Invitation email sent to ${recipientEmail}`);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send invitation email');
    }
}
