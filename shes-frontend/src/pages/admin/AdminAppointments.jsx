import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import API_BASE_URL from '../../config/apiConfig';
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminNavbar from '../../components/AdminNavbar';
import Spinner from '../../components/Spinner';

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [adminName, setAdminName] = useState('Admin');
const [statusFilter, setStatusFilter] = useState('All');

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/Admin/GetAllAppointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch appointments.');
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  };

  const getStatusInfo = (statusID) => {
    switch (statusID) {
      case 1: return { label: 'Pending', color: 'secondary' };
      case 2: return { label: 'Scheduled', color: 'info' };
      case 3: return { label: 'Completed', color: 'success' };
      case 4: return { label: 'Canceled', color: 'danger' };
      case 5: return { label: 'Rescheduled', color: 'warning text-dark' };
      default: return { label: 'Unknown', color: 'dark' };
    }
  };

  useEffect(() => {
    const storedName = localStorage.getItem('adminName');
    if (storedName) {
      setAdminName(storedName);
    }
    fetchAppointments();
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <AdminNavbar 
        onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
        isSidebarOpen={isSidebarOpen} 
      />

      <div className="d-flex flex-grow-1 overflow-hidden position-relative pt-5">
        <div className="d-none d-lg-block fixed-sidebar-container">
          <Sidebar />
        </div>

        <main className="flex-grow-1 ma p-3 p-md-4 overflow-auto">
          <h2 className="mb-4 text-primary fw-bold">Appointments Management</h2>

          {loading ? (
            <Spinner message="Loading appointments..." />
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : (
            <div className="table-responsive">
              <div className="mb-3 d-flex align-items-center gap-2">
  <label className="form-label fw-semibold mb-0">Filter by Status:</label>
  <select
    className="form-select form-select-sm"
    style={{ maxWidth: '200px' }}
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
  >
    <option value="All">All</option>
    <option value="1">Pending</option>
    <option value="2">Scheduled</option>
    <option value="3">Completed</option>
    <option value="4">Canceled</option>
    <option value="5">Rescheduled</option>
  </select>
</div>

              <table className="table table-bordered table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Patient Name</th>
                    <th>Doctor Name</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
               {appointments
  .filter(appt => statusFilter === 'All' || String(appt.statusID) === statusFilter)
  .map((appt, index) => {
    const { label, color } = getStatusInfo(appt.statusID);
    return (
      <tr key={appt.appointmentId}>
        <td>{index + 1}</td>
        <td>{appt.patientName}</td>
        <td>{appt.doctorName}</td>
        <td>{new Date(new Date(appt.appointmentDate).setDate(new Date(appt.appointmentDate).getDate() + 1)).toLocaleDateString('en-US', {
          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        })}</td>
        <td>{new Date(appt.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
        <td className="text-center">
          <span className={`badge bg-${color}`}>{label}</span>
        </td>
      </tr>
    );
  })}

                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {isSidebarOpen && <div className="drawer-overlay" onClick={() => setIsSidebarOpen(false)}></div>}
      <div className={`drawer-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="drawer-header d-flex justify-content-end p-3">
          <button className="btn btn-close" onClick={() => setIsSidebarOpen(false)}></button>
        </div>
        <div className="d-flex flex-column align-items-center mb-4 px-3">
          <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mb-2"
               style={{ width: '50px', height: '50px', fontSize: '1.5rem' }}>
            {adminName.charAt(0).toUpperCase()}
          </div>
          <strong>{adminName}</strong>
          <small className="text-muted">Logged in as Admin</small>
        </div>

        <Sidebar />

        <div className="mt-auto px-3 pb-4">
          <button
            className="btn btn-danger w-100"
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('adminName');
              window.location.href = '/login';
            }}
          >
            <i className="bi bi-box-arrow-right me-1"></i>Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminAppointments;
