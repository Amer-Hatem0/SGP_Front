import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from './logo.png';

const Header = () => {
  const location = useLocation();

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
        <div className="container d-flex justify-content-between align-items-center">
          {/* Logo */}
          <Link className="navbar-brand" to="/">
            <img src={logo} alt="Logo" height="60" width="160" />
          </Link>

          {/* Toggle button for small screens */}
          <button
            className="navbar-toggler d-lg-none"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#mobileMenu"
            aria-controls="mobileMenu"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Desktop Menu */}
          <div className="d-none d-lg-flex align-items-center gap-4">
            <ul className="navbar-nav d-flex flex-row gap-3 mb-0">
              {['/home', '/about', '/services', '/doctors', '/contact'].map((path, idx) => {
                const labels = ['Home', 'About', 'Services', 'Doctors', 'Contact'];
                return (
                  <li className="nav-item" key={path}>
                    <Link
                      className={`nav-link fw-medium ${location.pathname === path ? 'active' : ''}`}
                      to={path}
                    >
                      {labels[idx]}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="d-flex gap-2">
              <Link className="btn btn-outline-primary px-4" to="/login">Login</Link>
              <Link className="btn btn-primary px-4" to="/register">Register</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Offcanvas Menu for Small Screens */}
      <div
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id="mobileMenu"
        aria-labelledby="mobileMenuLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="mobileMenuLabel">Menu</h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body d-flex flex-column gap-3">
          <Link className="nav-link" to="/home">Home</Link>
          <Link className="nav-link" to="/about">About</Link>
          <Link className="nav-link" to="/services">Services</Link>
          <Link className="nav-link" to="/doctors">Doctors</Link>
          <Link className="nav-link" to="/contact">Contact</Link>
          <hr />
          <Link className="btn btn-outline-primary w-100" to="/login">Login</Link>
          <Link className="btn btn-primary w-100" to="/register">Register</Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
