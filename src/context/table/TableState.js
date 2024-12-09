import React, { useState, useEffect, useContext, useRef } from 'react';
import RoomContext from './tableContext';
import socketContext from '@/context/websocket/socketContext';
import authContext from '@/context/auth/authContext';
import NewRoom, {
  NewRoomInfo,
  NewBoard,
  NewCtrl,
  initBoard,
  initCtrl,
  roomUpdate,
} from '@/components/game/domains/Room';
import { initSeats } from '@/components/game/domains/Seat';
import Player from '@/components/game/domains/Player';
import {
  playChipsHandleFive,
  playCollectChipsToPot,
  playCardFoldOne,
  playCheckSound,
  playCardPlaceChipsOne,
  playCardSlideSix,
} from '@/components/audio';
import { setupSeats } from '@/components/game/domains/Seat';

// let autoPlay = false; // Set true makes logged in player play automatically
let tempPlayers = [];

const TableState = ({ children }) => {
  const { socket, playerId, socketDisconnected } = useContext(socketContext);
  const { setMyDashboardDataRefresh } = useContext(authContext);

  const [enableSounds, setEnableSounds] = useState(true);
  const [autoCheck, setAutoCheck] = useState(false);

  // Set true makes logged in player play automatically
  const [autoPlay, setAutoPlay] = useState(false);

  const [tableId, setTableId] = useState(-1);
  const [players, setPlayers] = useState(null);
  const [heroTurn, setHeroTurn] = useState({ data: null });

  const [actionButtonsEnabled, setActionButtonsEnabled] = useState(false);

  const [roomInfo, setRoomInfo] = useState({ data: NewRoomInfo() });
  const [board, setBoard] = useState({ data: NewBoard(enableSounds) });
  const [ctrl, setCtrl] = useState({ data: NewCtrl(enableSounds) });

  const roomRef = useRef(NewRoom(NewRoomInfo(), NewBoard(enableSounds), NewCtrl(enableSounds)));

  const seatsRef = useRef(setupSeats());
  const [seats, setSeats] = useState({ data: seatsRef.current });

  useEffect(() => {
    setPlayers(null);
  }, [socketDisconnected]);

  const playerIdRef = useRef(-1);

  useEffect(() => {
    if (socket) {
      regRoomHandler(socket);
    }
  }, [socket]);

  useEffect(() => {
    playerIdRef.current = playerId;
  }, [playerId]);

  const cardSetDelayMillis = 300;

  function regRoomHandler(socket) {
    // Example: {"playerCount":3,"roomMinBet":10,"middleCards":["Q♠","6♦","9♠","4♠"],"playersData":[{"playerId":0,"playerName":"Bot362","playerMoney":6462.5,"isDealer":false},{"playerId":1,"playerName":"Bot265","playerMoney":9902.5,"isDealer":false},{"playerId":2,"playerName":"Bot966","playerMoney":13500,"isDealer":true}]}
    socket.handle('tableParams', (jsonData) => tableParameters(jsonData.data));

    // Hole Cards  ({"players":[{"playerId":0,"cards":["3♠","4♥"]}]})
    socket.handle('holeCards', (jsonData) => holeCards(jsonData.data));

    // Status update ({"totalPot":30,"currentStatus":"Betting round 4","middleCards":["2♦","4♥","5♦","A♠","3♠"],"playersData":[{"playerId":1,"playerName":"Anon250","playerMoney":10000,"totalBet":0,"isPlayerTurn":false,"isFold":true,"timeBar":0},{"playerId":2,"playerName":"Anon93","playerMoney":9970,"totalBet":30,"isPlayerTurn":true,"isFold":false,"timeBar":0}],"isCallSituation":false,"isResultsCall":false})
    socket.handle('statusUpdate', (jsonData) => statusUpdate(jsonData.data));

    // Example: {"playerId":0,"actionText":"raise"}
    socket.handle('lastUserAction', (jsonData) => playerLastActionHandler(jsonData.data));

    // The Flop (theFlop: {"middleCards":["8♣","5♣","2♥"]})
    socket.handle('theFlop', (jsonData) => theFlop(jsonData.data));

    // The turn (theTurn: {"middleCards":["Q♦","J♥","3♥","6♠"]})
    socket.handle('theTurn', (jsonData) => theTurn(jsonData.data));

    // The river (theRiver: {"middleCards":["8♥","8♦","J♣","J♠","7♣"]})
    socket.handle('theRiver', (jsonData) => theRiver(jsonData.data));

    socket.handle('collectChipsToPot', (jsonData) => collectChipsToPotAction());

    // Example: {"players":[{"playerId":0,"cards":["6♦","A♦"]},{"playerId":1,"cards":["7♣","7♠"]}]}
    socket.handle('allPlayersCards', (jsonData) => allPlayersCards(jsonData.data));

    socket.handle('audioCommand', (jsonData) => audioCommand(jsonData.data));
  }

  // init room data
  const tableParameters = (rData) => {
    setMyDashboardDataRefresh({}); // Added so refreshing xp needed counter updates automatically

    initBoard(roomRef.current.board);
    initCtrl(roomRef.current.ctrl);
    initSeats(seatsRef.current);

    boardParser(rData, roomRef.current.board);
    playerParser(rData);

    setRoomInfo({ data: roomRef.current.roomInfo });
    setBoard({ data: roomRef.current.board });
    setSeats({ data: seatsRef.current });
  };

  const boardParser = (rData, board) => {
    board.setMinBet(rData.roomMinBet);

    const gameStarted = rData.gameStarted;
    if (rData.middleCards?.length > 0) {
      for (let m = 0; m < rData.middleCards.length; m++) {
        board.setMiddleCard(m, rData.middleCards[m], gameStarted);
      }
    }
  };

  const playerParser = (rData) => {
    const gameStarted = rData.gameStarted;
    const playerCount = rData.playerCount;

    var playerIds = [],
      playerNames = [],
      playerMoneys = [],
      playerIsDealer = [];
    for (let i = 0; i < rData.playersData.length; i++) {
      playerIds.push(Number(rData.playersData[i].playerId));
      playerNames.push(rData.playersData[i].playerName);
      playerMoneys.push(Number(rData.playersData[i].playerMoney));
      playerIsDealer.push(rData.playersData[i].isDealer);
    }

    switch (playerCount) {
      case 1:
        giveSeats(
          playerCount,
          [0],
          playerIds,
          playerNames,
          playerMoneys,
          playerIsDealer,
          gameStarted
        );
        break;
      case 2:
        giveSeats(
          playerCount,
          [0, 3],
          playerIds,
          playerNames,
          playerMoneys,
          playerIsDealer,
          gameStarted
        );
        break;
      case 3:
        giveSeats(
          playerCount,
          [0, 2, 3],
          playerIds,
          playerNames,
          playerMoneys,
          playerIsDealer,
          gameStarted
        );
        break;
      case 4:
        giveSeats(
          playerCount,
          [0, 2, 3, 5],
          playerIds,
          playerNames,
          playerMoneys,
          playerIsDealer,
          gameStarted
        );
        break;
      case 5:
        giveSeats(
          playerCount,
          [0, 1, 2, 3, 5],
          playerIds,
          playerNames,
          playerMoneys,
          playerIsDealer,
          gameStarted
        );
        break;
      case 6:
        giveSeats(
          playerCount,
          [0, 1, 2, 3, 4, 5, 6],
          playerIds,
          playerNames,
          playerMoneys,
          playerIsDealer,
          gameStarted
        );
        break;
      default:
        break;
    }
  };

  function giveSeats(
    playerCount,
    seatPositions,
    playerIds,
    playerNames,
    playerMoneys,
    playerIsDealer,
    gameStarted
  ) {
    tempPlayers = []; // initialize array

    const players = tempPlayers;
    for (let i = 0; i < playerCount; i++) {
      players.push(
        new Player(seats.data[seatPositions[i]], playerIds[i], playerNames[i], playerMoneys[i])
      );
      const player = players[i];
      player.initPlayer(gameStarted);
      if (playerIsDealer[i]) {
        player.setPlayerAsDealer();
      }
    }

    return players;
  }

  const statusPlayerUpdate = (sData, players) => {
    for (let i = 0; i < sData.playersData.length; i++) {
      const playerRaw = sData.playersData[i];
      const pMoney = playerRaw.playerMoney;
      const pTotalBet = playerRaw.totalBet;
      const pTurn = playerRaw.isPlayerTurn;
      const pIsFold = playerRaw.isFold;
      // const pTimeBar = playerRaw.timeBar;
      const pTimeLeft = playerRaw.timeLeft;

      const pId = playerRaw.playerId;

      let player = players[i];
      if (player == null) {
        // problem occure
        // console.error('player null', i);
      }

      player.setTimeBar(pTimeLeft);
      if (Number(pId) === Number(playerIdRef.current) && player.tempBet > 0) {
        // Hero Do nothing
      } else {
        player.setPlayerMoney(pMoney);
        if (!sData.collectingPot) {
          player.setPlayerTotalBet(pTotalBet);
        }
      }
      if (pIsFold) {
        if (!player.isFold) {
          if (enableSounds) {
            playCardFoldOne.play();
          }
          player.setPlayerFold();
        }
      }

      if (Number(pId) === Number(playerIdRef.current)) {
        // Hero
        player.setPlayerTurn(pTurn, sData.isCallSituation);
        roomRef.current.ctrl.actionBtnVisibility(pTurn, false);

        setActionButtonsEnabled(true);
        if (pTurn) {
          setHeroTurn({ data: player });
        }
      }
    }
    if (sData.isResultsCall) {
      // showdown round
      if (enableSounds) {
        playChipsHandleFive.play();
      }

      let isPlaySound = false;

      for (let i = 0; i < players.length; i++) {
        const player = players[i];

        player.tempBet = 0;
        player.setPlayerTotalBet(0);
        if (player.playerId !== playerIdRef.current) {
          // villain
          if (!player.isFold) {
            player.setPlayerCards();
            player.setShowCards(true);
            isPlaySound = true;
          }
        }
        for (let w = 0; w < sData.roundWinnerPlayerIds.length; w++) {
          if (Number(sData.roundWinnerPlayerIds[w]) === Number(player.playerId)) {
            player.startWinnerGlowAnimation();
            if (sData.roundWinnerPlayerCards) {
              let cl = sData.roundWinnerPlayerCards.length;
              for (let c = 0; c < cl; c++) {
                player.startWinnerGlowCardsAnimation(
                  sData.roundWinnerPlayerCards[c],
                  roomRef.current.board
                );
              }
            }
          }
        }
      }

      if (isPlaySound && enableSounds) {
        playCardSlideSix.play();
      }
    }

    setPlayers(players);
  };

  const statusUpdate = (sData) => {
    roomUpdate(sData, roomRef.current);
    setRoomInfo({ data: roomRef.current.roomInfo });
    setCtrl({ data: roomRef.current.ctrl });
    statusPlayerUpdate(sData, tempPlayers);
    setSeats({ data: seats.data });
    setBoard({ data: roomRef.current.board });
  };

  // ----------------------------------------------------
  const holeCards = (pData) => {
    const players = tempPlayers;
    for (let p = 0; p < pData.players.length; p++) {
      for (let i = 0; i < players.length; i++) {
        const playerRaw = pData.players[p];

        const player = players[i];
        if (Number(player.playerId) === Number(playerRaw.playerId)) {
          player.playerCards.push(playerRaw.cards[0]);
          player.playerCards.push(playerRaw.cards[1]);
          player.setPuffInFastEnabled(true);
        }
      }
    }
    holeCardsAsync(players);
  };

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  async function holeCardsAsync(players) {
    for (let c = 0; c < 2; c++) {
      for (let i = 0; i < players.length; i++) {
        const player = players[i];
        if (!player.isFold) {
          await sleep(cardSetDelayMillis);
          player.setPlayerCard(c);
          setSeats({ data: seats.data });
          if (enableSounds) {
            playCardSlideSix.play();
          }
        }
      }
    }
  }

  // Handles last player action animation
  function playerLastActionHandler(aData) {
    const players = tempPlayers;
    for (let i = 0; i < players.length; i++) {
      const player = players[i];
      const playerSeat = player.playerSeat;

      if (playerSeat.seatLastAction != null) {
        playerSeat.setLastAction(null);
        playerSeat.refreshLastAction = {};
      }
      if (player.playerId === aData.playerId) {
        playerSeat.setLastAction(aData.actionText);
        playerSeat.refreshLastAction = {};
      }
    }
    setSeats({ data: seats.data });
  }

  async function theFlop(fData) {
    const players = tempPlayers;
    for (let i = 0; i < players.length; i++) {
      players[i].setPuffInFastEnabled(false);
    }
    const board = roomRef.current.board;
    board.middleCardsPuffIn = [false, false, false, false, false];
    setBoard({ data: { ...board } });
    for (let i = 0; i < 3; i++) {
      board.middleCards[i] = fData.middleCards[i];
      board.middleCardsPuffIn[i] = true;
      setBoard({ data: { ...board } });
      if (enableSounds) {
        playCardSlideSix.play();
      }
      await new Promise((resolve) => setTimeout(resolve, cardSetDelayMillis));
    }
  }

  async function theTurn(tData) {
    const board = roomRef.current.board;
    board.middleCards[3] = tData.middleCards[3];
    board.middleCardsPuffIn[3] = true;
    setBoard({ data: { ...board } });
    playCardSlideSix.play();
  }

  function theRiver(rData) {
    const board = roomRef.current.board;
    board.middleCards[4] = rData.middleCards[4];
    board.middleCardsPuffIn[4] = true;
    setBoard({ data: { ...board } });
    if (enableSounds) {
      playCardSlideSix.play();
    }
  }

  // Backend want's to run collect chips to pot animation
  const collectChipsToPotAction = () => {
    //toastr["info"]("Collect chips action call");
    if (enableSounds) {
      playCollectChipsToPot.play();
    }
    const players = tempPlayers;
    for (let i = 0; i < players.length; i++) {
      const player = players[i];
      if (player.playerTotalBet > 0) {
        player.playerSeat.seatCollectChipsToPot();
      }
    }
  };

  // Receive all players cards before results for showing them
  function allPlayersCards(cData) {
    const players = tempPlayers;
    for (let p = 0; p < cData.players.length; p++) {
      for (let i = 0; i < players.length; i++) {
        const playRaw = cData.players[p];
        const player = players[i];

        if (Number(player.playerId) === Number(playRaw.playerId)) {
          player.playerCards = []; // clear first
          player.playerCards.push(playRaw.cards[0]);
          player.playerCards.push(playRaw.cards[1]);
        }
      }
    }
  }

  function audioCommand(aData) {
    if (enableSounds) {
      switch (aData.command) {
        case 'fold':
          playCardFoldOne.play();
          break;
        case 'check':
          playCheckSound.play();
          break;
        case 'call':
          playCardPlaceChipsOne.play();
          break;
        case 'raise':
          playCardPlaceChipsOne.play();
          break;
        default:
          break;
      }
    }
  }

  // eslint-disable-next-line prettier/prettier
  return (
    <RoomContext.Provider
      value={{
        tableId,
        setTableId,
        players,
        setPlayers,
        heroTurn,
        setHeroTurn,
        enableSounds,
        setEnableSounds,
        actionButtonsEnabled,
        setActionButtonsEnabled,
        autoPlay,
        setAutoPlay,
        autoCheck,
        setAutoCheck,
        board,
        setBoard,
        roomInfo,
        setRoomInfo,
        ctrl,
        setCtrl,
        seats,
        setSeats,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export default TableState;
