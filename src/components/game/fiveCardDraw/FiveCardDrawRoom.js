import React from 'react';
import RoomStatus from '@/components/game/RoomStatus';
import RoomTable from '@/components/game/RoomTable';
import TurnControl from '@/components/game/TurnControl';

const FiveCardDrawRoom = () => {
  return (
    <>
      <RoomStatus />
      {/* <!-- Poker table --> */}
      <RoomTable>
        <div style={{ marginTop: '15px', marginLeft: '20px' }}></div>
      </RoomTable>
      <TurnControl />
    </>
  );
};

export default FiveCardDrawRoom;
