import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaTasks, FaNotesMedical, FaFileMedical, FaCalendarCheck, FaChartLine, FaBell } from 'react-icons/fa';
import './DoctorSidebar.css';

export default function DoctorSidebar() {
  const getLinkClass = ({ isActive }) =>
    isActive ? 'DoctorSidebar-link DoctorSidebar-active' : 'DoctorSidebar-link';

  return (
    <div className="DoctorSidebar-container">
      <h2 className="DoctorSidebar-title">SHES</h2>
      <nav className="DoctorSidebar-nav">
        <NavLink to="/doctor/home" className={getLinkClass}><FaHome /> Home</NavLink>
        <NavLink to="/doctor/tasks-history" className={getLinkClass}><FaTasks /> Tasks & History</NavLink>
        <NavLink to="/doctor/patient-management" className={getLinkClass}><FaNotesMedical /> Patient Management</NavLink>
        <NavLink to="/doctor/patient-details" className={getLinkClass}><FaFileMedical /> Patient Details</NavLink>
        <NavLink to="/doctor/leave-schedule" className={getLinkClass}><FaCalendarCheck /> Leave & Schedule</NavLink>
        <NavLink to="/doctor/RescheduleAppointments" className={getLinkClass}><FaChartLine /> My Appointments</NavLink>
        <NavLink to="/doctor/chat" className={getLinkClass}>💬    chat</NavLink>
          <NavLink to="/doctor/Notifications" className={getLinkClass}><FaBell /> Notifications</NavLink>
      </nav>
    </div>
  );
}
