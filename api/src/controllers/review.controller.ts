import { Request, Response } from 'express';
import { Review } from '../models/review.model';

export async function getProductReview(req: Request, res: Response) {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const skip = (page - 1) * limit;

        const productReviews = await Review.find(
            { product_id: req.params.product_id },
            { _id: 1, created_at: 1, product_review: 1, customer_name: 1, customer_id: 1 }
        ).limit(limit).skip(skip).sort({ created_at: -1 });

        res.json(productReviews)
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function getTotalProductReview(req: Request, res: Response) {
    try {
        const totalReviews = await Review.countDocuments({ product_id: req.params.product_id });
        res.json({ total_reviews: totalReviews });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function makeReview(req: Request, res: Response) {
    try {
        if (!req.body.product_review || req.body.product_review.trim() === '') {
            return res.status(400).json({ message: 'review content tidak boleh kosong.' });
        }

        const newComment = new Review(req.body);
        await newComment.save();
        res.status(200).json({ message: 'new comment added' });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}