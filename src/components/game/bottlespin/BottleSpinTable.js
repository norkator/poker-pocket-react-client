import React, { useContext, useEffect, useState } from 'react';
import BottleSpinSeatSlot from './BottleSpinSeatSlot';
import tableContext from '@/context/table/tableContext';

const BottleSpinTable = ({ children }) => {
  const { seats } = useContext(tableContext);
  const [positions, setPositions] = useState([]);

  function calculatePositions(numSeats) {
    const positions = [];
    const angleIncrement = (2 * Math.PI) / numSeats;
    const radius = 200; // circle radius in pixels
    const centerX = 250; // x-coordinate of the center
    const centerY = 250; // y-coordinate of the center
    for (let i = 0; i < numSeats; i++) {
      const angle = i * angleIncrement;
      positions.push({
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      });
    }
    return positions;
  }

  useEffect(() => {
    const numSeats = seats.data.length;
    const calculatedPositions = calculatePositions(numSeats);
    setPositions(calculatedPositions);
  }, [seats.data]);

  const current = seats.data.map((seat, index) => ({
    ...seat,
    position: positions[index] || { x: 0, y: 0 },
  }));

  return (
    <div id="bottleSpinTable" className="bottleSpinTable">
      {/* Table layout */}
      {current.map(
        (seat, index) =>
          seat.seatFrame && (
            <BottleSpinSeatSlot
              key={seat.id}
              pos={`s${index + 1}`}
              seat={seat}
              position={{
                x: seat.position.x,
                y: seat.position.y,
              }}
            />
          )
      )}
      {/* Middle Bottle */}
      {children}
    </div>
  );
};

export default BottleSpinTable;
