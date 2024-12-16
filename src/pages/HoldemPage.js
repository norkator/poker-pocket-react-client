import React from 'react';
import styled from 'styled-components';
import HoldemRoom from '@/components/game/holdem/HoldemRoom';
import Footer from '@/components/navigation/Footer';

const StyledContainer = styled.div`
  min-width: 850px;
  width: 850px;
  margin-top: 5px;
`;

const HoldemPage = () => {
  return (
    <>
      <StyledContainer className="container">
        <HoldemRoom />
        <Footer />
      </StyledContainer>
    </>
  );
};

export default HoldemPage;
