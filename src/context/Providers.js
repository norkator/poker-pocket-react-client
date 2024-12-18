import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import GlobalState from './global/GlobalState';
import LocaProvider from './localization/LocaProvider';
import ContentProvider from './content/ContentProvider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ModalProvider from './modal/ModalProvider';
import OfflineProvider from './offline/OfflineProvider';
import WebSocketProvider from './websocket/WebsocketProvider';
import AuthState from './auth/AuthState';
import GameState, { useGameState } from './game/GameState';
import HoldemTableState from '@/context/table/HoldemTableState';
import FCDTableState from '@/context/table/FCDTableState';

const GameStateSelector = ({ children }) => {
  const { currentGame } = useGameState();

  switch (currentGame) {
    case 'Holdem':
      return <HoldemTableState>{children}</HoldemTableState>;
    case 'FiveCardDraw':
      return <FCDTableState>{children}</FCDTableState>;
    default:
      return <div>No game selected</div>;
  }
};

const Providers = ({ children }) => (
  <BrowserRouter>
    <GlobalState>
      <LocaProvider>
        <ContentProvider>
          <ToastContainer />
          <ModalProvider>
            <OfflineProvider>
              <WebSocketProvider>
                <AuthState>
                  <GameState>
                    <GameStateSelector>{children}</GameStateSelector>
                  </GameState>
                </AuthState>
              </WebSocketProvider>
            </OfflineProvider>
          </ModalProvider>
        </ContentProvider>
      </LocaProvider>
    </GlobalState>
  </BrowserRouter>
);

export default Providers;
