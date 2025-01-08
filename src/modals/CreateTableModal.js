import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import contentContext from '@/context/content/contentContext';
import { LS_TOKEN } from '@/context/auth/AuthState';

const Label = styled.label`
  font-weight: bold;
  margin-top: 10px;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const CreateTableModal = ({ existingTableId, context, closeModal }) => {
  const { socketCtx } = context;
  const { socket, playerId } = socketCtx;
  const { t } = useContext(contentContext);

  const [tableId, setTableId] = useState(-1);
  const [gameType, setGameType] = useState('');
  const [tableName, setTableName] = useState('');
  const [botCount, setBotCount] = useState(0);
  const [password, setPassword] = useState('');
  const [turnCountdown, setTurnCountdown] = useState(20);
  const [minBet, setMinBet] = useState(10);
  const [afterRoundCountdown, setAfterRoundCountdown] = useState(10);
  const [discardAndDrawTimeout, setDiscardAndDrawTimeout] = useState(20);

  useEffect(() => {
    if (socket) {
      regSocketMessageHandler(socket);
      if (existingTableId > 0) {
        setTableId(existingTableId);
        const token = localStorage.getItem(LS_TOKEN);
        socket.send(
          JSON.stringify({
            key: 'getUserTable',
            token,
            tableId: existingTableId,
          })
        );
      }
    }
  }, [socket, existingTableId]);

  const regSocketMessageHandler = (socket) => {
    socket.handle('getUserTable', (jsonData) => tableData(jsonData.data));

    socket.handle('createUpdateUserTable', (jsonData) => createUpdateTableResult(jsonData.data));
  };

  function tableData(data) {
    const table = data.table;
    if (table) {
      setTableId(table.id);
      setGameType(table.game || '');
      setTableName(table.tableName || '');
      setBotCount(table.botCount || 0);
      setPassword(table.password || '');
      setTurnCountdown(table.turnCountdown || 20);
      setMinBet(table.minBet || 10);
      setAfterRoundCountdown(table.afterRoundCountdown || 10);
      setDiscardAndDrawTimeout(table.discardAndDrawTimeout || 20);
    }
  }

  function createUpdateTableResult(data) {
    if (data.success) {
      toast.success('Table created/updated successfully!');
      closeModal();
    } else {
      toast.error(data.message || 'Failed to create/update table.');
    }
  }

  function createUpdateTable(tableData) {
    const token = localStorage.getItem(LS_TOKEN);
    if (socket && token) {
      const data = JSON.stringify({
        key: 'createUpdateUserTable',
        token: token,
        tableData,
      });
      socket.send(data);
    }
  }

  const handleCreateTable = () => {
    if (!gameType || !tableName) {
      toast.error('Please fill all required fields.');
      return;
    }
    const tableData = {
      id: tableId,
      game: gameType,
      tableName,
      botCount,
      password,
      turnCountdown,
      minBet,
      afterRoundCountdown,
      discardAndDrawTimeout,
    };
    createUpdateTable(tableData);
  };

  const isFormValid = gameType && tableName;

  return (
    <>
      <Label htmlFor="gameType">{t('GAME_TYPE')}</Label>
      <Select id="gameType" value={gameType} onChange={(e) => setGameType(e.target.value)}>
        <option value="">{t('SELECT_GAME_TYPE')}</option>
        <option value="HOLDEM">{t('HOLDEM')}</option>
        <option value="FIVE_CARD_DRAW">{t('FIVE_CARD_DRAW')}</option>
        <option value="BOTTLE_SPIN">{t('BOTTLE_SPIN')}</option>
      </Select>

      <Label htmlFor="tableName">{t('TABLE_NAME')}</Label>
      <Input
        id="tableName"
        type="text"
        placeholder="Enter table name (max 20 characters)"
        value={tableName}
        maxLength={20}
        onChange={(e) => setTableName(e.target.value)}
      />
      <small style={{ color: '#555', display: 'block', marginTop: '-8px', marginBottom: '10px' }}>
        {t('Table name must be 20 characters or fewer.')}
      </small>

      <Label htmlFor="botCount">Bot Count</Label>
      <Select id="botCount" value={botCount} onChange={(e) => setBotCount(Number(e.target.value))}>
        {[...Array(7).keys()].map((count) => (
          <option key={count} value={count}>
            {count}
          </option>
        ))}
      </Select>

      <Label htmlFor="password">Password</Label>
      <Input
        id="password"
        type="text"
        placeholder="Enter password (optional)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Label htmlFor="turnCountdown">Turn Countdown</Label>
      <Input
        id="turnCountdown"
        type="number"
        value={turnCountdown}
        onChange={(e) => setTurnCountdown(Number(e.target.value))}
      />

      <Label htmlFor="minBet">Minimum Bet</Label>
      <Input
        id="minBet"
        type="number"
        value={minBet}
        onChange={(e) => setMinBet(Number(e.target.value))}
      />

      <Label htmlFor="afterRoundCountdown">After Round Countdown</Label>
      <Input
        id="afterRoundCountdown"
        type="number"
        value={afterRoundCountdown}
        onChange={(e) => setAfterRoundCountdown(Number(e.target.value))}
      />

      <Label htmlFor="discardAndDrawTimeout">Discard and Draw Timeout</Label>
      <Input
        id="discardAndDrawTimeout"
        type="number"
        value={discardAndDrawTimeout}
        disabled={gameType !== 'FIVE_CARD_DRAW'}
        onChange={(e) => setDiscardAndDrawTimeout(Number(e.target.value))}
      />

      <Button className="mt-2" onClick={handleCreateTable} disabled={!isFormValid}>
        {existingTableId > 0 ? t('UPDATE_TABLE') : t('CREATE_TABLE')}
      </Button>
    </>
  );
};

export default CreateTableModal;
