import React, { useContext, useRef, useState, useEffect } from 'react';
import globalContext from '@/context/global/globalContext';
import tableContext from '@/context/table/tableContext';
import { formatMoney } from '@/utils/Money';

const Bottle = () => {
  const { cardStyle } = useContext(globalContext);
  const { board } = useContext(tableContext);

  const bottleRef = useRef(null);
  const [rotation, setRotation] = useState(0);
  const [spinSpeed, setSpinSpeed] = useState(0.2);
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasClicked, setHasClicked] = useState(false);

  useEffect(() => {
    if (hasClicked) return;

    const interval = setInterval(() => {
      setRotation((prev) => (prev + spinSpeed) % 360);
    }, 16); // ~60 FPS
    return () => clearInterval(interval);
  }, [spinSpeed, hasClicked]);

  const handleBottleClick = () => {
    if (isSpinning) return;

    setHasClicked(true);

    const initialSpeed = Math.random() * 15 + 15; // Random speed between 15 and 30
    const deceleration = 0.2;

    setSpinSpeed(initialSpeed);
    setIsSpinning(true);

    let currentSpeed = initialSpeed;

    const spinInterval = setInterval(() => {
      currentSpeed = Math.max(0, currentSpeed - deceleration);
      setSpinSpeed(currentSpeed);

      setRotation((prev) => (prev + currentSpeed) % 360);

      if (currentSpeed <= 0) {
        clearInterval(spinInterval);
        setIsSpinning(false);
        setSpinSpeed(0);
      }
    }, 16); // ~60 FPS
  };

  const current = board?.data;

  return (
    <div className="bottleContainer" onClick={handleBottleClick}>
      <div
        ref={bottleRef}
        className="bottle"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: isSpinning ? 'none' : 'transform 0.1s linear',
        }}
      >
        <div id="totalPot" className="bottleTotalPotText">
          <div>{current?.getTotalPot() > 0 ? formatMoney(current.getTotalPot()) + '$' : ''}</div>
        </div>
        <div className="bottleIcon"></div>
      </div>
    </div>
  );
};

export default Bottle;
