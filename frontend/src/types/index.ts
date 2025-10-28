export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  profile?: Profile;
}

export interface Profile {
  id: string;
  userId: string;
  gender: 'masculino' | 'feminino' | 'outro';
  birthDate: string;
  height: number;
  currentWeight: number;
  targetWeight?: number;
  activityLevel: 'sedentario' | 'leve' | 'moderado' | 'intenso' | 'muito_intenso';
  goal: 'perder_peso' | 'manter_peso' | 'ganhar_peso' | 'ganhar_massa';
  dailyCalories: number;
  dailyProtein: number;
  dailyCarbs: number;
  dailyFat: number;
  dailyWater: number;
}

export interface Food {
  id: string;
  name: string;
  brand?: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sodium?: number;
  sugar?: number;
  servingSize: number;
  servingUnit: string;
  isBrazilian: boolean;
  isVerified: boolean;
}

export interface Meal {
  id: string;
  userId: string;
  date: string;
  type: 'cafe_manha' | 'lanche_manha' | 'almoco' | 'lanche_tarde' | 'jantar' | 'ceia';
  foods: MealFood[];
  totals?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface MealFood {
  id: string;
  mealId: string;
  foodId: string;
  food: Food;
  quantity: number;
  unit: string;
}

export interface DailyStats {
  consumed: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    water: number;
  };
  goals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    water: number;
  } | null;
}

export interface WeeklyStat {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  water: number;
}
