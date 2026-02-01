import mongoose, { Schema, Types } from "mongoose";

export type CartIntrf = {
    created_at: string;
    product_images: string[];
    product_name: string;
    product_price: number;
    product_total: number;
    user_id: Types.ObjectId;
    product_id: Types.ObjectId;
    product_owner_id: Types.ObjectId;
}

const productSchema = new Schema<CartIntrf>({
    created_at: { type: String, required: true },
    product_images: [{ type: String, required: true }],
    product_name: { type: String, required: true },
    product_price: { type: Number, required: true },
    product_total: { type: Number, required: true },
    user_id: { type: Schema.Types.ObjectId, required: true },
    product_id: { type: Schema.Types.ObjectId, required: true },
    product_owner_id: { type: Schema.Types.ObjectId, required: true }
});

export const Cart = mongoose.model<CartIntrf>('cart', productSchema, 'cart');