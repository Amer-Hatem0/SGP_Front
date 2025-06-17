import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUserMd, FaClipboardList, FaTasks, FaUserCheck, FaChartBar, FaBars, FaSignOutAlt } from 'react-icons/fa';

export default function SupervisorNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const adminName = localStorage.getItem('adminName') || 'Supervisor';

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem('token');
      localStorage.removeItem('adminName');
      window.location.href = '/login';
    }
  };

  return (
    <>
      <nav className="supervisor-navbar">
        <div className="supervisor-navbar-container d-flex justify-content-between align-items-center px-3 py-2">
          {/* Logo / Title */}
          <div className="supervisor-navbar-brand d-flex align-items-center">
            <FaUserMd size={24} className="me-2" />
            <span>Supervisor Panel</span>
          </div>

          {/* Desktop Navigation Links + Logout Button */}
          <div className="d-none d-lg-flex align-items-center gap-4">
            <ul className="supervisor-navbar-links d-flex align-items-center gap-4 mb-0">
              <li>
                <Link to="/supervisor/home" className={({ isActive }) => isActive ? "active" : ""}>
                  <FaClipboardList /> <span>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link to="/supervisor/leave-requests" className={({ isActive }) => isActive ? "active" : ""}>
                  <FaTasks /> <span>Leave Requests</span>
                </Link>
              </li>
              <li>
                <Link to="/supervisor/assign-patient" className={({ isActive }) => isActive ? "active" : ""}>
                  <FaUserCheck /> <span>Assign Patient</span>
                </Link>
              </li>
              <li>
                <Link to="/supervisor/verify-patients" className={({ isActive }) => isActive ? "active" : ""}>
                  <FaUserMd /> <span>Verify Patients</span>
                </Link>
              </li>
              <li>
                <Link to="/supervisor/performance" className={({ isActive }) => isActive ? "active" : ""}>
                  <FaChartBar /> <span>Performance</span>
                </Link>
              </li>
            </ul>

            {/* Logout Button (Desktop) */}
            <button
              className="btn btn-outline-light btn-sm ms-2"
              onClick={handleLogout}
              style={{ marginLeft: '2rem' }}
            >
              <FaSignOutAlt className="me-1" /> Logout
            </button>
          </div>

          {/* Mobile Toggle Button */}
          <button
            className="btn btn-outline-light d-lg-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <FaBars size={20} />
          </button>
        </div>
      </nav>

      {/* Responsive Drawer Menu */}
      {isMenuOpen && <div className="drawer-overlay" onClick={toggleMenu}></div>}
      <div className={`drawer-menu ${isMenuOpen ? 'open' : ''}`}>
        <div className="drawer-header d-flex justify-content-between align-items-center px-3 py-3">
          <strong>{adminName}</strong>
          <button className="btn btn-close" onClick={toggleMenu}></button>
        </div>

        <ul className="drawer-nav flex-column px-3 gap-3">
          <li><Link to="/supervisor/home" onClick={toggleMenu}>🏠 Dashboard</Link></li>
          <li><Link to="/supervisor/leave-requests" onClick={toggleMenu}>📝 Leave Requests</Link></li>
          <li><Link to="/supervisor/assign-patient" onClick={toggleMenu}>👥 Assign Patient</Link></li>
          <li><Link to="/supervisor/verify-patients" onClick={toggleMenu}>✅ Verify Patients</Link></li>
          <li><Link to="/supervisor/performance" onClick={toggleMenu}>📊 Performance</Link></li>
        </ul>

        <div className="drawer-footer px-3 py-3 mt-auto border-top">
          <button
            className="btn btn-danger w-100"
            onClick={handleLogout}
          >
            🔐 Logout
          </button>
        </div>
      </div>
    </>
  );
}