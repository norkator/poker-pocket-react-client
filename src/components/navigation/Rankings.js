import React, { useContext, useEffect, useMemo, useState } from 'react';
import socketContext from '@/context/websocket/socketContext';
import contentContext from '@/context/content/contentContext';
import StatCard from '@/components/StatCard';
import { toast } from 'react-toastify';

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
    const responseCode = jsonData.code;
    const rData = jsonData.data;
    if (Number(responseCode) === 200) {
      setRankingData(rData);
    } else {
      toast.error('Unspecified error while retrieving rankings');
    }
  }

  function loadMedalImage(iconName) {
    return './assets/images/' + iconName + '.png';
  }

  const RankingView = useMemo(() => {
    if (!rankingData) {
      return null;
    }

    return rankingData.map((rData) => {
      return (
        <button key={rData.name} className="list-group-item list-group-item-action">
          <div className="d-flex flex-row">
            <div className="p-2" style={{ marginLeft: '-10px' }}>
              <img
                src={loadMedalImage(rData.icon)}
                alt=""
                style={{ width: '25px', height: '50px' }}
              />
            </div>
            <div className="p-2" style={{ marginLeft: '-10px', width: '150px' }}>
              <div className="grid" style={{ marginLeft: '30px' }}>
                <div className="row">
                  <b>{rData.name}</b>
                </div>
                <div className="row">
                  <label>{rData.xp + ' xp'}</label>
                </div>
              </div>
            </div>
            <div className="p-2">
              <div className="container">
                <div className="row">
                  <div className="col-md-8">
                    <h6>
                      Wins
                      <span className="badge badge-secondary">{rData.win_count}</span>
                    </h6>
                  </div>
                  <div className="col-md-8">
                    <h6>
                      Losses <span className="badge badge-secondary">{rData.lose_count}</span>
                    </h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </button>
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
        <ul id="rankingListGroup" className="list-group" style={{ marginTop: '10px' }}>
          {RankingView}
        </ul>
      </div>
    </div>
  );
};

export default Rankings;
