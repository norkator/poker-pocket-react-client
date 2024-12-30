import React from 'react';
import RoomStatus from '@/components/game/RoomStatus';
import HoldemTable from '@/components/game/holdem/HoldemTable';
import BoardCards from '@/components/game/BoardCards';
import TurnControl from '@/components/game/TurnControl';
import Overlay from '@/components/Overlay';

const HoldemRoom = () => {
  return (
    <Overlay>
      {(showOverlay) => (
        <>
          <RoomStatus />
          <HoldemTable>
            <div style={{ marginTop: '15px', marginLeft: '20px' }}>
              <BoardCards />
            </div>
          </HoldemTable>
          <TurnControl />
          {/*<button onClick={() => showOverlay('🎉 +10 XP WIN STREAK!')}>Overlay</button> */}
        </>
      )}
    </Overlay>
  );
};

export default HoldemRoom;
