import React, { useContext } from 'react';
import BottleSpinSeatSlot from './BottleSpinSeatSlot';
import tableContext from '@/context/table/tableContext';

const BottleSpinTable = ({ children }) => {
  const { seats } = useContext(tableContext);

  const current = seats.data;
  return (
    <div id="bottleSpinTable" className="bottleSpinTable">
      {/* <!-- Top layout --> */}
      <div className="row bottleSpinTableRow">
        <div className="col">
          {/* <!-- Seat layout --> */}
          {current[2] && current[2].seatFrame ? (
            <BottleSpinSeatSlot pos="s3" className="float-right" seat={current[2]} betRight />
          ) : (
            ''
          )}
          {/* <!-- /Seat --> */}
        </div>
        <div className="col-2">{/* <!-- POT INFO --> */}</div>
        <div className="col">
          {/* <!-- Seat layout --> */}
          {current[3] && current[3].seatFrame ? (
            <BottleSpinSeatSlot pos="s4" className="float-left" seat={current[3]} betLeft />
          ) : (
            ''
          )}
          {/* <!-- /Seat --> */}
        </div>
      </div>

      {/* <!-- Middle layout --> */}
      <div className="row bottleSpinTableRow">
        <div className="col">
          {/* <!-- Seat layout --> */}
          {current[1] && current[1].seatFrame ? (
            <BottleSpinSeatSlot pos="s2" seat={current[1]} betRight />
          ) : (
            ''
          )}
          {/* <!-- /Seat --> */}
        </div>
        <div className="col-5">
          {/* <!-- MIDDLE BOTTLE --> */}
          {children}
          {/* <!-- /MIDDLE BOTTLE --> */}
        </div>
        <div className="col">
          {/* <!-- Seat layout --> */}
          {current[4] && current[4].seatFrame ? (
            <BottleSpinSeatSlot pos="s5" seat={current[4]} betLeft />
          ) : (
            ''
          )}
        </div>
      </div>

      {/* <!-- Bottom layout --> */}
      <div className="row bottleSpinTableRow">
        <div className="col">
          {current[0] && current[0].seatFrame ? (
            <BottleSpinSeatSlot pos="s1" className="float-right" seat={current[0]} betRight />
          ) : (
            ''
          )}
        </div>
        <div className="col-2">{/* <!-- Empty space --> */}</div>
        <div className="col">
          {/* <!-- Seat layout --> */}
          {current[5] && current[5].seatFrame ? (
            <BottleSpinSeatSlot pos="s6" className="float-left" seat={current[5]} betLeft />
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  );
};

export default BottleSpinTable;
