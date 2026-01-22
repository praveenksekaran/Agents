export interface PaintProduct {
  id: string;
  brand: string;
  name: string;
  color: string;
  description: string;
  pricePerLiter: number;
  coveragePerLiter: number; // sq ft per liter
  thumbnailUrl: string;
}

export interface Room {
  id: string;
  name: string;
  length: number; // feet
  width: number; // feet
  height: number; // feet
  x: number; // position on canvas
  y: number; // position on canvas
  walls: Wall[];
}

export interface Wall {
  id: string;
  roomId: string;
  name: 'north' | 'south' | 'east' | 'west';
  length: number; // feet
  height: number; // feet
  paintId?: string;
  openings: Opening[];
}

export interface Opening {
  id: string;
  type: 'door' | 'window';
  width: number; // feet
  height: number; // feet
  positionX: number; // feet from left edge of wall
  positionY?: number; // feet from floor (for windows)
}

export interface Floor {
  id: string;
  name: string;
  rooms: Room[];
}

export interface PaintEstimate {
  paintId: string;
  paintProduct: PaintProduct;
  totalArea: number; // sq ft
  litersRequired: number;
  totalCost: number;
}

export interface ProjectSummary {
  estimates: PaintEstimate[];
  grandTotal: number;
}

export type DraggableItemType = 'room' | 'door' | 'window';
