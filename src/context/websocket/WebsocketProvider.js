import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import config from '@/clientConfig';
import SocketContext from './socketContext';
import { NewWsSocket } from './wssocket';

const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  // for listening connection hook
  const [socketConnected, setSocketConnected] = useState(null);
  const [socketDisconnected, setSocketDisconnected] = useState(null);

  const playerIdRef = useRef(-1); // CONNECTION_ID = -1;
  const setPlayerId = (val) => {
    playerIdRef.current = val;
  };

  // ----------------------------------------------------
  // From server commands a.k.a. messages
  const onMessageHandler = (socket) => {
    socket.handle('connected', connectedResult);
    socket.handle('onXPGained', (jsonData) => {
      onXPGained(jsonData.code, jsonData.data);
    });
    socket.handle('clientMessage', (jsonData) => {
      clientMessage(jsonData.data);
    });
  };

  function connectedResult(jsonData) {
    setSocketConnected({});
    setPlayerId(Number(jsonData.data.playerId));
  }

  // Notify front end of gaining more xp
  function onXPGained(responseCode, xData) {
    if (Number(responseCode) === 200) {
      toast.info('+' + xData.xpGainedAmount + 'XP gained due ' + xData.xpMessage);
    }
  }

  // Show incoming message straight on UI
  function clientMessage(cData) {
    toast.info(cData.message);
  }

  useEffect(() => {
    window.addEventListener('beforeunload', () => cleanUp);
    window.addEventListener('beforeclose', () => cleanUp);

    socket || connect();

    return () => {
      window.removeEventListener('beforeunload', cleanUp);
      window.removeEventListener('beforeclose', cleanUp);

      cleanUp('callback');
    };
  }, []);

  function cleanUp(reason) {
    if (socket) {
      const webSocket = socket;
      setSocketDisconnected();
      setSocket(null);
      webSocket.close();
    }
  }

  const connect = () => {
    console.log('Using url: ' + config.socketURI);

    NewWsSocket(
      config.socketURI,
      (wsSocket) => {
        onMessageHandler(wsSocket);
        setSocket(wsSocket);
        // window.socket = wsSocket;
      },
      (wsSocket) => {
        toast.error('WebSocket closed!');
        cleanUp('WebSocket closed!');
      }
    );
  };

  const reconnect = () => {
    cleanUp('reconnect') || connect();
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        socketConnected,
        socketDisconnected,
        playerId: playerIdRef.current,
        setPlayerId,
        reconnect,
        cleanUp,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default WebSocketProvider;
