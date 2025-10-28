import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export const searchFoods = async (req: AuthRequest, res: Response) => {
  try {
    const { q, category, brazilian } = req.query;

    const where: any = {};

    if (q) {
      where.OR = [
        { name: { contains: q as string, mode: 'insensitive' } },
        { brand: { contains: q as string, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (brazilian === 'true') {
      where.isBrazilian = true;
    }

    const foods = await prisma.food.findMany({
      where,
      take: 50,
      orderBy: [{ isVerified: 'desc' }, { isBrazilian: 'desc' }, { name: 'asc' }],
    });

    res.json(foods);
  } catch (error) {
    console.error('Erro ao buscar alimentos:', error);
    res.status(500).json({ error: 'Erro ao buscar alimentos' });
  }
};

export const getFoodById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const food = await prisma.food.findUnique({
      where: { id },
    });

    if (!food) {
      return res.status(404).json({ error: 'Alimento não encontrado' });
    }

    res.json(food);
  } catch (error) {
    console.error('Erro ao buscar alimento:', error);
    res.status(500).json({ error: 'Erro ao buscar alimento' });
  }
};
