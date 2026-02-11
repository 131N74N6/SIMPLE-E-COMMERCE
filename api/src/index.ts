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

const app = express();

app.use(express.json());
app.use(cors());
app.use('/auth', authRateLimiter, authRouters);
app.use('/cart', cartRouters)
app.use('/product', productRouters);
app.use('/review', reviewRouters);
app.use('/purchase-history', purchaseHistoryRouters);
app.use('/sale-history', saleHistoryRouters);

db.then(() => {
    app.listen(1234, () => console.log('server running at http://localhost:1234'));
});