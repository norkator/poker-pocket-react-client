import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import contentContext from '@/context/content/contentContext';

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
`;

const CreateTableModal = ({ tableId, context, closeModal }) => {
  const { socketCtx } = context;
  const { socket, playerId } = socketCtx;
  const { t } = useContext(contentContext);

  const [gameType, setGameType] = useState('');
  const [tableName, setTableName] = useState('');
  const [botCount, setBotCount] = useState(0);
  const [password, setPassword] = useState('');
  const [turnCountdown, setTurnCountdown] = useState(20);
  const [minBet, setMinBet] = useState(10);
  const [afterRoundCountdown, setAfterRoundCountdown] = useState(10);
  const [discardAndDrawTimeout, setDiscardAndDrawTimeout] = useState(20);

  function createUpdateTable(tableData) {
    if (socket) {
      const data = JSON.stringify({
        key: 'createTable',
        tableData: tableData,
      });
      socket.send(data);
      toast.success('Table created successfully!');
      closeModal();
    }
  }

  const handleCreateTable = () => {
    if (!gameType || !tableName) {
      toast.error('Please fill all required fields.');
      return;
    }
    const tableData = {
      id: tableId,
      gameType,
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
        placeholder="Enter table name"
        value={tableName}
        onChange={(e) => setTableName(e.target.value)}
      />

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
        disabled={gameType !== 'someSpecificGame'}
        onChange={(e) => setDiscardAndDrawTimeout(Number(e.target.value))}
      />

      <Button className="mt-2" onClick={handleCreateTable}>
        {t('CREATE_TABLE')}
      </Button>
    </>
  );
};

export default CreateTableModal;
