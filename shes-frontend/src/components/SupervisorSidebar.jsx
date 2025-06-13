 
import React from 'react';
import { Link } from 'react-router-dom';
 
import { FaUserMd, FaClipboardList, FaBoxes, FaUserCheck, FaChartBar, FaBell, FaTasks } from 'react-icons/fa';
import '../pages/supervisor/SupervisorDashboard.css';
export default function SupervisorSidebar({ isOpen, toggleSidebar }) {
  return (
    <div className={`supervisor-sidebar ${isOpen ? 'open' : 'closed'}`}>
      <h3 className="supervisor-sidebar-title">Supervisor</h3>
      <ul className="supervisor-sidebar-list">
        <li><FaClipboardList /> <Link to="/supervisor/home">Dashboard</Link></li>
        <li><FaTasks /> <Link to="/supervisor/leave-requests">Leave Requests</Link></li>
        {/* <li><FaBoxes /> <Link to="/supervisor/inventory">Inventory</Link></li> */}
        <li><FaUserCheck /> <Link to="/supervisor/assign-patient">Assign Patient</Link></li>
        <li><FaUserMd /> <Link to="/supervisor/verify-patients">Verify Patients</Link></li>
        <li><FaChartBar /> <Link to="/supervisor/performance">Performance</Link></li>
        
      </ul>
    </div>
  );
}
