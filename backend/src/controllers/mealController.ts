import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

const createMealSchema = z.object({
  date: z.string(),
  type: z.enum(['cafe_manha', 'lanche_manha', 'almoco', 'lanche_tarde', 'jantar', 'ceia']),
});

const addFoodSchema = z.object({
  foodId: z.string(),
  quantity: z.number().positive(),
  unit: z.string(),
});

export const getMealsByDate = async (req: AuthRequest, res: Response) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Data é obrigatória' });
    }

    const startDate = new Date(date as string);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date as string);
    endDate.setHours(23, 59, 59, 999);

    const meals = await prisma.meal.findMany({
      where: {
        userId: req.userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        foods: {
          include: {
            food: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Calcular totais de cada refeição
    const mealsWithTotals = meals.map((meal) => {
      let totalCalories = 0;
      let totalProtein = 0;
      let totalCarbs = 0;
      let totalFat = 0;

      meal.foods.forEach((mealFood) => {
        const multiplier = mealFood.quantity / 100;
        totalCalories += mealFood.food.calories * multiplier;
        totalProtein += mealFood.food.protein * multiplier;
        totalCarbs += mealFood.food.carbs * multiplier;
        totalFat += mealFood.food.fat * multiplier;
      });

      return {
        ...meal,
        totals: {
          calories: Math.round(totalCalories),
          protein: Math.round(totalProtein * 10) / 10,
          carbs: Math.round(totalCarbs * 10) / 10,
          fat: Math.round(totalFat * 10) / 10,
        },
      };
    });

    res.json(mealsWithTotals);
  } catch (error) {
    console.error('Erro ao buscar refeições:', error);
    res.status(500).json({ error: 'Erro ao buscar refeições' });
  }
};

export const createMeal = async (req: AuthRequest, res: Response) => {
  try {
    const { date, type } = createMealSchema.parse(req.body);

    const meal = await prisma.meal.create({
      data: {
        userId: req.userId!,
        date: new Date(date),
        type,
      },
      include: {
        foods: {
          include: {
            food: true,
          },
        },
      },
    });

    res.status(201).json(meal);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Erro ao criar refeição:', error);
    res.status(500).json({ error: 'Erro ao criar refeição' });
  }
};

export const addFoodToMeal = async (req: AuthRequest, res: Response) => {
  try {
    const { mealId } = req.params;
    const { foodId, quantity, unit } = addFoodSchema.parse(req.body);

    // Verificar se a refeição pertence ao usuário
    const meal = await prisma.meal.findFirst({
      where: {
        id: mealId,
        userId: req.userId,
      },
    });

    if (!meal) {
      return res.status(404).json({ error: 'Refeição não encontrada' });
    }

    const mealFood = await prisma.mealFood.create({
      data: {
        mealId,
        foodId,
        quantity,
        unit,
      },
      include: {
        food: true,
      },
    });

    res.status(201).json(mealFood);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Erro ao adicionar alimento:', error);
    res.status(500).json({ error: 'Erro ao adicionar alimento' });
  }
};

export const removeFoodFromMeal = async (req: AuthRequest, res: Response) => {
  try {
    const { mealId, foodId } = req.params;

    // Verificar se a refeição pertence ao usuário
    const meal = await prisma.meal.findFirst({
      where: {
        id: mealId,
        userId: req.userId,
      },
    });

    if (!meal) {
      return res.status(404).json({ error: 'Refeição não encontrada' });
    }

    await prisma.mealFood.delete({
      where: {
        id: foodId,
      },
    });

    res.json({ message: 'Alimento removido com sucesso' });
  } catch (error) {
    console.error('Erro ao remover alimento:', error);
    res.status(500).json({ error: 'Erro ao remover alimento' });
  }
};

export const deleteMeal = async (req: AuthRequest, res: Response) => {
  try {
    const { mealId } = req.params;

    // Verificar se a refeição pertence ao usuário
    const meal = await prisma.meal.findFirst({
      where: {
        id: mealId,
        userId: req.userId,
      },
    });

    if (!meal) {
      return res.status(404).json({ error: 'Refeição não encontrada' });
    }

    await prisma.meal.delete({
      where: {
        id: mealId,
      },
    });

    res.json({ message: 'Refeição deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar refeição:', error);
    res.status(500).json({ error: 'Erro ao deletar refeição' });
  }
};
