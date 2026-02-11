import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';

export const validateWebhook = (req: Request, res: Response, next: NextFunction) => {
    const { body } = req;
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const signatureKey = crypto.createHmac('sha512', serverKey!).update(JSON.stringify(body)).digest('base64');

    if (signatureKey !== req.headers['x-midtrans-signature']) {
        return res.status(403).json({ error: 'Invalid signature' });
    }

    next();
};