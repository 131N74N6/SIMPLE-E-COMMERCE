import mongoose, { Schema, Types } from "mongoose";

export type PaymentIntrf = {
    created_at: string;
    amount: number;
    payment_method: string;
    payment_details: {
        va_numbers?: { bank: string; va_number: string }[];
        payment_type?: string;
        transaction_time?: string;
        transaction_id?: string;
    };
    status: 'pending' | 'completed' | 'failed' | 'settlement' | 'cancel' | 'expire';
    user_id: Types.ObjectId;
    order_id: Types.ObjectId;
}

const paymentSchema = new Schema<PaymentIntrf>({
    created_at: { type: String, required: true },
    amount: { type: Number, required: true },
    payment_method: { type: String, required: true },
    payment_details: { type: Object, required: false },
    status: { type: String, enum: ['pending', 'completed', 'failed', 'settlement', 'cancel', 'expire'], required: true },
    user_id: { type: Schema.Types.ObjectId, required: true },
    order_id: { type: Schema.Types.ObjectId, required: true },
});

export const Payment = mongoose.model<PaymentIntrf>('payments', paymentSchema, 'payments');