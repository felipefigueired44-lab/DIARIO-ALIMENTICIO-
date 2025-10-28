import { useState } from 'react';
import type { Meal } from '../types';
import { mealAPI } from '../lib/api';
import FoodSearchModal from './FoodSearchModal';

interface MealSectionProps {
  type: Meal['type'];
  label: string;
  meal?: Meal;
  date: string;
  onUpdate: () => void;
}

export default function MealSection({ type, label, meal, date, onUpdate }: MealSectionProps) {
  const [showFoodSearch, setShowFoodSearch] = useState(false);
  const [loading, setLoading] = useState(false);

  const createMealAndOpenSearch = async () => {
    if (!meal) {
      setLoading(true);
      try {
        await mealAPI.create({ date, type });
        await onUpdate();
        setShowFoodSearch(true);
      } catch (error) {
        console.error('Erro ao criar refeição:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setShowFoodSearch(true);
    }
  };

  const removeFood = async (foodId: string) => {
    if (!meal) return;
    setLoading(true);
    try {
      await mealAPI.removeFood(meal.id, foodId);
      await onUpdate();
    } catch (error) {
      console.error('Erro ao remover alimento:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{label}</h3>
        <button
          onClick={createMealAndOpenSearch}
          disabled={loading}
          className="btn-primary text-sm"
        >
          + Adicionar Alimento
        </button>
      </div>

      {meal && meal.foods.length > 0 ? (
        <div className="space-y-3">
          {meal.foods.map((mealFood) => (
            <div
              key={mealFood.id}
              className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex-1">
                <p className="font-medium">{mealFood.food.name}</p>
                <p className="text-sm text-gray-600">
                  {mealFood.quantity}{mealFood.unit} • {Math.round((mealFood.food.calories * mealFood.quantity) / 100)} kcal
                </p>
              </div>
              <button
                onClick={() => removeFood(mealFood.id)}
                disabled={loading}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Remover
              </button>
            </div>
          ))}

          {meal.totals && (
            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Total:</span>
                <span>
                  {meal.totals.calories} kcal | P: {meal.totals.protein}g | C: {meal.totals.carbs}g | G: {meal.totals.fat}g
                </span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4">Nenhum alimento adicionado</p>
      )}

      {showFoodSearch && meal && (
        <FoodSearchModal
          mealId={meal.id}
          onClose={() => setShowFoodSearch(false)}
          onAdd={() => {
            setShowFoodSearch(false);
            onUpdate();
          }}
        />
      )}
    </div>
  );
}
