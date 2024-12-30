import React from 'react';

const GameIcon = ({ game }) => {
  const getIconSrc = (game) => {
    switch (game) {
      // case 'HOLDEM':
      //   return '/assets/images/holdem.png';
      // case 'FIVE_CARD_DRAW':
      //   return '/assets/images/fivecarddraw.png';
      default:
        return '/assets/images/dealer_chip.png';
    }
  };

  const getAltText = (game) => {
    switch (game) {
      case 'HOLDEM':
        return 'Holdem';
      case 'FIVE_CARD_DRAW':
        return 'Five Card Draw';
      default:
        return 'Game';
    }
  };

  return (
    <img
      src={getIconSrc(game)}
      alt={getAltText(game)}
      style={{ width: '24px', marginRight: '8px' }}
    />
  );
};

export default GameIcon;
