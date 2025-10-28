interface CaloriesParams {
  gender: string;
  age: number;
  weight: number; // kg
  height: number; // cm
  activityLevel: string;
  goal: string;
}

// Fórmula de Harris-Benedict revisada
export const calculateCalories = (params: CaloriesParams): number => {
  const { gender, age, weight, height, activityLevel, goal } = params;

  // Taxa Metabólica Basal (TMB)
  let bmr: number;
  if (gender === 'masculino') {
    bmr = 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
  } else {
    bmr = 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age;
  }

  // Fator de atividade
  const activityFactors: { [key: string]: number } = {
    sedentario: 1.2, // Pouco ou nenhum exercício
    leve: 1.375, // Exercício leve 1-3 dias/semana
    moderado: 1.55, // Exercício moderado 3-5 dias/semana
    intenso: 1.725, // Exercício intenso 6-7 dias/semana
    muito_intenso: 1.9, // Exercício muito intenso, trabalho físico
  };

  let tdee = bmr * activityFactors[activityLevel];

  // Ajustar baseado no objetivo
  switch (goal) {
    case 'perder_peso':
      tdee -= 500; // Déficit de 500 calorias
      break;
    case 'ganhar_peso':
    case 'ganhar_massa':
      tdee += 300; // Superávit de 300 calorias
      break;
    case 'manter_peso':
    default:
      // Manter TDEE
      break;
  }

  return Math.max(1200, tdee); // Mínimo de 1200 calorias
};
