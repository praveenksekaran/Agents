'use client';

import { Floor } from '@/types';

interface FloorTabsProps {
  floors: Floor[];
  activeFloorId: string;
  onFloorChange: (floorId: string) => void;
  onAddFloor: () => void;
}

export default function FloorTabs({ floors, activeFloorId, onFloorChange, onAddFloor }: FloorTabsProps) {
  return (
    <div className="bg-gray-100 border-b border-gray-200 px-4 py-2 flex items-center gap-2">
      {floors.map((floor) => (
        <button
          key={floor.id}
          onClick={() => onFloorChange(floor.id)}
          className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
            floor.id === activeFloorId
              ? 'bg-white text-blue-600 border-t-2 border-blue-600'
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >
          {floor.name}
        </button>
      ))}
      <button
        onClick={onAddFloor}
        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors ml-2"
      >
        + Add Floor
      </button>
    </div>
  );
}
