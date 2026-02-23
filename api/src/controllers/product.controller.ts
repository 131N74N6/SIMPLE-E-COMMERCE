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

export async function getAllProducts(req: Request, res: Response) {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const skip = (page - 1) * limit;

        const allPost = await Product.find(
            {}, 
            { _id: 1, product_name: 1, product_images: 1, product_price: 1 }
        ).limit(limit).skip(skip).sort({ created_at: 1 });
        
        res.json(allPost);
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function getSearchedProducts(req: Request, res: Response) {
    try {
        const searched = req.query.searched as string;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const skip = (page - 1) * limit;
        
        if (!searched || typeof searched !== 'string') {
            return res.status(400).json({ message: 'Search query is required' });
        }

        if (isNaN(page) || page < 1) {
            return res.status(400).json({ message: 'Invalid page parameter' });
        }

        if (isNaN(limit) || limit < 1 || limit > 20) {
            return res.status(400).json({ message: 'Invalid limit parameter' });
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

export async function getUserProducts(req: Request, res: Response) {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const skip = (page - 1) * limit;

        const signedInUserProducts = await Product.find(
            { user_id: req.params.user_id }, 
            { _id: 1, product_name: 1, product_images: 1, product_price: 1, user_id: 1 }
        ).limit(limit).skip(skip).sort({ created_at: 1 });

        res.json(signedInUserProducts);
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function getSelectedProduct(req: Request, res: Response) {
    try {
        const selectedProduct = await Product.find({ _id: req.params._id });
        res.json(selectedProduct)
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function getUserTotalProducts(req: Request, res: Response) {
    try {
        const totalPost = await Product.find({ user_id: req.params.user_id }).countDocuments();
        res.json(totalPost);
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function insertNewProduct(req: Request, res: Response) {
    try {
        if (!req.body.product_name || !req.body.product_price || !req.body.product_stock || !req.body.product_images || !req.body.product_description) {
            return res.status(400).json({ message: 'Isi semua input field' });
        }
        const newPost = new Product(req.body);
        await newPost.save();
        res.status(200).json({ message: 'Product berhasil ditambahkan' });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function deleteAllProducts(req: Request, res: Response) {
    try {
        const signedUserId = req.params.user_id;
        const signedUserProduct = await Product.find({ user_id: signedUserId });
        const gatherPublicIds: string[] = [];

        if (signedUserProduct.length === 0) {
            return res.status(404).json({ message: 'Produk tidak ditemukan.' });
        }

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

export async function deleteChosenProducts(req: Request, res: Response) {
    try {
        const { publicIds } = req.body as { publicIds: string[] };
        
        const deletePromises = publicIds.map(public_id => {
            return v2.uploader.destroy(public_id);
        });

        await Promise.all(deletePromises);

        res.status(200).json({ message: 'Gambar berhasil dihapus dari Cloudinary' });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}

export async function deleteOneProduct(req: Request, res: Response) {
    try {
        const getProductId = req.params._id;
        const selectedProduct = await Product.find({ _id: getProductId });

        if (selectedProduct[0].product_images && selectedProduct[0].product_images.length > 0) {
            const deletePromises = selectedProduct[0].product_images.map(image => {
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
        const getProductId = req.params._id;
        
        if (!req.body.product_name || !req.body.product_price || !req.body.product_stock || !req.body.product_images || !req.body.product_description) {
            return res.status(400).json({ message: 'Isi semua input field' });
        }

        await Promise.all([
            Product.updateOne(
                { _id: getProductId }, { 
                    $set: {
                        product_images: req.body.product_images,
                        product_description: req.body.product_description,
                        product_name: req.body.product_name,
                        product_price: req.body.product_price,
                        product_stock: req.body.product_stock
                    }
                }
            ),
            Cart.updateMany(
                { product_id: getProductId }, {
                    $set: {
                        product_name: req.body.product_name,
                        product_price: req.body.product_price,
                        product_images: req.body.product_images
                    }
                }
            ),
            PurchaseHistory.updateMany(
                { 'product_list.product_id': getProductId }, {
                    $set: {
                        'product_list.$[elem].product_name': req.body.product_name,
                        'product_list.$[elem].product_price': req.body.product_price,
                        'product_list.$[elem].product_images': req.body.product_images
                    }
                }, {
                    arrayFilters: [{ 'elem.product_id': getProductId }]
                }
            ),
            SaleHistory.updateMany(
                { 'product_list.product_id': getProductId }, {
                    $set: {
                        'product_list.$[elem].product_name': req.body.product_name,
                        'product_list.$[elem].product_price': req.body.product_price,
                        'product_list.$[elem].product_images': req.body.product_images
                    }
                }, {
                    arrayFilters: [{ 'elem.product_id': getProductId }]
                }
            )
        ]);
        res.status(200).json({ message: 'Produk berhasil diperbarui' });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' });
    }
}