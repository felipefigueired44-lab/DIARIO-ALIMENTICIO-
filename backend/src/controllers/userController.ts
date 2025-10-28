import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth';
import { calculateCalories } from '../utils/calculations';

const prisma = new PrismaClient();

const profileSchema = z.object({
  gender: z.enum(['masculino', 'feminino', 'outro']),
  birthDate: z.string(),
  height: z.number().positive(),
  currentWeight: z.number().positive(),
  targetWeight: z.number().positive().optional(),
  activityLevel: z.enum(['sedentario', 'leve', 'moderado', 'intenso', 'muito_intenso']),
  goal: z.enum(['perder_peso', 'manter_peso', 'ganhar_peso', 'ganhar_massa']),
});

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.userId },
    });

    if (!profile) {
      return res.status(404).json({ error: 'Perfil não encontrado' });
    }

    res.json(profile);
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({ error: 'Erro ao buscar perfil' });
  }
};

export const createProfile = async (req: AuthRequest, res: Response) => {
  try {
    const data = profileSchema.parse(req.body);

    // Verificar se já existe perfil
    const existingProfile = await prisma.profile.findUnique({
      where: { userId: req.userId },
    });

    if (existingProfile) {
      return res.status(400).json({ error: 'Perfil já existe' });
    }

    // Calcular idade
    const birthDate = new Date(data.birthDate);
    const age = Math.floor(
      (Date.now() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
    );

    // Calcular necessidades calóricas
    const calories = calculateCalories({
      gender: data.gender,
      age,
      weight: data.currentWeight,
      height: data.height,
      activityLevel: data.activityLevel,
      goal: data.goal,
    });

    // Calcular macros (40% carbs, 30% protein, 30% fat)
    const dailyProtein = (calories * 0.3) / 4; // 4 cal/g
    const dailyCarbs = (calories * 0.4) / 4;
    const dailyFat = (calories * 0.3) / 9; // 9 cal/g

    const profile = await prisma.profile.create({
      data: {
        userId: req.userId!,
        ...data,
        birthDate: new Date(data.birthDate),
        dailyCalories: Math.round(calories),
        dailyProtein: Math.round(dailyProtein),
        dailyCarbs: Math.round(dailyCarbs),
        dailyFat: Math.round(dailyFat),
      },
    });

    res.status(201).json(profile);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Erro ao criar perfil:', error);
    res.status(500).json({ error: 'Erro ao criar perfil' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const data = profileSchema.partial().parse(req.body);

    const existingProfile = await prisma.profile.findUnique({
      where: { userId: req.userId },
    });

    if (!existingProfile) {
      return res.status(404).json({ error: 'Perfil não encontrado' });
    }

    // Se peso ou outros dados mudaram, recalcular calorias
    let updateData: any = { ...data };

    if (data.birthDate) {
      updateData.birthDate = new Date(data.birthDate);
    }

    // Recalcular se campos relevantes mudaram
    if (
      data.currentWeight ||
      data.height ||
      data.activityLevel ||
      data.goal ||
      data.gender ||
      data.birthDate
    ) {
      const birthDate = new Date(data.birthDate || existingProfile.birthDate);
      const age = Math.floor(
        (Date.now() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
      );

      const calories = calculateCalories({
        gender: data.gender || existingProfile.gender,
        age,
        weight: data.currentWeight || existingProfile.currentWeight,
        height: data.height || existingProfile.height,
        activityLevel: data.activityLevel || existingProfile.activityLevel,
        goal: data.goal || existingProfile.goal,
      });

      updateData.dailyCalories = Math.round(calories);
      updateData.dailyProtein = Math.round((calories * 0.3) / 4);
      updateData.dailyCarbs = Math.round((calories * 0.4) / 4);
      updateData.dailyFat = Math.round((calories * 0.3) / 9);
    }

    const profile = await prisma.profile.update({
      where: { userId: req.userId },
      data: updateData,
    });

    res.json(profile);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({ error: 'Erro ao atualizar perfil' });
  }
};
