import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaTachometerAlt, FaUser, FaStethoscope, FaCalendarAlt,
  FaFileMedical, FaHistory, FaBars, FaArrowRight, FaBell
} from 'react-icons/fa';
 

export default function PatientSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const name = user.name || 'Patient';
  const today = new Date().toLocaleDateString();

  return (
    <>
      {/* Sidebar */}
      <aside className={`patient-sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="patient-logo">
            {collapsed ? (
              <button className="expand-btn" onClick={() => setCollapsed(false)}>
               <FaArrowRight />
              </button>
            ) : (
              <>
                ➕ Hospital
                <button className="collapse-btn" onClick={() => setCollapsed(true)}>
                  <FaBars />
                </button>
              </>
            )}
          </div>
        </div>

        <nav className="patient-nav">
          <Link to="/patient/home" className="patient-nav-link">
            <FaTachometerAlt />
            {!collapsed && <span>Dashboard</span>}
          </Link>
          <Link to="/patient/profile" className="patient-nav-link">
            <FaUser />
            {!collapsed && <span>Profile</span>}
          </Link>
          <Link to="/patient/doctors" className="patient-nav-link">
            <FaStethoscope />
            {!collapsed && <span>Doctors</span>}
          </Link>
          <Link to="/patient/appointments" className="patient-nav-link">
            <FaCalendarAlt />
            {!collapsed && <span>My Appointments</span>}
          </Link>
          <Link to="/patient/upload-report" className="patient-nav-link">
            <FaFileMedical />
            {!collapsed && <span>My Reports</span>}
          </Link>


          
          <Link to="/patient/MedicalHistory" className="patient-nav-link">
            <FaHistory />
            {!collapsed && <span>Medical History</span>}
          </Link>
           <Link to="/ChatPage" className="patient-nav-link">
            <FaHistory />
            {!collapsed && <span>Chat</span>}
          </Link>
        </nav>
      </aside>

      {/* Top Navbar */}
      {/* <header
        className="patient-topbar"
        style={{ marginLeft: collapsed ? '70px' : '240px' }}
      >
        <div className="topbar-left">
          <h2> Welcome {name} 👋</h2>
          <span>{today}</span>
        </div>
        <div className="topbar-right">
          <button className="topbar-icon">
            <FaBell />
          </button>
          <img
            src="https://i.pravatar.cc/150?img=11"
            alt="avatar"
            className="topbar-avatar"
          />
        </div>
      </header> */}
    </>
  );
}
