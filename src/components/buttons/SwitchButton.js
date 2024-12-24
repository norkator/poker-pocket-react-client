import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const SwitchWrapper = styled.label`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  cursor: pointer;
  user-select: none;

  .label-text {
    color: white;
    font-size: 13px;
    margin-bottom: 5px;
  }

  .toggle-container {
    position: relative;
    display: inline-block;
    width: 50px;
    height: 24px;
  }

  .toggle {
    position: absolute;
    inset: 0;
    background-color: rgb(67, 67, 67);
    border-radius: 24px;
    transition: background-color 0.3s;
  }

  .toggle::before {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    background-color: #dc3545;
    border-radius: 50%;
    top: 2px;
    left: 2px;
    transition: transform 0.3s;
  }

  .toggle-input {
    display: none;
  }

  .toggle-input:checked + .toggle {
    background-color: #dc3545;
  }

  .toggle-input:checked + .toggle::before {
    transform: translateX(26px);
  }
`;

const SwitchButton = ({ id, label, onText, offText, value, onChange }) => {
  const [state, setState] = useState(value ?? false);

  const onChangeState = (event) => {
    const newVal = event.target.checked;
    setState(newVal);
    if (onChange) {
      onChange(newVal);
    }
  };

  return (
    <SwitchWrapper htmlFor={id}>
      <span className="label-text">
        {label}: {value ? onText : offText}
      </span>
      <div className="toggle-container">
        <input
          id={id}
          type="checkbox"
          className="toggle-input"
          checked={state}
          onChange={onChangeState}
        />
        <span className="toggle" />
      </div>
    </SwitchWrapper>
  );
};

SwitchButton.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onText: PropTypes.string,
  offText: PropTypes.string,
  value: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

SwitchButton.defaultProps = {
  onText: 'On',
  offText: 'Off',
};

export default SwitchButton;
