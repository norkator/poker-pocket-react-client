import React from 'react';
import styled from 'styled-components';
import MyAccount from '@/components/navigation/MyAccount';

const StyledContainer = styled.div`
  max-width: 850px;
  margin-top: 5px;
`;

const MyAccountPage = () => {
  return (
    <>
      <StyledContainer className="container">
        <MyAccount />
      </StyledContainer>
    </>
  );
};

export default MyAccountPage;
