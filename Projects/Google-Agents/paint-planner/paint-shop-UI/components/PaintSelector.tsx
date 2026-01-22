'use client';

import { PaintProduct } from '@/types';
import Image from 'next/image';

interface PaintSelectorProps {
  isOpen: boolean;
  paints: PaintProduct[];
  onClose: () => void;
  onSelect: (paintId: string) => void;
}

export default function PaintSelector({ isOpen, paints, onClose, onSelect }: PaintSelectorProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-4/5 max-w-4xl max-h-[80vh] overflow-y-auto shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Select Paint Color</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {paints.map((paint) => (
            <button
              key={paint.id}
              onClick={() => {
                onSelect(paint.id);
                onClose();
              }}
              className="border border-gray-300 rounded-lg p-3 hover:border-blue-500 hover:shadow-lg transition-all text-left"
            >
              <div className="mb-2 w-full h-20 rounded border border-gray-200 overflow-hidden">
                <img
                  src={paint.thumbnailUrl}
                  alt={paint.color}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="font-semibold text-sm text-gray-800">{paint.color}</div>
              <div className="text-xs text-gray-600">{paint.brand} - {paint.name}</div>
              <div className="text-xs text-gray-500 mt-1">
                ${paint.pricePerLiter.toFixed(2)}/L
              </div>
              <div className="text-xs text-gray-500">
                {paint.coveragePerLiter} sq ft/L
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
