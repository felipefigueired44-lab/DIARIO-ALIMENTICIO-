import { Router } from 'express';
import { searchFoods, getFoodById } from '../controllers/foodController';
import { authMiddleware } from '../middleware/auth';

export const foodRoutes = Router();

foodRoutes.use(authMiddleware);

foodRoutes.get('/search', searchFoods);
foodRoutes.get('/:id', getFoodById);
