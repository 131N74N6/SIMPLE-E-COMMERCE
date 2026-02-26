// import dns from 'node:dns/promises'; // Import modul dns

// dns.setServers(["1.1.1.1", "8.8.8.8"]);
// console.log('DNS servers set to Cloudflare (1.1.1.1) and Google (8.8.8.8)');

import express from "express";
// import { db } from "./database/mongodb";
import cors from "cors";
import { authRateLimiter } from "./middlewares/auth.middleware";
import productRouters from "./routes/product.router";
import reviewRouters from "./routes/review.router";
import authRouters from "./routes/auth.router";
import cartRouters from "./routes/cart.router";
import purchaseHistoryRouters from "./routes/purchase_history.router";
import saleHistoryRouters from "./routes/sale_history.router";
import paymentRouters from "./routes/payment.router";

const app = express();

app.use(express.json());
app.use(cors({
    methods: ['DELETE', 'GET', 'POST', 'PUT'],
    origin: ["http://localhost:5173", "http://localhost:1234", "https://api-e-shop.vercel.app"]
}));
app.use('/api/auth', authRateLimiter, authRouters);
app.use('/api/cart', cartRouters)
app.use('/api/product', productRouters);
app.use('/api/payment', paymentRouters);
app.use('/api/review', reviewRouters);
app.use('/api/purchase-history', purchaseHistoryRouters);
app.use('/api/sale-history', saleHistoryRouters);

// db.then(() => {
//     app.listen(1234, () => console.log('server running at http://localhost:1234'));
// });

export default app;