import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config/apiConfig';
 import DoctorSidebar from '../../components/DoctorSidebar';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const token = JSON.parse(localStorage.getItem('user'))?.token;

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const userId = parseInt(decoded.sub);
      const res = await axios.get(`${API_BASE_URL}/Notification/ByUser/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data);
    } catch (error) {
      console.error('Failed to load notifications', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`${API_BASE_URL}/Notification/MarkAsRead/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) =>
        prev.map((n) => (n.notificationID === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error('Failed to mark as read', error);
    }
  };

  return (
    <div className="notifications-container">
   <DoctorSidebar />
        <div className="nc">
      <h2>🔔 Notifications</h2>
      {notifications.length === 0 ? (
        <p>No notifications available.</p>
      ) : (
      <ul className="notifications-list">
  {notifications.map((notification) => (
    <li
      key={notification.notificationID}
      className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}
    >
      <div className="notification-content">
        <strong>{notification.title}</strong>
        <p>{notification.message}</p>
        <small>{new Date(notification.createdAt).toLocaleString()}</small>
      </div>
      {!notification.isRead && (
        <button onClick={() => markAsRead(notification.notificationID)}>Mark as read</button>
      )}
    </li>
  ))}
</ul>

      )}
    </div></div>
  );
}
