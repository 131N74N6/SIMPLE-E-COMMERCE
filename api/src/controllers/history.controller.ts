import { Request, Response } from 'express';
import { History } from '../models/history.model';

export async function moveToHistory(req: Request, res: Response) {
    try {
        const newHistoryData = new History(req.body);
        await newHistoryData.save();
        res.status(200).json({ message: 'successfuly moved data to history' });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function getBoughtProducts(req: Request, res: Response) {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const skip = (page - 1) * limit;

        const getProducts = await History.find(
            { user_id: req.params.user_id },
            { product_name: 1, product_images: 1, product_price: 1, product_id: 1 }
        ).limit(limit).skip(skip);

        res.json(getProducts);
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function deleteOneFromHistory(req: Request, res: Response) {
    try {
        await History.deleteOne({ _id: req.params._id });
        res.status(200).json({ message: 'deleted one from history' });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function deleteAllFromHistory(req: Request, res: Response) {
    try {
        await History.deleteMany({ user_id: req.params.user_id });
        res.status(200).json({ message: 'deleted all from history' });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}