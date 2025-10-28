import { Router } from 'express';
import { getDailyStats, getWeeklyStats } from '../controllers/statsController';
import { authMiddleware } from '../middleware/auth';

export const statsRoutes = Router();

statsRoutes.use(authMiddleware);

statsRoutes.get('/daily', getDailyStats);
statsRoutes.get('/weekly', getWeeklyStats);
