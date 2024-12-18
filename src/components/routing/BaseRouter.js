import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import HoldemPage from '@/pages/HoldemPage';
import GamesPage from '@/pages/GamesPage';
import FiveCardDrawPage from '@/pages/FiveCardDrawPage';
import { useGameState } from '@/context/game/GameState';

const AppRoute = ({ component: Component, layout: Layout, ...rest }) => {
  return (
    <Layout {...rest}>
      <Component {...rest} />
    </Layout>
  );
};

const BaseRouter = () => {
  const { setCurrentGame } = useGameState();

  useEffect(() => {
    const pathToGameMap = {
      '/holdem': 'Holdem',
      '/fivecarddraw': 'FiveCardDraw',
    };

    // eslint-disable-next-line no-restricted-globals
    const game = pathToGameMap[location.pathname] || 'Holdem';
    setCurrentGame(game);
    // eslint-disable-next-line no-restricted-globals
  }, [location, setCurrentGame]);

  return (
    <Routes>
      <Route path="/" element={<AppRoute component={HoldemPage} layout={MainLayout} />} />
      <Route path="/games" element={<AppRoute component={GamesPage} layout={MainLayout} />} />
      <Route path="/holdem" element={<AppRoute component={HoldemPage} layout={MainLayout} />} />
      <Route
        path="/fivecarddraw"
        element={<AppRoute component={FiveCardDrawPage} layout={MainLayout} />}
      />
    </Routes>
  );
};

export default BaseRouter;
