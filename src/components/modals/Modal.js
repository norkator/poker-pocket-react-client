import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const ModalWrapper = styled.div`
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1050;
  background-color: rgba(0, 0, 0, 0.5);
`;

const Modal = ({
  children,
  headingText = 'Modal',
  btnText = 'Call to Action',
  onClose,
  onBtnClicked,
  showHeader = true,
  showFooter = true,
}) => {
  const handleBackdropClick = (e) => {
    // if (e.target.id === 'wrapper') {
    //   onClose();
    // }
  };
  return ReactDOM.createPortal(
    <ModalWrapper id="wrapper" onClick={handleBackdropClick}>
      <div className="modal modal-dialog modal-dialog-centered" role="document">
        {' '}
        <div className="modal-content">
          {showHeader && (
            <div className="modal-header">
              <h5 className="modal-title">{headingText}</h5>
              <button type="button" className="btn-close" onClick={onClose} aria-label="Close" />
            </div>
          )}
          <div className="modal-body">
            {children || (
              <div>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Blanditiis error
                aspernatur vel fugiat quisquam aut tempore, consequatur quo. Neque officiis magni
                molestias quasi, accusamus rem sunt incidunt inventore esse. Modi.
              </div>
            )}
          </div>
          {showFooter && (
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onBtnClicked}>
                {btnText}
              </button>
            </div>
          )}
        </div>
      </div>
    </ModalWrapper>,
    document.getElementById('modal')
  );
};

Modal.propTypes = {
  showHeader: PropTypes.bool,
  showFooter: PropTypes.bool,
  headingText: PropTypes.string,
  btnText: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onBtnClicked: PropTypes.func.isRequired,
};

Modal.defaultProps = {
  showHeader: true,
  showFooter: true,
};

const initialModalData = {
  children: () => (
    <div>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis rerum omnis, minima
      perferendis, illum quasi expedita quo saepe fuga nulla cupiditate. Reprehenderit fugit placeat
      error corrupti illo ut? Numquam repellat molestias autem porro. Autem enim asperiores
      voluptatem itaque libero aspernatur cupiditate porro atque vel. Esse numquam tempora hic
      soluta excepturi?
    </div>
  ),
  headingText: 'Modal',
  btnText: 'Button',
  showFooter: false,
  showHeader: false,
};

export default Modal;
export { initialModalData };
