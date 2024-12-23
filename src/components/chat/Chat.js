import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const ChatContainer = styled.div`
  height: 100%;
  flex-direction: column;
  min-height: 650px;
`;

const MessageList = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
`;

const MessageWrapper = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  overflow-y: auto;
`;

const MessageBubble = styled.div`
  margin-bottom: 10px;
  padding: 10px 15px;
  border-radius: 15px;
  background-color: #2e2e3a;
  color: white;
  align-self: flex-end;
  word-wrap: break-word;
  word-break: break-word;
  font-size: 13px;
  &:nth-child(even) {
    align-self: flex-end;
  }
`;

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messageEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, newMessage]);
      setNewMessage('');
    }
  };

  return (
    <ChatContainer className="ml-2">
      <div
        className="card text-white"
        style={{
          backgroundColor: '#434343',
          minHeight: '650px',
          maxHeight: '650px',
          maxWidth: '310px',
        }}
      >
        <div className="card-body" style={{ padding: 0, overflowY: 'auto' }}>
          <MessageWrapper>
            <MessageList>
              {messages.map((message, index) => (
                <MessageBubble key={index}>{message}</MessageBubble>
              ))}
              <div ref={messageEndRef}></div>
            </MessageList>
          </MessageWrapper>
        </div>
        <div className="card-footer d-flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
            placeholder="Message"
            className="form-control mr-2"
            style={{ flex: 1, fontSize: '13px' }}
          />
          <button
            onClick={handleSendMessage}
            className="btn btn-danger"
            style={{
              fontSize: '13px',
            }}
          >
            Send
          </button>
        </div>
      </div>
    </ChatContainer>
  );
};

export default Chat;
