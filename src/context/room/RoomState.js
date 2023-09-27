import React, { useEffect, useContext, useRef } from 'react';
import RoomContext from './roomContext';
import gameContext from '@/context/game/gameContext';
import socketContext from '@/context/websocket/socketContext';
import NewRoom, {
  NewRoomInfo,
  NewBoard,
  NewCtrl,
  initRoom,
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

let players = [];

const RoomState = ({ children }) => {
  const { connId, regRoomHandler } = useContext(socketContext);

  const {
    setHeroTurn,
    setPlayers,
    enableSounds,
    autoPlay,
    setActionButtonsEnabled,
    autoPlayCommandRequested,
    setRoomInfo,
    setBoard,
    setCtrl,
    seats,
    setSeats,
  } = useContext(gameContext);

  const connIdRef = useRef(-1);
  const room = useRef(NewRoom(NewRoomInfo(), NewBoard(enableSounds), NewCtrl(enableSounds)));

  useEffect(() => {
    // console.log('reg onRoomHandler');
    regRoomHandler(onRoomHandler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    connIdRef.current = connId;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connId]);

  function onRoomHandler(jsonData) {
    // console.log('onRoomHandler jsonData', jsonData);
    if (!jsonData) return;

    switch (jsonData.key) {
      case 'roomParams':
        // Example: {"playerCount":3,"roomMinBet":10,"middleCards":["Q♠","6♦","9♠","4♠"],"playersData":[{"playerId":0,"playerName":"Bot362","playerMoney":6462.5,"isDealer":false},{"playerId":1,"playerName":"Bot265","playerMoney":9902.5,"isDealer":false},{"playerId":2,"playerName":"Bot966","playerMoney":13500,"isDealer":true}]}
        roomParameters(jsonData.data);
        break;
      case 'holeCards':
        // Hole Cards  ({"players":[{"playerId":0,"cards":["3♠","4♥"]}]})
        holeCards(jsonData.data);
        break;
      case 'statusUpdate':
        // Status update ({"totalPot":30,"currentStatus":"Betting round 4","middleCards":["2♦","4♥","5♦","A♠","3♠"],"playersData":[{"playerId":1,"playerName":"Anon250","playerMoney":10000,"totalBet":0,"isPlayerTurn":false,"isFold":true,"timeBar":0},{"playerId":2,"playerName":"Anon93","playerMoney":9970,"totalBet":30,"isPlayerTurn":true,"isFold":false,"timeBar":0}],"isCallSituation":false,"isResultsCall":false})
        statusUpdate(jsonData.data);
        break;
      case 'lastUserAction':
        // Example: {"playerId":0,"actionText":"raise"}
        playerLastActionHandler(jsonData.data);
        break;
      case 'theFlop':
        // The Flop (theFlop: {"middleCards":["8♣","5♣","2♥"]})
        theFlop(jsonData.data);
        break;
      case 'theTurn':
        // The turn (theTurn: {"middleCards":["Q♦","J♥","3♥","6♠"]})
        theTurn(jsonData.data);
        break;
      case 'theRiver':
        // The river (theRiver: {"middleCards":["8♥","8♦","J♣","J♠","7♣"]})
        theRiver(jsonData.data);
        break;
      case 'collectChipsToPot':
        collectChipsToPotAction();
        break;
      case 'allPlayersCards':
        // Example: {"players":[{"playerId":0,"cards":["6♦","A♦"]},{"playerId":1,"cards":["7♣","7♠"]}]}
        allPlayersCards(jsonData.data);
        break;
      case 'audioCommand':
        audioCommand(jsonData.data);
        break;
      default:
        return false;
    }
    return true;
  }

  // init room data
  const roomParameters = (rData) => {
    console.log('Room params: ', JSON.stringify(rData));

    initRoom(room.current);
    initSeats(seats.data);
    // getLoggedInUserStatistics(); // Added so refreshing xp needed counter updates automatically
    roomStatusParser(rData);
    boardParser(rData);
    setRoomInfo({ data: room.current.roomInfo });
    setBoard({ data: room.current.board });

    playerParser(rData);
    setSeats({ data: seats.data });
  };

  const roomStatusParser = (rData) => {};

  const boardParser = (rData) => {
    const board = room.current.board;
    board.setMinBet(rData.roomMinBet);

    const gameStarted = rData.gameStarted;
    if (rData.middleCards?.length > 0) {
      for (let m = 0; m < rData.middleCards.length; m++) {
        board.middleCards[m] = rData.middleCards[m];
        board.setMiddleCard(m, gameStarted);
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
    players = []; // initialize array

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
        // console.log('player null', i);
      }

      player.setTimeBar(pTimeLeft);
      if (Number(pId) === Number(connIdRef.current) && player.tempBet > 0) {
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

      if (Number(pId) === Number(connIdRef.current)) {
        // Hero
        player.setPlayerTurn(pTurn, sData.isCallSituation);
        room.current.ctrl.actionBtnVisibility(pTurn, false);

        setActionButtonsEnabled(true);
        if (pTurn && autoPlay && !autoPlayCommandRequested) {
          // getAutoPlayAction();
        }
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
        if (player.playerId !== connIdRef.current) {
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
              console.log(sData.roundWinnerPlayerCards);
              console.log(room.current.board);
              let cl = sData.roundWinnerPlayerCards.length;
              for (let c = 0; c < cl; c++) {
                player.startWinnerGlowCardsAnimation(
                  sData.roundWinnerPlayerCards[c],
                  room.current.board
                );
              }
            }
          }
        }
      }

      if (isPlaySound) {
        playCardSlideSix.play();
      }
    }

    setPlayers(players);
  };

  const statusUpdate = (sData) => {
    // console.log('statusUpdate ', sData);

    roomUpdate(sData, room.current);
    setRoomInfo({ data: room.current.roomInfo });
    setCtrl({ data: room.current.ctrl });
    statusPlayerUpdate(sData, players);
    setSeats({ data: seats.data });
    setBoard({ data: room.current.board });
  };

  // ----------------------------------------------------
  const holeCards = (pData) => {
    for (let p = 0; p < pData.players.length; p++) {
      for (let i = 0; i < players.length; i++) {
        const playerRaw = pData.players[p];

        const player = players[i];
        if (Number(player.playerId) === Number(playerRaw.playerId)) {
          player.playerCards.push(playerRaw.cards[0]);
          player.playerCards.push(playerRaw.cards[1]);
        }
      }
    }
    holeCardsAsync(players);
  };

  async function holeCardsAsync(players) {
    let isPlaySound = false;
    for (let c = 0; c < 2; c++) {
      for (let i = 0; i < players.length; i++) {
        const player = players[i];
        if (!player.isFold) {
          // await sleep(300);
          player.setPlayerCards();
          player.setShowCards(false);
          isPlaySound = true;
        }
      }
    }

    if (isPlaySound) {
      playCardSlideSix.play();
    }
  }

  // Handles last player action animation
  function playerLastActionHandler(aData) {
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
    const board = room.current.board;
    board.middleCards[0] = fData.middleCards[0];
    board.middleCards[1] = fData.middleCards[1];
    board.middleCards[2] = fData.middleCards[2];
    setBoard({ data: board });
  }

  async function theTurn(tData) {
    const board = room.current.board;
    board.middleCards[3] = tData.middleCards[3];
    setBoard({ data: board });
  }

  function theRiver(rData) {
    const board = room.current.board;
    board.middleCards[4] = rData.middleCards[4];
    setBoard({ data: board });
  }

  // Backend want's to run collect chips to pot animation
  const collectChipsToPotAction = () => {
    //toastr["info"]("Collect chips action call");
    if (enableSounds) {
      playCollectChipsToPot.play();
    }
    for (let i = 0; i < players.length; i++) {
      const player = players[i];
      if (player.playerTotalBet > 0) {
        player.playerSeat.seatCollectChipsToPot();
      }
    }
  };

  // Receive all players cards before results for showing them
  function allPlayersCards(cData) {
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
      value={{}}
    >
      {children}
    </RoomContext.Provider>
  );
};

export default RoomState;
