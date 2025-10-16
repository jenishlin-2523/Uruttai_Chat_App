import React, { useEffect, useRef } from 'react';
import { format } from 'date-fns';

function ChatList({ messages, currentUserId, isTyping, selectedUser }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="chat-messages">
      {messages.map((message) => (
        <div
          key={message._id}
          className={`message ${
            message.sender._id === currentUserId ? 'message-sent' : 'message-received'
          }`}
        >
          <div className="message-content">{message.content}</div>
          <div className="message-time">
            {format(new Date(message.createdAt), 'HH:mm')}
          </div>
        </div>
      ))}
      {isTyping && (
        <div className="typing-indicator">
          {selectedUser.username} is typing...
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default ChatList;