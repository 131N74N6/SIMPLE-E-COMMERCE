import { Request, Response } from 'express';
import { Product } from '../models/product.model';
import dotenv from 'dotenv';
import { v2 } from 'cloudinary';
import { Review } from '../models/review.model';
import { Cart } from '../models/cart.model';
import { PurchaseHistory } from '../models/purchase_history.model';
import { SaleHistory } from '../models/sale_history.model';

dotenv.config();

v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function getAllProducts(req: Request, res: Response): Promise<void> {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const skip = (page - 1) * limit;

        const allPost = await Product.find(
            {}, 
            { _id: 1, product_name: 1, product_images: 1, product_price: 1 }
        ).limit(limit).skip(skip);
        
        res.json(allPost);
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

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

        const searchedPost = await Product.find(
            { product_name: { $regex: new RegExp(searched, 'i') } },
            { _id: 1, product_name: 1, product_images: 1, product_price: 1 }
        ).limit(limit).skip(skip);
        
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

        const signedInUserProducts = await Product.find(
            { user_id: req.params.user_id }, 
            { _id: 1, product_name: 1, product_images: 1, product_price: 1, user_id: 1 }
        ).limit(limit).skip(skip).sort({ created_at: -1 });

        res.json(signedInUserProducts);
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function getSelectedProduct(req: Request, res: Response): Promise<void> {
    try {
        const selectedProduct = await Product.find({ _id: req.params._id });
        res.json(selectedProduct)
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function getUserTotalProducts(req: Request, res: Response): Promise<void> {
    try {
        const getUserId = req.params.id;
        const totalPost = await Product.find({ user_id: getUserId }).countDocuments();
        res.json(totalPost);
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function insertNewProduct(req: Request, res: Response): Promise<void> {
    try {
        const newPost = new Product(req.body);
        await newPost.save();
        res.status(200).json({ message: 'Product berhasil ditambahkan' });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function deleteAllProducts(req: Request, res: Response): Promise<void> {
    try {
        const signedUserId = req.params.user_id;
        const signedUserProduct = await Product.find({ user_id: signedUserId });
        const gatherPublicIds: string[] = [];

        signedUserProduct.forEach(product => {
            product.product_images.forEach(p_image => {
                gatherPublicIds.push(p_image.public_id);
            });
        });

        const deletePromises = gatherPublicIds.map(public_id => {
            return v2.uploader.destroy(public_id);
        });

        await Promise.all(deletePromises);

        await Promise.all([
            Product.deleteMany({ user_id: signedUserId }),
            Review.deleteMany({ seller_id: signedUserProduct }),
            Cart.deleteMany({ seller_id: signedUserProduct }),
            PurchaseHistory.deleteMany({ 'product_list.seller_id': signedUserProduct }),
            SaleHistory.deleteMany({ seller_id: signedUserId })
        ]);
        
        res.status(201).json({ message: 'semua produk berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function deleteOneProduct(req: Request, res: Response): Promise<void> {
    try {
        const getProductId = req.params._id;
        const selectedProduct = await Product.findById(getProductId);

        if (!selectedProduct) {
            res.status(404).json({ message: 'Produk tidak ditemukan.' });
            return;
        }

        if (selectedProduct.product_images && selectedProduct.product_images.length > 0) {
            const deletePromises = selectedProduct.product_images.map(image => {
                return v2.uploader.destroy(image.public_id);
            });
            await Promise.all(deletePromises);
        }
        
        await Promise.all([
            Product.deleteOne({ _id: getProductId }),
            Review.deleteMany({ product_id: getProductId }),
            Cart.deleteMany({ product_id: getProductId }),
            PurchaseHistory.deleteMany({ 'product_list.product_id': getProductId }),
            SaleHistory.deleteMany({ 'product_list.product_id': getProductId })
        ]);

        res.status(200).json({ message: 'product berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function updateProductDetail(req: Request, res: Response) {
    try {
        await Product.updateOne(
            { _id: req.params._id }, { 
                $set: {
                product_description: req.body.product_description,
                product_name: req.body.product_name,
                product_price: req.body.product_price,
                product_stock: req.body.product_stock
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}