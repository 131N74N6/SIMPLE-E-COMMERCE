import express from 'express';
import { deleteAllFromHistory, deleteOneFromHistory, getSearchSoldProducts, getSoldProducts, moveToHistory } from '../controllers/sale_history.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const saleHistoryRouters = express.Router();

saleHistoryRouters.post('/move-to-history', verifyToken, moveToHistory);
saleHistoryRouters.get('/sold-products/:user_id', verifyToken, getSoldProducts);
saleHistoryRouters.delete('/delete/:_id', verifyToken, deleteOneFromHistory);
saleHistoryRouters.delete('/deletes/:user_id', verifyToken, deleteAllFromHistory);
saleHistoryRouters.get('/searched/:user_id', verifyToken, getSearchSoldProducts);

export default saleHistoryRouters;