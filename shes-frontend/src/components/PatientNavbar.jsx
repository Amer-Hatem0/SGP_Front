import React, { useState, useEffect } from 'react';
import { 
  FaBell, FaSignOutAlt, FaUserCog, FaUser, FaBars, FaTimes,
  FaTachometerAlt, FaStethoscope, FaCalendarAlt, 
  FaFileMedical, FaHistory, FaCommentAlt
} from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom'; 
import logo from './logo.png';  
import axios from 'axios';
import API_BASE_URL from '../config/apiConfig';

export default function PatientNavbar() {
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const storedName = localStorage.getItem('patientName');
  const name = storedName || user.name || 'Patient';  
  const role = user.role || 'Patient';
  const location = useLocation();
  
  const [darkMode, setDarkMode] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [fullName, setFullName] = useState('');

  const initial = fullName.charAt(0).toUpperCase();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user.token;
        const decoded = JSON.parse(atob(token.split('.')[1]));
        const userId = parseInt(decoded.userId || decoded.sub);

        const profileRes = await axios.get(`${API_BASE_URL}/Patient/Profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFullName(profileRes.data.fullName);
      } catch (err) {
        console.error("Error fetching data", err);
      }
    };

    fetchData();
  }, []);

  const navLinks = [
    { path: "/patient/home", icon: <FaTachometerAlt />, label: "Dashboard" },
    { path: "/patient/profile", icon: <FaUser />, label: "Profile" },
    { path: "/patient/doctors", icon: <FaStethoscope />, label: "Doctors" },
    { path: "/patient/appointments", icon: <FaCalendarAlt />, label: "Appointments" },
    { path: "/patient/upload-report", icon: <FaFileMedical />, label: "Reports" },
    { path: "/patient/MedicalHistory", icon: <FaHistory />, label: "History" },
    { path: "/ChatPage", icon: <FaCommentAlt />, label: "Chat" }
  ];

  return (
    <>
      <nav className={`navbar ${darkMode ? 'navbar-dark bg-dark' : 'navbar-light bg-white'} shadow-sm`}>
        <div className="container-fluid">
          {/* Logo and Mobile Menu Toggle */}
          <div className="d-flex align-items-center">
            <Link to="/patient/home" className="navbar-brand">
              <img src={logo} alt="Wellness Logo" style={{ height: '30px' }} />
            </Link>
          </div>

          {/* Desktop Navigation (hidden on mobile) */}
          <div className="d-none d-lg-flex align-items-center flex-grow-1">
            <div className="d-flex justify-content-center flex-grow-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`nav-link mx-1 ${darkMode ? 'text-light' : 'text-dark'} ${location.pathname === link.path ? (darkMode ? 'active bg-primary' : 'active bg-primary text-white') : ''}`}
                  style={{
                    borderRadius: '4px',
                    padding: '0.5rem 1rem',
                    fontSize: '0.9rem'
                  }}
                >
                  <span className="me-2">{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="d-flex align-items-center">
            {/* Mobile Menu Button (hidden on desktop) */}
            <button 
              className="navbar-toggler ms-2 d-lg-none border-0" 
              type="button" 
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              aria-label="Toggle navigation"
            >
              {showMobileMenu ? (
                <FaTimes className={darkMode ? 'text-light' : 'text-dark'} size={20} />
              ) : (
                <FaBars className={darkMode ? 'text-light' : 'text-dark'} size={20} />
              )}
            </button>

            {/* Notification Bell (hidden on mobile when menu is open) */}
            {!showMobileMenu && (
              <div className="position-relative me-2">
                <button 
                  className={`btn btn-sm ${darkMode ? 'btn-outline-light' : 'btn-outline-secondary'} rounded-circle p-2`}
                  aria-label="Notifications"
                >
                  <FaBell size={16} />
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    3
                  </span>
                </button>
              </div>
            )}

            {/* User Dropdown (hidden on mobile when menu is open) */}
            {!showMobileMenu && (
              <div className="dropdown">
                <button
                  className="btn p-0 border-0 bg-transparent d-flex align-items-center"
                  onClick={() => setShowDropdown(!showDropdown)}
                  aria-expanded={showDropdown}
                >
                  <div 
                    className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                    style={{ 
                      width: '36px', 
                      height: '36px', 
                      backgroundColor: '#0d6efd',
                      fontSize: '14px'
                    }}
                  >
                    {initial}
                  </div>
                  <span className={`ms-2 d-none d-md-inline ${darkMode ? 'text-light' : 'text-dark'}`}>
                    {name}
                  </span>
                </button>

                <div 
                  className={`dropdown-menu dropdown-menu-end mt-2 shadow ${showDropdown ? 'show' : ''} ${darkMode ? 'bg-dark border-secondary' : 'bg-white border-light'}`}
                  style={{ minWidth: '220px' }}
                >
                  <div className="dropdown-header px-3 py-2">
                    <div className="fw-bold">{name}</div>
                    <small className={`${darkMode ? 'text-light' : 'text-muted'}`}>{role}</small>
                  </div>
                  <div className="dropdown-divider" />
                  <Link 
                    to="/patient/profile" 
                    className={`dropdown-item ${darkMode ? 'text-light hover-dark' : 'text-dark hover-light'}`}
                    onClick={() => setShowDropdown(false)}
                  >
                    <FaUser className="me-2" /> My Profile
                  </Link>
                  <Link 
                    to="/settings" 
                    className={`dropdown-item ${darkMode ? 'text-light hover-dark' : 'text-dark hover-light'}`}
                    onClick={() => setShowDropdown(false)}
                  >
                    <FaUserCog className="me-2" /> Settings
                  </Link>
                  <div className="dropdown-divider" />
                  <button 
                    className="dropdown-item text-danger"
                    onClick={() => {
                      localStorage.removeItem('token');
                      localStorage.removeItem('adminName');
                      window.location.href = '/login';
                    }}
                  >
                    <FaSignOutAlt className="me-2" /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Menu */}
      <div 
        className={`mobile-sidebar ${darkMode ? 'dark' : 'light'} ${showMobileMenu ? 'open' : ''}`}
        onClick={() => setShowMobileMenu(false)}
      >
        <div 
          className={`sidebar-content ${darkMode ? 'bg-dark' : 'bg-light'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sidebar-header d-flex justify-content-between align-items-center p-3 border-bottom">
            <div className="user-info d-flex align-items-center">
              <div 
                className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-3"
                style={{ 
                  width: '40px', 
                  height: '40px', 
                  backgroundColor: '#0d6efd',
                  fontSize: '16px'
                }}
              >
                {initial}
              </div>
              <div>
                <h6 className="mb-0 fw-bold">{name}</h6>
                <small className={darkMode ? 'text-light' : 'text-muted'}>{role}</small>
              </div>
            </div>
            <button 
              className="btn p-0 border-0 bg-transparent"
              onClick={() => setShowMobileMenu(false)}
              aria-label="Close menu"
            >
              <FaTimes className={darkMode ? 'text-light' : 'text-dark'} />
            </button>
          </div>

          <div className="sidebar-menu p-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link d-flex align-items-center py-3 ${darkMode ? 'text-light' : 'text-dark'} ${location.pathname === link.path ? (darkMode ? 'active bg-primary' : 'active bg-primary text-white') : ''}`}
                onClick={() => setShowMobileMenu(false)}
                style={{
                  borderRadius: '4px',
                  padding: '0.5rem 1rem',
                  margin: '0.25rem 0'
                }}
              >
                <span className="me-3" style={{ width: '24px' }}>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}

            <div className="mt-4 pt-3 border-top">
              <Link 
                to="/patient/profile" 
                className={`nav-link d-flex align-items-center py-2 ${darkMode ? 'text-light' : 'text-dark'}`}
                onClick={() => setShowMobileMenu(false)}
              >
                <FaUser className="me-3" /> My Profile
              </Link>
              <Link 
                to="/settings" 
                className={`nav-link d-flex align-items-center py-2 ${darkMode ? 'text-light' : 'text-dark'}`}
                onClick={() => setShowMobileMenu(false)}
              >
                <FaUserCog className="me-3" /> Settings
              </Link>
              <button 
                className={`nav-link d-flex align-items-center py-2 w-100 text-start ${darkMode ? 'text-light' : 'text-dark'}`}
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('adminName');
                  window.location.href = '/login';
                }}
              >
                <FaSignOutAlt className="me-3" /> Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add this CSS to your stylesheet */}
      <style jsx>{`
        .mobile-sidebar {
          position: fixed;
          top: 0;
          right: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0,0,0,0.5);
          z-index: 1050;
          transform: translateX(100%);
          transition: transform 0.3s ease-out;
        }
        
        .mobile-sidebar.open {
          transform: translateX(0);
        }
        
        .sidebar-content {
          position: absolute;
          top: 0;
          right: 0;
          width: 320px;
          height: 100%;
          overflow-y: auto;
          box-shadow: -2px 0 10px rgba(0,0,0,0.1);
          transform: translateX(100%);
          transition: transform 0.3s ease-out;
        }
        
        .mobile-sidebar.open .sidebar-content {
          transform: translateX(0);
        }
        
        @media (max-width: 576px) {
          .sidebar-content {
            width: 280px;
          }
        }
      `}</style>
    </>
  );
}