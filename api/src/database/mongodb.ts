import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

export const db = mongoose.connect(`${process.env.MONGODB_URL}`)
.then((res) => {
    if (res) console.log('DATABASE CONNECTED');
}).catch((error) => {
    console.log(error);
});