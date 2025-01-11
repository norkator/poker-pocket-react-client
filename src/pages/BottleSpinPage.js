import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import BottleSpinRoom from '@/components/game/bottlespin/BottleSpinRoom';
import Footer from '@/components/navigation/Footer';
import Chat from '@/components/chat/Chat';

const StyledContainer = styled.div`
  display: flex;
  margin-top: 5px;
  position: relative;
`;

const ToggleButton = styled.button`
  position: fixed;
  right: 10px;
  bottom: 10px;
  background-color: #23272b;
  color: white;
  border: none;
  border-radius: 50%;
  padding: 15px;
  font-size: 15px;
  cursor: pointer;
  z-index: 9999;

  &:hover {
    opacity: 0.9;
  }
`;

const BottleSpinPage = () => {
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1200);

  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1200);
      if (window.innerWidth >= 1200) {
        setIsChatOpen(true);
      } else {
        setIsChatOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <StyledContainer className="container">
        <div style={{ flex: 1, maxWidth: '850px' }}>
          <BottleSpinRoom />
          <Footer />
        </div>
        {isChatOpen && <Chat />}
        {isMobile && <ToggleButton onClick={toggleChat}>💬</ToggleButton>}
      </StyledContainer>
    </>
  );
};

export default BottleSpinPage;
