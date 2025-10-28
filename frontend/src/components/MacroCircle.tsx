interface MacroCircleProps {
  label: string;
  value: number;
  max: number;
  unit: string;
  color: string;
}

export default function MacroCircle({ label, value, max, unit, color }: MacroCircleProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="card text-center">
      <div className="relative inline-block">
        <svg className="w-32 h-32 transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="45"
            stroke="#e5e7eb"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="64"
            cy="64"
            r="45"
            className={color}
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-gray-500">de {max}</p>
        </div>
      </div>
      <p className="mt-2 font-medium text-gray-700">{label}</p>
      <p className="text-sm text-gray-500">{unit}</p>
    </div>
  );
}
