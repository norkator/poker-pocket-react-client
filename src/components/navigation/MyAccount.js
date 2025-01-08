import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import socketContext from '@/context/websocket/socketContext';
import contentContext from '@/context/content/contentContext';
import StatCard from '@/components/StatCard';
import authContext from '@/context/auth/authContext';
import { formatMoney } from '@/utils/Money';
import StatsChart from '@/components/StatsChart';
import GameIcon from '@/components/GameIcon';
import modalContext from '@/context/modal/modalContext';
import CreateTableModal from '@/modals/CreateTableModal';
import { LS_TOKEN } from '@/context/auth/AuthState';
import { toast } from 'react-toastify';

const MyAccount = () => {
  const { t } = useContext(contentContext);
  const socketCtx = useContext(socketContext);
  const { socket, socketConnected } = useContext(socketContext);
  const navigate = useNavigate();
  const { myDashboardData } = useContext(authContext);
  const { openView, openModal, closeModal } = useContext(modalContext);

  useEffect(() => {
    if (socket) {
      regSocketMessageHandler(socket);
      getUserTables();
    }
  }, [socket]);

  const regSocketMessageHandler = (socket) => {
    socket.handle('getUserTables', (jsonData) => getUserTablesDataResult(jsonData.data));
  };

  const initUserStats = {
    username: '',
    money: formatMoney(0),
    winCount: 0,
    loseCount: 0,
    xp: 0,
    achievements: [],
  };
  const [userStats, setUserStats] = useState(initUserStats);
  const [userTables, setUserTables] = useState(null);

  useEffect(() => {
    if (myDashboardData) {
      parseMyStats(myDashboardData);
    } else {
      setUserStats(initUserStats);
    }
  }, [myDashboardData]);

  function parseMyStats(data) {
    const stats = data.userStats;
    setUserStats(stats);
  }

  function removeTable(tableId) {
    console.info('remove table ' + tableId);
    toast.warn('🙈 Removing user tables is not implemented yet', {
      autoClose: 5 * 1000,
      theme: 'dark',
    });
  }

  function getUserTables() {
    const token = localStorage.getItem(LS_TOKEN);
    socket.send(
      JSON.stringify({
        key: 'getUserTables',
        token: token,
      })
    );
  }

  function getUserTablesDataResult(data) {
    if (data.success) {
      setUserTables(data.tables);
    }
  }

  const openCreateTableModal = (existingTableId = -1) => {
    if (socket) {
      openModal(
        () => (
          <CreateTableModal
            context={{ socketCtx }}
            closeModal={() => {
              getUserTables();
              closeModal();
            }}
            existingTableId={existingTableId}
          />
        ),
        t('CREATE_TABLE'),
        true,
        true,
        t('CLOSE')
      );
    }
  };

  const MyGamesTableRows = useMemo(() => {
    if (!userTables) return null;

    return userTables.map((table) => {
      const { game, id, tableName, password, botCount } = table;
      return (
        <tr key={id}>
          <th scope="row">{id}</th>
          <td>
            <div className="d-flex align-items-center">
              <GameIcon game={game} />
              {t(game)}
            </div>
          </td>
          <td>{tableName}</td>
          <td>{password}</td>
          <td>{botCount}</td>
          <td>
            <button
              className="btn btn-sm btn-outline-info me-2"
              onClick={() => openCreateTableModal(id)}
            >
              {t('EDIT')}
            </button>
            <button className="btn btn-sm btn-outline-danger me-2" onClick={() => removeTable(id)}>
              {t('REMOVE')}
            </button>
          </td>
        </tr>
      );
    });
  }, [userTables]);

  return (
    <div className="container" style={{ maxWidth: '850px' }}>
      <div className="mt-4">
        <div>
          <h2
            style={{
              color: 'white',
              marginBottom: '1rem',
            }}
          >{`👋 ${t('HELLO')}, ${userStats.username}`}</h2>
        </div>
        <div className="d-flex flex-wrap gap-2 justify-content-start">
          <StatCard
            width={'16.5rem'}
            number={`${formatMoney(userStats.money)}$`}
            text={t('MONEY')}
          />
          <StatCard width={'12rem'} number={userStats.xp} text={t('XP')} />
          <StatCard width={'10rem'} number={userStats.winCount} text={t('WIN_COUNT')} />
          <StatCard width={'10rem'} number={userStats.loseCount} text={t('LOSE_COUNT')} />
        </div>
      </div>

      <div
        className="card mt-2"
        style={{
          width: '100%',
          padding: '10px',
          color: 'white',
        }}
      >
        <StatsChart userStats={userStats.dailyAverageStats}></StatsChart>
      </div>

      <div
        className="card mt-4 mb-4"
        style={{
          width: '100%',
          padding: '10px',
        }}
      >
        <div>
          <h4
            style={{
              color: 'white',
            }}
          >{`🎮 ${t('MY_GAMES')}`}</h4>
        </div>
        <div
          style={{
            fontSize: '13px',
            color: 'white',
            marginBottom: '1rem',
          }}
        >
          {t('MY_GAMES_INFO')}
        </div>
        <table
          className="table table-dark table-striped"
          style={{ marginBottom: 0, backgroundColor: '#434343' }}
        >
          <thead className="thead-dark">
            <tr>
              <th scope="col">#</th>
              <th scope="col">{t('GAME')}</th>
              <th scope="col">{t('TABLE_NAME')}</th>
              <th scope="col">{t('PASSWORD')}</th>
              <th scope="col">{t('BOT_COUNT')}</th>
              <th scope="col">{t('ACTION')}</th>
            </tr>
          </thead>
          <tbody>
            {MyGamesTableRows || (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center' }}>
                  {t('LOADING')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <button
          className="btn btn-sm btn-outline-light mt-2"
          onClick={() => openCreateTableModal(-1)}
        >
          {t('CREATE_TABLE')}
        </button>
      </div>
    </div>
  );
};

export default MyAccount;
