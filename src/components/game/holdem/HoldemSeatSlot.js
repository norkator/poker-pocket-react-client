import React, { useContext, useMemo } from 'react';
import styles from '../SeatSlot.module.css';
import globalContext from '@/context/global/globalContext';
import { formatMoney } from '@/utils/Money';
import { getCardResource } from '@/utils/CardRes';

const HoldemSeatSlot = ({ pos, className, playerId, seat, betLeft, betRight }) => {
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
  }, [seat, seat.refreshLastAction]);

  const cardsView = useMemo(() => {
    let path0 = null;
    let path1 = null;

    if (seat.playerId === playerId || seat.seatShowCards) {
      // show cards
      if (seat.seatCard0) {
        path0 = getCardResource(seat.seatCard0, cardStyle);
      }
      if (seat.seatCard1) {
        path1 = getCardResource(seat.seatCard1, cardStyle);
      }
    }

    if (seat.seatCard0 === undefined || seat.seatCard0 === null) {
      path0 = '';
    }
    if (seat.seatCard1 === undefined || seat.seatCard1 === null) {
      path1 = '';
    }

    return (
      <div className="row">
        <div className="col" style={{ marginLeft: '22px' }}>
          <div
            className={`cardOne ${
              path0 !== null && seat.puffInFastEnabled ? 'magicFast puffIn' : ''
            } ${seat.seatWinningGlowCard0 ? 'card-glow' : ''}`}
            style={{
              visibility: path0 === null ? 'hidden' : 'visible',
              backgroundImage: seat.seatCard0 ? `url(${path0})` : seat.seatIsFold ? 'url()' : '',
            }}
          ></div>
        </div>
        <div className="col" style={{ marginLeft: '-20px' }}>
          <div
            className={`cardTwo ${
              path1 !== null && seat.puffInFastEnabled ? 'magicFast puffIn' : ''
            } ${seat.seatWinningGlowCard1 ? 'card-glow' : ''}`}
            style={{
              visibility: path1 === null ? 'hidden' : 'visible',
              backgroundImage: seat.seatCard1 ? `url(${path1})` : seat.seatIsFold ? 'url()' : '',
            }}
          ></div>
        </div>
        <div className="col"></div>
      </div>
    );
  }, [
    cardStyle,
    seat.seatCard0,
    seat.seatCard1,
    seat.seatWinningGlowCard0,
    seat.seatWinningGlowCard1,
    seat.puffInFastEnabled,
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
  }, [seat.seatBetFrame, seat.seatDoBet, seat.seatCollectChips, seat.seatTotalBet]);

  return (
    <div className={styles.root}>
      <div id={'S-' + seat.id} className={`SeatFrame ${className}`}>
        {actionView}
        <div className="container" style={{ width: '100%' }}>
          {cardsView}
        </div>
        <div className="container" style={{ width: '100%', marginTop: '-20px' }}>
          <div
            id="CardView"
            className={`card ${seat.cardAnimation ? 'card-animation' : ''}`}
            style={{
              maxWidth: '176px',
            }}
          >
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

export default HoldemSeatSlot;
