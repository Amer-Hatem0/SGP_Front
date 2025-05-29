// SupervisorDashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config/apiConfig';
import SupervisorSidebar from '../../components/SupervisorSidebar';
import { FaBell, FaEnvelope, FaPlusCircle, FaClipboardCheck, FaUserCheck } from 'react-icons/fa';
import './SupervisorDashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

export default function SupervisorDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [overview, setOverview] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [unverifiedPatients, setUnverifiedPatients] = useState([]);
  const [lowInventoryItems, setLowInventoryItems] = useState([]);
  const [doctorsOnShift, setDoctorsOnShift] = useState([]);
  const [hasNotification, setHasNotification] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem('user'))?.token;

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const overviewRes = await axios.get(`${API_BASE_URL}/Supervisor/DailyOverview`, { headers: { Authorization: `Bearer ${token}` } });
      const assignmentRes = await axios.get(`${API_BASE_URL}/Supervisor/Assignments`, { headers: { Authorization: `Bearer ${token}` } });
      const patientsRes = await axios.get(`${API_BASE_URL}/Supervisor/Patients`, { headers: { Authorization: `Bearer ${token}` } });
      const inventoryRes = await axios.get(`${API_BASE_URL}/Supervisor/Inventory`, { headers: { Authorization: `Bearer ${token}` } });

      setOverview(overviewRes.data);
      setAssignments(assignmentRes.data.slice(-5).reverse());
      setUnverifiedPatients(patientsRes.data.filter(p => p.status !== 'Verified').slice(0, 3));
      setLowInventoryItems(inventoryRes.data.filter(i => i.quantity < 5));
      setDoctorsOnShift(overviewRes.data.doctorsOnShift || []);

      if (overviewRes.data.pendingLeaveRequests > 0 || patientsRes.data.some(p => p.status !== 'Verified')) {
        setHasNotification(true);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    }
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleDropdown = () => { setShowDropdown(!showDropdown); setHasNotification(false); };
  const toggleProfileDropdown = () => setShowProfileDropdown(!showProfileDropdown);
  const navigateTo = (type) => {
    if (type === 'leave') navigate('/supervisor/leave-requests');
    else if (type === 'verify') navigate('/supervisor/verify-patients');
    else if (type === 'inventory') navigate('/supervisor/inventory');
    else if (type === 'profile') navigate('/supervisor/profile');
    else if (type === 'logout') {
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  return (
    <div className="d-flex">
      <SupervisorSidebar isOpen={sidebarOpen} />
      <div className="flex-grow-1">
        <nav className="navbar navbar-light bg-white border-bottom px-4 py-3 shadow-sm">
          <button className="btn btn-outline-primary me-3" onClick={toggleSidebar}>{sidebarOpen ? '❮' : '❯'}</button>
          <h4 className="mb-0">Supervisor Dashboard</h4>
          <div className="ms-auto d-flex align-items-center gap-3 position-relative">
            <FaEnvelope size={18} className="text-secondary cursor-pointer" />
            <div onClick={toggleDropdown} className="position-relative cursor-pointer">
              <FaBell size={18} className="text-secondary" />
              {hasNotification && <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', borderRadius: '50%', padding: '2px 5px', fontSize: '10px' }}>!</span>}
              {showDropdown && (
                <div className="dropdown-menu show p-2" style={{ position: 'absolute', right: 0, top: '25px', zIndex: 999, minWidth: '220px' }}>
                  {overview?.pendingLeaveRequests > 0 && <div className="dropdown-item" onClick={() => navigateTo('leave')}>📝 طلب إجازة جديد</div>}
                  {unverifiedPatients.length > 0 && <div className="dropdown-item" onClick={() => navigateTo('verify')}>🆕 توثيق مريض جديد</div>}
                </div>
              )}
            </div>

            <div className="position-relative">
              <img
                src="/profile.jpg"
                alt="Profile"
                className="rounded-circle cursor-pointer"
                style={{ width: '36px', height: '36px', objectFit: 'cover' }}
                onClick={toggleProfileDropdown}
              />
              {showProfileDropdown && (
                <div className="dropdown-menu show p-2" style={{ position: 'absolute', right: 0, top: '42px', zIndex: 999 }}>
            <div className="dropdown-item" onClick={() => navigateTo('profile')} style={{ cursor: 'pointer' }}>⚙️ Settings</div>
---
<div className="dropdown-item" onClick={() => navigateTo('logout')} style={{ cursor: 'pointer' }}>🚪 Logout</div>   </div>
              )}
            </div>
          </div>
        </nav>

        <div className="container-fluid mt-4 px-4">
          <div className="row g-4">
            <div className="col-md-6">
              <div className="card shadow-sm p-3">
                <h5>Doctors On Shift Today</h5>
                <ul className="mb-0">
                  {doctorsOnShift.length ? doctorsOnShift.map((d, i) => <li key={i}>{d}</li>) : <li className="text-muted">No shift data</li>}
                </ul>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card shadow-sm p-3">
                <h5>Quick Actions</h5>
                <div className="d-flex gap-2">
                  {/* <button className="btn btn-outline-success" onClick={() => navigateTo('inventory')}><FaPlusCircle /> طلب مخزون</button> */}
            <button className="btn btn-outline-info" onClick={() => navigateTo('verify')}><FaUserCheck /> Verify Patient</button>
 
<button className="btn btn-outline-warning" onClick={() => navigateTo('leave')}><FaClipboardCheck /> Process Leave</button>   </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card shadow-sm p-3">
                <h5>Pending Leave Requests</h5>
                <p className="fs-4">{overview?.pendingLeaveRequests ?? 0}</p>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card shadow-sm p-3">
                <h5>Low Inventory Items</h5>
                <ul className="mb-0">
                  {lowInventoryItems.length ? lowInventoryItems.map((item, idx) => <li key={idx}>{item.itemName} - ({item.quantity})</li>) : <li className="text-muted">All inventory levels are sufficient</li>}
                </ul>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card shadow-sm p-3">
                <h5>Recent Patient Assignments</h5>
                <ul className="mb-0">
                  {assignments.length ? assignments.map((a, i) => <li key={i}>{a.patientName} → {a.doctorName} ({a.assignedAt?.slice(0,10)})</li>) : <li className="text-muted">No recent assignments</li>}
                </ul>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card shadow-sm p-3">
                <h5>Unverified Patients</h5>
                <ul className="mb-0">
                  {unverifiedPatients.length ? unverifiedPatients.map((p, i) => <li key={i}>{p.fullName} - {p.email}</li>) : <li className="text-muted">No unverified patients</li>}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
