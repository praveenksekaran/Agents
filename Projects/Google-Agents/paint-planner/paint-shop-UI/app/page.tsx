'use client';

import { useState, useEffect, useRef } from 'react';
import { Floor, Room, Wall, Opening, DraggableItemType, PaintProduct, ProjectSummary } from '@/types';
import { generatePaintEstimates, calculateGrandTotal } from '@/utils/calculations';
import Toolbar from '@/components/Toolbar';
import FloorTabs from '@/components/FloorTabs';
import RoomModal from '@/components/RoomModal';
import OpeningModal from '@/components/OpeningModal';
import PaintSelector from '@/components/PaintSelector';
import Summary from '@/components/Summary';
import RoomCanvas from '@/components/RoomCanvas';
import ChatPanel from '@/components/ChatPanel';
import { AgentSystem, AgentMessage } from '@/utils/agents';
import paintProductsData from '@/data/paint-products.json';

export default function Home() {
  const [floors, setFloors] = useState<Floor[]>([
    { id: 'floor-1', name: 'Ground Floor', rooms: [] }
  ]);
  const [activeFloorId, setActiveFloorId] = useState('floor-1');
  const [paintProducts] = useState<PaintProduct[]>(paintProductsData);

  // Modal states
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [showOpeningModal, setShowOpeningModal] = useState(false);
  const [showPaintSelector, setShowPaintSelector] = useState(false);
  const [showSummary, setShowSummary] = useState(false); // Can be removed/deprecated if using chat solely, but keeping for backup

  // Current operation states
  const [currentItemType, setCurrentItemType] = useState<DraggableItemType | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [selectedWallId, setSelectedWallId] = useState<string | null>(null);
  const [selectedOpening, setSelectedOpening] = useState<{ roomId: string, wallId: string, openingId: string } | null>(null);

  // Agent System State
  const agentSystemRef = useRef<AgentSystem | null>(null);
  const [agentMessages, setAgentMessages] = useState<AgentMessage[]>([]);

  const activeFloor = floors.find(f => f.id === activeFloorId);

  // Initialize Agent System
  useEffect(() => {
    // Only init once
    if (!agentSystemRef.current) {
      const allRooms = floors.flatMap(f => f.rooms); // Flatten rooms for agent context
      agentSystemRef.current = new AgentSystem(allRooms, paintProducts);

      agentSystemRef.current.subscribe((msgs) => {
        setAgentMessages(msgs);
      });

      agentSystemRef.current.start();
    }
  }, []); // Run once on mount

  // Sync rooms to agent context whenever they change
  useEffect(() => {
    if (agentSystemRef.current) {
      const allRooms = floors.flatMap(f => f.rooms);
      agentSystemRef.current.updateRooms(allRooms);
    }
  }, [floors]);


  const handleItemSelect = (type: DraggableItemType) => {
    setCurrentItemType(type);
    if (type === 'room') {
      setShowRoomModal(true);
    } else if (type === 'door' || type === 'window') {
      if (activeFloor && activeFloor.rooms.length > 0) {
        if (!selectedRoomId) {
          alert('Please select a room first by clicking on its floor area.');
          return;
        }
        setShowOpeningModal(true);
      } else {
        alert('Please add a room first before adding doors or windows.');
      }
    }
  };

  const handleAddRoom = (data: { name: string; length: number; width: number; height: number }) => {
    const newRoom: Room = {
      id: `room-${Date.now()}`,
      name: data.name,
      length: data.length,
      width: data.width,
      height: data.height,
      x: 50 + (activeFloor?.rooms.length || 0) * 50,
      y: 50 + (activeFloor?.rooms.length || 0) * 50,
      walls: [
        {
          id: `wall-${Date.now()}-north`,
          roomId: '',
          name: 'north',
          length: data.length,
          height: data.height,
          openings: []
        },
        {
          id: `wall-${Date.now()}-south`,
          roomId: '',
          name: 'south',
          length: data.length,
          height: data.height,
          openings: []
        },
        {
          id: `wall-${Date.now()}-east`,
          roomId: '',
          name: 'east',
          length: data.width,
          height: data.height,
          openings: []
        },
        {
          id: `wall-${Date.now()}-west`,
          roomId: '',
          name: 'west',
          length: data.width,
          height: data.height,
          openings: []
        }
      ]
    };

    // Update wall roomIds
    newRoom.walls.forEach(wall => wall.roomId = newRoom.id);

    setFloors(floors.map(floor => {
      if (floor.id === activeFloorId) {
        return { ...floor, rooms: [...floor.rooms, newRoom] };
      }
      return floor;
    }));

    setShowRoomModal(false);
  };

  const handleAddOpening = (data: { width: number; height: number; positionY?: number }) => {
    if (!selectedRoomId) {
      alert('Please select a room first.');
      return;
    }

    const room = activeFloor?.rooms.find(r => r.id === selectedRoomId);
    if (!room) return;

    const opening: Opening = {
      id: `opening-${Date.now()}`,
      type: currentItemType as 'door' | 'window',
      width: data.width,
      height: data.height,
      positionX: 1, // 1 foot from left edge
      positionY: data.positionY
    };

    setFloors(floors.map(floor => {
      if (floor.id === activeFloorId) {
        return {
          ...floor,
          rooms: floor.rooms.map(r => {
            if (r.id === selectedRoomId) {
              return {
                ...r,
                walls: r.walls.map((wall, idx) => {
                  if (idx === 0) { // Add to first wall
                    return { ...wall, openings: [...wall.openings, opening] };
                  }
                  return wall;
                })
              };
            }
            return r;
          })
        };
      }
      return floor;
    }));

    setShowOpeningModal(false);
  };

  const handleWallClick = (roomId: string, wallId: string) => {
    setSelectedRoomId(roomId);
    setSelectedWallId(wallId);
    setSelectedOpening(null);
    setShowPaintSelector(true);
  };

  const handleRoomClick = (roomId: string) => {
    setSelectedRoomId(roomId === '' ? null : roomId);
    setSelectedWallId(null);
    setSelectedOpening(null);
  };

  const handleOpeningClick = (roomId: string, wallId: string, openingId: string) => {
    setSelectedOpening({ roomId, wallId, openingId });
    setSelectedRoomId(null);
    setSelectedWallId(null);
  };

  const handleRoomMove = (roomId: string, x: number, y: number) => {
    setFloors(floors.map(floor => {
      if (floor.id === activeFloorId) {
        return {
          ...floor,
          rooms: floor.rooms.map(r => {
            if (r.id === roomId) {
              return { ...r, x, y };
            }
            return r;
          })
        };
      }
      return floor;
    }));
  };

  const handleOpeningMove = (roomId: string, wallId: string, openingId: string, position: number) => {
    setFloors(floors.map(floor => {
      if (floor.id === activeFloorId) {
        return {
          ...floor,
          rooms: floor.rooms.map(r => {
            if (r.id === roomId) {
              return {
                ...r,
                walls: r.walls.map(w => {
                  if (w.id === wallId) {
                    return {
                      ...w,
                      openings: w.openings.map(o => o.id === openingId ? { ...o, positionX: position } : o)
                    };
                  }
                  return w;
                })
              }
            }
            return r;
          })
        }
      }
      return floor;
    }));
  };

  const handleDelete = () => {
    if (selectedOpening) {
      // Delete opening
      setFloors(floors.map(floor => {
        if (floor.id === activeFloorId) {
          return {
            ...floor,
            rooms: floor.rooms.map(r => {
              if (r.id === selectedOpening.roomId) {
                return {
                  ...r,
                  walls: r.walls.map(w => {
                    if (w.id === selectedOpening.wallId) {
                      return {
                        ...w,
                        openings: w.openings.filter(o => o.id !== selectedOpening.openingId)
                      };
                    }
                    return w;
                  })
                };
              }
              return r;
            })
          };
        }
        return floor;
      }));
      setSelectedOpening(null);
    } else if (selectedRoomId) {
      // Delete room
      setFloors(floors.map(floor => {
        if (floor.id === activeFloorId) {
          return {
            ...floor,
            rooms: floor.rooms.filter(r => r.id !== selectedRoomId)
          };
        }
        return floor;
      }));
      setSelectedRoomId(null);
    }
  };

  const handlePaintSelect = (paintId: string) => {
    if (!selectedRoomId || !selectedWallId) return;

    setFloors(floors.map(floor => {
      if (floor.id === activeFloorId) {
        return {
          ...floor,
          rooms: floor.rooms.map(room => {
            if (room.id === selectedRoomId) {
              return {
                ...room,
                walls: room.walls.map(wall => {
                  if (wall.id === selectedWallId) {
                    return { ...wall, paintId };
                  }
                  return wall;
                })
              };
            }
            return room;
          })
        };
      }
      return floor;
    }));

    setSelectedRoomId(null);
    setSelectedWallId(null);
  };

  const handleAddFloor = () => {
    const floorNumber = floors.length + 1;
    const newFloor: Floor = {
      id: `floor-${Date.now()}`,
      name: `Floor ${floorNumber}`,
      rooms: []
    };
    setFloors([...floors, newFloor]);
    setActiveFloorId(newFloor.id);
  };

  const handleComplete = () => {
    // Generate paint summary JSON - aggregate walls by paint and sum paintableArea
    if (agentSystemRef.current) {
      // Map to accumulate paintableArea by paintId
      const paintAreaMap = new Map<string, {
        productId: string;
        brand: string;
        name: string;
        color: string;
        pricePerLiter: number;
        coveragePerLiter: number;
        paintableArea_sum: number;
      }>();

      // Iterate through all floors, rooms, and walls
      floors.forEach(floor => {
        floor.rooms.forEach(room => {
          room.walls.forEach(wall => {
            if (wall.paintId) {
              const paintProduct = paintProducts.find(p => p.id === wall.paintId);
              if (paintProduct) {
                // Calculate paintable area for this wall (wall area - opening area)
                const wallArea = wall.length * wall.height;
                const openingArea = wall.openings.reduce((sum, o) => sum + (o.width * o.height), 0);
                const paintableArea = wallArea - openingArea;

                // Get existing entry or create new one
                const existing = paintAreaMap.get(wall.paintId);
                if (existing) {
                  existing.paintableArea_sum += paintableArea;
                } else {
                  paintAreaMap.set(wall.paintId, {
                    productId: paintProduct.id,
                    brand: paintProduct.brand,
                    name: paintProduct.name,
                    color: paintProduct.color,
                    pricePerLiter: paintProduct.pricePerLiter,
                    coveragePerLiter: paintProduct.coveragePerLiter,
                    paintableArea_sum: paintableArea
                  });
                }
              }
            }
          });
        });
      });

      // Convert map to array for JSON output
      const paintSummaryData = {
        paints: Array.from(paintAreaMap.values())
      };

      agentSystemRef.current.triggerPlanner(paintSummaryData);
    }
  };

  const handleSendMessage = (text: string) => {
    if (agentSystemRef.current) {
      agentSystemRef.current.handleUserMessage(text);
    }
  };

  const summary: ProjectSummary = {
    estimates: generatePaintEstimates(floors, paintProducts),
    grandTotal: calculateGrandTotal(generatePaintEstimates(floors, paintProducts))
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-lg shrink-0">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">DIY Paint Planner</h1>
          <button
            onClick={handleComplete}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold shadow"
          >
            Complete
          </button>
        </div>
      </header>

      {/* Main Content Area: Split View */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left Side: Canvas & Tools */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Toolbar */}
          <Toolbar
            onItemSelect={handleItemSelect}
            onDelete={handleDelete}
            canDelete={!!selectedRoomId || !!selectedOpening}
          />

          {/* Floor Tabs */}
          <FloorTabs
            floors={floors}
            activeFloorId={activeFloorId}
            onFloorChange={setActiveFloorId}
            onAddFloor={handleAddFloor}
          />

          {/* Canvas */}
          <div className="flex-1 relative overflow-hidden bg-gray-100">
            {activeFloor && (
              <RoomCanvas
                rooms={activeFloor.rooms}
                paints={paintProducts}
                selectedRoomId={selectedRoomId}
                selectedOpeningId={selectedOpening?.openingId || null}
                onWallClick={handleWallClick}
                onRoomClick={handleRoomClick}
                onRoomMove={handleRoomMove}
                onOpeningClick={handleOpeningClick}
                onOpeningMove={handleOpeningMove}
              />
            )}
            {activeFloor && activeFloor.rooms.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center text-gray-500">
                  <p className="text-xl mb-2">No rooms yet</p>
                  <p>Click "Add Room" to get started</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Chat Panel */}
        <ChatPanel
          messages={agentMessages}
          onSendMessage={handleSendMessage}
        />
      </div>

      {/* Modals - (Keeping them as overlays) */}
      <RoomModal
        isOpen={showRoomModal}
        onClose={() => setShowRoomModal(false)}
        onSubmit={handleAddRoom}
      />

      <OpeningModal
        isOpen={showOpeningModal}
        type={currentItemType as DraggableItemType}
        onClose={() => setShowOpeningModal(false)}
        onSubmit={handleAddOpening}
      />

      <PaintSelector
        isOpen={showPaintSelector}
        paints={paintProducts}
        onClose={() => {
          setShowPaintSelector(false);
        }}
        onSelect={handlePaintSelect}
      />

      {/* Deprecated Summary Modal - Logic moved to chat, but keeping if needed or can just remove */}
      <Summary
        isOpen={showSummary}
        summary={summary}
        onClose={() => setShowSummary(false)}
      />
    </div>
  );
}
