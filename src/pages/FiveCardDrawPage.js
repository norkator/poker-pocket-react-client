import React from 'react';
import styled from 'styled-components';
import Footer from '@/components/navigation/Footer';
import FiveCardDrawRoom from '@/components/game/fiveCardDraw/FiveCardDrawRoom';

const StyledContainer = styled.div`
  min-width: 850px;
  width: 850px;
  margin-top: 5px;
`;

const FiveCardDrawPage = () => {
  return (
    <>
      <StyledContainer className="container">
        <FiveCardDrawRoom />
        <Footer />
      </StyledContainer>
    </>
  );
};

export default FiveCardDrawPage;
