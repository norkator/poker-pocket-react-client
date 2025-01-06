import React, { useContext, useMemo } from 'react';
import styled from 'styled-components';
import tableContext from '@/context/table/tableContext';

const StyledCard = styled.div`
  background-color: #434343;
  width: 100%;
  padding-top: 5px;
  padding-bottom: 5px;
`;

const RoomStatus = () => {
  const { roomInfo } = useContext(tableContext);

  const view = useMemo(() => {
    const current = roomInfo.data;

    return (
      <StyledCard className="card">
        {/* <!-- Room status --> */}
        <div className="row">
          <div className="col-10">
            <div className="container">
              <div className="row">
                <div className="col-sm">
                  <div id="tableName" className="roomStatusText">
                    {current.getTableName()}
                  </div>
                </div>
                <div className="col-sm">
                  <div id="minBet" className="roomStatusText">
                    {current.getMinBet()}
                  </div>
                </div>
                <div className="col-sm">
                  <div id="spectatorsCount" className="roomStatusText">
                    {current.getRoomSpectatorCount()}
                  </div>
                </div>
                <div className="col-sm">
                  <div id="waitingPlayersCount" className="roomStatusText">
                    {current.getRoomWaitingPlayersCount()}
                  </div>
                </div>
                <div className="col-sm">
                  <div id="deckStatus" className="roomStatusText">
                    {current.getRoomDeckStatus()}
                  </div>
                </div>
                <div className="col-sm">
                  <div id="deckCardsBurned" className="roomStatusText">
                    {current.getRoomDeckBurnedCount()}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-8">
            <div className="container">
              <div className="row">
                <div className="col-sm-auto">
                  <div id="roomStatusText" className="roomStatusText" style={{ textAlign: 'left' }}>
                    <span style={{ marginRight: '30px' }}>
                      ♣ Table status: {current.getRoomStatusText()}
                    </span>
                  </div>
                </div>
                <div className="col-sm-auto">
                  <div id="roomTurnText" className="roomStatusText" style={{ textAlign: 'left' }}>
                    <span style={{ marginRight: '30px' }}>
                      ♠ Turn: {current.getRoomTurnText()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </StyledCard>
    );
  }, [roomInfo]);

  return view;
};

export default RoomStatus;
