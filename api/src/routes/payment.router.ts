import express from 'express';
import { createTransaction, handleWebhook } from '../controllers/payment.controller';
import { validateWebhook } from '../middlewares/webhook.middleware';
import { verifyToken } from '../middlewares/auth.middleware';

const paymentRouters = express.Router();

paymentRouters.post('/create-transaction', verifyToken, createTransaction);
paymentRouters.post('/webhook', validateWebhook, handleWebhook);

export default paymentRouters