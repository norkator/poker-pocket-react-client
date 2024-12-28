import React, { useState, useEffect, useContext } from 'react';
import NavButton from '@/components/buttons/NavButton';
import contentContext from '@/context/content/contentContext';
import modalContext from '@/context/modal/modalContext';
import SelectTableModal from '@/modals/SelectTableModal';
import RankingsModal from '@/modals/RankingsModal';
import UserDashboardModal from '@/modals/UserDashboardModal';
import SignInOnModal from '@/modals/SignInOnModal';
import socketContext from '@/context/websocket/socketContext';
import authContext from '@/context/auth/authContext';
import tableContext from '@/context/table/tableContext';
import { useNavigate } from 'react-router-dom';
import { LS_TOKEN } from '@/context/auth/AuthState';

const LS_ENABLE_SOUNDS_STATE = 'LS_ENABLE_SOUNDS_STATE';

const Navbar = () => {
  const { t } = useContext(contentContext);
  const navigate = useNavigate();
  const { openView, openModal, closeModal } = useContext(modalContext);

  const { socket, socketConnected } = useContext(socketContext);
  const { isAuthed, xpNeededForNextMedal } = useContext(authContext);

  const socketCtx = useContext(socketContext);
  const authCtx = useContext(authContext);
  const tableCtx = useContext(tableContext);

  const [enableSounds, setEnableSounds] = useState(true);

  useEffect(() => {
    const sounds = localStorage.getItem(LS_ENABLE_SOUNDS_STATE);
    setEnableSounds(sounds);
  }, []);

  useEffect(() => {
    localStorage.setItem(LS_ENABLE_SOUNDS_STATE, enableSounds ? 'true' : 'false');
  }, [enableSounds]);

  useEffect(() => {
    if (isAuthed) {
      openRoomModal('all');
    }
  }, [socketConnected]);

  function toggleSounds() {
    setEnableSounds(!enableSounds);
  }

  const openRoomModal = (mode) => {
    if (socket) {
      openModal(
        () => (
          <SelectTableModal mode={mode} context={{ socketCtx, tableCtx }} closeModal={closeModal} />
        ),
        t('SELECT_ROOM'),
        t('CLOSE')
      );
    }
  };

  const openRankingsModal = () =>
    openModal(() => <RankingsModal context={{ socketCtx }} />, t('RANKINGS'), t('CLOSE'));

  // const openGameInfoModal = () =>
  //   openModal(() => <GameInfoModal context={{ socketCtx }} />, t('SERVER_INFORMATION'), t('CLOSE'));

  // const openCmdModal = () =>
  //   openView(() => <CommandModal context={{ socketCtx }} closeModal={closeModal} />);

  const openUserModal = () =>
    openView(() => <UserDashboardModal context={{ socketCtx, authCtx }} closeModal={closeModal} />);

  const openSignInModaView = () => {
    openView(() => (
      <SignInOnModal mode={0} context={{ socketCtx, authCtx }} closeModal={closeModal} />
    ));
  };

  const logoutClick = () => {
    localStorage.removeItem(LS_TOKEN);
    window.location.reload();
  };

  const [isTogglerShow, setIsTogglerShow] = useState(false);

  const togglerSwitch = () => {
    setIsTogglerShow(!isTogglerShow);
  };

  const navigateGames = () => {
    navigate('/games');
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark custom-navbar">
        <a className="navbar-brand ms-2" href="https://pokerpocket.nitramite.com/">
          <img
            src="./assets/images/logo.png"
            style={{ width: '30px', height: '30px' }}
            className="d-inline-block align-top me-2"
            alt="Poker Pocket logo"
          />
          Poker Pocket
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded={isTogglerShow ? 'true' : 'false'}
          aria-label="Toggle navigation"
          onClick={togglerSwitch}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className={`collapse navbar-collapse ${isTogglerShow ? 'show' : ''}`}
          id="navbarSupportedContent"
        >
          <ul className="navbar-nav me-auto mt-1 mt-md-0">
            <NavButton onClick={() => navigateGames()}>{t('GAMES')}</NavButton>
            <NavButton onClick={toggleSounds}>
              {enableSounds ? t('SOUNDS_DISABLE') : t('SOUNDS_ENABLE')}
            </NavButton>
          </ul>
          {isAuthed ? (
            <ul
              id="loggedInUserIcon"
              className="nav navbar-nav ms-auto"
              onClick={() => openUserModal()}
            >
              <li style={{ marginRight: '5px' }}>
                <div
                  style={{
                    color: 'white',
                    height: '100%',
                    textAlign: 'center',
                    marginTop: '5px',
                  }}
                >
                  {xpNeededForNextMedal ? 'Next medal +' + xpNeededForNextMedal + 'xp' : ''}
                </div>
              </li>
              <li>
                <div style={{ marginRight: '5px' }}>
                  <img
                    id="loggedInUserMedal"
                    style={{ width: '40px', height: '40px' }}
                    src="./assets/images/shaded_medal_blank.png"
                    alt="User medal"
                  />
                </div>
              </li>
              <li>
                <div style={{ marginRight: '5px' }}>
                  <img
                    style={{ width: '40px', height: '40px' }}
                    src="./assets/images/logo_circle.png"
                    alt="Poker Pocket circle logo"
                  />
                </div>
              </li>
            </ul>
          ) : null}
          <div className="d-flex mt-1 my-md-0 me-2">
            {!isAuthed ? (
              <button
                id="nav_bar_login_btn"
                className="btn btn-outline-light"
                onClick={() => openSignInModaView()}
              >
                {t('LOGIN')}
              </button>
            ) : (
              <button
                id="login_logout_btn"
                className="btn btn-outline-success"
                type="button"
                onClick={() => logoutClick()}
              >
                {t('LOGOUT')}
              </button>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
