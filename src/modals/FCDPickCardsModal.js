import React, { useMemo, useContext, useState } from 'react';
import { getCardResource } from '@/utils/CardRes';
import globalContext from '@/context/global/globalContext';
import contentContext from '@/context/content/contentContext';

const FCDPickCardsModal = ({ cards, onCardsSelected }) => {
  const { t } = useContext(contentContext);
  const { cardStyle } = useContext(globalContext);
  const [selectedCards, setSelectedCards] = useState([]);

  const toggleCardSelection = (card) => {
    setSelectedCards((prevSelected) => {
      if (prevSelected.includes(card)) {
        return prevSelected.filter((c) => c !== card);
      } else {
        return [...prevSelected, card];
      }
    });
  };

  const handleAnimationEnd = (e) => {
    // e.target.classList.add('stayAtTop');
  };

  const CardsView = useMemo(() => {
    if (!cards) {
      return null;
    }

    return (
      <div className="row">
        {cards.cards.map((card, index) => {
          const path = getCardResource(card, cardStyle);
          const isSelected = selectedCards.includes(card);

          return (
            <div
              key={index}
              className={`pokerCardForPicker ${isSelected ? 'magictime slideUpCustom' : ''}`}
              style={{
                backgroundImage: `url(${path})`,
                cursor: 'pointer',
              }}
              onClick={() => toggleCardSelection(card)}
              onAnimationEnd={isSelected ? handleAnimationEnd : null}
            ></div>
          );
        })}
      </div>
    );
  }, [cards, cardStyle, selectedCards]);

  return (
    <>
      <div className="selectedCards">
        <small>{t('CARDS_TO_DISCARD')}:</small>
        {selectedCards.length > 0 ? <p>{selectedCards.join(', ')}</p> : <p>...</p>}
      </div>
      <div className="container" style={{ margin: '10px', marginTop: '40px' }}>
        {CardsView}
      </div>
      <button
        onClick={() => onCardsSelected(selectedCards)}
        type="button"
        className={`btn btn-outline-dark`}
        style={{ margin: '0 2px' }}
      >
        {t('CONTINUE')}
      </button>
    </>
  );
};

export default FCDPickCardsModal;
