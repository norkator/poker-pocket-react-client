import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import HoldemPage from '@/pages/HoldemPage';
import GamesPage from '@/pages/GamesPage';
import FiveCardDrawPage from '@/pages/FiveCardDrawPage';
import MyAccountPage from '@/pages/MyAccountPage';
import RankingsPage from '@/pages/RankingsPage';
import BottleSpinPage from '@/pages/BottleSpinPage';

const AppRoute = ({ component: Component, layout: Layout, ...rest }) => {
  return (
    <Layout {...rest}>
      <Component {...rest} />
    </Layout>
  );
};

const BaseRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<AppRoute component={GamesPage} layout={MainLayout} />} />
      <Route path="/games" element={<AppRoute component={GamesPage} layout={MainLayout} />} />
      <Route path="/holdem" element={<AppRoute component={HoldemPage} layout={MainLayout} />} />
      <Route
        path="/fivecarddraw"
        element={<AppRoute component={FiveCardDrawPage} layout={MainLayout} />}
      />
      <Route path="/account" element={<AppRoute component={MyAccountPage} layout={MainLayout} />} />
      <Route path="/rankings" element={<AppRoute component={RankingsPage} layout={MainLayout} />} />
      <Route
        path="/bottlespin"
        element={<AppRoute component={BottleSpinPage} layout={MainLayout} />}
      />
    </Routes>
  );
};

export default BaseRouter;
