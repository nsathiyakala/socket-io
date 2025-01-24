"use client"
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:8000');

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Fetch initial messages
    fetch('http://localhost:8000/chat/getMessage')
      .then((res) => res.json())
      .then((data) => setMessages(data.message));

    // Listen for new messages
    socket.on('receiveMessage', (message) => {
        // alert("sent")
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  console.log(messages);
  

  const sendMessage = () => {
    if (newMessage.trim() && username.trim()) {
      const messageData = { sender:username, receiver: 'receiver', message: newMessage };
      socket.emit('sendMessage', messageData);
      setNewMessage('');
    }
  };

  return (
    <div>
      <h4>Chats</h4>
      <input
        type="text"
        placeholder="Enter your name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <div>
        <div style={{ height: '300px', overflowY: 'scroll' }}>
          {messages.map((msg, index) => (
            <div key={index}>
              <strong>{msg.sender}:</strong> {msg.message}
            </div>
          ))}
        </div>
        <input
          type="text"
          placeholder="Type a message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
