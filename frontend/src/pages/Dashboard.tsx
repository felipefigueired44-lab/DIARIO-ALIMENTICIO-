import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { mealAPI, statsAPI, waterAPI } from '../lib/api';
import type { Meal, DailyStats } from '../types';
import MacroCircle from '../components/MacroCircle';
import MealSection from '../components/MealSection';
import WaterTracker from '../components/WaterTracker';
import Navbar from '../components/Navbar';
import { MEAL_TYPES } from '../utils/constants';

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [meals, setMeals] = useState<Meal[]>([]);
  const [stats, setStats] = useState<DailyStats | null>(null);
  const [waterTotal, setWaterTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [selectedDate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [mealsRes, statsRes, waterRes] = await Promise.all([
        mealAPI.getByDate(selectedDate),
        statsAPI.getDaily(selectedDate),
        waterAPI.getByDate(selectedDate),
      ]);

      setMeals(mealsRes.data);
      setStats(statsRes.data);
      setWaterTotal(waterRes.data.total);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(format(newDate, 'yyyy-MM-dd'));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-600">Carregando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Date Selector */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => changeDate(-1)}
            className="btn-secondary"
          >
            ← Anterior
          </button>

          <div className="text-center">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="input-field text-center text-lg font-semibold"
            />
          </div>

          <button
            onClick={() => changeDate(1)}
            className="btn-secondary"
            disabled={selectedDate >= format(new Date(), 'yyyy-MM-dd')}
          >
            Próximo →
          </button>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <MacroCircle
              label="Calorias"
              value={stats.consumed.calories}
              max={stats.goals?.calories || 2000}
              unit="kcal"
              color="bg-primary-500"
            />
            <MacroCircle
              label="Proteínas"
              value={stats.consumed.protein}
              max={stats.goals?.protein || 150}
              unit="g"
              color="bg-blue-500"
            />
            <MacroCircle
              label="Carboidratos"
              value={stats.consumed.carbs}
              max={stats.goals?.carbs || 250}
              unit="g"
              color="bg-yellow-500"
            />
            <MacroCircle
              label="Gorduras"
              value={stats.consumed.fat}
              max={stats.goals?.fat || 65}
              unit="g"
              color="bg-red-500"
            />
          </div>
        )}

        {/* Water Tracker */}
        <WaterTracker
          total={waterTotal}
          goal={stats?.goals?.water || 2000}
          date={selectedDate}
          onUpdate={loadData}
        />

        {/* Meals */}
        <div className="space-y-6 mt-8">
          {Object.entries(MEAL_TYPES).map(([type, label]) => {
            const meal = meals.find((m) => m.type === type);
            return (
              <MealSection
                key={type}
                type={type as Meal['type']}
                label={label}
                meal={meal}
                date={selectedDate}
                onUpdate={loadData}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
