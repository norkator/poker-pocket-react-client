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
    width: 60px;
    height: 34px;
  }

  .toggle {
    position: absolute;
    inset: 0;
    background-color: rgb(67, 67, 67);
    border-radius: 24px;
    transition: background-color 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 10px;
    font-weight: bold;
  }

  .toggle::before {
    content: '';
    position: absolute;
    width: 30px;
    height: 30px;
    background-color: #dc3545;
    border-radius: 50%;
    top: 2px;
    left: 2px;
    transition: transform 0.3s;
  }

  .toggle-input {
    display: none;
  }

  .toggle-text {
    position: absolute;
    top: 7px;
    left: 50%;
    transform: translateX(-50%);
    color: white;
    font-size: 12px;
    font-weight: bold;
  }

  .toggle-input:checked + .toggle {
    background-color: #dc3545;
  }

  .toggle-input:checked + .toggle::before {
    transform: translateX(28px);
  }
`;

const SwitchButton = ({ id, label, onText, offText, value, onChange }) => {
  return (
    <SwitchWrapper htmlFor={id}>
      <span className="label-text">{label}</span>
      <div className="toggle-container">
        <input
          id={id}
          type="checkbox"
          className="toggle-input"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="toggle">{value ? <span className="toggle-text">{onText}</span> : ''}</span>
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
