import React, { createContext, useContext, useState } from 'react';

const GameContext = createContext();

export const useGameState = () => useContext(GameContext);

const GameState = ({ children }) => {
  const [currentGame, setCurrentGame] = useState('Holdem');

  return (
    <GameContext.Provider value={{ currentGame, setCurrentGame }}>{children}</GameContext.Provider>
  );
};

export default GameState;
