 
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config/apiConfig';
import './DoctorHome.css';
import DoctorSidebar from '../../components/DoctorSidebar';
import { useNavigate } from 'react-router-dom';
import { FaUserMd, FaChartLine, FaBell, FaProcedures } from 'react-icons/fa';

export default function DoctorHome() {
  const [dailyTasks, setDailyTasks] = useState(null);
  const [performance, setPerformance] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const token = JSON.parse(localStorage.getItem('user'))?.token;
  const navigate = useNavigate();
const [unreadCount, setUnreadCount] = useState(0);
  useEffect(() => {
    fetchDailyTasks();
    fetchPerformanceReport();
    fetchNotifications();
    checkNewMessages();
  }, []);

  const fetchDailyTasks = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/Doctor/DailyTasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDailyTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPerformanceReport = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/Doctor/PerformanceReport`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPerformance(res.data);
    } catch (err) {
      console.error(err);
    }
  };

//  const fetchNotifications = async () => {
//   try {
//     const token = JSON.parse(localStorage.getItem('user')).token;
//     const decoded = JSON.parse(atob(token.split('.')[1]));
//     const userId = parseInt(decoded.userId || decoded.sub);  

//     const res = await axios.get(`${API_BASE_URL}/Notification/User/${userId}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     setNotifications(res.data);
//   } catch (err) {
//     console.error(err);
//   }
// };


 
const fetchNotifications = async () => {
  try {
    const token = JSON.parse(localStorage.getItem('user')).token;
    const decoded = JSON.parse(atob(token.split('.')[1]));
    const userId = parseInt(decoded.userId || decoded.sub);  

    const res = await axios.get(`${API_BASE_URL}/Notification/ByUser/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const all = res.data;
    setNotifications(all);
    setUnreadCount(all.filter(n => !n.isRead).length);
  } catch (err) {
    console.error(err);
  }
};


  const checkNewMessages = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/Doctor/DoctorHasNewMessages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHasNewMessage(res.data === true);
    } catch (err) {
      console.error('Error checking messages');
    }
  };

  const goToChat = () => {
    navigate('/doctor/chat');
  };

    const goToNotf = () => {
    navigate('/doctor/Notifications');
  };

  return (
    <div className="DrHome-container-full">
      <DoctorSidebar />

      <main className="DrHome-main">
        <header className="DrHome-header">
          <input type="text" placeholder="Search here..." className="DrHome-search" />
          <div className="DrHome-icons">
       <span
  onClick={goToNotf}
  style={{ cursor: 'pointer', position: 'relative' }}
>
  🔔
  {unreadCount > 0 && (
    <>
      <span className="DrHome-badge-green"></span>
      <span className="DrHome-unread-count">{unreadCount}</span>
    </>
  )}
</span>



            <span
              onClick={goToChat}
              style={{ cursor: 'pointer', position: 'relative' }}
            >
              💬
              {hasNewMessage && (
                <span className="DrHome-badge"></span>
              )}
            </span>

            <img src="https://i.pravatar.cc/40" alt="profile" className="DrHome-avatar" />
          </div>
        </header>

        <section className="DrHome-stats">
          <div className="DrHome-card">
            <FaUserMd size={28} className="text-[#25a6e9]" />
            <div>
              <div className="DrHome-stat-number">{dailyTasks?.appointmentsToday ?? '...'}</div>
              <div className="DrHome-stat-label">Today's Appointments</div>
            </div>
          </div>

          <div className="DrHome-card">
            <FaChartLine size={28} className="text-[#f39c12]" />
            <div>
             <div className="DrHome-rating" style={{  fontSize: '14px', color: '#888' }}>
  ⭐ Rating: {performance?.rating ?? 'N/A'} / 5
</div>

              <div className="DrHome-stat-label pt-4">Performance Score</div>
            </div>
          </div>

          <div className="DrHome-card">
            <FaBell size={28} className="text-[#e74c3c]" />
            <div>
              <div className="DrHome-stat-number">{unreadCount}</div>
              <div className="DrHome-stat-label">New Notifications</div>
            </div>
          </div>

          <div className="DrHome-card">
            <FaProcedures size={28} className="text-[#26c6da]" />
            <div>
              <div className="DrHome-stat-number">{dailyTasks?.patientsNeedingFollowUp ?? '...'}</div>
              <div className="DrHome-stat-label">Patients to Follow Up</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
