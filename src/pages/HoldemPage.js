import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import HoldemRoom from '@/components/game/holdem/HoldemRoom';
import Footer from '@/components/navigation/Footer';
import Chat from '@/components/chat/Chat';

const StyledContainer = styled.div`
  display: flex;
  margin-top: 5px;
  position: relative;
`;

const ToggleButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #434343;
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  cursor: pointer;

  @media (min-width: 1200px) {
    display: none;
  }
`;

const HoldemPage = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
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
          <HoldemRoom />
          <Footer />
        </div>
        {isChatOpen && <Chat />}
        {isMobile && <ToggleButton onClick={toggleChat}>{isChatOpen ? '×' : '➤'}</ToggleButton>}
      </StyledContainer>
    </>
  );
};

export default HoldemPage;
