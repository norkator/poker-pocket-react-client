import { playCardTakeOutFromPackageOne, playCardSlideSix } from '@/components/audio';
import { formatMoney } from '@/utils/Money';

export const NewBoard = (enableSounds) => {
  let totalPot = 240;
  let minBet = 100;

  const middleCards = [];
  const middleCardsSlideUp = [];
  for (let m = 0; m < 5; m++) {
    middleCards.push(null);
    middleCardsSlideUp.push(null);
  }

  const resetMiddleCards = () => {
    for (let m = 0; m < middleCards.length; m++) {
      middleCards[m] = null;
      middleCardsSlideUp[m] = false;
    }
  };

  const setMiddleCard = (number, cardStr, isMiddleOfTheGame) => {
    if (enableSounds && !isMiddleOfTheGame) {
      playCardSlideSix.play();
    }

    middleCards[number] = cardStr;
  };

  const startWinnerCardGlowAnimation = (cardNumber) => {
    if (cardNumber < 0 || cardNumber > 4) return;

    middleCardsSlideUp[cardNumber] = true;
  };

  const setTotalPot = (money) => {
    totalPot = money;
  };

  const getTotalPot = () => {
    return totalPot;
  };

  const middleCardsPuffIn = [false, false, false, false, false];

  return {
    middleCards,
    middleCardsSlideUp,
    middleCardsPuffIn,
    setTotalPot,
    getTotalPot,
    resetMiddleCards,
    setMiddleCard,
    startWinnerCardGlowAnimation,
  };
};

export const initBoard = (board) => {
  board.setTotalPot(0);
  board.resetMiddleCards();
};

export const NewRoomInfo = () => {
  let tableName = '♦ Default table';
  let spectatorsCount = '♦ Spectating: 0';
  let waitingPlayersCount = '♦ Waiting: 0';
  let deckStatus = '♦ Deck: -';
  let deckCardsBurned = '♦ Burned: -';
  let minBet = '♦ Min bet: -';
  let roomStatusText = 'Wait for parameters...';
  let roomTurnText = 'No Turn...';

  const setRoomStatusText = (statusStr) => {
    roomStatusText = statusStr;
  };

  const getRoomStatusText = () => {
    return roomStatusText;
  };

  const setRoomTurnText = (turnStr) => {
    roomTurnText = turnStr;
  };

  const getRoomTurnText = () => {
    return roomTurnText;
  };

  const setTableName = (val) => {
    tableName = '♦ ' + val;
  };

  const getTableName = () => {
    return tableName;
  };

  const setRoomSpectatorCount = (val) => {
    spectatorsCount = '♦ Spectating: ' + val;
  };

  const getRoomSpectatorCount = () => {
    return spectatorsCount;
  };

  const setRoomWaitingPlayersCount = (val) => {
    waitingPlayersCount = '♦ Waiting: ' + val;
  };

  const getRoomWaitingPlayersCount = () => {
    return waitingPlayersCount;
  };

  const setRoomDeckStatus = (val) => {
    deckStatus = '♦ Deck: ' + val;
  };

  const getRoomDeckStatus = () => {
    return deckStatus;
  };

  const setRoomDeckBurnedCount = (val) => {
    deckCardsBurned = '♦ Burned: ' + val;
  };

  const getRoomDeckBurnedCount = () => {
    return deckCardsBurned;
  };

  const setMinBet = (money) => {
    minBet = money;
  };

  const getMinBet = () => {
    return `♦ Min bet: ${formatMoney(minBet)}$`;
  };

  return {
    getRoomStatusText,
    getRoomTurnText,
    getTableName,
    getRoomSpectatorCount,
    getRoomWaitingPlayersCount,
    getRoomDeckStatus,
    getRoomDeckBurnedCount,
    getMinBet,
    setRoomStatusText,
    setRoomTurnText,
    setTableName,
    setRoomSpectatorCount,
    setRoomWaitingPlayersCount,
    setRoomDeckStatus,
    setRoomDeckBurnedCount,
    setMinBet,
  };
};

export const NewCtrl = (enableSounds) => {
  let isFoldBtn = true;
  let isCheckBtn = true;
  let isRaiseBtn = true;
  let isCallSituation = true;

  const toggleCheckAndCall = (val) => {
    isCallSituation = val;
  };

  const actionBtnVisibility = (visible, isInit) => {
    if (visible) {
      if (!isFoldBtn && !isInit) {
        if (enableSounds) {
          playCardTakeOutFromPackageOne.play();
        }
      }
      isFoldBtn = true;
      isCheckBtn = true;
      isRaiseBtn = true;
    } else {
      if (isFoldBtn && !isInit) {
        if (enableSounds) {
          playCardTakeOutFromPackageOne.play();
        }
      }
      isFoldBtn = false;
      isCheckBtn = false;
      isRaiseBtn = false;
    }
  };

  return {
    isCallSituation,
    isFoldBtn,
    isCheckBtn,
    isRaiseBtn,
    toggleCheckAndCall,
    actionBtnVisibility,
  };
};

export const initCtrl = (ctrl) => {
  ctrl.actionBtnVisibility(false, true);
};

const NewRoom = (roomInfo, board, ctrl) => {
  return {
    roomInfo,
    board,
    ctrl,
  };
};

// ----------------------------------------------------
export const roomUpdate = (sData, room) => {
  const roomInfo = room.roomInfo;
  roomInfo.setRoomStatusText(sData.currentStatus);
  roomInfo.setRoomTurnText(sData.currentTurnText);
  roomInfo.setTableName(sData.tableName);
  roomInfo.setRoomSpectatorCount(sData.spectatorsCount);
  roomInfo.setRoomWaitingPlayersCount(sData.appendPlayersCount);
  roomInfo.setRoomDeckStatus(sData.deckStatus);
  roomInfo.setRoomDeckBurnedCount(sData.deckCardsBurned);
  roomInfo.setMinBet(sData.tableMinBet);

  const board = room.board;
  board.setTotalPot(sData.totalPot);

  const ctrl = room.ctrl;
  ctrl.toggleCheckAndCall(sData.isCallSituation);
};

export default NewRoom;
