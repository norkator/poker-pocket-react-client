import React from 'react';
import styled from 'styled-components';
import HoldemRoom from '@/components/game/holdem/HoldemRoom';
import Footer from '@/components/navigation/Footer';
import Chat from '@/components/chat/Chat';

const StyledContainer = styled.div`
  display: flex;
  margin-top: 5px;
`;

const HoldemPage = () => {
  return (
    <>
      <StyledContainer
        className="container"
        style={{
          maxWidth: '1200px',
        }}
      >
        <div style={{ flex: 1, maxWidth: '850px' }}>
          <HoldemRoom />
          <Footer />
        </div>
        <Chat></Chat>
      </StyledContainer>
    </>
  );
};

export default HoldemPage;
