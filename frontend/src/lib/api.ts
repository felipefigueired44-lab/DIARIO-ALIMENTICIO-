import axios from 'axios';
import type { User, Profile, Food, Meal, DailyStats, WeeklyStat } from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const authAPI = {
  register: (data: { email: string; password: string; name: string }) =>
    api.post<{ user: User; token: string }>('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post<{ user: User; token: string }>('/auth/login', data),
};

// User Profile
export const userAPI = {
  getProfile: () => api.get<Profile>('/user/profile'),

  createProfile: (data: Omit<Profile, 'id' | 'userId' | 'dailyCalories' | 'dailyProtein' | 'dailyCarbs' | 'dailyFat' | 'dailyWater' | 'createdAt' | 'updatedAt'>) =>
    api.post<Profile>('/user/profile', data),

  updateProfile: (data: Partial<Omit<Profile, 'id' | 'userId'>>) =>
    api.put<Profile>('/user/profile', data),
};

// Foods
export const foodAPI = {
  search: (params: { q?: string; category?: string; brazilian?: boolean }) =>
    api.get<Food[]>('/foods/search', { params }),

  getById: (id: string) => api.get<Food>(`/foods/${id}`),
};

// Meals
export const mealAPI = {
  getByDate: (date: string) =>
    api.get<Meal[]>('/meals', { params: { date } }),

  create: (data: { date: string; type: Meal['type'] }) =>
    api.post<Meal>('/meals', data),

  addFood: (mealId: string, data: { foodId: string; quantity: number; unit: string }) =>
    api.post(`/meals/${mealId}/foods`, data),

  removeFood: (mealId: string, foodId: string) =>
    api.delete(`/meals/${mealId}/foods/${foodId}`),

  delete: (mealId: string) => api.delete(`/meals/${mealId}`),
};

// Water
export const waterAPI = {
  getByDate: (date: string) =>
    api.get<{ intakes: any[]; total: number }>('/water', { params: { date } }),

  add: (data: { date: string; amount: number }) =>
    api.post('/water', data),
};

// Stats
export const statsAPI = {
  getDaily: (date: string) =>
    api.get<DailyStats>('/stats/daily', { params: { date } }),

  getWeekly: (startDate: string) =>
    api.get<WeeklyStat[]>('/stats/weekly', { params: { startDate } }),
};
