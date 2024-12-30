import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import socketContext from '@/context/websocket/socketContext';
import contentContext from '@/context/content/contentContext';
import StatCard from '@/components/StatCard';

const MyAccount = () => {
  const { t } = useContext(contentContext);
  const socketCtx = useContext(socketContext);
  const { socket, socketConnected } = useContext(socketContext);
  const navigate = useNavigate();

  // const [tablesData, setTablesData] = useState(null);
  // const [statistics, setStatistics] = useState(null);

  return (
    <div className="container" style={{ maxWidth: '850px' }}>
      <div className="container mt-4">
        <div className="d-flex flex-wrap gap-3 justify-content-start">
          <StatCard number={0} text={t('TOTAL_GAME')} />
          <StatCard number={0} text={t('TOTAL_PLAYERS')} />
          <StatCard number={0} text={t('TOTAL_BOTS')} />
        </div>
      </div>

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
    </div>
  );
};

export default MyAccount;
