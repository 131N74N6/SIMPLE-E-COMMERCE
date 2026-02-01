import { Router } from "express";
import { deleteAllProducts, deleteOneProduct, getSearchedProducts, getUserProducts, getUserTotalProducts } from '../controllers/cart.controller';

const cartRouters = Router();

cartRouters.delete('/delete/:product_id', deleteOneProduct);
cartRouters.delete('/deletes', deleteAllProducts);
cartRouters.get('/:user_id', getUserProducts);
cartRouters.get('/total/:user_id', getUserTotalProducts);
cartRouters.get('/searched', getSearchedProducts);

export default cartRouters;