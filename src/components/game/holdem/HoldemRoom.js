import React from 'react';
import RoomStatus from '@/components/game/RoomStatus';
import HoldemTable from '@/components/game/holdem/HoldemTable';
import BoardCards from '@/components/game/BoardCards';
import TurnControl from '@/components/game/TurnControl';

const HoldemRoom = () => {
  return (
    <>
      <RoomStatus />
      {/* <!-- Poker table --> */}
      <HoldemTable>
        <div style={{ marginTop: '15px', marginLeft: '20px' }}>
          <BoardCards />
        </div>
      </HoldemTable>
      <TurnControl />
    </>
  );
};

export default HoldemRoom;
