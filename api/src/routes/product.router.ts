import { Router } from "express";
import { 
    deleteAllProducts, deleteChosenProducts, deleteOneProduct, getAllProducts, getSearchedProducts, 
    getSelectedProduct, getUserProducts, getUserTotalProducts, insertNewProduct, 
    updateProductDetail
} from '../controllers/product.controller';
import { checkOwnership, verifyToken } from "../middlewares/auth.middleware";

const productRouters = Router();

productRouters.delete('/delete-chosen', verifyToken, deleteChosenProducts);
productRouters.delete('/delete/:_id', verifyToken, deleteOneProduct);
productRouters.delete('/deletes/:user_id', verifyToken, checkOwnership, deleteAllProducts);
productRouters.get('/get-all', getAllProducts);
productRouters.get('/owner/:user_id', verifyToken, getUserProducts);
productRouters.get('/total/:user_id', verifyToken, checkOwnership, getUserTotalProducts);
productRouters.get('/search', verifyToken, getSearchedProducts);
productRouters.get('/detail/:_id', verifyToken, getSelectedProduct);
productRouters.post('/add-product', verifyToken, insertNewProduct);
productRouters.put('/update/:_id', verifyToken, updateProductDetail);

export default productRouters;