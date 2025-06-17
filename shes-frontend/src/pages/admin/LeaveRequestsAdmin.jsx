import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import API_BASE_URL from '../../config/apiConfig';
import 'bootstrap/dist/css/bootstrap.min.css';
 import AdminNavbar from '../../components/AdminNavbar';
const LeaveRequestsAdmin = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // حالة.drawer
  const [adminName, setAdminName] = useState('Admin');

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/Admin/GetAllLeaveRequests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Filter only Forwarded requests
      const filtered = res.data.filter(r => r.status === 'Forwarded');
      setRequests(filtered);
    } catch (err) {
      console.error(err);
      setError('Failed to load leave requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedName = localStorage.getItem('adminName');
    if (storedName) {
      setAdminName(storedName);
    }
    fetchRequests();
  }, []);

  const updateStatus = async (id, action) => {
    try {
      await axios.put(`${API_BASE_URL}/Admin/${action}LeaveRequest/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchRequests();
    } catch (err) {
      console.error(`Failed to ${action.toLowerCase()} request`, err);
    }
  };

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
          <h2 className="mb-4 text-primary fw-bold">Forwarded Leave Requests</h2>

          {loading ? (
            <div className="text-center">Loading leave requests...</div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Doctor</th>
                    <th>Reason</th>
                    <th>Start</th>
                    <th>End</th>
                    <th>Status</th>
                    <th>Submitted</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req, index) => (
                    <tr key={req.requestID}>
                      <td>{index + 1}</td>
                      <td>{req.doctorName}</td>
                      <td>{req.reason}</td>
                      <td>{req.startDate?.slice(0, 10)}</td>
                      <td>{req.endDate?.slice(0, 10)}</td>
                      <td><span className="badge bg-warning text-dark">{req.status}</span></td>
                      <td>{req.submittedAt?.slice(0, 10)}</td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-success me-2"
                          onClick={() => updateStatus(req.requestID, 'Approve')}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => updateStatus(req.requestID, 'Reject')}
                        >
                          Reject
                        </button>
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

export default LeaveRequestsAdmin;