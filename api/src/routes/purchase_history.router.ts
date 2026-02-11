import Router from 'express';
import { deleteAllFromHistory, deleteOneFromHistory, getBoughtProducts, moveToHistory } from '../controllers/purchase_history.controller';

const purchaseHistoryRouters = Router();

purchaseHistoryRouters.delete('/delete/:_id', deleteOneFromHistory);
purchaseHistoryRouters.delete('/deletes/:user_id', deleteAllFromHistory);
purchaseHistoryRouters.get('/:user_id', getBoughtProducts);
purchaseHistoryRouters.get('/searched/:user_id', getBoughtProducts);
purchaseHistoryRouters.post('/add', moveToHistory);

export default purchaseHistoryRouters;