import { Router } from "express";
import { 
    deleteAllProducts, deleteOneProduct, getAllProducts, getSearchedProducts, 
    getSelectedProduct, getUserProducts, getUserTotalProducts, insertNewProduct, 
    updateProductDetail
} from '../controllers/product.controller';

const productRouters = Router();

productRouters.delete('/delete/:_id', deleteOneProduct);
productRouters.delete('/deletes/:user_id', deleteAllProducts);
productRouters.get('/get-all', getAllProducts);
productRouters.get('/get/:user_id', getUserProducts);
productRouters.get('/total/:user_id', getUserTotalProducts);
productRouters.get('/searched', getSearchedProducts);
productRouters.get('/detail/:_id', getSelectedProduct);
productRouters.post('/add-product', insertNewProduct);
productRouters.put('/update/:_id', updateProductDetail);

export default productRouters;