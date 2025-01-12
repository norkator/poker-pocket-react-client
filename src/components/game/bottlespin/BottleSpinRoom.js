import React from 'react';
import RoomStatus from '@/components/game/RoomStatus';
import TurnControl from '@/components/game/TurnControl';
import Overlay from '@/components/Overlay';
import BottleSpinTable from '@/components/game/bottlespin/BottleSpinTable';
import styled from 'styled-components';
import Bottle from '@/components/game/Bottle';

const CenteredBottleSpinTable = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const BottleSpinRoom = () => {
  return (
    <Overlay>
      {(showOverlay) => (
        <>
          <RoomStatus />
          <CenteredBottleSpinTable>
            <BottleSpinTable>
              <Bottle />
            </BottleSpinTable>
          </CenteredBottleSpinTable>
          <TurnControl />
        </>
      )}
    </Overlay>
  );
};

export default BottleSpinRoom;
