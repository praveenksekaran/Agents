# Floor Plan JSON Format

When the user clicks the **Complete** button, a comprehensive JSON object is generated from the floor plan data and sent to the Vertex AI Agent.

## JSON Structure

```json
{
  "project": {
    "name": "DIY Paint Project",
    "totalFloors": 1,
    "timestamp": "2026-01-13T12:00:00.000Z"
  },
  "floors": [
    {
      "floorId": "floor-1",
      "floorName": "Ground Floor",
      "totalRooms": 2,
      "rooms": [
        {
          "roomId": "room-123456",
          "roomName": "Living Room",
          "dimensions": {
            "length": 20,
            "width": 15,
            "height": 10,
            "unit": "feet"
          },
          "walls": [
            {
              "wallId": "wall-123456-north",
              "orientation": "north",
              "dimensions": {
                "length": 20,
                "height": 10,
                "area": 200,
                "unit": "feet"
              },
              "paint": {
                "productId": "paint-1",
                "brand": "Sherwin-Williams",
                "name": "Snowbound",
                "color": "white",
                "pricePerLiter": 45,
                "coveragePerLiter": 350
              },
              "openings": [
                {
                  "openingId": "opening-789",
                  "type": "window",
                  "dimensions": {
                    "width": 4,
                    "height": 3,
                    "area": 12,
                    "unit": "feet"
                  },
                  "position": {
                    "x": 8,
                    "y": 3
                  }
                }
              ],
              "totalOpeningArea": 12,
              "paintableArea": 188
            },
            {
              "wallId": "wall-123456-south",
              "orientation": "south",
              "dimensions": {
                "length": 20,
                "height": 10,
                "area": 200,
                "unit": "feet"
              },
              "paint": {
                "productId": "paint-1",
                "brand": "Sherwin-Williams",
                "name": "Snowbound",
                "color": "white",
                "pricePerLiter": 45,
                "coveragePerLiter": 350
              },
              "openings": [
                {
                  "openingId": "opening-790",
                  "type": "door",
                  "dimensions": {
                    "width": 3,
                    "height": 7,
                    "area": 21,
                    "unit": "feet"
                  },
                  "position": {
                    "x": 10,
                    "y": 0
                  }
                }
              ],
              "totalOpeningArea": 21,
              "paintableArea": 179
            },
            {
              "wallId": "wall-123456-east",
              "orientation": "east",
              "dimensions": {
                "length": 15,
                "height": 10,
                "area": 150,
                "unit": "feet"
              },
              "paint": null,
              "openings": [],
              "totalOpeningArea": 0,
              "paintableArea": 150
            },
            {
              "wallId": "wall-123456-west",
              "orientation": "west",
              "dimensions": {
                "length": 15,
                "height": 10,
                "area": 150,
                "unit": "feet"
              },
              "paint": null,
              "openings": [],
              "totalOpeningArea": 0,
              "paintableArea": 150
            }
          ],
          "totalWallArea": 700,
          "totalOpeningArea": 33,
          "totalPaintableArea": 667
        }
      ]
    }
  ]
}
```

## Key Features

### Project Level
- **name**: Project name
- **totalFloors**: Number of floors in the project
- **timestamp**: When the data was generated (ISO 8601 format)

### Floor Level
- **floorId**: Unique identifier for the floor
- **floorName**: Display name (e.g., "Ground Floor", "First Floor")
- **totalRooms**: Count of rooms on this floor
- **rooms**: Array of room objects

### Room Level
- **roomId**: Unique identifier for the room
- **roomName**: Display name (e.g., "Living Room", "Bedroom")
- **dimensions**: Length, width, height in feet
- **walls**: Array of 4 walls (north, south, east, west)
- **totalWallArea**: Sum of all wall areas
- **totalOpeningArea**: Sum of all door/window areas
- **totalPaintableArea**: Total wall area minus openings

### Wall Level
- **wallId**: Unique identifier for the wall
- **orientation**: Wall direction (north, south, east, west)
- **dimensions**: Length, height, and calculated area
- **paint**: Paint product details (or null if not selected)
  - Product ID, brand, name, color
  - Price per liter and coverage per liter
- **openings**: Array of doors/windows on this wall
- **totalOpeningArea**: Sum of opening areas on this wall
- **paintableArea**: Wall area minus openings

### Opening Level
- **openingId**: Unique identifier for the opening
- **type**: "door" or "window"
- **dimensions**: Width, height, and calculated area
- **position**: X and Y coordinates on the wall

## Usage

The JSON is automatically generated when the user:
1. Designs their floor plan on the canvas
2. Selects paint colors for walls
3. Adds doors and windows
4. Clicks the **Complete** button

The agent receives this comprehensive data and can:
- Calculate exact paint quantities needed
- Provide cost estimates per room/floor
- Suggest paint products
- Generate shopping lists
- Offer painting tips based on room configuration
