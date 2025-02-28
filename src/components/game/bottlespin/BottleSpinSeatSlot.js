import React, { useContext, useMemo } from 'react';
import styles from '../SeatSlot.module.css';
import globalContext from '@/context/global/globalContext';
import { formatMoney } from '@/utils/Money';

const BottleSpinSeatSlot = ({ pos, className, seat, betLeft, betRight, position }) => {
  const { cardStyle } = useContext(globalContext);

  const actionView = useMemo(() => {
    const seatLastAction = seat.seatLastAction;

    return (
      <div
        style={{
          position: 'relative',
        }}
      >
        {seatLastAction ? (
          <div className="lastActionTexts magictime puffIn action-animation">{seatLastAction}</div>
        ) : null}
      </div>
    );
  }, [seat, seat.refreshLastAction]);

  const betFrameView = useMemo(() => {
    return seat.seatBetFrame ? (
      <div
        id="BetFrame"
        className={`${seat.seatDoBet ? 'magictime puffIn' : ''}`}
        style={{
          position: 'absolute',
          left: '-50px',
          top: '30px',
          zIndex: 9999,
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
    <div
      className={styles.root}
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div
        id={'S-' + seat.id}
        className={`SeatFrame ${className}`}
        style={{
          width: '130px',
          position: 'relative',
          top: '-10px',
        }}
      >
        {actionView}
        <div className="container" style={{ width: '100%', marginTop: '20px' }}>
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
        {seat.seatDealerChip ? (
          <div
            id="DealerChip"
            className="spinnerChipView"
            style={{
              position: 'relative',
              top: '-80px',
            }}
          ></div>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default BottleSpinSeatSlot;
