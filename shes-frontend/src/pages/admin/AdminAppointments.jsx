import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import API_BASE_URL from '../../config/apiConfig';
import 'bootstrap/dist/css/bootstrap.min.css';
 import AdminNavbar from '../../components/AdminNavbar';

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // حالة.drawer
  const [adminName, setAdminName] = useState('Admin');

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
      setLoading(false);
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
      {/* Navbar */}
      <AdminNavbar 
  onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
  isSidebarOpen={isSidebarOpen} 
/>

      {/* Main Content with Responsive Sidebar */}
      <div className="d-flex flex-grow-1 overflow-hidden position-relative pt-5">
        {/* Sidebar for large screens */}
        <div className="d-none d-lg-block fixed-sidebar-container">
          <Sidebar />
        </div>

        {/* Main Page Content */}
        <main className="flex-grow-1 ma p-3 p-md-4 overflow-auto">
          <h2 className="mb-4 text-primary fw-bold">Appointments Management</h2>

          {loading ? (
            <div className="text-center">Loading appointments...</div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : (
            <div className="table-responsive">
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
                  {appointments.map((appt, index) => (
                    <tr key={appt.appointmentId}>
                      <td>{index + 1}</td>
                      <td>{appt.patientName}</td>
                      <td>{appt.doctorName}</td>
                      <td>{new Date(appt.appointmentDate).toLocaleDateString()}</td>
                      <td>{new Date(appt.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                      <td className="text-center">
                        <span className={`badge ${
                          appt.statusName === 'Completed'
                            ? 'bg-success'
                            : appt.statusName === 'Cancelled'
                              ? 'bg-danger'
                              : 'bg-warning text-dark'
                        }`}>
                          {appt.statusName}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {/* Responsive Drawer Sidebar */}
      {isSidebarOpen && <div className="drawer-overlay" onClick={() => setIsSidebarOpen(false)}></div>}
      <div className={`drawer-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="drawer-header d-flex justify-content-end p-3">
          <button className="btn btn-close" onClick={() => setIsSidebarOpen(false)}></button>
        </div>

        {/* Mobile User Info */}
        <div className="d-flex flex-column align-items-center mb-4 px-3">
          <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mb-2"
               style={{ width: '50px', height: '50px', fontSize: '1.5rem' }}>
            {adminName.charAt(0).toUpperCase()}
          </div>
          <strong>{adminName}</strong>
          <small className="text-muted">Logged in as Admin</small>
        </div>

        <Sidebar />

        {/* Mobile Logout Button inside drawer */}
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