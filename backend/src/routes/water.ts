import { Router } from 'express';
import { getWaterByDate, addWater } from '../controllers/waterController';
import { authMiddleware } from '../middleware/auth';

export const waterRoutes = Router();

waterRoutes.use(authMiddleware);

waterRoutes.get('/', getWaterByDate);
waterRoutes.post('/', addWater);
