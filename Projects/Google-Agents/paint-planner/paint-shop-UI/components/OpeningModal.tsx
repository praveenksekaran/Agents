'use client';

import { useState } from 'react';
import { DraggableItemType } from '@/types';

interface OpeningModalProps {
  isOpen: boolean;
  type: DraggableItemType;
  onClose: () => void;
  onSubmit: (data: { width: number; height: number; positionY?: number }) => void;
}

export default function OpeningModal({ isOpen, type, onClose, onSubmit }: OpeningModalProps) {
  const [width, setWidth] = useState(type === 'door' ? '3' : '4');
  const [height, setHeight] = useState(type === 'door' ? '7' : '4');
  const [positionY, setPositionY] = useState('3');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const widthNum = parseFloat(width);
    const heightNum = parseFloat(height);
    const positionYNum = type === 'window' ? parseFloat(positionY) : undefined;

    if (widthNum > 0 && heightNum > 0) {
      onSubmit({
        width: widthNum,
        height: heightNum,
        positionY: positionYNum
      });
      setWidth(type === 'door' ? '3' : '4');
      setHeight(type === 'door' ? '7' : '4');
      setPositionY('3');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Add {type === 'door' ? 'Door' : 'Window'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Width (feet)
            </label>
            <input
              type="number"
              step="0.1"
              min="0.5"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Height (feet)
            </label>
            <input
              type="number"
              step="0.1"
              min="0.5"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {type === 'window' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Height from Floor (feet)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={positionY}
                onChange={(e) => setPositionY(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Add {type === 'door' ? 'Door' : 'Window'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
