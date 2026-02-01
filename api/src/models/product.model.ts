import mongoose, { Schema, Types } from "mongoose";

export type ProductIntrf = {
    created_at: string;
    product_description: string;
    product_images: { 
        file_url: string;
        public_id: string;
    }[];
    product_name: string;
    product_price: number;
    product_stock: number;
    user_id: Types.ObjectId;
}

const productSchema = new Schema<ProductIntrf>({
    created_at: { type: String, required: true },
    product_description: { type: String, required: true },
    product_images: [{
        file_url: { type: String },
        public_id: { type: String }
    }],
    product_name: { type: String, required: true },
    product_price: { type: Number, required: true },
    product_stock: { type: Number, required: true },
    user_id: { type: Schema.Types.ObjectId, required: true }
});

export const Product = mongoose.model<ProductIntrf>('products', productSchema, 'products');