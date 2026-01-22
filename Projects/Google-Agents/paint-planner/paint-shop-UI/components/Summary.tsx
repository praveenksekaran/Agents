'use client';

import { ProjectSummary } from '@/types';

interface SummaryProps {
  isOpen: boolean;
  summary: ProjectSummary | null;
  onClose: () => void;
}

export default function Summary({ isOpen, summary, onClose }: SummaryProps) {
  if (!isOpen || !summary) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-4/5 max-w-3xl max-h-[80vh] overflow-y-auto shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Paint Shopping List</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-3xl font-bold"
          >
            ×
          </button>
        </div>

        {summary.estimates.length === 0 ? (
          <p className="text-gray-600 text-center py-8">
            No paint has been assigned to walls yet. Click on walls in your rooms to assign paint colors.
          </p>
        ) : (
          <>
            <div className="space-y-6">
              {summary.estimates.map((estimate) => (
                <div key={estimate.paintId} className="border border-gray-300 rounded-lg p-6 bg-gray-50">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 rounded border border-gray-300 overflow-hidden flex-shrink-0">
                      <img
                        src={estimate.paintProduct.thumbnailUrl}
                        alt={estimate.paintProduct.color}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800">
                        {estimate.paintProduct.color}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {estimate.paintProduct.brand} - {estimate.paintProduct.name}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Total Wall Area:</span>
                      <span className="font-semibold ml-2">{estimate.totalArea.toFixed(1)} sq ft</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Coverage:</span>
                      <span className="font-semibold ml-2">
                        {estimate.paintProduct.coveragePerLiter} sq ft/L
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Liters Required:</span>
                      <span className="font-semibold ml-2">{estimate.litersRequired.toFixed(1)} L</span>
                      <span className="text-xs text-gray-500 ml-1">(2 coats)</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Price per Liter:</span>
                      <span className="font-semibold ml-2">
                        ${estimate.paintProduct.pricePerLiter.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-300">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-700">Total Cost:</span>
                      <span className="text-2xl font-bold text-blue-600">
                        ${estimate.totalCost.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t-2 border-gray-400">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-gray-800">Grand Total:</span>
                <span className="text-3xl font-bold text-green-600">
                  ${summary.grandTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </>
        )}

        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
