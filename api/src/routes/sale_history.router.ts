import express from 'express';
import { deleteAllFromHistory, deleteOneFromHistory, getSearchSoldProducts, getSoldProducts, moveToHistory } from '../controllers/sale_history.controller';

const saleHistoryRouters = express.Router();

saleHistoryRouters.post('/move-to-history', moveToHistory);
saleHistoryRouters.get('/sold-products/:user_id', getSoldProducts);
saleHistoryRouters.delete('/delete/:_id', deleteOneFromHistory);
saleHistoryRouters.delete('/deletes/:user_id', deleteAllFromHistory);
saleHistoryRouters.get('/searched/:user_id', getSearchSoldProducts);

export default saleHistoryRouters;