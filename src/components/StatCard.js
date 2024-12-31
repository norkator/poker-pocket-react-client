import React from 'react';

const StatCard = ({ number, text, width = '12rem' }) => {
  return (
    <div
      className="card p-3 text-center"
      style={{
        width: width,
      }}
    >
      <div
        style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          color: 'white',
        }}
      >
        {number}
      </div>
      <div
        style={{
          fontSize: '13px',
          color: 'white',
        }}
      >
        {text}
      </div>
    </div>
  );
};

export default StatCard;
