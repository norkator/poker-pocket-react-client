import React from 'react';
import RoomStatus from '@/components/game/RoomStatus';
import TurnControl from '@/components/game/TurnControl';
import FiveCardDrawTable from '@/components/game/fiveCardDraw/FiveCardDrawTable';
import BoardCards from '@/components/game/BoardCards';
import Overlay from '@/components/Overlay';

const FiveCardDrawRoom = () => {
  return (
    <Overlay>
      {(showOverlay) => (
        <>
          <RoomStatus />
          {/* <!-- Poker table --> */}
          <FiveCardDrawTable>
            <div style={{ marginTop: '15px', marginLeft: '20px' }}>
              <BoardCards />
            </div>
          </FiveCardDrawTable>
          <TurnControl />
          {/*<button onClick={() => showOverlay('🎉 +10 XP WIN STREAK!')}>Overlay</button> */}
        </>
      )}
    </Overlay>
  );
};

export default FiveCardDrawRoom;
