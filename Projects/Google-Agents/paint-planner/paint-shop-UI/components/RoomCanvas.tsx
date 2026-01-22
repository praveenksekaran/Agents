'use client';

import { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Rect, Text, Group } from 'react-konva';
import { Room, PaintProduct } from '@/types';
import Konva from 'konva';

interface RoomCanvasProps {
  rooms: Room[];
  paints: PaintProduct[];
  selectedRoomId: string | null;
  selectedOpeningId: string | null;
  onWallClick: (roomId: string, wallId: string) => void;
  onRoomClick: (roomId: string) => void;
  onRoomMove: (roomId: string, x: number, y: number) => void;
  onOpeningClick: (roomId: string, wallId: string, openingId: string) => void;
  onOpeningMove?: (roomId: string, wallId: string, openingId: string, position: number) => void;
}

const SCALE = 15; // pixels per foot

export default function RoomCanvas({
  rooms,
  paints,
  selectedRoomId,
  selectedOpeningId,
  onWallClick,
  onRoomClick,
  onRoomMove,
  onOpeningClick,
  onOpeningMove
}: RoomCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const getPaintColor = (paintId?: string): string => {
    if (!paintId) return '#F5F5F5';
    const paint = paints.find(p => p.id === paintId);
    if (!paint) return '#F5F5F5';

    // Extract color from SVG data URL
    const match = paint.thumbnailUrl.match(/fill='%23([0-9A-F]+)'/i);
    if (match) {
      return '#' + match[1];
    }
    return '#F5F5F5';
  };

  const renderRoom = (room: Room) => {
    const roomWidth = room.length * SCALE;
    const roomHeight = room.width * SCALE;
    const wallThickness = 8;
    const isSelected = room.id === selectedRoomId;

    // Get wall colors
    const northWall = room.walls.find(w => w.name === 'north');
    const southWall = room.walls.find(w => w.name === 'south');
    const eastWall = room.walls.find(w => w.name === 'east');
    const westWall = room.walls.find(w => w.name === 'west');

    return (
      <Group
        key={room.id}
        x={room.x}
        y={room.y}
        draggable
        onDragEnd={(e) => {
          onRoomMove(room.id, e.target.x(), e.target.y());
        }}
      >
        {/* Floor - Selectable area */}
        <Rect
          width={roomWidth}
          height={roomHeight}
          fill="#FAFAFA"
          stroke={isSelected ? "#3B82F6" : "#666"}
          strokeWidth={isSelected ? 3 : 1}
          onClick={(e) => {
            onRoomClick(room.id);
          }}
          onTap={() => onRoomClick(room.id)}
        />

        {/* North Wall (top) */}
        <Rect
          x={0}
          y={0}
          width={roomWidth}
          height={wallThickness}
          fill={getPaintColor(northWall?.paintId)}
          stroke="#333"
          strokeWidth={1}
          onClick={() => northWall && onWallClick(room.id, northWall.id)}
          onTap={() => northWall && onWallClick(room.id, northWall.id)}
        />

        {/* South Wall (bottom) */}
        <Rect
          x={0}
          y={roomHeight - wallThickness}
          width={roomWidth}
          height={wallThickness}
          fill={getPaintColor(southWall?.paintId)}
          stroke="#333"
          strokeWidth={1}
          onClick={() => southWall && onWallClick(room.id, southWall.id)}
          onTap={() => southWall && onWallClick(room.id, southWall.id)}
        />

        {/* East Wall (right) */}
        <Rect
          x={roomWidth - wallThickness}
          y={0}
          width={wallThickness}
          height={roomHeight}
          fill={getPaintColor(eastWall?.paintId)}
          stroke="#333"
          strokeWidth={1}
          onClick={() => eastWall && onWallClick(room.id, eastWall.id)}
          onTap={() => eastWall && onWallClick(room.id, eastWall.id)}
        />

        {/* West Wall (left) */}
        <Rect
          x={0}
          y={0}
          width={wallThickness}
          height={roomHeight}
          fill={getPaintColor(westWall?.paintId)}
          stroke="#333"
          strokeWidth={1}
          onClick={() => westWall && onWallClick(room.id, westWall.id)}
          onTap={() => westWall && onWallClick(room.id, westWall.id)}
        />

        {/* Room label */}
        <Text
          x={roomWidth / 2}
          y={roomHeight / 2 - 20}
          text={room.name}
          fontSize={14}
          fontStyle="bold"
          fill="#333"
          align="center"
          offsetX={50}
          listening={false}
        />
        <Text
          x={roomWidth / 2}
          y={roomHeight / 2}
          text={`${room.length}' × ${room.width}'`}
          fontSize={11}
          fill="#666"
          align="center"
          offsetX={40}
          listening={false}
        />

        {/* Render openings on walls */}
        {northWall?.openings.map((opening, idx) => {
          const isOpeningSelected = opening.id === selectedOpeningId;
          return (
            <Rect
              key={`north-${idx}`}
              x={opening.positionX * SCALE}
              y={0}
              width={opening.width * SCALE}
              height={wallThickness}
              fill={opening.type === 'door' ? '#8B4513' : '#87CEEB'}
              stroke={isOpeningSelected ? "#EF4444" : "#000"}
              strokeWidth={isOpeningSelected ? 2 : 1}
              draggable
              dragBoundFunc={(pos) => {
                const roomX = room.x; // Absolute layout position
                const groupPos = { x: room.x, y: room.y }; // Assuming room hasn't moved since render? 
                // Actually dragBoundFunc passes absolute position. 
                // We need to constrain relative to the group.
                // But simplified: 
                // For north wall (horizontal): Y is fixed. X is bounded by room left/right.
                return {
                  x: Math.min(Math.max(pos.x, groupPos.x), groupPos.x + roomWidth - (opening.width * SCALE)),
                  y: groupPos.y // Keep Y fixed at top of room
                };
              }}
              onDragEnd={(e) => {
                const newX = (e.target.x() - room.x) / SCALE;
                northWall && onOpeningMove && onOpeningMove(room.id, northWall.id, opening.id, newX);
              }}
              onClick={(e) => {
                e.cancelBubble = true;
                northWall && onOpeningClick(room.id, northWall.id, opening.id);
              }}
              onTap={() => northWall && onOpeningClick(room.id, northWall.id, opening.id)}
            />
          );
        })}
        {southWall?.openings.map((opening, idx) => {
          const isOpeningSelected = opening.id === selectedOpeningId;
          return (
            <Rect
              key={`south-${idx}`}
              x={opening.positionX * SCALE}
              y={roomHeight - wallThickness}
              width={opening.width * SCALE}
              height={wallThickness}
              fill={opening.type === 'door' ? '#8B4513' : '#87CEEB'}
              stroke={isOpeningSelected ? "#EF4444" : "#000"}
              strokeWidth={isOpeningSelected ? 2 : 1}
              draggable
              dragBoundFunc={(pos) => {
                const groupPos = { x: room.x, y: room.y };
                return {
                  x: Math.min(Math.max(pos.x, groupPos.x), groupPos.x + roomWidth - (opening.width * SCALE)),
                  y: groupPos.y + roomHeight - wallThickness // Keep Y fixed at bottom
                };
              }}
              onDragEnd={(e) => {
                const newX = (e.target.x() - room.x) / SCALE;
                southWall && onOpeningMove && onOpeningMove(room.id, southWall.id, opening.id, newX);
              }}
              onClick={(e) => {
                e.cancelBubble = true;
                southWall && onOpeningClick(room.id, southWall.id, opening.id);
              }}
              onTap={() => southWall && onOpeningClick(room.id, southWall.id, opening.id)}
            />
          );
        })}
        {eastWall?.openings.map((opening, idx) => {
          const isOpeningSelected = opening.id === selectedOpeningId;
          return (
            <Rect
              key={`east-${idx}`}
              x={roomWidth - wallThickness}
              y={opening.positionX * SCALE}
              width={wallThickness}
              height={opening.width * SCALE}
              fill={opening.type === 'door' ? '#8B4513' : '#87CEEB'}
              stroke={isOpeningSelected ? "#EF4444" : "#000"}
              strokeWidth={isOpeningSelected ? 2 : 1}
              draggable
              dragBoundFunc={(pos) => {
                const groupPos = { x: room.x, y: room.y };
                return {
                  x: groupPos.x + roomWidth - wallThickness, // Keep X fixed at right
                  y: Math.min(Math.max(pos.y, groupPos.y), groupPos.y + roomHeight - (opening.width * SCALE))
                };
              }}
              onDragEnd={(e) => {
                // For East/West walls, the "position" is Y relative to the room top
                // But our Opening interface calls it "positionX" universally for position along the wall
                const newPos = (e.target.y() - room.y) / SCALE;
                eastWall && onOpeningMove && onOpeningMove(room.id, eastWall.id, opening.id, newPos);
              }}
              onClick={(e) => {
                e.cancelBubble = true;
                eastWall && onOpeningClick(room.id, eastWall.id, opening.id);
              }}
              onTap={() => eastWall && onOpeningClick(room.id, eastWall.id, opening.id)}
            />
          );
        })}
        {westWall?.openings.map((opening, idx) => {
          const isOpeningSelected = opening.id === selectedOpeningId;
          return (
            <Rect
              key={`west-${idx}`}
              x={0}
              y={opening.positionX * SCALE}
              width={wallThickness}
              height={opening.width * SCALE}
              fill={opening.type === 'door' ? '#8B4513' : '#87CEEB'}
              stroke={isOpeningSelected ? "#EF4444" : "#000"}
              strokeWidth={isOpeningSelected ? 2 : 1}
              draggable
              dragBoundFunc={(pos) => {
                const groupPos = { x: room.x, y: room.y };
                return {
                  x: groupPos.x, // Keep X fixed at left
                  y: Math.min(Math.max(pos.y, groupPos.y), groupPos.y + roomHeight - (opening.width * SCALE))
                };
              }}
              onDragEnd={(e) => {
                const newPos = (e.target.y() - room.y) / SCALE;
                westWall && onOpeningMove && onOpeningMove(room.id, westWall.id, opening.id, newPos);
              }}
              onClick={(e) => {
                e.cancelBubble = true;
                westWall && onOpeningClick(room.id, westWall.id, opening.id);
              }}
              onTap={() => westWall && onOpeningClick(room.id, westWall.id, opening.id)}
            />
          );
        })}
      </Group>
    );
  };

  return (
    <div ref={containerRef} className="flex-1 bg-gray-100">
      <Stage width={dimensions.width} height={dimensions.height} onClick={(e) => {
        // If click is on stage, deselect everything
        if (e.target === e.target.getStage()) {
          onRoomClick('');
        }
      }}>
        <Layer>
          {rooms.map(renderRoom)}
        </Layer>
      </Stage>
    </div>
  );
}
