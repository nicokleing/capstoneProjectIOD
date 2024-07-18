// src/pages/AdminPanel.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io("http://localhost:5000");

const AdminPanel = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    axios.get('/api/chat/messages').then(response => {
      setMessages(response.data);
    });

    socket.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  return (
    <div>
      <h1>Admin Panel - Chat</h1>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={msg.user.email === localStorage.getItem('email') ? 'my-message' : 'other-message'}>
            <strong>{msg.user.name}: </strong>{msg.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;
