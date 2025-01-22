import React, { useContext, useEffect, useState } from 'react';
import BottleSpinSeatSlot from './BottleSpinSeatSlot';
import tableContext from '@/context/table/tableContext';

const BottleSpinTable = ({ children }) => {
  const { seats } = useContext(tableContext);
  const [positions, setPositions] = useState([]);
  const [currentSeats, setCurrentSeats] = useState([]);

  function calculateResponsiveValues() {
    if (window.innerWidth <= 768) {
      return { radius: 100, centerX: 125, centerY: 125 }; // half of the original size
    }
    return { radius: 200, centerX: 250, centerY: 250 }; // original size
  }

  function calculatePositions(numActiveSeats) {
    const { radius, centerX, centerY } = calculateResponsiveValues();
    const positions = [];
    const angleIncrement = (2 * Math.PI) / numActiveSeats;

    for (let i = 0; i < numActiveSeats; i++) {
      const angle = -Math.PI / 2 + i * angleIncrement;
      positions.push({
        x: Math.round(centerX + radius * Math.cos(angle)), // x-coordinate
        y: Math.round(centerY + radius * Math.sin(angle)), // y-coordinate
      });
    }
    return positions;
  }

  useEffect(() => {
    function updatePositions() {
      const numSeats = seats.data.filter((s) => s.seatFrame).length;
      const calculatedPositions = calculatePositions(numSeats);
      setPositions(calculatedPositions);
      const current = seats.data
        .filter((s) => s.seatFrame)
        .map((seat, index) => ({
          ...seat,
          position: calculatedPositions[index] || { x: 0, y: 0 },
        }));
      setCurrentSeats(current);
    }

    updatePositions();

    window.addEventListener('resize', updatePositions);
    return () => window.removeEventListener('resize', updatePositions);
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
