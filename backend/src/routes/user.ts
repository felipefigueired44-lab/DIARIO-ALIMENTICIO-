import { Router } from 'express';
import { getProfile, createProfile, updateProfile } from '../controllers/userController';
import { authMiddleware } from '../middleware/auth';

export const userRoutes = Router();

userRoutes.use(authMiddleware);

userRoutes.get('/profile', getProfile);
userRoutes.post('/profile', createProfile);
userRoutes.put('/profile', updateProfile);
