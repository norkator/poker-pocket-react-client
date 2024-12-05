import React from 'react';
import Providers from '@/context/Providers';
import BaseRouter from '@/components/routing/BaseRouter';

const App = () => {
  return (
    <Providers>
      <BaseRouter />
    </Providers>
  );
};

export default App;
