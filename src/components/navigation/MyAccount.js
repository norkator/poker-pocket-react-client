import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import socketContext from '@/context/websocket/socketContext';
import contentContext from '@/context/content/contentContext';
import StatCard from '@/components/StatCard';
import authContext from '@/context/auth/authContext';
import { formatMoney } from '@/utils/Money';

const MyAccount = () => {
  const { t } = useContext(contentContext);
  const socketCtx = useContext(socketContext);
  const { socket, socketConnected } = useContext(socketContext);
  const navigate = useNavigate();
  const { myDashboardData } = useContext(authContext);

  const initUserStats = {
    username: '',
    money: formatMoney(0),
    winCount: 0,
    loseCount: 0,
    xp: 0,
    achievements: [],
  };
  const [userStats, setUserStats] = useState(initUserStats);

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
          <StatCard width={'15rem'} number={`${formatMoney(userStats.money)}$`} text={t('MONEY')} />
          <StatCard width={'12rem'} number={userStats.xp} text={t('XP')} />
          <StatCard width={'10rem'} number={userStats.winCount} text={t('WIN_COUNT')} />
          <StatCard width={'10rem'} number={userStats.loseCount} text={t('LOSE_COUNT')} />
        </div>
      </div>

      {/*
      <div
        className="card"
        style={{
          width: '100%',
          marginTop: '10px',
          padding: '10px',
        }}
      >
        Hello world
      </div>
      */}
    </div>
  );
};

export default MyAccount;
