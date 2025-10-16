import React from 'react';

function Sidebar({ users, selectedUser, onSelectUser, onlineUsers, currentUser, onLogout }) {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Chats</h2>
        <button onClick={onLogout} className="logout-btn">
          Logout
        </button>
      </div>
      <div className="user-list">
        {users.map((u) => (
          <div
            key={u._id}
            className={`user-item ${selectedUser?._id === u._id ? 'active' : ''}`}
            onClick={() => onSelectUser(u)}
          >
            <img src={u.avatar} alt={u.username} className="user-avatar" />
            <div className="user-info">
              <div className="user-name">{u.username}</div>
              <div className="user-status-text">{u.status}</div>
            </div>
            <div className={onlineUsers[u._id] ? 'online-indicator' : 'offline-indicator'} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;