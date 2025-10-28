import { useState } from 'react';
import { waterAPI } from '../lib/api';

interface WaterTrackerProps {
  total: number;
  goal: number;
  date: string;
  onUpdate: () => void;
}

const WATER_AMOUNTS = [200, 300, 500, 1000];

export default function WaterTracker({ total, goal, date, onUpdate }: WaterTrackerProps) {
  const [loading, setLoading] = useState(false);
  const percentage = Math.min((total / goal) * 100, 100);

  const addWater = async (amount: number) => {
    setLoading(true);
    try {
      await waterAPI.add({ date, amount });
      onUpdate();
    } catch (error) {
      console.error('Erro ao adicionar água:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Hidratação</h3>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span>{total}ml</span>
          <span>{goal}ml</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className="bg-blue-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {WATER_AMOUNTS.map((amount) => (
          <button
            key={amount}
            onClick={() => addWater(amount)}
            disabled={loading}
            className="btn-secondary flex-1 min-w-[100px]"
          >
            +{amount}ml
          </button>
        ))}
      </div>
    </div>
  );
}
