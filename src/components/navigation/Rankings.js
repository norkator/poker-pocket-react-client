import React, { useContext, useEffect, useMemo, useState } from 'react';
import socketContext from '@/context/websocket/socketContext';
import contentContext from '@/context/content/contentContext';
import StatCard from '@/components/StatCard';
import GameIcon from '@/components/GameIcon';
import { formatMoney } from '@/utils/Money';

const Rankings = () => {
  const { t } = useContext(contentContext);
  const socketCtx = useContext(socketContext);
  const { socket, playerId } = socketCtx;

  useEffect(() => {
    if (socket) {
      socket.handle('rankings', getRankingsResult);
    }
  }, [socket]);

  useEffect(() => {
    getRankings();
  }, []);

  const [rankingData, setRankingData] = useState(null);

  function getRankings() {
    if (socket) {
      const data = JSON.stringify({
        key: 'rankings',
      });
      socket.send(data);
    }
  }

  function getRankingsResult(jsonData) {
    const rData = jsonData.data.ranks;
    if (rData.length > 0) {
      setRankingData(rData);
    }
  }

  function loadMedalImage(iconName) {
    return './assets/images/' + iconName + '.png';
  }

  const RankingView = useMemo(() => {
    if (!rankingData) return null;

    return rankingData.map((rank, index) => {
      const { username, xp, money, win_count, lose_count } = rank;
      return (
        <tr key={username}>
          <td>{index + 1}</td>
          <td>
            <div className="d-flex align-items-center">
              <GameIcon game="Game" />
              {t(username)}
            </div>
          </td>
          <td>{xp} XP</td>
          <td>{`${formatMoney(money)}$`}</td>
          <td>{win_count}</td>
          <td>{lose_count}</td>
        </tr>
      );
    });
  }, [rankingData]);

  return (
    <div className="container" style={{ maxWidth: '850px' }}>
      <div className="mt-4">
        <div>
          <h2
            style={{
              color: 'white',
              marginBottom: '1rem',
            }}
          >{`📈 ${t('RANKINGS')}`}</h2>
        </div>
        <div className="d-flex flex-wrap gap-2 justify-content-start">
          <StatCard width={'16.5rem'} number={0} text={t('TOTAL_PLAYERS')} />
        </div>
      </div>

      <div
        className="card mt-2 mb-4"
        style={{
          width: '100%',
          padding: '10px',
          color: 'white',
        }}
      >
        <table
          className="table table-dark table-striped"
          style={{ marginBottom: 0, backgroundColor: '#434343' }}
        >
          <thead className="thead-dark">
            <tr>
              <th scope="col">{t('RANK')}</th>
              <th scope="col">{t('USERNAME')}</th>
              <th scope="col">XP</th>
              <th scope="col">{t('MONEY')}</th>
              <th scope="col">{t('WIN_COUNT')}</th>
              <th scope="col">{t('LOSE_COUNT')}</th>
            </tr>
          </thead>
          <tbody>
            {RankingView || (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center' }}>
                  {t('LOADING')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Rankings;
