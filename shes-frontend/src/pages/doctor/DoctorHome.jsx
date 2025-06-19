import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config/apiConfig';
import './DoctorHome.css';
import DoctorSidebar from '../../components/DoctorSidebar';
import { useNavigate } from 'react-router-dom';
import { FaUserMd, FaChartLine, FaBell, FaProcedures } from 'react-icons/fa';
import Navbar from '../../components/DrNavbar';
import Spinner from '../../components/Spinner';

export default function DoctorHome() {
  const [dailyTasks, setDailyTasks] = useState(null);
  const [performance, setPerformance] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const token = JSON.parse(localStorage.getItem('user'))?.token;
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
const [isLoading, setIsLoading] = useState(true);

  const [adminName, setAdminName] = useState('Dr. Ahmed');

useEffect(() => {
  const storedName = JSON.parse(localStorage.getItem('user'))?.name || 'Doctor';
  setAdminName(storedName);

  const fetchAll = async () => {
    try {
      await Promise.all([
        fetchDailyTasks(),
        fetchPerformanceReport(),
        fetchNotifications(),
        checkNewMessages()
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  fetchAll();
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

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };
if (isLoading) {
  return <Spinner message="Loading doctor dashboard..." />;
}

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      {/* Navbar */}
    
      <Navbar />
      {/* Main Content with Responsive Sidebar */}
      <div className="d-flex flex-grow-1 overflow-hidden position-relative pt-5">
        {/* Sidebar for large screens */}
        <div className="d-none d-lg-block fixed-sidebar-container">
          <DoctorSidebar />
        </div>

        {/* Main Page Content */}
        <main className="flex-grow-1 DRMAIN p-3 p-md-4 overflow-auto">
          <header className="DrHome-header mt-4 mb-4">
            {/* Welcome Message */}
            <div className="DrHome-welcome">
              <h3>Welcome, {adminName}!</h3>
            </div>

            {/* Icons Section */}
            <div className="DrHome-icons">
              <span
                onClick={goToNotf}
                style={{ cursor: 'pointer', position: 'relative' }}
                title="Notifications"
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
                title="Messages"
              >
                💬
                {hasNewMessage && (
                  <span className="DrHome-badge"></span>
                )}
              </span>
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
                <div className="DrHome-rating" style={{ fontSize: '14px', color: '#888' }}>
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

      {/* Responsive Drawer Sidebar */}
      {isSidebarOpen && <div className="drawer-overlay" onClick={() => setIsSidebarOpen(false)}></div>}
      <div className={`drawer-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="drawer-header d-flex justify-content-end p-3">
          <button className="btn btn-close" onClick={() => setIsSidebarOpen(false)}></button>
        </div>

        {/* Mobile User Info */}
        <div className="d-flex flex-column align-items-center mb-4 px-3">
          <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mb-2"
               style={{ width: '50px', height: '50px', fontSize: '1.5rem' }}>
            {adminName.charAt(0).toUpperCase()}
          </div>
          <strong>{adminName}</strong>
          <small className="text-muted">Logged in as Doctor</small>
        </div>

        <DoctorSidebar />

        {/* Mobile Logout Button inside drawer */}
        <div className="mt-auto px-3 pb-4">
          <button
            className="btn btn-danger w-100"
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-right me-1"></i>Logout
          </button>
        </div>
      </div>
    </div>
  );
}