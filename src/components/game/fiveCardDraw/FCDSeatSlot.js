import React, { useContext, useMemo } from 'react';
import styles from '../SeatSlot.module.css';
import globalContext from '@/context/global/globalContext';
import { formatMoney } from '@/utils/Money';
import { getCardResource } from '@/utils/CardRes';

const FCDSeatSlot = ({ pos, className, playerId, seat, betLeft, betRight }) => {
  const { cardStyle } = useContext(globalContext);

  const actionView = useMemo(() => {
    const seatLastAction = seat.seatLastAction;

    return (
      <div className="container player-action-pos">
        {seatLastAction ? (
          <div className="lastActionTexts magictime puffIn action-animation">{seatLastAction}</div>
        ) : null}
      </div>
    );
  }, [seat]);

  const cardsView = useMemo(() => {
    let path0 = null;
    let path1 = null;
    let path2 = null;
    let path3 = null;
    let path4 = null;

    if (seat.playerId === playerId || seat.seatShowCards) {
      // show cards
      if (seat.seatCard0) {
        path0 = getCardResource(seat.seatCard0, cardStyle);
      }
      if (seat.seatCard1) {
        path1 = getCardResource(seat.seatCard1, cardStyle);
      }
      if (seat.seatCard2) {
        path2 = getCardResource(seat.seatCard2, cardStyle);
      }
      if (seat.seatCard3) {
        path3 = getCardResource(seat.seatCard3, cardStyle);
      }
      if (seat.seatCard4) {
        path4 = getCardResource(seat.seatCard4, cardStyle);
      }
    }

    if (seat.seatCard0 === undefined) {
      path0 = '';
    }
    if (seat.seatCard1 === undefined) {
      path1 = '';
    }
    if (seat.seatCard2 === undefined) {
      path2 = '';
    }
    if (seat.seatCard3 === undefined) {
      path3 = '';
    }
    if (seat.seatCard4 === undefined) {
      path4 = '';
    }

    return (
      <div className="row">
        <div
          className={`pokerCard ${
            path0 !== null && seat.puffInFastEnabled ? 'magicFast puffIn' : ''
          } ${seat.seatWinningGlowCard0 ? 'card-glow' : ''}`}
          style={{
            visibility: path0 === null ? 'visible' : 'visible',
            backgroundImage: seat.seatCard0 ? `url(${path0})` : seat.seatIsFold ? 'url()' : '',
            marginLeft: '-5px',
          }}
        ></div>
        <div
          className={`pokerCard ${
            path1 !== null && seat.puffInFastEnabled ? 'magicFast puffIn' : ''
          } ${seat.seatWinningGlowCard1 ? 'card-glow' : ''}`}
          style={{
            visibility: path1 === null ? 'visible' : 'visible',
            backgroundImage: seat.seatCard1 ? `url(${path1})` : seat.seatIsFold ? 'url()' : '',
            marginLeft: '-5px',
          }}
        ></div>
        <div
          className={`pokerCard ${
            path2 !== null && seat.puffInFastEnabled ? 'magicFast puffIn' : ''
          } ${seat.seatWinningGlowCard1 ? 'card-glow' : ''}`}
          style={{
            visibility: path2 === null ? 'visible' : 'visible',
            backgroundImage: seat.seatCard2 ? `url(${path1})` : seat.seatIsFold ? 'url()' : '',
            marginLeft: '-5px',
          }}
        ></div>
        <div
          className={`pokerCard ${
            path3 !== null && seat.puffInFastEnabled ? 'magicFast puffIn' : ''
          } ${seat.seatWinningGlowCard1 ? 'card-glow' : ''}`}
          style={{
            visibility: path3 === null ? 'visible' : 'visible',
            backgroundImage: seat.seatCard3 ? `url(${path1})` : seat.seatIsFold ? 'url()' : '',
            marginLeft: '-5px',
          }}
        ></div>
        <div
          className={`pokerCard ${
            path4 !== null && seat.puffInFastEnabled ? 'magicFast puffIn' : ''
          } ${seat.seatWinningGlowCard1 ? 'card-glow' : ''}`}
          style={{
            visibility: path4 === null ? 'visible' : 'visible',
            backgroundImage: seat.seatCard4 ? `url(${path1})` : seat.seatIsFold ? 'url()' : '',
            marginLeft: '-5px',
          }}
        ></div>
      </div>
    );
  }, [
    seat.playerId,
    seat.seatShowCards,
    seat.seatCard0,
    seat.seatCard1,
    seat.seatCard2,
    seat.seatCard3,
    seat.seatCard4,
    seat.puffInFastEnabled,
    seat.seatWinningGlowCard0,
    seat.seatIsFold,
    seat.seatWinningGlowCard1,
    playerId,
    cardStyle,
  ]);

  const betFrameView = useMemo(() => {
    return seat.seatBetFrame ? (
      <div
        id="BetFrame"
        className={`container ${seat.seatDoBet ? 'magictime puffIn' : ''} bet-pos ${
          betLeft ? 'bet-left' : ''
        } ${betRight ? 'bet-right' : ''}
            `}
        style={{
          animation: seat.seatCollectChips ? pos + 'ChipsToPot 0.5s alternate forwards' : '',
        }}
      >
        <div className="moneyView"></div>
        <div id="TotalBet" className="betTexts">
          {seat.seatTotalBet}
        </div>
      </div>
    ) : (
      ''
    );
  }, [
    seat.seatBetFrame,
    seat.seatDoBet,
    seat.seatCollectChips,
    seat.seatTotalBet,
    betLeft,
    betRight,
    pos,
  ]);

  return (
    <div className={styles.root}>
      <div id={'S-' + seat.id} className={`SeatFrame ${className}`}>
        {actionView}
        <div className="container" style={{ width: '200px', marginLeft: '10px' }}>
          {cardsView}
        </div>
        <div className="container" style={{ width: '200px', marginTop: '-20px' }}>
          <div id="CardView" className={`card ${seat.cardAnimation ? 'card-animation' : ''}`}>
            <div id="Name" className="seatTexts">
              {seat.seatName}
            </div>
            <div id="Money" className="seatTexts">
              {formatMoney(seat.seatMoney) + '$'}
            </div>
            <div className="progress">
              <div
                className="progress-bar"
                role="progressbar"
                id="TimeBar"
                aria-valuemin="0"
                aria-valuemax="100"
                style={
                  seat.seatTimeBar > 0
                    ? {
                        width: '100%',
                        animation: `lineburn ${seat.seatTimeBar / 1000}s linear forwards`,
                      }
                    : {}
                }
              ></div>
            </div>
          </div>
        </div>
        {betFrameView}
        {seat.seatDealerChip ? <div id="DealerChip" className="dealerChipView"></div> : ''}
      </div>
    </div>
  );
};

export default FCDSeatSlot;
