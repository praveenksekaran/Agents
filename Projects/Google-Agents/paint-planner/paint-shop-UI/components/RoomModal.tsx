'use client';

import { useState } from 'react';

interface RoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; length: number; width: number; height: number }) => void;
}

export default function RoomModal({ isOpen, onClose, onSubmit }: RoomModalProps) {
  const [name, setName] = useState('Room');
  const [length, setLength] = useState('12');
  const [width, setWidth] = useState('10');
  const [height, setHeight] = useState('8');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lengthNum = parseFloat(length);
    const widthNum = parseFloat(width);
    const heightNum = parseFloat(height);

    if (lengthNum > 0 && widthNum > 0 && heightNum > 0) {
      onSubmit({
        name,
        length: lengthNum,
        width: widthNum,
        height: heightNum
      });
      setName('Room');
      setLength('12');
      setWidth('10');
      setHeight('8');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Add Room</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Room Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Length (feet)
            </label>
            <input
              type="number"
              step="0.1"
              min="1"
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Width (feet)
            </label>
            <input
              type="number"
              step="0.1"
              min="1"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Height (feet)
            </label>
            <input
              type="number"
              step="0.1"
              min="1"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
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
              Add Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
