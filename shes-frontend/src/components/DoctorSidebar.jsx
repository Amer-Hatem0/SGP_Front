 
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaHome,
  FaTasks,
  FaNotesMedical,
  FaFileMedical,
  FaCalendarCheck,
  FaChartLine,
  FaBell,
} from 'react-icons/fa';

import './DoctorSidebar.css';

/**
 * DoctorSidebar Component
 * Sidebar for the doctor dashboard with navigation links.
 */
export default function DoctorSidebar() {
  /**
   * Returns appropriate class name based on active state of NavLink
   * @param {Object} param0 - NavLink state object
   * @returns {string} Class name
   */
  const getLinkClass = ({ isActive }) =>
    isActive ? 'DoctorSidebar-link DoctorSidebar-active' : 'DoctorSidebar-link';

  return (
    <div className="DoctorSidebar-container">
      {/* Logo / Title */}
      <h2 className="DoctorSidebar-title">SHES Doctor</h2>

      {/* Navigation Menu */}
      <nav className="DoctorSidebar-nav">
        <NavLink to="/doctor/home" className={getLinkClass}>
          <FaHome /> <span>Home</span>
        </NavLink>

        <NavLink to="/doctor/tasks-history" className={getLinkClass}>
          <FaTasks /> <span>Tasks & History</span>
        </NavLink>

        <NavLink to="/doctor/patient-management" className={getLinkClass}>
          <FaNotesMedical /> <span>Patient Management</span>
        </NavLink>

        <NavLink to="/doctor/patient-details" className={getLinkClass}>
          <FaFileMedical /> <span>Patient Details</span>
        </NavLink>

        <NavLink to="/doctor/leave-schedule" className={getLinkClass}>
          <FaCalendarCheck /> <span>Leave & Schedule</span>
        </NavLink>

        <NavLink to="/doctor/reschedule-appointments" className={getLinkClass}>
          <FaChartLine /> <span>My Appointments</span>
        </NavLink>

        <NavLink to="/doctor/chat" className={getLinkClass}>
          💬 <span>Chat</span>
        </NavLink>

        <NavLink to="/doctor/notifications" className={getLinkClass}>
          <FaBell /> <span>Notifications</span>
        </NavLink>
      </nav>
    </div>
  );
}