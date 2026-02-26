import { Request, Response } from 'express';
import { SaleHistory } from '../models/sale_history.model';

export async function moveToHistory(req: Request, res: Response) {
    try {
        const newHistoryData = new SaleHistory(req.body);
        await newHistoryData.save();
        res.status(200).json({ message: 'data dipindahkan ke history penjualan' });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function getSoldProducts(req: Request, res: Response) {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const skip = (page - 1) * limit;

        const getProducts = await SaleHistory.find(
            { seller_id: req.params.user_id },
            { created_at: 1, product_list: 1, quantity: 1, status: 1, total_price: 1 }
        ).limit(limit).skip(skip).sort({ created_at: -1 });

        res.json(getProducts);
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function deleteOneFromHistory(req: Request, res: Response) {
    try {
        await SaleHistory.deleteOne({ _id: req.params._id });
        res.status(200).json({ message: 'data berhasil dihapus dari history penjualan' });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function deleteAllFromHistory(req: Request, res: Response) {
    try {
        await SaleHistory.deleteMany({ seller_id: req.params.user_id });
        res.status(200).json({ message: 'berhasil menghapus semua data dari history penjualan' });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function getSearchSoldProducts(req: Request, res: Response) {
    try {
        const { searched } = req.query;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const skip = (page - 1) * limit;
        
        if (!searched || typeof searched !== 'string') {
            res.status(400).json({ message: 'Search query is required' });
            return;
        }

        const getProducts = await SaleHistory.find(
            { seller_id: req.params.user_id, "product_list.product_name": { $regex: new RegExp(searched, 'i') } },
            { created_at: 1, product_list: 1, quantity: 1, status: 1, total_price: 1 }
        ).limit(limit).skip(skip).sort({ created_at: -1 });

        res.json(getProducts);
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}