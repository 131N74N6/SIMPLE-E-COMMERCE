import { Router } from "express";
import { 
    deleteAllProducts, deleteOneProduct, getAllProducts, getSearchedProducts, 
    getSelectedProduct, getUserProducts, getUserTotalProducts, insertNewProduct, 
    updateProductDetail
} from '../controllers/product.controller';
import { checkOwnership, verifyToken } from "../middlewares/auth.middleware";

const productRouters = Router();

productRouters.delete('/delete/:_id', verifyToken, deleteOneProduct);
productRouters.delete('/deletes/:user_id', verifyToken, checkOwnership, deleteAllProducts);
productRouters.get('/', verifyToken, getAllProducts);
productRouters.get('/:user_id', verifyToken, checkOwnership, getUserProducts);
productRouters.get('/total/:user_id', verifyToken, checkOwnership, getUserTotalProducts);
productRouters.get('/searched', verifyToken, getSearchedProducts);
productRouters.get('/:_id', verifyToken, getSelectedProduct);
productRouters.post('/add-product', verifyToken, insertNewProduct);
productRouters.put('/update/:_id', verifyToken, updateProductDetail);

export default productRouters;