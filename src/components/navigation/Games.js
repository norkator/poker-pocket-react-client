import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import socketContext from '@/context/websocket/socketContext';
import tableContext from '@/context/table/tableContext';
import contentContext from '@/context/content/contentContext';
import { formatMoney } from '@/utils/Money';
import NavButton from '@/components/buttons/NavButton';
import StatCard from '@/components/StatCard';
import GameIcon from '@/components/GameIcon';
import FAQCard from '@/components/FAQCard';

const Games = () => {
  const { t } = useContext(contentContext);
  const socketCtx = useContext(socketContext);
  const tableCtx = useContext(tableContext);
  const { socket, socketConnected } = useContext(socketContext);
  const { tableId, setTableId } = tableCtx;

  const navigate = useNavigate();

  const [tablesData, setTablesData] = useState(null);
  const [statistics, setStatistics] = useState(null);

  const getTables = (socket) => {
    if (socket) {
      const data = JSON.stringify({
        key: 'getTables',
        tableId: -1,
      });
      socket.send(data);
    }
  };

  useEffect(() => {
    if (socket && socketConnected) {
      socket.handle('getTables', (jsonData) => parseData(jsonData.data));
      getTables(socket);
    }
  }, [socket, socketConnected]);

  const parseData = (data) => {
    setTablesData(data.tables);
    setStatistics(data.stats);
  };

  const selectTable = (table_id, game) => {
    if (socket) {
      const data = JSON.stringify({
        key: 'selectTable',
        tableId: table_id,
      });
      socket.send(data);

      const data2 = JSON.stringify({
        key: 'getTableParams',
        tableId: table_id,
      });
      socket.send(data2);
      setTableId(table_id);
      handleNavigation(game);
    }
  };

  const selectSpectateTable = (table_id, game) => {
    if (socket) {
      const data = JSON.stringify({
        key: 'selectSpectateTable',
        tableId: table_id,
      });
      socket.send(data);

      const data2 = JSON.stringify({
        key: 'getTableParams',
        tableId: table_id,
      });
      socket.send(data2);
      setTableId(table_id);
      handleNavigation(game);
    }
  };

  const handleNavigation = (game) => {
    switch (game) {
      case 'HOLDEM':
        navigate('/holdem');
        break;
      case 'FIVE_CARD_DRAW':
        navigate('/fivecarddraw');
        break;
      default:
        navigate('/games');
        break;
    }
  };

  // Memoized table rows
  const TableRows = useMemo(() => {
    if (!tablesData) return null;

    return tablesData.map((table) => {
      const { game, tableId, tableName, playerCount, maxSeats, tableMinBet = 10 } = table;
      return (
        <tr key={tableId}>
          <th scope="row">{tableId}</th>
          <td>
            <div className="d-flex align-items-center">
              <GameIcon game={game} />
              {t(game)}
            </div>
          </td>
          <td>{tableName}</td>
          <td>
            {playerCount}/{maxSeats}
          </td>
          <td>{formatMoney(tableMinBet)}$</td>
          <td>
            <button
              className="btn btn-sm btn-primary me-2"
              onClick={() => selectTable(tableId, game)}
            >
              {t('JOIN')}
            </button>
            <NavButton onClick={() => selectSpectateTable(tableId, game)}>
              {t('SPECTATE')}
            </NavButton>
          </td>
        </tr>
      );
    });
  }, [tablesData]);

  return (
    <div className="container" style={{ maxWidth: '850px' }}>
      {statistics ? (
        <div className="container mt-4">
          <div className="d-flex flex-wrap gap-3 justify-content-start">
            <StatCard number={statistics.totalGames} text={t('TOTAL_GAME')} />
            <StatCard number={statistics.totalPlayers} text={t('TOTAL_PLAYERS')} />
            <StatCard number={statistics.totalBots} text={t('TOTAL_BOTS')} />
          </div>
        </div>
      ) : (
        ''
      )}

      <div
        className="card"
        style={{
          width: '100%',
          marginTop: '10px',
          padding: '10px',
        }}
      >
        <table
          className="table table-dark table-striped"
          style={{ marginBottom: 0, backgroundColor: '#434343' }}
        >
          <thead className="thead-dark">
            <tr>
              <th scope="col">#</th>
              <th scope="col">{t('GAME')}</th>
              <th scope="col">{t('TABLE_NAME')}</th>
              <th scope="col">{t('PLAYERS')}</th>
              <th scope="col">{t('MIN_BET')}</th>
              <th scope="col">{t('ACTION')}</th>
            </tr>
          </thead>
          <tbody>
            {TableRows || (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center' }}>
                  {t('LOADING')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <FAQCard></FAQCard>
    </div>
  );
};

export default Games;
