import Router from 'express';
import { deleteAllFromHistory, deleteOneFromHistory, getBoughtProducts, moveToHistory } from '../controllers/purchase_history.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const purchaseHistoryRouters = Router();

purchaseHistoryRouters.delete('/delete/:_id', verifyToken, deleteOneFromHistory);
purchaseHistoryRouters.delete('/deletes/:user_id', verifyToken, deleteAllFromHistory);
purchaseHistoryRouters.get('/:user_id', verifyToken, getBoughtProducts);
purchaseHistoryRouters.get('/searched/:user_id', verifyToken, getBoughtProducts);
purchaseHistoryRouters.post('/add', verifyToken, moveToHistory);

export default purchaseHistoryRouters;