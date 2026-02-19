import { Router } from "express";
import { deleteAllProducts, deleteOneProduct, getSearchedProducts, getUserProducts, getUserTotalProducts, insertNewProduct, updateCartProduct } from '../controllers/cart.controller';
import { checkOwnership, verifyToken } from "../middlewares/auth.middleware";

const cartRouters = Router();

cartRouters.delete('/delete/:_id', verifyToken, deleteOneProduct);
cartRouters.delete('/deletes/:user_id', verifyToken, checkOwnership, deleteAllProducts);
cartRouters.get('/:user_id', verifyToken, checkOwnership, getUserProducts);
cartRouters.get('/total/:user_id', verifyToken, checkOwnership, getUserTotalProducts);
cartRouters.get('/searched', verifyToken, getSearchedProducts);
cartRouters.post('/add', verifyToken, insertNewProduct);
cartRouters.put('/update/:_id', verifyToken, updateCartProduct);

export default cartRouters;