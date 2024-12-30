import React, { useState, useEffect, useContext, useRef } from 'react';
import { toast } from 'react-toastify';
import AuthContext from './authContext';
import socketContext from '@/context/websocket/socketContext';

export const LS_TOKEN = 'TOKEN';

const AuthState = ({ children }) => {
  const { socket, playerId } = useContext(socketContext);

  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [isAuthed, setIsAuthed] = useState(false);

  const isLoggedInRef = useRef(false);

  useEffect(() => {
    const token = localStorage.getItem(LS_TOKEN);
    if (token) {
      if (socket) {
        socket.send(
          JSON.stringify({
            key: 'userParams',
            token: token,
          })
        );
      }
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      regAuthHandler(socket);
    }
  }, [socket]);

  const regAuthHandler = (socket) => {
    socket.handle('userParams', userParams);

    socket.handle('userStatistics', (jsonData) => userStatisticsResults(jsonData.data));
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
    if (socket) {
      socket.send(
        JSON.stringify({
          key: 'userParams',
          token: token,
        })
      );
    }
  }

  function userParams(jsonData) {
    const lData = jsonData.data;
    if (!lData.success) {
      toast.error('You are logged in from another instance, which is forbidden!');
    } else {
      setIsAuthed(true);
    }
  }

  function getLoggedInUserStatistics() {
    const token = localStorage.getItem(LS_TOKEN);
    if (socket && isAuthed && token) {
      const data = JSON.stringify({
        key: 'userStatistics',
        token: token,
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

  function userStatisticsResults(uData) {
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
