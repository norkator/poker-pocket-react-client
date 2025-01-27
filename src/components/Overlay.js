import React, { useState, useEffect, useContext } from 'react';
import socketContext from '@/context/websocket/socketContext';
import contentContext from '@/context/content/contentContext';
import { playMaximize006, playMinimize008 } from '@/components/Audio';
import tableContext from '@/context/table/tableContext';

const Overlay = ({ children }) => {
  const { t } = useContext(contentContext);
  const { socket, playerId } = useContext(socketContext);
  const { enableSounds } = useContext(tableContext);
  const [isVisible, setIsVisible] = useState(false);
  const [text, setText] = useState('');

  useEffect(() => {
    if (socket) {
      regAuthHandler(socket);
    }
  }, [socket]);

  const regAuthHandler = (socket) => {
    socket.handle('onXPGained', (jsonData) => xpResult(jsonData.data));
  };

  function xpResult(xpData) {
    const amount = xpData.amount;
    const translationKey = xpData.translationKey;
    showOverlay(`🎉 +${amount} ${t(translationKey)}`);
  }

  const showOverlay = (message) => {
    setText(message);
    setIsVisible(true);
    if (enableSounds) {
      playMaximize006.play();
    }
    setTimeout(() => {
      if (enableSounds) {
        playMinimize008.play();
      }
      setIsVisible(false);
    }, 2000);
  };

  return (
    <>
      {isVisible && (
        <div className="overlay">
          <div className="overlay-content">{text}</div>
        </div>
      )}
      {children(showOverlay)}
    </>
  );
};

export default Overlay;
