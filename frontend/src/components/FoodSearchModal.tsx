import { useState, useEffect } from 'react';
import { foodAPI, mealAPI } from '../lib/api';
import type { Food } from '../types';

interface FoodSearchModalProps {
  mealId: string;
  onClose: () => void;
  onAdd: () => void;
}

export default function FoodSearchModal({ mealId, onClose, onAdd }: FoodSearchModalProps) {
  const [search, setSearch] = useState('');
  const [foods, setFoods] = useState<Food[]>([]);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [quantity, setQuantity] = useState('100');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    searchFoods();
  }, [search]);

  const searchFoods = async () => {
    try {
      const { data } = await foodAPI.search({ q: search });
      setFoods(data);
    } catch (error) {
      console.error('Erro ao buscar alimentos:', error);
    }
  };

  const addFood = async () => {
    if (!selectedFood) return;
    setLoading(true);
    try {
      await mealAPI.addFood(mealId, {
        foodId: selectedFood.id,
        quantity: parseFloat(quantity),
        unit: selectedFood.servingUnit,
      });
      onAdd();
    } catch (error) {
      console.error('Erro ao adicionar alimento:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Adicionar Alimento</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
              ×
            </button>
          </div>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar alimento..."
            className="input-field"
            autoFocus
          />
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {!selectedFood ? (
            <div className="space-y-2">
              {foods.map((food) => (
                <button
                  key={food.id}
                  onClick={() => setSelectedFood(food)}
                  className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">
                        {food.name}
                        {food.isBrazilian && (
                          <span className="ml-2 text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                            🇧🇷 Brasileiro
                          </span>
                        )}
                      </p>
                      {food.brand && <p className="text-sm text-gray-600">{food.brand}</p>}
                    </div>
                    <div className="text-right text-sm">
                      <p className="font-medium">{food.calories} kcal</p>
                      <p className="text-gray-600">por {food.servingSize}{food.servingUnit}</p>
                    </div>
                  </div>
                </button>
              ))}

              {foods.length === 0 && search && (
                <p className="text-center text-gray-500 py-8">Nenhum alimento encontrado</p>
              )}

              {foods.length === 0 && !search && (
                <p className="text-center text-gray-500 py-8">
                  Digite para buscar alimentos
                </p>
              )}
            </div>
          ) : (
            <div>
              <button
                onClick={() => setSelectedFood(null)}
                className="text-primary-600 mb-4 flex items-center gap-2"
              >
                ← Voltar
              </button>

              <div className="card">
                <h3 className="font-bold text-lg mb-2">{selectedFood.name}</h3>
                {selectedFood.brand && (
                  <p className="text-gray-600 mb-4">{selectedFood.brand}</p>
                )}

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-600">Calorias</p>
                    <p className="font-medium">{selectedFood.calories} kcal</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Proteínas</p>
                    <p className="font-medium">{selectedFood.protein}g</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Carboidratos</p>
                    <p className="font-medium">{selectedFood.carbs}g</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Gorduras</p>
                    <p className="font-medium">{selectedFood.fat}g</p>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantidade ({selectedFood.servingUnit})
                  </label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="input-field"
                    min="1"
                    step="0.1"
                  />
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="text-sm text-gray-600 mb-2">Total com {quantity}{selectedFood.servingUnit}:</p>
                  <p className="font-bold text-lg">
                    {Math.round((selectedFood.calories * parseFloat(quantity || '0')) / 100)} kcal
                  </p>
                </div>

                <button
                  onClick={addFood}
                  disabled={loading || !quantity}
                  className="btn-primary w-full"
                >
                  {loading ? 'Adicionando...' : 'Adicionar'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
