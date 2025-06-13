 
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/apiConfig';
import './ChatBox.css';

export default function ChatBox({ receiverId, receiverName }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messageEndRef = useRef(null);

  const currentUser = JSON.parse(localStorage.getItem('user'));
  const token = currentUser?.token;

  let senderId;
  try {
    const decoded = JSON.parse(atob(token.split('.')[1]));
    senderId = parseInt(decoded.sub);
  } catch {}

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/Chat/conversation/${senderId}/${receiverId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data);
      scrollToBottom();
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const markAllUnreadAsRead = async (msgs) => {
    try {
      for (const msg of msgs) {
        if (!msg.isRead && msg.receiverId === senderId) {
          await axios.put(`${API_BASE_URL}/Chat/MarkAsRead/${msg.messageID}`, {}, {
            headers: { Authorization: `Bearer ${token}` },
          });
        }
      }
    } catch (err) {
      console.error("Failed to mark messages as read", err);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      await axios.post(`${API_BASE_URL}/Chat/send`, {
        senderUserID: senderId,
        receiverUserID: receiverId,
        content: newMessage
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewMessage('');
      fetchMessages();
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  const scrollToBottom = () => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

 
  useEffect(() => {
    if (!receiverId) return;

    const init = async () => {
      await fetchMessages();
    };
    init();

    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [receiverId]);

  
  useEffect(() => {
    if (messages.length === 0) return;

    const lastMessage = messages[messages.length - 1];

    

    markAllUnreadAsRead(messages);
  }, [messages]);

  return (
    <div className="chatbox-container">
      <div className="chatbox-header">
        <h3>💬 Chatting with: {receiverName || 'Unknown'}</h3>
      </div>
      <div className="chatbox-messages">
        {messages.map((msg) => (
          <div key={msg.messageID} className={`chatbox-message ${msg.senderUserID === senderId ? 'sent' : 'received'}`}>
            <div className="chatbox-bubble">
              {msg.content}
           
              <div className="message-time">
                {new Date(new Date(msg.sentAt).getTime() + 3 * 60 * 60 * 1000).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
              
            </div>
               {msg.isRead && (
                <span className="read-indicator"> ✓✓</span>
              )}
               {msg.isRead ==0 && (
                <span className="read-indicator"> ✓</span>
              )}
          </div>
        ))}
        <div ref={messageEndRef}></div>
      </div>
      <div className="chatbox-input">
        <input
          type="text"
          placeholder="Write your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
