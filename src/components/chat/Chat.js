import React, { useState, useEffect, useRef, useContext } from 'react';
import styled from 'styled-components';
import socketContext from '@/context/websocket/socketContext';
import contentContext from '@/context/content/contentContext';
import { toast } from 'react-toastify';
import tableContext from '@/context/table/tableContext';

const ChatContainer = styled.div`
  flex-direction: column;
  max-width: 310px;
  transition: transform 0.3s ease;

  @media (max-width: 1200px) {
    position: fixed;
    top: 0;
    right: 0;
    margin-right: 5px;
    margin-top: 5px;
    max-height: 650px;
    background-color: #434343;
    z-index: 999;
  }

  @media (min-width: 1200px) {
    transform: translateX(0);
    position: static;
  }
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

  .username {
    font-size: 10px;
    font-weight: lighter;
    color: #ccc;
  }

  .message-content {
    font-size: 13px;
  }
`;

const Chat = ({ isVisible }) => {
  const { t } = useContext(contentContext);
  const { socket, socketConnected } = useContext(socketContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messageEndRef = useRef(null);
  const isMounted = useRef(true);

  const { tableId } = useContext(tableContext);

  useEffect(() => {
    getChatMessages();
  }, [socket, tableId]);

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
    const newMessage = mData.chatMessage;
    if (newMessage.message.trim() && isMounted.current) {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    }
  }

  useEffect(() => {
    if (socket) {
      regAuthHandler(socket);
    }
    return () => {
      if (socket) {
        // handler is removed to prevent memory leaks
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
        // tableId: tableIdRef.current, // this is determined by back end for security reasons
      });
      socket.send(data);
      setNewMessage('');
    } else {
      toast.error('Could not send message');
    }
  };

  return (
    <ChatContainer className="ms-2" isVisible={isVisible}>
      <div className="card text-white chatSize">
        <div className="card-body" style={{ padding: 0, overflowY: 'auto' }}>
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
            style={{
              fontSize: '13px',
            }}
          >
            {t('SEND')}
          </button>
        </div>
      </div>
    </ChatContainer>
  );
};

export default Chat;
