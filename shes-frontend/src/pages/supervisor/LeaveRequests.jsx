// LeaveRequests.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config/apiConfig';
import SupervisorSidebar from '../../components/SupervisorSidebar';
import { FaForward } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function LeaveRequests() {
  const [requests, setRequests] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const token = JSON.parse(localStorage.getItem('user'))?.token;

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/Supervisor/DoctorLeaveRequests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(res.data);
    } catch (err) {
      console.error('Error fetching leave requests:', err);
    }
  };

  const forwardRequest = async (id) => {
    try {
      await axios.put(`${API_BASE_URL}/Supervisor/ForwardLeaveRequest/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchRequests(); // refresh list
    } catch (err) {
      console.error('Error forwarding request:', err);
    }
  };

  return (
    <div className={`d-flex ${sidebarOpen ? '' : 'sidebar-closed'}`}>
      <SupervisorSidebar isOpen={sidebarOpen} />

      <div className="flex-grow-1">
        {/* Navbar */}
        <nav className="navbar navbar-light bg-white border-bottom px-4 py-3 shadow-sm">
          <button className="btn btn-outline-primary me-3" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? '❮' : '❯'}
          </button>
          <h4 className="mb-0">Leave Requests</h4>
        </nav>

        {/* Table */}
        <div className="container-fluid mt-4 px-4">
          <table className="table table-bordered shadow-sm">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Doctor</th>
                <th>Start</th>
                <th>End</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Submitted At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.length > 0 ? (
                requests.map((req, index) => (
                  <tr key={req.leaveRequestId}>
                    <td>{index + 1}</td>
                    <td>{req.doctorName}</td>

                    <td>{req.startDate?.slice(0, 10)}</td>
                    <td>{req.endDate?.slice(0, 10)}</td>
                    <td>{req.reason}</td>
                    <td>{req.status}</td>
                    <td>{req.submittedAt?.slice(0, 10)}</td>
                    <td>
                      {req.status === 'Pending' && (
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => forwardRequest(req.leaveRequestId)}
                        >
                          <FaForward className="me-1" /> Forward
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center text-muted">No leave requests found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
