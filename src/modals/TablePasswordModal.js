import React, { useContext } from 'react';
import contentContext from '@/context/content/contentContext';

const TablePasswordModal = ({ context, closeModal }) => {
  const { t } = useContext(contentContext);

  return (
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
            data-bs-dismiss="modal"
            aria-label="Close"
            onClick={closeModal}
          ></button>
        </div>
        <div className="modal-body">
          <div id="div-forms1">
            <form id="login-form" onSubmit={form_submit}>
              <div style={{ marginLeft: '2px' }}>
                <span>{tipMsg}</span>
              </div>
              <input
                id="table_password"
                className="form-control"
                type="password"
                placeholder="Table password"
                required
                style={{ marginTop: '5px' }}
                value={inputData.lg_password}
                onChange={(event) =>
                  setInputData({
                    ...inputData,
                    lg_password: event.currentTarget.value,
                  })
                }
              />
              <button type="submit" className="d-none" aria-hidden="true"></button>{' '}
            </form>
          </div>
        </div>
        <div className="modal-footer">
          <div>
            <button
              className="btn btn-primary btn-md btn-block"
              onClick={form_submit}
              disabled={!inputData.lg_username || !inputData.lg_password}
            >
              {t('LOGIN')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TablePasswordModal;
