import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from './logo.png';

const navLinks = [
  { to: '/home', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/doctors', label: 'Doctors' },
  { to: '/contact', label: 'Contact' },
];

const Header = () => {
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Close drawer on link click
  const handleLinkClick = () => setDrawerOpen(false);

  return (
    <>
      <header>
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
          <div className="container d-flex align-items-center justify-content-between">
            {/* Logo */}
               <img src={logo} alt="Logo" height="70" width="200" className="d-inline-block align-text-top" />
           
            {/* Hamburger Icon for mobile/medium screens */}
            <button
              className="d-lg-none btn"
              style={{ fontSize: 28 }}
              aria-label="Open menu"
              onClick={() => setDrawerOpen(true)}
            >
              <span className="bi bi-list"></span>
            
            </button>

            {/* Desktop Links */}
            <ul className="navbar-nav d-none d-lg-flex flex-row gap-3 mb-0">
              {navLinks.map(link => (
                <li className="nav-item zzz1" key={link.to}>
                  <Link
                    className={`nav-link fw-medium ${location.pathname === link.to ? 'active' : ''}`}
                    to={link.to}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="d-none d-lg-flex gap-2">
              <Link className="btn btn-outline-primary px-4" to="/login">Login</Link>
              <Link className="btn btn-primary px-4" to="/register">Register</Link>
            </div>
          </div>
        </nav>
      </header>
      
      {/* Sidebar Drawer */}
      <div className={`drawer-overlay ${drawerOpen ? 'open' : ''}`} onClick={() => setDrawerOpen(false)} />
      <div className={`drawer ${drawerOpen ? 'open' : ''}`}>
        <div className="drawer-header d-flex justify-content-between align-items-center p-3 border-bottom">
          <img src={logo} alt="Logo" height="32" />
          <button className="btn" onClick={() => setDrawerOpen(false)} style={{ fontSize: 22 }}>×</button>
        </div>
        <ul className="list-unstyled p-3">
          {navLinks.map(link => (
            <li key={link.to} className="mb-2">
              <Link
                className={`nav-link fw-medium ${location.pathname === link.to ? 'active' : ''}`}
                to={link.to}
                onClick={handleLinkClick}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li className="mb-2">
            <Link className="btn btn-outline-primary w-100 mb-2" to="/login" onClick={handleLinkClick}>Login</Link>
          </li>
          <li>
            <Link className="btn btn-primary w-100" to="/register" onClick={handleLinkClick}>Register</Link>
          </li>
        </ul>
      </div>

      {/* Minimal CSS for drawer */}
      <style>
        {`
        .drawer {
          position: fixed;
          top: 0;
          right: -320px;
          width: 320px;
          height: 100vh;
          background: #fff;
          box-shadow: -2px 0 12px rgba(0,0,0,0.12);
          transition: right 0.3s cubic-bezier(.65,.05,.36,1);
          z-index: 1040;
          overflow-y: auto;
        }
        .drawer.open {
          right: 0;
        }
        .drawer-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0,0,0,0.18);
          opacity: 0;
          z-index: 1035;
          pointer-events: none;
          transition: opacity 0.2s;
        }
        .drawer-overlay.open {
          opacity: 1;
          pointer-events: auto;
        }
        `}
      </style>
    </>
  );
};

export default Header;
