import express from 'express';
import type { Request, Response } from 'express';
import { sendInvitationEmail } from '../services/email.js';

const router = express.Router();

interface InviteRequestBody {
    email: string;
    senderName: string;
    sessionId: string;
}

router.post('/invite', async (req: Request<{}, {}, InviteRequestBody>, res: Response) => {
    try {
        const { email, senderName, sessionId } = req.body;

        if (!email || !senderName || !sessionId) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: email, senderName, or sessionId'
            });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email address'
            });
        }

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const sessionUrl = `${frontendUrl}/session/${sessionId}`;

        await sendInvitationEmail({
            recipientEmail: email,
            senderName,
            sessionId,
            sessionUrl,
        });

        res.json({
            success: true,
            message: 'Invitation sent successfully'
        });
    } catch (error) {
        console.error('Error sending invitation:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send invitation. Please try again later.'
        });
    }
});

export default router;
