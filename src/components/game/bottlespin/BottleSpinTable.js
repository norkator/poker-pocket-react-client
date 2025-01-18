import React, { useContext, useEffect, useState } from 'react';
import BottleSpinSeatSlot from './BottleSpinSeatSlot';
import tableContext from '@/context/table/tableContext';

const BottleSpinTable = ({ children }) => {
  const { seats } = useContext(tableContext);
  const [positions, setPositions] = useState([]);
  const [currentSeats, setCurrentSeats] = useState([]);

  function calculatePositions(numActiveSeats) {
    const positions = [];
    const angleIncrement = (2 * Math.PI) / numActiveSeats; // Divide full circle by active seats
    const radius = 200; // Circle radius in pixels
    const centerX = 250; // x-coordinate of the center
    const centerY = 250; // y-coordinate of the center

    // Place active players in their corresponding seats
    for (let i = 0; i < numActiveSeats; i++) {
      const angle = -Math.PI / 2 + i * angleIncrement; // Start at the top and rotate clockwise
      positions.push({
        x: Math.round(centerX + radius * Math.cos(angle)), // x-coordinate
        y: Math.round(centerY + radius * Math.sin(angle)), // y-coordinate
      });
    }
    return positions;
  }

  useEffect(() => {
    const numSeats = seats.data.filter((s) => s.seatFrame).length;
    const calculatedPositions = calculatePositions(numSeats);
    setPositions(calculatedPositions); // Set positions first
    const current = seats.data
      .filter((s) => s.seatFrame)
      .map((seat, index) => ({
        ...seat,
        position: calculatedPositions[index] || { x: 0, y: 0 },
      }));
    setCurrentSeats(current);
  }, [JSON.stringify(seats.data)]);

  return (
    <div id="bottleSpinTable" className="bottleSpinTable">
      {/* Table layout */}
      {currentSeats.map((seat, index) =>
        seat.seatFrame ? (
          <BottleSpinSeatSlot
            key={seat.id}
            pos={`s${index + 1}`}
            seat={seat}
            position={{
              x: seat.position.x,
              y: seat.position.y,
            }}
          />
        ) : null
      )}

      {/* Middle Bottle */}
      {children}
    </div>
  );
};

export default BottleSpinTable;
