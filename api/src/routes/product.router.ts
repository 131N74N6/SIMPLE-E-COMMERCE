import { Router } from "express";
import { 
    deleteAllProducts, deleteOneProduct, getAllProducts, getSearchedProducts, 
    getSelectedProduct, getUserProducts, getUserTotalProducts, insertNewProduct, 
    updateProductDetail
} from '../controllers/product.controller';

const productRouters = Router();

productRouters.delete('/delete/:_id', deleteOneProduct);
productRouters.delete('/deletes', deleteAllProducts);
productRouters.get('/', getAllProducts);
productRouters.get('/:user_id', getUserProducts);
productRouters.get('/total/:user_id', getUserTotalProducts);
productRouters.get('/searched', getSearchedProducts);
productRouters.get('/:_id', getSelectedProduct);
productRouters.post('/add-product', insertNewProduct);
productRouters.put('/update/:_id', updateProductDetail);

export default productRouters;