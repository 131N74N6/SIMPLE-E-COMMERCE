import { Request, Response } from 'express';
import midtransClient from 'midtrans-client';
import { Order } from '../models/order.model';
import { Payment } from '../models/payment.model';

let snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

export async function createTransaction (req: Request, res: Response) {
    const { customer_id, product_list, quantity } = req.body;

    if (!customer_id || !product_list || !quantity) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const order = new Order({ customer_id, product_list, quantity });
        await order.save();

        const parameter = {
            transaction_details: {
                order_id: order._id.toString(),
                gross_amount: quantity,
            },
            credit_card: { secure: true, },
        }

        const transaction = await snap.createTransaction(parameter);
        const snapToken = transaction.token;

        order.snap_token = snapToken;
        order.transaction_id = transaction.transaction_id;
        await order.save();

        res.status(200).json({ snap_token: snapToken });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}

export async function handleWebhook (req: Request, res: Response) {
    const notification = req.body;

    try {
        const orderId = notification.order_id;
        const order = await Order.findById(orderId);

        if (!order) return res.status(404).json({ error: 'Order not found' });

        order.status = notification.transaction_status;
        await order.save();

        const payment = new Payment({
            order_id: order._id,
            transaction_status: notification.transaction_status,
            payment_type: notification.payment_type,
            fraud_status: notification.fraud_status,
            gross_amount: notification.gross_amount,
            midtrans_response: notification,
        });

        await payment.save();

        res.status(200).json({ message: 'Notification received' });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}