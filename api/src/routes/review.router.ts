import { Router } from "express";
import { getProductReview, getTotalProductReview, makeReview } from "../controllers/review.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const reviewRouters = Router();

reviewRouters.get('/get/:product_id', verifyToken, getProductReview);
reviewRouters.get('/total/:product_id', verifyToken, getTotalProductReview);
reviewRouters.post('/make', verifyToken, makeReview);

export default reviewRouters;