import React, { useContext, useMemo } from 'react';
import globalContext from '@/context/global/globalContext';
import tableContext from '@/context/table/tableContext';
import { getCardResource } from '@/utils/CardRes';
import { formatMoney } from '@/utils/Money';

const BoardCards = () => {
  const { cardStyle } = useContext(globalContext);
  const { board } = useContext(tableContext);

  const view = useMemo(() => {
    const current = board.data;
    return current ? (
      <div className="container">
        {current.isShowMiddleCards() ? (
          <div className="row justify-center" style={{ justifyContent: 'center' }}>
            {current.middleCards
              ? current.middleCards.map((card, index) => {
                  let path = null;
                  if (card) {
                    path = getCardResource(card, cardStyle);
                  }
                  return (
                    <div
                      className={`middleCard ${
                        current.middleCardsPuffIn[index] && !current.middleCardsSlideUp[index]
                          ? 'magicFast puffIn'
                          : ''
                      } ${current.middleCardsSlideUp[index] ? 'magictime card-glow' : ''}`}
                      key={'MC' + index}
                      style={{
                        backgroundImage: card ? `url(${path})` : 'url()',
                      }}
                    />
                  );
                })
              : ''}
          </div>
        ) : (
          ''
        )}
        <div id="totalPot" className="totalPotText">
          {current.getTotalPot() > 0 ? <div className="moneyView"></div> : ''}
          <div>{current.getTotalPot() > 0 ? formatMoney(current.getTotalPot()) + '$' : ''}</div>
        </div>
      </div>
    ) : (
      ''
    );
  }, [board, cardStyle]);

  return view;
};

export default BoardCards;
