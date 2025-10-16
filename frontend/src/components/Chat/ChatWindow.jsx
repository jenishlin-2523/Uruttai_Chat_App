import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import Sidebar from '../Layout/Sidebar';
import ChatList from './ChatList';
import MessageInput from './MessageInput';
import { getAvatarSvg } from '../../utils/avatar'; // <-- import DiceBear utility

function ChatWindow() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState({});
  const [onlineUsers, setOnlineUsers] = useState({});
  const { user, logout } = useAuth();
  const socket = useSocket();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('receive_message', (message) => {
        if (
          (message.sender._id === selectedUser?._id && message.receiver._id === user.id) ||
          (message.sender._id === user.id && message.receiver._id === selectedUser?._id)
        ) {
          setMessages((prev) => [...prev, message]);
        }
      });

      socket.on('user_typing', ({ userId, isTyping }) => {
        setTypingUsers((prev) => ({ ...prev, [userId]: isTyping }));
      });

      socket.on('user_status', ({ userId, online }) => {
        setOnlineUsers((prev) => ({ ...prev, [userId]: online }));
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, online } : u))
        );
      });

      socket.on('message_sent', (message) => {
        setMessages((prev) => [...prev, message]);
      });

      return () => {
        socket.off('receive_message');
        socket.off('user_typing');
        socket.off('user_status');
        socket.off('message_sent');
      };
    }
  }, [socket, selectedUser, user]);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser._id);
    }
  }, [selectedUser]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/auth/users`);
      setUsers(response.data);

      const onlineStatus = {};
      response.data.forEach((u) => {
        onlineStatus[u._id] = u.online;
      });
      setOnlineUsers(onlineStatus);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/messages/${userId}`
      );
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = (content) => {
    if (!selectedUser || !socket) return;

    socket.emit('send_message', {
      sender: user.id,
      receiver: selectedUser._id,
      content,
      messageType: 'text',
    });
  };

  const handleTyping = (isTyping) => {
    if (!selectedUser || !socket) return;

    socket.emit('typing', {
      sender: user.id,
      receiver: selectedUser._id,
      isTyping,
    });
  };

  return (
    <div className="chat-container">
      <Sidebar
        users={users}
        selectedUser={selectedUser}
        onSelectUser={setSelectedUser}
        onlineUsers={onlineUsers}
        currentUser={user}
        onLogout={logout}
      />
      <div className="chat-main">
        {selectedUser ? (
          <>
            <div className="chat-header">
              {/* Use DiceBear avatar SVG instead of <img> */}
              <div
                className="user-avatar"
                dangerouslySetInnerHTML={{ __html: getAvatarSvg(selectedUser._id) }}
              />
              <div className="user-info">
                <div className="user-name">{selectedUser.username}</div>
                <div className="user-status-text">
                  {onlineUsers[selectedUser._id] ? 'Online' : 'Offline'}
                </div>
              </div>
            </div>
            <ChatList
              messages={messages}
              currentUserId={user.id}
              isTyping={typingUsers[selectedUser._id]}
              selectedUser={selectedUser}
            />
            <MessageInput
              onSendMessage={handleSendMessage}
              onTyping={handleTyping}
            />
          </>
        ) : (
          <div className="empty-chat">
            Select a user to start chatting
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatWindow;
