import React from 'react';
import styled from 'styled-components';
import FiveCardDrawRoom from '@/components/game/fiveCardDraw/FiveCardDrawRoom';
import Footer from '@/components/navigation/Footer';
import Chat from '@/components/chat/Chat';

const StyledContainer = styled.div`
  display: flex;
  margin-top: 5px;
`;

const FiveCardDrawPage = () => {
  return (
    <>
      <StyledContainer
        className="container"
        style={{
          maxWidth: '1200px',
        }}
      >
        <div style={{ flex: 1, maxWidth: '850px' }}>
          <FiveCardDrawRoom />
          <Footer />
        </div>
        <Chat></Chat>
      </StyledContainer>
    </>
  );
};

export default FiveCardDrawPage;
