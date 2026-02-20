import mongoose, { Schema, Types } from 'mongoose';

export type OrderIntrf = {
    created_at: string;
    customer_id: Types.ObjectId;
    customer_name: string;
    customer_email: string;
    product_list: {
        product_images: { 
            file_url: string;
            public_id: string;
        }[];
        product_name: string;
        product_price: number;
        product_id: Types.ObjectId;
        product_total: number;
        seller_id: Types.ObjectId;
        seller_name: string;
    }[];
    snap_token: string;
    status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
    total_quantity: number;
    total_price: number;
    transaction_id: string;
}

const orderSchema = new Schema<OrderIntrf>({
    created_at: { type: String, required: true },
    customer_id: { type: Schema.Types.ObjectId, required: true },
    customer_name: { type: String, required: true },
    customer_email: { type: String, required: true },
    product_list: [{
        product_images: [{ 
            file_url: { type: String, required: true },
            public_id: { type: String, required: true },
        }],
        product_name: { type: String, required: true },
        product_price: { type: Number, required: true },
        product_id: { type: Schema.Types.ObjectId, required: true },
        product_total: { type: Number, required: true },
        seller_id: { type: Schema.Types.ObjectId, required: true },
        seller_name: { type: String, required: true },
    }],
    snap_token: { type: String },
    status: { type: String, enum: ['pending', 'shipped', 'delivered', 'cancelled'], required: true },
    total_quantity: { type: Number, required: true },
    total_price: { type: Number, required: true },
    transaction_id: { type: String }
});

export const Order = mongoose.model<OrderIntrf>('orders', orderSchema, 'orders');