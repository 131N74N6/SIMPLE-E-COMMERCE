import mongoose, { Schema } from "mongoose";

export type AuthIntrf = {
    created_at: string;
    email: string;
    password: string;
    username: string;
}

const authSchema = new Schema<AuthIntrf>({
    created_at: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    username: { type: String, required: true },
});

export const Auth = mongoose.model<AuthIntrf>('users', authSchema, 'users');