import React, { useState, useEffect, useContext, useRef } from 'react';
import { toast } from 'react-toastify';
import AuthContext from './authContext';
import socketContext from '@/context/websocket/socketContext';

const AuthState = ({ children }) => {
  const { socket, connId } = useContext(socketContext);

  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [isAuthed, setIsAuthed] = useState(false);

  const isLoggedInRef = useRef(false);

  useEffect(() => {
    if (socket) {
      regAuthHandler(socket);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  const regAuthHandler = (socket) => {
    socket.handle('loggedInUserParamsResult', loggedInUserParamsResult);
    // Example: {"name":"Admin","money":79050,"winCount":1,"loseCount":6,"achievements":[{"name":"Starter","description":"Starter's achievement from good start.","icon_name":"achievement_starter"},{"name":"Test achievement","description":"Second achievement","icon_name":"achievement_starter"}]}
    socket.handle('loggedInUserStatisticsResults', (jsonData) =>
      loggedInUserStatisticsResults(jsonData.data)
    );
  };

  useEffect(() => {
    if (isLoggedIn) {
      isLoggedInRef.current = true;
      setLoggedInUserParams(isLoggedIn);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  useEffect(() => {
    if (isAuthed) {
      getLoggedInUserStatistics();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthed]);

  // Login related functions
  function setLoggedInUserParams(isLoggedIn) {
    // SHA3-512
    var username = isLoggedIn.username;
    var passwordHash = isLoggedIn.password;
    if (socket) {
      socket.send(
        JSON.stringify({
          connectionId: connId,
          key: 'loggedInUserParams',
          name: username,
          password: passwordHash,
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
        connectionId: connId,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
