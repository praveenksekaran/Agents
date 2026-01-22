import { Room, Wall, Opening, PaintEstimate, PaintProduct, Floor } from '@/types';

/**
 * Calculate the area of a wall minus its openings
 */
export function calculateWallArea(wall: Wall): number {
  const totalWallArea = wall.length * wall.height;
  const openingsArea = wall.openings.reduce((total, opening) => {
    return total + (opening.width * opening.height);
  }, 0);
  return Math.max(0, totalWallArea - openingsArea);
}

/**
 * Calculate total paintable area for all walls with a specific paint
 */
export function calculatePaintArea(walls: Wall[], paintId: string): number {
  return walls
    .filter(wall => wall.paintId === paintId)
    .reduce((total, wall) => total + calculateWallArea(wall), 0);
}

/**
 * Calculate liters required for a given area and coverage rate
 * Assumes 2 coats and rounds up
 */
export function calculateLitersRequired(area: number, coveragePerLiter: number): number {
  const coats = 2;
  const litersNeeded = (area * coats) / coveragePerLiter;
  return Math.ceil(litersNeeded * 10) / 10; // Round up to nearest 0.1 liter
}

/**
 * Generate paint estimates for all floors
 */
export function generatePaintEstimates(
  floors: Floor[],
  paintProducts: PaintProduct[]
): PaintEstimate[] {
  // Collect all walls from all floors
  const allWalls: Wall[] = [];
  floors.forEach(floor => {
    floor.rooms.forEach(room => {
      allWalls.push(...room.walls);
    });
  });

  // Group by paint ID
  const paintMap = new Map<string, PaintProduct>();
  paintProducts.forEach(product => paintMap.set(product.id, product));

  const usedPaintIds = new Set<string>();
  allWalls.forEach(wall => {
    if (wall.paintId) {
      usedPaintIds.add(wall.paintId);
    }
  });

  // Calculate estimates for each paint
  const estimates: PaintEstimate[] = [];
  usedPaintIds.forEach(paintId => {
    const paintProduct = paintMap.get(paintId);
    if (!paintProduct) return;

    const totalArea = calculatePaintArea(allWalls, paintId);
    const litersRequired = calculateLitersRequired(totalArea, paintProduct.coveragePerLiter);
    const totalCost = litersRequired * paintProduct.pricePerLiter;

    estimates.push({
      paintId,
      paintProduct,
      totalArea,
      litersRequired,
      totalCost
    });
  });

  return estimates;
}

/**
 * Calculate grand total cost
 */
export function calculateGrandTotal(estimates: PaintEstimate[]): number {
  return estimates.reduce((total, estimate) => total + estimate.totalCost, 0);
}
