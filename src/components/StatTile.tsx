import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatTileProps {
  Icon: LucideIcon;
  label: string;
  count: number;
  type: string;
  bgColor: string;
  hoverBgColor: string;
  ringColor: string;
  barColor: string;
  isActive: boolean;
  onClick: () => void;
}

const StatTile: React.FC<StatTileProps> = ({
  Icon,
  label,
  count,
  bgColor,
  hoverBgColor,
  ringColor,
  barColor,
  isActive,
  onClick,
}) => {
  return (
    <div className="flex-1 min-w-[200px] flex flex-col gap-2">
      <button
        onClick={onClick}
        className={`w-full ${bgColor} ${hoverBgColor} ${
          isActive ? `ring-4 ${ringColor} scale-105 shadow-lg` : ''
        } text-white rounded-lg p-6 shadow-md transition-all duration-200 transform hover:scale-102`}
      >
        <Icon className="w-8 h-8 mb-2" />
        <h3 className="text-xl font-semibold">{label}</h3>
        <p className="text-2xl font-bold">{count}</p>
      </button>
      {isActive && (
        <div className={`h-1.5 ${barColor} rounded-lg shadow-lg transition-all duration-200 mx-2`} />
      )}
    </div>
  );
};

export default StatTile;