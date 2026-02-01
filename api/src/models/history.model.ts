import mongoose, { Schema, Types } from "mongoose";

export type HistoryIntrf = {
    created_at: string;
    product_images: string[];
    product_name: string;
    product_price: number;
    product_id: Types.ObjectId;
    product_owner_id: Types.ObjectId;
    user_id: Types.ObjectId;
}

const historySchema = new Schema<HistoryIntrf>({
    created_at: { type: String, required: true },
    product_images: [{ type: String, required: true }],
    product_name: { type: String, required: true },
    product_price: { type: Number, required: true },
    product_id: { type: Schema.Types.ObjectId, required: true },
    product_owner_id: { type: Schema.Types.ObjectId, required: true },
    user_id: { type: Schema.Types.ObjectId, required: true }
});

export const History = mongoose.model<HistoryIntrf>('history', historySchema, 'history');