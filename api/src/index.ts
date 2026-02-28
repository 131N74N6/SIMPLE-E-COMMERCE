import dns from 'node:dns/promises';
import dotenv from 'dotenv';

dotenv.config();

if (process.env.NODE_ENV !== 'production') {
    dns.setServers(["1.1.1.1", "8.8.8.8"]);
    console.log('DNS servers set to Cloudflare (1.1.1.1) and Google (8.8.8.8)');
}

import express from "express";
import { db } from "./database/mongodb";
import cors from "cors";
import { authRateLimiter } from "./middlewares/auth.middleware";
import productRouters from "./routes/product.router";
import reviewRouters from "./routes/review.router";
import authRouters from "./routes/auth.router";
import cartRouters from "./routes/cart.router";
import purchaseHistoryRouters from "./routes/purchase_history.router";
import saleHistoryRouters from "./routes/sale_history.router";
import paymentRouters from "./routes/payment.router";
import { v2 } from 'cloudinary';

const app = express();

v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

app.use(express.json());
app.use(cors({
    origin: [
        "http://localhost:5173", 
        "http://localhost:1234", 
        "https://e-shop-be-chi.vercel.app/", 
        "https://e-shop-jade-sigma.vercel.app/"
    ],
    credentials: true,
}));
app.use('/api/auth', authRateLimiter, authRouters);
app.use('/api/cart', cartRouters)
app.use('/api/product', productRouters);
app.use('/api/payment', paymentRouters);
app.use('/api/review', reviewRouters);
app.use('/api/purchase-history', purchaseHistoryRouters);
app.use('/api/sale-history', saleHistoryRouters);

if (process.env.NODE_ENV !== 'production') {
    db.then(() => {
        app.listen(1234, () => console.log('server running at http://localhost:1234'));
    });
}

export default app;