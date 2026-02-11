import mongoose, { Schema, Types } from 'mongoose';

export type OrderIntrf = {
    created_at: string;
    customer_id: Types.ObjectId;
    customer_name: string;
    seller_name: string;
    seller_id: Types.ObjectId;
    product_list: {
        product_images: { 
            file_url: string;
            public_id: string;
        }[];
        product_name: string;
        product_price: number;
        product_id: Types.ObjectId;
        product_owner_id: Types.ObjectId;
    }[];
    quantity: number;
    status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
    total_price: number;
}

const orderSchema = new Schema<OrderIntrf>({
    created_at: { type: String, required: true },
    customer_id: { type: Schema.Types.ObjectId, required: true },
    customer_name: { type: String, required: true },
    seller_id: { type: Schema.Types.ObjectId, required: true },
    seller_name: { type: String, required: true },
    product_list: [{
        product_images: [{ 
            file_url: { type: String, required: true },
            public_id: { type: String, required: true },
        }],
        product_name: { type: String, required: true },
        product_price: { type: Number, required: true },
        product_id: { type: Schema.Types.ObjectId, required: true },
        product_owner_id: { type: Schema.Types.ObjectId, required: true }
    }],
    quantity: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'shipped', 'delivered', 'cancelled'], required: true },
    total_price: { type: Number, required: true }
});

export const Order = mongoose.model<OrderIntrf>('orders', orderSchema, 'orders');