import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import globalContext from '@/context/global/globalContext';
import contentContext from '@/context/content/contentContext';
import tableContext from '@/context/table/tableContext';
import SwitchButton from '@/components/buttons/SwitchButton';
import { parserCardStyle } from '@/utils/CardRes';

const StyledItem = styled.div`
  margin-top: 10px;
`;

export const LS_USE_PURPLE_TABLE = 'LS_USE_PURPLE_TABLE';
export const LS_USE_BLACK_CARDS = 'LS_USE_BLACK_CARDS';
export const LS_AUTO_CHECK_ENABLED = 'LS_AUTO_CHECK_ENABLED';
export const LS_AUTO_PLAY_ENABLED = 'LS_AUTO_PLAY_ENABLED';
export const LS_MODE_TOGGLE_STATE = 'LS_MODE_TOGGLE_STATE';

// Sleep promise
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const purpleBgVal = () => {
  const purpleBgVal = localStorage.getItem(LS_USE_PURPLE_TABLE);
  if (purpleBgVal === null || purpleBgVal === 'undefined') {
    return false;
  }
  return purpleBgVal === 'true';
};

const blackCardVal = () => {
  const blackCardVal = localStorage.getItem(LS_USE_BLACK_CARDS);
  if (blackCardVal === null || blackCardVal === 'undefined') {
    return false;
  }
  return blackCardVal === 'true';
};

const autoCheckEnabledVal = () => {
  const autoCheckEnabled = localStorage.getItem(LS_AUTO_CHECK_ENABLED);
  if (autoCheckEnabled === null || autoCheckEnabled === 'undefined') {
    return false;
  }
  return autoCheckEnabled === 'true';
};

const autoPlayEnabledVal = () => {
  const autoPlayEnabled = localStorage.getItem(LS_AUTO_PLAY_ENABLED);
  if (autoPlayEnabled === null || autoPlayEnabled === 'undefined') {
    return false;
  }
  return autoPlayEnabled === 'true';
};

const SettingsBar = () => {
  const { setCardStyle } = useContext(globalContext);
  const { t } = useContext(contentContext);
  const { autoCheck, setAutoCheck, autoPlay, setAutoPlay } = useContext(tableContext);

  const [tablePurpleBg, setTablePurpleBg] = useState(purpleBgVal());
  const [blackCards, setBlackCards] = useState(blackCardVal());

  // Handlers for each toggle
  const changeTableColor = (state) => {
    setTablePurpleBg(state);
    localStorage.setItem(LS_USE_PURPLE_TABLE, JSON.stringify(state));
    applyTableColor(state);
  };

  const applyTableColor = (state) => {
    const pokerTable = document.getElementById('pokerTable');
    pokerTable.style.backgroundImage = state
      ? "url('./assets/images/poker_table_purple.png')"
      : "url('./assets/images/poker_table_green.png')";
  };

  const changeBlackCards = (state) => {
    setBlackCards(state);
    const cardsStyle = JSON.stringify(state);
    setCardStyle(parserCardStyle(cardsStyle));
    localStorage.setItem(LS_USE_BLACK_CARDS, cardsStyle);
  };

  const changeAutoCheck = (state) => {
    setAutoCheck(state);
    localStorage.setItem(LS_AUTO_CHECK_ENABLED, String(state));
  };

  const changeAutoPlay = (state) => {
    setAutoPlay(state);
    localStorage.setItem(LS_AUTO_PLAY_ENABLED, String(state));
  };

  const changeConnectMode = (state) => {
    localStorage.setItem(LS_MODE_TOGGLE_STATE, JSON.stringify(state));
    reloadDelay();
  };

  const reloadDelay = async () => {
    await sleep(500);
    window.location.reload(); // Reload site with new connection params
  };

  const getCurrentYear = () => new Date().getFullYear();

  return (
    <div className="row">
      <div className="col-auto">
        <footer className="footer">
          <div style={{ color: '#FFFFFF' }}>♣ ♦ ♥ ♠</div>
          <div style={{ color: '#FFFFFF' }}>&copy; Nitramite {getCurrentYear()}</div>
          <div style={{ color: '#FFFFFF' }}>Graphics Raphael Ciribelly</div>
        </footer>
      </div>
      <StyledItem className="col col-auto">
        <SwitchButton
          id="tableColor"
          label={t('PURPLE_TABLE')}
          onText="On"
          offText="Off"
          value={tablePurpleBg}
          onChange={changeTableColor}
        />
      </StyledItem>
      <StyledItem className="col col-auto">
        <SwitchButton
          id="blackCards"
          label={t('BLACK_CARDS')}
          onText="On"
          offText="Off"
          value={blackCards}
          onChange={changeBlackCards}
        />
      </StyledItem>
      <StyledItem className="col col-auto">
        <SwitchButton
          id="autoCheck"
          label={t('AUTO_CHECK')}
          onText="On"
          offText="Off"
          value={autoCheck}
          onChange={(state) => {
            setAutoCheck(state);
            localStorage.setItem(LS_AUTO_CHECK_ENABLED, String(state));
          }}
        />
      </StyledItem>
      <StyledItem className="col col-auto">
        <SwitchButton
          id="autoPlay"
          label={t('AUTO_PLAY')}
          onText="On"
          offText="Off"
          value={autoPlay}
          onChange={(state) => {
            setAutoPlay(state);
            localStorage.setItem(LS_AUTO_PLAY_ENABLED, String(state));
          }}
        />
      </StyledItem>
      <StyledItem className="col col-auto">
        <SwitchButton
          id="connection"
          label={t('CONNECTION')}
          onText="Prod"
          offText="Dev"
          value={false}
          onChange={changeConnectMode}
        />
      </StyledItem>
      <div className="col-2" style={{ marginTop: '20px' }}>
        <div className="row">
          <a href="https://play.google.com/store/apps/details?id=com.nitramite.pokerpocket">
            <img
              className="playBadge"
              src="./assets/images/badge_play.png"
              alt="Poker Pocket on Google Play"
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default SettingsBar;
