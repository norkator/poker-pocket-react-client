import React, { useState, useEffect, useRef, useContext } from 'react';
import styled from 'styled-components';
import socketContext from '@/context/websocket/socketContext';
import contentContext from '@/context/content/contentContext';
import { toast } from 'react-toastify';

const ChatContainer = styled.div`
  position: fixed;
  right: 10px;
  bottom: 80px;
  max-width: 400px;
  border-radius: 10px;
  display: ${(props) => (props.isVisible ? 'flex' : 'none')};
  flex-direction: column;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
`;

const MessageList = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  overflow-y: auto;
  max-height: 70vh;
`;

const MessageWrapper = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  overflow: hidden;
`;

const MessageBubble = styled.div`
  margin-bottom: 10px;
  padding: 10px 15px;
  border-radius: 15px;
  background-color: #313131;
  color: white;
  align-self: flex-end;
  word-wrap: break-word;
  word-break: break-word;
  font-size: 13px;

  &:nth-child(even) {
    align-self: flex-end;
  }

  .username {
    font-size: 10px;
    font-weight: lighter;
    color: #ccc;
  }

  .message-content {
    font-size: 13px;
  }
`;

const PublicChat = ({ isVisible, toggleVisibility }) => {
  const { t } = useContext(contentContext);
  const { socket } = useContext(socketContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messageEndRef = useRef(null);
  const isMounted = useRef(true);

  useEffect(() => {
    getChatMessages();
  }, [socket]);

  function getChatMessages() {
    if (socket) {
      const data = JSON.stringify({
        key: 'getChatMessages',
      });
      socket.send(data);
    }
  }

  const scrollToBottom = () => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const regAuthHandler = (socket) => {
    socket.handle('getChatMessages', (jsonData) => handleMessages(jsonData.data));
    socket.handle('chatMessage', (jsonData) => newMessageData(jsonData.data));
  };

  function handleMessages(mData) {
    const messages = mData.messages;
    if (isMounted.current) {
      setMessages(messages);
    }
  }

  function newMessageData(mData) {
    if (mData.success) {
      const newMessage = mData.chatMessage;
      if (newMessage.message.trim() && isMounted.current) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    } else {
      toast.error(t(mData.translationKey));
    }
  }

  useEffect(() => {
    if (socket) {
      regAuthHandler(socket);
    }
    return () => {
      if (socket) {
        socket.removeHandler && socket.removeHandler('chatMessage');
      }
    };
  }, [socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleSendMessage = () => {
    if (!newMessage.trim()) {
      return;
    }
    if (socket) {
      const data = JSON.stringify({
        key: 'chatMessage',
        message: newMessage,
      });
      socket.send(data);
      setNewMessage('');
    } else {
      toast.error('Could not send message');
    }
  };

  return (
    <ChatContainer isVisible={isVisible} className="magicFast puffIn">
      <div className="card text-white">
        <div className="card-body" style={{ padding: 0 }}>
          <MessageWrapper>
            <MessageList>
              {messages.map((message, index) => (
                <MessageBubble key={index}>
                  <div className="username">{message.playerName}</div>
                  <div className="message-content">{message.message}</div>
                </MessageBubble>
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
            placeholder={t('MESSAGE')}
            className="form-control me-2"
            style={{ flex: 1, fontSize: '13px' }}
          />
          <button
            onClick={handleSendMessage}
            className="btn btn-danger"
            style={{ fontSize: '13px' }}
          >
            {t('SEND')}
          </button>
        </div>
      </div>
    </ChatContainer>
  );
};

export default PublicChat;
