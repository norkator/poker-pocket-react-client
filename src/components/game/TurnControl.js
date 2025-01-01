import React, { useEffect, useContext, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import socketContext from '@/context/websocket/socketContext';
import tableContext from '@/context/table/tableContext';
import { playCardPlaceChipsOne } from '@/components/Audio';
import contentContext from '@/context/content/contentContext';

const StyledBetBtn = ({ onClick, label }) => {
  return (
    <button onClick={onClick} type="button" className="btn btn-danger" style={{ margin: '0 2px' }}>
      {label}
    </button>
  );
};

const StyledActBtn = ({ className, onClick, label }) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`btn btn-danger ${className || ''}`}
      style={{ margin: '0 2px' }}
    >
      {label}
    </button>
  );
};

const TurnControl = () => {
  const { t } = useContext(contentContext);
  const { socket, playerId } = useContext(socketContext);
  const { tableId, ctrl, players, heroTurn, autoCheck, autoPlay, refreshSeats } =
    useContext(tableContext);

  const [enableSounds] = useState(true);

  useEffect(() => {
    if (socket) {
      socket.handle('autoPlayActionResult', (jsonData) => autoPlayActionResult(jsonData.data));
    }
  }, [autoPlayActionResult, socket, tableId]);

  useEffect(() => {
    const hero = heroTurn.data;
    if (autoCheck && hero && hero.isPlayerTurn) {
      checkBtnClick(hero);
    }
  }, [autoCheck, checkBtnClick, heroTurn]);

  const autoPlayCommandRequested = useRef(null);

  useEffect(() => {
    const hero = heroTurn.data;
    if (autoPlay && hero && hero.isPlayerTurn && !autoPlayCommandRequested.current) {
      getAutoPlayAction();
    }
  }, [autoPlay, getAutoPlayAction, heroTurn]);

  // If autoplay enabled, request action via this function
  function getAutoPlayAction() {
    if (socket) {
      autoPlayCommandRequested.current = true;
      const data = JSON.stringify({
        key: 'autoPlayAction',
      });
      socket.send(data);
    }
  }

  // AutoPlay action result parser
  function autoPlayActionResult(aData) {
    // console.log(JSON.stringify(aData));
    // example {"action":"bot_call","amount":0}
    console.log('AutoPlay action: ' + aData.action);

    switch (aData.action) {
      case 'bot_fold':
        setFold();
        break;
      case 'bot_check':
        setCheck();
        break;
      case 'bot_call':
        setCheck();
        break;
      case 'bot_raise':
        setRaise(aData.amount);
        break;
      case 'remove_bot':
        toast.warn(t('INSUFFICIENT_FUNDS'));
        leaveTable();
        break;
      default:
        setCheck();
        break;
    }
    autoPlayCommandRequested.current = false; // reset always
  }

  function leaveTable() {
    if (socket) {
      const data = JSON.stringify({
        key: 'leaveTable',
        tableId: tableId,
      });
      socket.send(data);
    }
  }

  function setFold() {
    if (socket) {
      const data = JSON.stringify({
        key: 'setFold',
        tableId: tableId,
      });
      socket.send(data);
    }
  }

  function setCheck() {
    if (socket) {
      const data = JSON.stringify({
        key: 'setCheck',
        tableId: tableId,
      });
      socket.send(data);
    }
  }

  function setRaise(amount) {
    if (socket && amount > 0) {
      const data = JSON.stringify({
        key: 'setRaise',
        tableId: tableId,
        amount: amount,
      });
      socket.send(data);
    }
  }

  function raiseHelper(amount, allIn) {
    for (let i = 0; i < players.length; i++) {
      const player = players[i];
      if (player.playerId === playerId && player.isPlayerTurn && Number(player.playerMoney) > 0) {
        if (!allIn) {
          if (player.playerMoney + player.tempBet > 0) {
            const playerTotalBet = player.playerTotalBet + amount;
            const playerMoney = player.playerMoney - amount;
            player.tempBet = player.tempBet + amount;
            player.setPlayerMoney(playerMoney);
            player.setPlayerTotalBet(playerTotalBet);
          } else {
            toast.error('Not enough money to raise!');
            return;
          }
        } else {
          const playerTotalBet = player.playerMoney + player.tempBet;
          const playerMoney = 0;
          player.tempBet = player.playerMoney + player.tempBet;
          player.setPlayerMoney(playerMoney);
          player.setPlayerTotalBet(playerTotalBet);
        }
        if (enableSounds) {
          playCardPlaceChipsOne.play();
        }
        refreshSeats();
      }
    }
  }

  function betTenClick() {
    if (playerId) {
      raiseHelper(10, false);
    }
  }

  function betTwentyFiveClick() {
    if (playerId) {
      raiseHelper(25, false);
    }
  }

  function betOneHundredClick() {
    if (playerId) {
      raiseHelper(100, false);
    }
  }

  function betFiveHundredClick() {
    if (playerId) {
      raiseHelper(500, false);
    }
  }

  function betAllInClick() {
    if (playerId) {
      raiseHelper(0, true);
    }
  }

  function myRaiseHelper() {
    const hero = heroTurn.data;
    if (hero) {
      const rTempBet = hero.tempBet;
      hero.tempBet = 0;
      return rTempBet;
    }
    return 0;
  }

  function foldBtnClick(hero) {
    if (hero && hero.isPlayerTurn) {
      setFold();
    }
  }

  function checkBtnClick(hero) {
    if (hero && hero.isPlayerTurn) {
      if (hero.tempBet > 0) {
        toast.info(t('ALREADY_THROWN_CHIPS'));
        const rTempBet = hero.tempBet;
        hero.tempBet = 0;
        setRaise(rTempBet);
      } else {
        setCheck();
      }
    }
  }

  function raiseBtnClick(hero) {
    if (hero && hero.isPlayerTurn) {
      const chips = myRaiseHelper();
      setRaise(chips);
    }
  }

  const view = useMemo(() => {
    const current = ctrl.data;
    const hero = heroTurn.data;

    return (
      // <!-- Bottom controls -->
      <div
        className="card"
        style={{ backgroundColor: '#434343', width: '100%', marginTop: '-20px' }}
      >
        <div className="container" style={{ width: '100%', padding: '10px', marginLeft: '10%' }}>
          <div className="row" style={{ width: '100%' }}>
            <div className="col">
              <StyledBetBtn onClick={betTenClick} label="+10" />
              <StyledBetBtn onClick={betTwentyFiveClick} label="+25" />
              <StyledBetBtn onClick={betOneHundredClick} label="+100" />
              <StyledBetBtn onClick={betFiveHundredClick} label="+500" />
              <StyledBetBtn onClick={betAllInClick} label="All In" />
            </div>
            {!autoCheck && !autoPlay && hero && hero.isPlayerTurn ? (
              <div className="col">
                <StyledActBtn
                  onClick={() => foldBtnClick(hero)}
                  className={`${current.isFoldBtn ? 'ctrl-btn-visiable' : 'ctrl-btn-hide'}`}
                  label="Fold"
                />
                {/* When calling situation occurs, swap check btn text to call (handled by statusUpdate call from server) */}
                <StyledActBtn
                  onClick={() => checkBtnClick(hero)}
                  className={`${current.isCheckBtn ? 'ctrl-btn-visiable' : 'ctrl-btn-hide'}`}
                  label={current.isCallSituation ? 'Call' : 'Check'}
                />
                <StyledActBtn
                  onClick={() => raiseBtnClick(hero)}
                  className={`${current.isRaiseBtn ? 'ctrl-btn-visiable' : 'ctrl-btn-hide'}`}
                  label="Raise"
                />
              </div>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
    );
  }, [ctrl, heroTurn, autoCheck, autoPlay]);

  return view;
};

export default TurnControl;
