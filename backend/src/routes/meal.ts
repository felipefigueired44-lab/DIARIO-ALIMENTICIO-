import { Router } from 'express';
import {
  getMealsByDate,
  createMeal,
  addFoodToMeal,
  removeFoodFromMeal,
  deleteMeal,
} from '../controllers/mealController';
import { authMiddleware } from '../middleware/auth';

export const mealRoutes = Router();

mealRoutes.use(authMiddleware);

mealRoutes.get('/', getMealsByDate);
mealRoutes.post('/', createMeal);
mealRoutes.post('/:mealId/foods', addFoodToMeal);
mealRoutes.delete('/:mealId/foods/:foodId', removeFoodFromMeal);
mealRoutes.delete('/:mealId', deleteMeal);
