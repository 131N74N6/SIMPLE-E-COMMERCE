import mongoose, { Schema, Types } from "mongoose";

export type PaymentIntrf = {
    created_at: string;
    amount: number;
    payment_method: string;
    status: 'pending' | 'completed' | 'failed';
    user_id: Types.ObjectId;
    order_id: Types.ObjectId;
}

const paymentSchema = new Schema<PaymentIntrf>({
    created_at: { type: String, required: true },
    amount: { type: Number, required: true },
    payment_method: { type: String, required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed'], required: true },
    user_id: { type: Schema.Types.ObjectId, required: true },
    order_id: { type: Schema.Types.ObjectId, required: true },
});

export const Payment = mongoose.model<PaymentIntrf>('payments', paymentSchema, 'payments');