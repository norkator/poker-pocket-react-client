import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';

const playerNickname = 'Anon' + Math.floor(Math.random() * 1000);

const SelectTableModal = ({ mode, context, closeModal }) => {
  const { socketCtx, tableCtx } = context;
  const { tableId, setTableId } = tableCtx;
  const { socket, connId } = socketCtx;

  const [isSpect, setIsSpect] = useState(mode !== 'all');

  const filterList = [
    { key: 'allRB', label: 'All', params: 'all' },
    { key: 'lowRB', label: 'Low bets', params: 'lowBets' },
    { key: 'mediumRB', label: 'Medium bets', params: 'mediumBets' },
    { key: 'highRB', label: 'High bets', params: 'highBets' },
  ];
  const [filter, setFilter] = useState(filterList[0]);

  const onChangeFilter = (item) => {
    setFilter(item);
  };

  const [roomsData, setRoomsData] = useState(null);

  useEffect(() => {
    if (!isSpect) {
      getRooms(socket, filter.params);
    } else {
      getSpectateRooms(socket, filter.params);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSpect, filter]);

  const getRooms = (socket, tableSortParam) => {
    if (socket) {
      if (tableId === -1) {
        const data = JSON.stringify({
          connectionId: connId,
          key: 'getTables',
          playerName: playerNickname,
          tableId: -1,
          tableSortParam: tableSortParam,
        });
        socket.send(data);
      } else {
        toast.warn('reload when already in a room');
        // TODO:
        // window.location.reload();
      }
    }
  };

  function selectRoom(table_id) {
    if (socket) {
      const data = JSON.stringify({
        connectionId: connId,
        key: 'selectTable',
        tableId: table_id,
      });
      socket.send(data);
    }
  }

  function getSpectateRooms(socket, tableSortParam) {
    if (socket) {
      if (tableId === -1) {
        const data = JSON.stringify({
          connectionId: connId,
          key: 'getSpectateTables',
          tableId: -1,
          tableSortParam: tableSortParam,
        });
        socket.send(data);
      } else {
        toast.warn('reload when already in a room');
        // TODO:
        // window.location.reload();
      }
    }
  }

  function selectSpectateRoom(table_id) {
    if (socket) {
      const data = JSON.stringify({
        connectionId: connId,
        key: 'selectSpectateTable',
        tableId: table_id,
      });
      socket.send(data);

      const data2 = JSON.stringify({
        connectionId: connId,
        key: 'getTableParams',
        tableId: table_id,
      });
      socket.send(data2);
    }
  }

  useEffect(() => {
    if (socket) {
      regGameHandler(socket);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  const regGameHandler = (socket) => {
    socket.handle('getTables', (jsonData) => parseRooms(jsonData.data.tables));

    socket.handle('getSpectateTables', (jsonData) => parseRooms(jsonData.data.tables));
  };

  const parseRooms = (rData) => {
    setRoomsData(rData);
  };

  const chooseRoom = (rData) => {
    const table_id = Number(rData.tableId);
    if (table_id !== -1) {
      setTableId(table_id);
      isSpect ? selectSpectateRoom(table_id) : selectRoom(table_id);
      closeModal();
    }
  };

  function PlayingRoomClick() {
    setIsSpect(false);
  }
  function SpectateRoomClick() {
    setIsSpect(true);
  }

  const RoomView = useMemo(() => {
    if (!roomsData) {
      return null;
    }
    return roomsData.map((rData) => {
      const minBet = rData['tableMinBet'] ? rData.tableMinBet : 10;
      const desc = ' ➟ ' + rData.playerCount + '/' + rData.maxSeats + ' ➟ MB ' + minBet + '$';
      return (
        <button
          key={rData.tableId}
          type="button"
          onClick={() => chooseRoom(rData)}
          className="list-group-item list-group-item-action"
        >
          <div className="d-flex flex-row">
            <div className="p-2" style={{ marginLeft: '-10px' }}>
              <div className={!isSpect ? 'chipIcon' : 'spectateIcon'}></div>
            </div>
            <div className="p-2" style={{ marginLeft: '-10px' }}>
              <b>{rData.tableName}</b>
              {desc}
            </div>
          </div>
        </button>
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomsData, isSpect]);

  return (
    <>
      <p>
        <button
          type="button"
          onClick={PlayingRoomClick}
          className={`btn btn3d ${!isSpect ? 'btn-primary' : 'btn-default'}`}
        >
          Playing rooms
        </button>
        <button
          type="button"
          onClick={SpectateRoomClick}
          className={`btn btn3d ${isSpect ? 'btn-primary' : 'btn-default'}`}
        >
          Spectate rooms
        </button>
      </p>
      <div style={{ marginLeft: '10px', marginBottom: '5px' }}>
        {filterList.length > 0
          ? ['radio'].map((type) =>
              filterList.map((item, index) => {
                return (
                  <div key={item.key} className="custom-control custom-radio custom-control-inline">
                    <input
                      id={item.key}
                      name={type}
                      type={type}
                      className="custom-control-input"
                      checked={filter.key === item.key}
                      onChange={() => onChangeFilter(item)}
                    />
                    <label className="custom-control-label" htmlFor={item.key}>
                      {item.label}
                    </label>
                  </div>
                );
              })
            )
          : null}
      </div>
      <div id="roomListGroup" className="list-group">
        {/* <!-- Dynamically appending here from javascript --> */}
        {RoomView}
      </div>
    </>
  );
};

export default SelectTableModal;
