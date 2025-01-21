import React, { useState, useContext, useEffect, useRef } from 'react';
import contentContext from '@/context/content/contentContext';

const TablePasswordModal = ({ closeModal, onProceed }) => {
  const { t } = useContext(contentContext);
  const [password, setPassword] = useState('');
  const passwordInputRef = useRef(null);

  useEffect(() => {
    if (passwordInputRef.current) {
      passwordInputRef.current.focus();
    }
  }, []);

  const handleProceed = () => {
    onProceed(password);
    closeModal();
  };

  return (
    <div>
      <div
        className="modal modal-dialog"
        style={{
          display: 'flex',
        }}
        role="document"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{t('TABLE_PASSWORD')}</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={closeModal}
            ></button>
          </div>
          <div className="modal-body">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                handleProceed();
              }}
            >
              <input
                id="table_password"
                className="form-control"
                type="text"
                placeholder={t('TABLE_PASSWORD')}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                ref={passwordInputRef}
              />
            </form>
          </div>
          <div className="modal-footer">
            <button
              className="btn btn-primary btn-md btn-block"
              onClick={handleProceed}
              disabled={!password}
            >
              {t('CONTINUE')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TablePasswordModal;
