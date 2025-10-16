import React from 'react';
import { getAvatarSvg } from '../../utils/avatar';

function Sidebar({ users, selectedUser, onSelectUser, onlineUsers, currentUser, onLogout }) {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Uruttai Chat</h2>
        <button onClick={onLogout} className="logout-btn">Logout</button>
      </div>

      <div className="user-list">
        {users.map((u) => (
          <div
            key={u._id}
            className={`user-item ${selectedUser?._id === u._id ? 'active' : ''}`}
            onClick={() => onSelectUser(u)}
          >
            <div
              className="user-avatar"
              dangerouslySetInnerHTML={{ __html: getAvatarSvg(u._id) }}
            />
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
