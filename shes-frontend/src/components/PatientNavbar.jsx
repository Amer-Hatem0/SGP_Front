import React from 'react';
import { FaBell } from 'react-icons/fa';
 

export default function PatientNavbar() {
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const name = user.name || 'Patient';
  const today = new Date().toLocaleDateString();

  return (
    <header className="patient-navbar">
      <div className="navbar-left">
        <h2 className="navbar-greeting">👋 Welcome, {name}</h2>
        <span className="navbar-date">{today}</span>
      </div>

      <div className="navbar-right">
        <button className="navbar-icon-btn">
          <FaBell />
        </button>
        <img
          src="https://i.pravatar.cc/150?img=11"
          alt="avatar"
          className="navbar-avatar"
        />
      </div>
    </header>
  );
}
