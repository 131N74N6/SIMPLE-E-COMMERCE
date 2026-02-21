import { Request, Response } from 'express';
import { Cart } from '../models/cart.model';
import dotenv from 'dotenv';

dotenv.config();

export async function getSearchedProducts(req: Request, res: Response): Promise<void> {
    try {
        const { searched } = req.query;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const skip = (page - 1) * limit;
        
        if (!searched || typeof searched !== 'string') {
            res.status(400).json({ message: 'Search query is required' });
            return;
        }

        if (isNaN(page) || page < 1) {
            res.status(400).json({ message: 'Invalid page parameter' });
            return;
        }

        if (isNaN(limit) || limit < 1 || limit > 12) {
            res.status(400).json({ message: 'Invalid limit parameter' });
            return;
        }

        const searchedPost = await Cart.find(
            { user_id: req.params.user_id, product_name: { $regex: new RegExp(searched, 'i') } },
            { created_at: 0 }
        ).limit(limit).skip(skip).sort({ created_at: -1 });
        
        res.json(searchedPost);
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function getUserProducts(req: Request, res: Response): Promise<void> {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const skip = (page - 1) * limit;

        const signedInUserProducts = await Cart.find(
            { user_id: req.params.user_id }, 
            { created_at: 0 }
        ).limit(limit).skip(skip).sort({ created_at: -1 });

        res.json(signedInUserProducts);
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function getUserTotalProducts(req: Request, res: Response): Promise<void> {
    try {
        const getUserId = req.params.user_id;
        const getUserProduct = await Cart.find({ user_id: getUserId });
        
        const productTotal = getUserProduct.reduce((total, item) => total + item.product_total, 0);
        const priceTotal = getUserProduct.reduce((total, product) => total + product.product_price, 0);

        res.json({ 
            product_total:productTotal, 
            price_total: priceTotal 
        });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function insertNewProduct(req: Request, res: Response): Promise<void> {
    try {
        const newPost = new Cart(req.body);
        await newPost.save();
        res.status(200).json({ message: 'new product added' });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function isProductInCart(req: Request, res: Response): Promise<void> {
    try {
        const { user_id, product_id } = req.query;
        const isProductExist = await Cart.findOne({ user_id, product_id });
        res.json(!!isProductExist);
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function deleteAllProducts(req: Request, res: Response): Promise<void> {
    try {
        const cartProducts = await Cart.find({ user_id: req.params.user_id });

        if (cartProducts.length === 0) {
            res.status(404).json({ message: 'Produk tidak ditemukan.' });
            return;
        }

        await Cart.deleteMany({ user_id: req.params.user_id });
        res.status(200).json({ message: 'Semua produk berhasil dihapus dari keranjang.' });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function deleteOneProduct(req: Request, res: Response): Promise<void> {
    try {
        await Cart.deleteOne({ _id : req.params._id });
        res.status(200).json({ message: 'products in cart successfuly deleted' });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function updateCartProduct(req: Request, res: Response): Promise<void> {
    try {
        const getCartProduct = await Cart.find({ _id: req.params._id });

        if (req.body.product_total < 1) {
            res.status(400).json({ message: 'total produk minimal 1' });
            return;
        }

        await Cart.updateOne({ _id: getCartProduct[0]._id }, {
            $set: {
                product_total: req.body.product_total,
                product_price: getCartProduct[0].product_price * req.body.product_total,
            }
        });
        res.status(200).json({ message: 'cart product successfuly updated' });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}