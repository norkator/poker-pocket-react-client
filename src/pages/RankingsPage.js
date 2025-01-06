import React from 'react';
import styled from 'styled-components';
import Rankings from '@/components/navigation/Rankings';

const StyledContainer = styled.div`
  max-width: 850px;
  margin-top: 5px;
`;

const RankingsPage = () => {
  return (
    <>
      <StyledContainer className="container">
        <Rankings />
      </StyledContainer>
    </>
  );
};

export default RankingsPage;
