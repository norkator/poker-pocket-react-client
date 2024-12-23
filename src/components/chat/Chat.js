import React, { useState } from 'react';
import styled from 'styled-components';

const ChatContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const MessageList = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding: 10px;
`;

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

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
          height: '100%',
        }}
      >
        <div className="card-body" style={{ padding: 0 }}>
          <MessageList>
            {messages.map((message, index) => (
              <div key={index} className="mb-2">
                <div>{message}</div>
              </div>
            ))}
          </MessageList>
        </div>
        <div className="card-footer d-flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Message"
            className="form-control mr-2"
            style={{ flex: 1 }}
          />
          <button onClick={handleSendMessage} className="btn btn-primary">
            Send
          </button>
        </div>
      </div>
    </ChatContainer>
  );
};

export default Chat;
