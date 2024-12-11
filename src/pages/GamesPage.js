import React from 'react';
import styled from 'styled-components';
import Games from '@/components/navigation/Games';

const StyledContainer = styled.div`
  max-width: 850px;
  margin-top: 5px;
`;

const GamesPage = () => {
  return (
    <>
      <StyledContainer className="container">
        <Games />
      </StyledContainer>
    </>
  );
};

export default GamesPage;
