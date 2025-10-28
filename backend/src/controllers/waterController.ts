import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

const addWaterSchema = z.object({
  date: z.string(),
  amount: z.number().positive(),
});

export const getWaterByDate = async (req: AuthRequest, res: Response) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Data é obrigatória' });
    }

    const startDate = new Date(date as string);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date as string);
    endDate.setHours(23, 59, 59, 999);

    const waterIntakes = await prisma.waterIntake.findMany({
      where: {
        userId: req.userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const total = waterIntakes.reduce((sum, intake) => sum + intake.amount, 0);

    res.json({ intakes: waterIntakes, total });
  } catch (error) {
    console.error('Erro ao buscar consumo de água:', error);
    res.status(500).json({ error: 'Erro ao buscar consumo de água' });
  }
};

export const addWater = async (req: AuthRequest, res: Response) => {
  try {
    const { date, amount } = addWaterSchema.parse(req.body);

    const waterIntake = await prisma.waterIntake.create({
      data: {
        userId: req.userId!,
        date: new Date(date),
        amount,
      },
    });

    res.status(201).json(waterIntake);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Erro ao adicionar água:', error);
    res.status(500).json({ error: 'Erro ao adicionar água' });
  }
};
