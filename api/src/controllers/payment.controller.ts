import { Request, Response } from 'express';
import midtransClient from 'midtrans-client';
import { Order } from '../models/order.model';
import { Payment } from '../models/payment.model';
import { Product } from '../models/product.model';

let snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY!,
    clientKey: process.env.MIDTRANS_CLIENT_KEY!,
});

export async function createTransaction(req: Request, res: Response) {
    const { created_at, customer_data, product_list, total_quantity, total_price } = req.body;

    if (!created_at || !customer_data || !product_list || !total_quantity || !total_price) {
        res.status(400).json({ message: 'Missing required fields' });
        return;
    }

    if (total_price <= 0) {
        res.status(400).json({ message: 'Total price must be greater than 0' });
        return;
    }

    try {
        const order = new Order({
            created_at,
            customer_data,
            product_list,
            status: 'pending',
            total_quantity,
            total_price,
        });
        await order.save();

        const parameter = {
            transaction_details: {
                order_id: order._id.toString(),
                gross_amount: total_price,
            },
            credit_card: { secure: true },
            item_details: product_list.map((item: any) => ({
                id: item.product_id.toString(),
                price: item.product_price,
                quantity: item.product_total,
                name: item.product_name.length > 50 ? `${item.product_name.substring(0, 40)}...`: item.product_name,
            })),
            customer_details: {
                first_name: customer_data.customer_firstname,
                last_name: customer_data.customer_lastname,
                email: customer_data.customer_email,
                phone: customer_data.customer_phone,
                billing_address: {
                    first_name: customer_data.customer_firstname,
                    last_name: customer_data.customer_lastname,
                    email: customer_data.customer_email,
                    phone: customer_data.customer_phone,
                    address: customer_data.customer_address,
                    city: customer_data.customer_city,
                    postal_code: customer_data.customer_postal_code,
                    country_code: customer_data.customer_country_code
                },
                shipping_address: {
                    first_name: customer_data.customer_firstname,
                    last_name: customer_data.customer_lastname,
                    email: customer_data.customer_email,
                    phone: customer_data.customer_phone,
                    address: customer_data.customer_address,
                    city: customer_data.customer_city,
                    postal_code: customer_data.customer_postal_code,
                    country_code: customer_data.customer_country_code
                }
            }
        };

        const transaction = await snap.createTransaction(parameter);
        const snapToken = transaction.token;

        order.snap_token = snapToken;
        order.transaction_id = transaction.transaction_id;
        await order.save();

        res.status(200).json({ snap_token: snapToken });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}

export async function handleWebhook(req: Request, res: Response) {
    const notification = req.body;

    try {
        const orderId = notification.order_id;
        const order = await Order.findById(orderId);

        if (!order) return res.status(404).json({ message: 'Order not found' });

        order.status = notification.transaction_status;
        await order.save();

        if (notification.transaction_status === 'settlement') {
            for (const item of order.product_list) {
                await Product.updateOne(
                    { _id: item.product_id },
                    { $inc: { product_stock: -item.product_total } } 
                );
            }
        }

        const payment = new Payment({
            created_at: new Date().toISOString(),
            amount: notification.gross_amount,
            payment_method: notification.payment_type,
            payment_details: {
                va_numbers: notification.va_numbers || [],
                payment_type: notification.payment_type,
                transaction_time: notification.transaction_time,
                transaction_id: notification.transaction_id,
            },
            status: notification.transaction_status, // 'settlement', 'cancel', 'expire', dll
            user_id: order.customer_data.customer_id, // user_id = customer_id
            order_id: order._id,
        });
        
        await payment.save();
        res.status(200).json({ message: 'Notification received' });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}