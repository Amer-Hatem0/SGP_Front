import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './Logo.png';

const AdminNavbar = ({ onMenuToggle, isSidebarOpen }) => {
  const navigate = useNavigate();
  const adminName = localStorage.getItem('adminName') || 'Admin';

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('adminName');
      navigate('/login'); // ✅ بدون إعادة تحميل الصفحة
    }
  };

  return (
    <nav className="navbar navbar-expand-lg text-white fixed-navbar" style={{
      background: 'linear-gradient(135deg, rgb(255, 255, 255), rgb(255, 255, 255))',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      padding: '1rem 2rem'
    }}>
      <div className="container-fluid d-flex align-items-center justify-content-between">
        <a className="navbar-brand fw-bold fs-4 d-flex align-items-center gap-2" href="/admin">
          <img src={logo} alt="Wellness Logo" style={{ width: '200px', height: '60px' }} />
        </a>

        {/* Desktop */}
        <div className="d-none d-lg-flex align-items-center text-black gap-3">
          <span className="d-flex flex-column align-items-end">
            <small className="opacity-75">Logged in as</small>
            <strong className="fs-6">{adminName}</strong>
          </span>

          <div className="rounded-circle ccccccc text-white d-flex align-items-center justify-content-center"
               style={{ width: '40px', height: '40px', fontSize: '1.1rem' }}>
            {adminName.charAt(0).toUpperCase()}
          </div>

          <button
            className="btn btn-outline-primary btn-sm ms-2 d-flex align-items-center"
            style={{ fontWeight: '500', borderRadius: '8px', padding: '6px 12px' }}
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-right me-1" style={{ fontSize: "1rem" }}></i>
            Logout
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="qq btn d-lg-none"
          onClick={onMenuToggle}
          aria-label="Toggle menu"
        >
          <i className="bi bi-list" style={{ fontSize: "1.5rem" }}></i>
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
