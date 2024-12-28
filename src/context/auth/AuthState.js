import React, { useState, useEffect, useContext, useRef } from 'react';
import { toast } from 'react-toastify';
import AuthContext from './authContext';
import socketContext from '@/context/websocket/socketContext';

const LS_TOKEN = 'TOKEN';

const AuthState = ({ children }) => {
  const { socket, playerId } = useContext(socketContext);

  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [isAuthed, setIsAuthed] = useState(false);

  const isLoggedInRef = useRef(false);

  useEffect(() => {
    if (socket) {
      regAuthHandler(socket);
    }
  }, [socket]);

  const regAuthHandler = (socket) => {
    socket.handle('loggedInUserParamsResult', loggedInUserParamsResult);

    socket.handle('loggedInUserStatisticsResults', (jsonData) =>
      loggedInUserStatisticsResults(jsonData.data)
    );
  };

  useEffect(() => {
    if (isLoggedIn) {
      isLoggedInRef.current = true;
      setLoggedInUserParams(isLoggedIn);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isAuthed) {
      getLoggedInUserStatistics();
    }
  }, [isAuthed]);

  function setLoggedInUserParams(isLoggedIn) {
    const token = isLoggedIn.token;
    localStorage.setItem(LS_TOKEN, token);
    if (socket) {
      socket.send(
        JSON.stringify({
          key: 'loggedInUserParams',
          token: token,
        })
      );
    }
  }

  function loggedInUserParamsResult(jsonData) {
    const lData = jsonData.data;
    if (!lData.result) {
      toast.error('You are logged in from another instance, which is forbidden!');
    } else {
      setIsAuthed(true);
    }
  }

  function getLoggedInUserStatistics() {
    if (socket && isAuthed) {
      const data = JSON.stringify({
        key: 'loggedInUserStatistics',
      });
      socket.send(data);
    }
  }

  const [myDashboardRefresh, setMyDashboardDataRefresh] = useState(null);
  const [myDashboardData, setMyDashboardData] = useState(null);
  const [xpNeededForNextMedal, setXpNeededForNextMedal] = useState(null);

  useEffect(() => {
    getLoggedInUserStatistics();
  }, [myDashboardRefresh]);

  function loggedInUserStatisticsResults(uData) {
    setMyDashboardData(uData);
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        isAuthed,
        setIsAuthed,
        myDashboardData,
        myDashboardRefresh,
        setMyDashboardDataRefresh,
        xpNeededForNextMedal,
        setXpNeededForNextMedal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthState;
