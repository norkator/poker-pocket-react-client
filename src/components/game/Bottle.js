import React, { useContext, useMemo } from 'react';
import globalContext from '@/context/global/globalContext';
import tableContext from '@/context/table/tableContext';
import { formatMoney } from '@/utils/Money';

const Bottle = () => {
  const { cardStyle } = useContext(globalContext);
  const { board } = useContext(tableContext);

  return useMemo(() => {
    const current = board.data;
    return current ? (
      <div className="container">
        <div id="totalPot" className="totalPotText">
          {current.getTotalPot() > 0 ? <div className="moneyView"></div> : ''}
          <div>{current.getTotalPot() > 0 ? formatMoney(current.getTotalPot()) + '$' : ''}</div>
        </div>
      </div>
    ) : (
      ''
    );
  }, [board, cardStyle]);
};

export default Bottle;
