// LeaveRequestsAdmin.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import API_BASE_URL from '../../config/apiConfig';
import 'bootstrap/dist/css/bootstrap.min.css';

const LeaveRequestsAdmin = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

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
    <div className="d-flex min-vh-100 bg-light">
      <Sidebar />
      <main className="flex-grow-1 p-5">
        <h2 className="mb-4 text-primary">Forwarded Leave Requests</h2>

        {loading ? (
          <div className="text-center">Loading leave requests...</div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
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
                      <button className="btn btn-sm btn-success me-2" onClick={() => updateStatus(req.requestID, 'Approve')}>Approve</button>
                      <button className="btn btn-sm btn-danger" onClick={() => updateStatus(req.requestID, 'Reject')}>Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default LeaveRequestsAdmin;
