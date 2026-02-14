import { Router } from "express";
import { deleteAllProducts, deleteOneProduct, getSearchedProducts, getUserProducts, getUserTotalProducts } from '../controllers/cart.controller';
import { checkOwnership, verifyToken } from "../middlewares/auth.middleware";

const cartRouters = Router();

cartRouters.delete('/delete/:product_id', verifyToken, deleteOneProduct);
cartRouters.delete('/deletes/:user_id', verifyToken, checkOwnership, deleteAllProducts);
cartRouters.get('/:user_id', verifyToken, checkOwnership, getUserProducts);
cartRouters.get('/total/:user_id', verifyToken, checkOwnership, getUserTotalProducts);
cartRouters.get('/searched', verifyToken, getSearchedProducts);

export default cartRouters;