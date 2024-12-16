import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import HoldemPage from '@/pages/HoldemPage';
import GamesPage from '@/pages/GamesPage';

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
      <Route path="/" element={<AppRoute component={HoldemPage} layout={MainLayout} />} />
      <Route path="/games" element={<AppRoute component={GamesPage} layout={MainLayout} />} />
    </Routes>
  );
};

export default BaseRouter;
