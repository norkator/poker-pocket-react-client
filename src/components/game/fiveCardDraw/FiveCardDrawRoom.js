import React from 'react';
import RoomStatus from '@/components/game/RoomStatus';
import TurnControl from '@/components/game/TurnControl';
import FiveCardDrawTable from '@/components/game/fiveCardDraw/FiveCardDrawTable';
import BoardCards from '@/components/game/BoardCards';

const FiveCardDrawRoom = () => {
  return (
    <>
      <RoomStatus />
      {/* <!-- Poker table --> */}
      <FiveCardDrawTable>
        <div style={{ marginTop: '15px', marginLeft: '20px' }}>
          <BoardCards />
        </div>
      </FiveCardDrawTable>
      <TurnControl />
    </>
  );
};

export default FiveCardDrawRoom;
