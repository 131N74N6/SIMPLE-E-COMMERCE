import Router from 'express';
import { deleteAllFromHistory, deleteOneFromHistory, getBoughtProducts, moveToHistory } from '../controllers/history.controller';

const historyRouters = Router();

historyRouters.delete('/delete/:_id', deleteOneFromHistory);
historyRouters.delete('/deletes', deleteAllFromHistory);
historyRouters.get('/:user_id', getBoughtProducts);
historyRouters.post('/add', moveToHistory);

export default historyRouters;