'use client';

import { DraggableItemType } from '@/types';

interface ToolbarProps {
  onItemSelect: (type: DraggableItemType) => void;
  onDelete?: () => void;
  canDelete?: boolean;
}

export default function Toolbar({ onItemSelect, onDelete, canDelete = false }: ToolbarProps) {
  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex gap-4 items-center">
        <h2 className="text-lg font-semibold text-gray-700">Tools:</h2>
        <button
          onClick={() => onItemSelect('room')}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm font-medium"
        >
          + Add Room
        </button>
        <button
          onClick={() => onItemSelect('door')}
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-sm font-medium"
        >
          + Add Door
        </button>
        <button
          onClick={() => onItemSelect('window')}
          className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors shadow-sm font-medium"
        >
          + Add Window
        </button>

        {onDelete && (
          <div className="ml-auto">
            <button
              onClick={onDelete}
              disabled={!canDelete}
              className={`px-6 py-3 text-white rounded-lg transition-colors shadow-sm font-medium ${canDelete
                  ? 'bg-red-500 hover:bg-red-600 cursor-pointer'
                  : 'bg-gray-300 cursor-not-allowed'
                }`}
            >
              Delete Selected
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
