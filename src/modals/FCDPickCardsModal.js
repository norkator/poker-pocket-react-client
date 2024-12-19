import React, { useMemo, useContext, useState } from 'react';
import { getCardResource } from '@/utils/CardRes';
import globalContext from '@/context/global/globalContext';
import contentContext from '@/context/content/contentContext';

const FCDPickCardsModal = ({ context, cards }) => {
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
        <p>{selectedCards.join(', ')}</p>
      </div>
      <div className="container" style={{ margin: '10px', marginTop: '40px' }}>
        {CardsView}
      </div>
    </>
  );
};

export default FCDPickCardsModal;
