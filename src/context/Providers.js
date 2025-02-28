import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import GlobalState from './global/GlobalState';
import LocaProvider from './localization/LocaProvider';
import ContentProvider from './content/ContentProvider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ModalProvider from './modal/ModalProvider';
import WebSocketProvider from './websocket/WebsocketProvider';
import AuthState from './auth/AuthState';
import GameState from './game/GameState';
import TableState from '@/context/table/TableState';

const Providers = ({ children }) => (
  <BrowserRouter>
    <GlobalState>
      <LocaProvider>
        <ContentProvider>
          <ToastContainer />
          <ModalProvider>
            <WebSocketProvider>
              <AuthState>
                <GameState>
                  <TableState>{children}</TableState>
                </GameState>
              </AuthState>
            </WebSocketProvider>
          </ModalProvider>
        </ContentProvider>
      </LocaProvider>
    </GlobalState>
  </BrowserRouter>
);

export default Providers;
