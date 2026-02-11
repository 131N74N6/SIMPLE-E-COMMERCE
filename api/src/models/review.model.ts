import mongoose, { Schema, Types } from "mongoose";

export type ReviewIntrf = {
    created_at: string;
    product_review: string;
    product_id: Types.ObjectId;
    seller_id: Types.ObjectId;
    customer_id: Types.ObjectId;
    customer_name: string;
}

const reviewSchema = new Schema<ReviewIntrf>({
    created_at: { type: String, required: true },
    product_review: { type: String, required: true },
    product_id: { type: Schema.Types.ObjectId, required: true },
    seller_id: { type: Schema.Types.ObjectId, required: true },
    customer_id: { type: Schema.Types.ObjectId, required: true },
    customer_name: { type: String, required: true }
});

export const Review = mongoose.model<ReviewIntrf>('product_reviews', reviewSchema, 'product_reviews');