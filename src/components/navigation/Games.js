import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import socketContext from '@/context/websocket/socketContext';
import tableContext from '@/context/table/tableContext';
import contentContext from '@/context/content/contentContext';
import { formatMoney } from '@/utils/Money';
import NavButton from '@/components/buttons/NavButton';
import StatCard from '@/components/StatCard';
import GameIcon from '@/components/GameIcon';
import FAQCard from '@/components/FAQCard';
import { toast } from 'react-toastify';
import modalContext from '@/context/modal/modalContext';
import TablePasswordModal from '@/modals/TablePasswordModal';
import PublicChat from '@/components/chat/PublicChat';
import styled from 'styled-components';

const ChatButton = styled.button`
  position: fixed;
  right: 10px;
  bottom: 10px;
  background-color: #23272b;
  color: white;
  border: none;
  border-radius: 50%;
  padding: 15px;
  font-size: 15px;
  cursor: pointer;
  z-index: 9999;

  &:hover {
    opacity: 0.9;
  }
`;

const Games = () => {
  const [searchParams] = useSearchParams();
  const queryStrTableId = searchParams.get('tableId');

  const { t } = useContext(contentContext);
  const { openView, openModal, closeModal } = useContext(modalContext);
  const socketCtx = useContext(socketContext);
  const { socket, socketConnected } = useContext(socketContext);
  const { tableId, setTableId } = useContext(tableContext);

  const navigate = useNavigate();

  const [tablesData, setTablesData] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [isChatVisible, setIsChatVisible] = useState(false);

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

      socket.handle('invalidTablePassword', (jsonData) =>
        invalidTablePasswordResult(jsonData.data)
      );

      socket.handle('selectTable', (jsonData) => selectTableResult(jsonData.data));

      socket.handle('selectSpectateTable', (jsonData) => selectSpectateTableResult(jsonData.data));

      getTables(socket);
    }
  }, [socket, socketConnected]);

  const parseData = (data) => {
    setTablesData(data.tables);
    setStatistics(data.stats);
  };

  const beforeSelectTable = (tableId, passwordProtected) => {
    if (passwordProtected) {
      openView(() => (
        <TablePasswordModal
          closeModal={closeModal}
          onProceed={(password) => selectTable(tableId, password)}
        />
      ));
    } else {
      selectTable(tableId, '');
    }
  };

  const selectTable = (tableId, password) => {
    if (socket) {
      const data = JSON.stringify({
        key: 'selectTable',
        tableId: tableId,
        password: password,
      });
      socket.send(data);
    }
  };

  const invalidTablePasswordResult = (data) => {
    toast.error(t(data.translationKey));
  };

  const selectTableResult = (data) => {
    const data2 = JSON.stringify({
      key: 'getTableParams',
      tableId: data.tableId,
    });
    socket.send(data2);
    setTableId(data.tableId);
    handleNavigation(data.game);
  };

  const beforeSelectSpectateTable = (tableId, passwordProtected) => {
    if (passwordProtected) {
      openView(() => (
        <TablePasswordModal
          closeModal={closeModal}
          onProceed={(password) => selectSpectateTable(tableId, password)}
        />
      ));
    } else {
      selectSpectateTable(tableId, '');
    }
  };

  const selectSpectateTable = (tableId, password) => {
    if (socket) {
      const data = JSON.stringify({
        key: 'selectSpectateTable',
        tableId: tableId,
        password: password,
      });
      socket.send(data);
    }
  };

  const selectSpectateTableResult = (data) => {
    const data2 = JSON.stringify({
      key: 'getTableParams',
      tableId: data.tableId,
    });
    socket.send(data2);
    setTableId(data.tableId);
    handleNavigation(data.game);
  };

  const handleNavigation = (game) => {
    switch (game) {
      case 'HOLDEM':
        navigate('/holdem');
        break;
      case 'FIVE_CARD_DRAW':
        navigate('/fivecarddraw');
        break;
      case 'BOTTLE_SPIN':
        navigate('/bottlespin');
        break;
      default:
        navigate('/games');
        break;
    }
  };

  const toggleChatVisibility = () => {
    setIsChatVisible(!isChatVisible);
  };

  // Memoized table rows
  const TableRows = useMemo(() => {
    if (!tablesData) return null;

    return tablesData.map((table) => {
      const {
        game,
        tableId,
        tableName,
        playerCount,
        maxSeats,
        tableMinBet = 10,
        passwordProtected,
      } = table;
      const isHighlighted = tableId === Number(queryStrTableId || -1);
      return (
        <tr
          key={tableId}
          style={{
            fontWeight: isHighlighted ? 'bold' : 'normal',
          }}
        >
          <th scope="row" className={isHighlighted ? 'bg-danger' : ''}>
            {tableId}
          </th>
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
          <td>{passwordProtected ? t('YES') : ''}</td>
          <td>
            <button
              className="btn btn-sm btn-primary me-2"
              onClick={() => beforeSelectTable(tableId, passwordProtected)}
            >
              {t('JOIN')}
            </button>
            <NavButton onClick={() => beforeSelectSpectateTable(tableId, passwordProtected)}>
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
        <div className="mt-4">
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
        <table className="table table-dark" style={{ marginBottom: 0, backgroundColor: '#434343' }}>
          <thead className="thead-dark">
            <tr>
              <th scope="col">#</th>
              <th scope="col">{t('GAME')}</th>
              <th scope="col">{t('TABLE_NAME')}</th>
              <th scope="col">{t('PLAYERS')}</th>
              <th scope="col">{t('MIN_BET')}</th>
              <th scope="col">{t('PASSWORD')}</th>
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
      <div className="card shadow-sm mt-4 mb-4">
        <div className="card-header text-white">
          <h5 className="card-title mb-0">Report an Issue</h5>
        </div>
        <div className="card-body">
          <p className="card-text text-white">
            You can report issue / join development / request feature on link below:
          </p>
          <a
            href="https://github.com/norkator/poker-pocket-ts-backend/issues/new"
            target="_blank"
            className="btn btn-outline-info"
            rel="noreferrer"
          >
            Report Issue on GitHub
          </a>
        </div>
      </div>
      <PublicChat isVisible={isChatVisible} toggleVisibility={toggleChatVisibility} />
      <ChatButton onClick={() => toggleChatVisibility()}>💬</ChatButton>;
    </div>
  );
};

export default Games;
