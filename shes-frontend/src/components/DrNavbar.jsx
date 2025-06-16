import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FaHome,
  FaTasks,
  FaNotesMedical,
  FaFileMedical,
  FaCalendarCheck,
  FaChartLine,
  FaBell,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from 'react-icons/fa';

 

export default function DoctorNavbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(prev => !prev);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const getLinkClass = ({ isActive }) =>
    isActive ? 'DoctorNavbar-link active' : 'DoctorNavbar-link';

  return (
    <div className="DoctorNavbar1">
      <nav className="DoctorNavbar-container1">
        <div className="DoctorNavbar-title">WELLNESS</div>

        <div className="DoctorNavbar-toggle" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </div>

        <div className="DoctorNavbar-links desktop-only">
          <NavLink to="/doctor/home" className={getLinkClass}><FaHome /> <span>Home</span></NavLink>
          <NavLink to="/doctor/tasks-history" className={getLinkClass}><FaTasks /> <span>Tasks</span></NavLink>
          <NavLink to="/doctor/patient-management" className={getLinkClass}><FaNotesMedical /> <span>Management</span></NavLink>
          <NavLink to="/doctor/patient-details" className={getLinkClass}><FaFileMedical /> <span>Details</span></NavLink>
          <NavLink to="/doctor/leave-schedule" className={getLinkClass}><FaCalendarCheck /> <span>Schedule</span></NavLink>
          <NavLink to="/doctor/reschedule-appointments" className={getLinkClass}><FaChartLine /> <span>Appointments</span></NavLink>
          <NavLink to="/doctor/chat" className={getLinkClass}>💬 <span>Chat</span></NavLink>
          <NavLink to="/doctor/notifications" className={getLinkClass}><FaBell /> <span>Notifications</span></NavLink>
          <button className="DoctorNavbar-link logout-btn" onClick={handleLogout}><FaSignOutAlt /> <span>Logout</span></button>
        </div>
      </nav>

     
      {isMenuOpen && (
        <div className="DoctorNavbar-mobile-menu">
          <NavLink to="/doctor/home" className={getLinkClass} onClick={toggleMenu}><FaHome /> Home</NavLink>
          <NavLink to="/doctor/tasks-history" className={getLinkClass} onClick={toggleMenu}><FaTasks /> Tasks</NavLink>
          <NavLink to="/doctor/patient-management" className={getLinkClass} onClick={toggleMenu}><FaNotesMedical /> Management</NavLink>
          <NavLink to="/doctor/patient-details" className={getLinkClass} onClick={toggleMenu}><FaFileMedical /> Details</NavLink>
          <NavLink to="/doctor/leave-schedule" className={getLinkClass} onClick={toggleMenu}><FaCalendarCheck /> Schedule</NavLink>
          <NavLink to="/doctor/reschedule-appointments" className={getLinkClass} onClick={toggleMenu}><FaChartLine /> Appointments</NavLink>
          <NavLink to="/doctor/chat" className={getLinkClass} onClick={toggleMenu}>💬 Chat</NavLink>
          <NavLink to="/doctor/notifications" className={getLinkClass} onClick={toggleMenu}><FaBell /> Notifications</NavLink>
          <button className="DoctorNavbar-link logout-btn" onClick={() => { toggleMenu(); handleLogout(); }}><FaSignOutAlt /> Logout</button>
        </div>
      )}
    </div>
  );
}
