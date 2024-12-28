import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import SignInView from './SignInModal';
import SignOnView from './SignOnModal';
import contentContext from '@/context/content/contentContext';
import { LS_TOKEN } from '@/context/auth/AuthState';

const SignInOnModal = ({ mode, context, closeModal }) => {
  const [state, setState] = useState(mode);

  const { t } = useContext(contentContext);
  const { socketCtx, authCtx } = context;
  const { socket, playerId } = socketCtx;
  const { setIsLoggedIn } = authCtx;

  const regAuthHandler = (socket) => {
    socket.handle('createAccount', (jsonData) => accountCreated(jsonData.data));

    socket.handle('login', (jsonData) => loginResult(jsonData.data));

    socket.handle('authenticationError', (jsonData) => console.log(jsonData.data));
  };

  useEffect(() => {
    if (socket) {
      regAuthHandler(socket);
    }
  }, [socket]);

  function accountCreated(aData) {
    if (aData.success) {
      toast.success(t('ACCOUNT_CREATED'));
      closeModal();
    } else {
      toast.error(t(aData.translationKey));
    }
  }

  function loginResult(lData) {
    if (lData.success) {
      toast.success('You are now logged in for this instance.');
      localStorage.setItem(LS_TOKEN, lData.token);
      setIsLoggedIn({
        token: lData.token,
      });
      closeModal();
    } else {
      toast.error(t(lData.translationKey));
    }
  }

  function forgotPasswordBtn() {
    // window.location.href = 'http://www.nitramite.com/contact.html';
    toast.warn(
      '🙈 Looks like you forgot your password, and we forgot to develop reset feature. Teamwork makes the dream work, right? Oh wait...',
      {
        autoClose: 10 * 1000,
        theme: 'dark',
      }
    );
  }

  function userLogin(username, password) {
    if (socket) {
      socket.send(
        JSON.stringify({
          key: 'login',
          username: username,
          password: password,
        })
      );
    }
  }

  function createAccount(username, password, email) {
    if (socket) {
      socket.send(
        JSON.stringify({
          key: 'createAccount',
          username: username,
          password: password,
          email: email,
        })
      );
    }
  }

  return (
    <div>
      {state === 0 ? (
        <SignInView
          userLogin={userLogin}
          setState={setState}
          forgotPasswordBtn={forgotPasswordBtn}
          closeModal={closeModal}
        />
      ) : (
        <SignOnView
          createAccount={createAccount}
          setState={setState}
          forgotPasswordBtn={forgotPasswordBtn}
          closeModal={closeModal}
        />
      )}
    </div>
  );
};

export default SignInOnModal;
