import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export const getDailyStats = async (req: AuthRequest, res: Response) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Data é obrigatória' });
    }

    const startDate = new Date(date as string);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date as string);
    endDate.setHours(23, 59, 59, 999);

    // Buscar todas as refeições do dia
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
    });

    // Calcular totais do dia
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    meals.forEach((meal) => {
      meal.foods.forEach((mealFood) => {
        const multiplier = mealFood.quantity / 100;
        totalCalories += mealFood.food.calories * multiplier;
        totalProtein += mealFood.food.protein * multiplier;
        totalCarbs += mealFood.food.carbs * multiplier;
        totalFat += mealFood.food.fat * multiplier;
      });
    });

    // Buscar metas do usuário
    const profile = await prisma.profile.findUnique({
      where: { userId: req.userId },
    });

    // Buscar água consumida
    const waterIntakes = await prisma.waterIntake.findMany({
      where: {
        userId: req.userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const totalWater = waterIntakes.reduce((sum, intake) => sum + intake.amount, 0);

    res.json({
      consumed: {
        calories: Math.round(totalCalories),
        protein: Math.round(totalProtein * 10) / 10,
        carbs: Math.round(totalCarbs * 10) / 10,
        fat: Math.round(totalFat * 10) / 10,
        water: totalWater,
      },
      goals: profile
        ? {
            calories: profile.dailyCalories,
            protein: profile.dailyProtein,
            carbs: profile.dailyCarbs,
            fat: profile.dailyFat,
            water: profile.dailyWater,
          }
        : null,
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
};

export const getWeeklyStats = async (req: AuthRequest, res: Response) => {
  try {
    const { startDate } = req.query;

    if (!startDate) {
      return res.status(400).json({ error: 'Data inicial é obrigatória' });
    }

    const start = new Date(startDate as string);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(end.getDate() + 7);
    end.setHours(23, 59, 59, 999);

    // Buscar todas as refeições da semana
    const meals = await prisma.meal.findMany({
      where: {
        userId: req.userId,
        date: {
          gte: start,
          lte: end,
        },
      },
      include: {
        foods: {
          include: {
            food: true,
          },
        },
      },
    });

    // Buscar água consumida na semana
    const waterIntakes = await prisma.waterIntake.findMany({
      where: {
        userId: req.userId,
        date: {
          gte: start,
          lte: end,
        },
      },
    });

    // Agrupar por dia
    const dailyStats: any[] = [];

    for (let i = 0; i < 7; i++) {
      const dayStart = new Date(start);
      dayStart.setDate(dayStart.getDate() + i);
      dayStart.setHours(0, 0, 0, 0);

      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);

      const dayMeals = meals.filter(
        (meal) => meal.date >= dayStart && meal.date <= dayEnd
      );

      const dayWater = waterIntakes
        .filter((intake) => intake.date >= dayStart && intake.date <= dayEnd)
        .reduce((sum, intake) => sum + intake.amount, 0);

      let calories = 0;
      let protein = 0;
      let carbs = 0;
      let fat = 0;

      dayMeals.forEach((meal) => {
        meal.foods.forEach((mealFood) => {
          const multiplier = mealFood.quantity / 100;
          calories += mealFood.food.calories * multiplier;
          protein += mealFood.food.protein * multiplier;
          carbs += mealFood.food.carbs * multiplier;
          fat += mealFood.food.fat * multiplier;
        });
      });

      dailyStats.push({
        date: dayStart.toISOString().split('T')[0],
        calories: Math.round(calories),
        protein: Math.round(protein * 10) / 10,
        carbs: Math.round(carbs * 10) / 10,
        fat: Math.round(fat * 10) / 10,
        water: dayWater,
      });
    }

    res.json(dailyStats);
  } catch (error) {
    console.error('Erro ao buscar estatísticas semanais:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas semanais' });
  }
};
