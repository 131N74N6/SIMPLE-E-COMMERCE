import { Router } from "express";
import { getProductReview, makeReview } from "../controllers/review.controller";

const reviewRouters = Router();

reviewRouters.get('/:product_id', getProductReview);
reviewRouters.post('/make', makeReview);

export default reviewRouters;