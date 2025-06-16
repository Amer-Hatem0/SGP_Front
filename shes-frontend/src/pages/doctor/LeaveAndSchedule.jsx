import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DoctorSidebar from '../../components/DoctorSidebar';
import API_BASE_URL from '../../config/apiConfig';
import Navbar from '../../components/DrNavbar';
export default function LeaveRequestPage() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [leaveRequests, setLeaveRequests] = useState([]);
  const token = JSON.parse(localStorage.getItem('user'))?.token;

  const fetchLeaveRequests = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/Doctor/MyLeaveRequests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeaveRequests(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load leave requests.");
    }
  };

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const handleSubmit = async () => {
    if (!startDate || !endDate || !reason) {
      alert("Please fill in all fields.");
      return;
    }

    try {
    const res = await axios.post(`${API_BASE_URL}/Doctor/RequestLeave`, {
 
  reason,
startDate: new Date(startDate).toISOString(),
endDate: new Date(endDate).toISOString(),

  submittedAt: new Date().toISOString(), // إضافة التاريخ الحالي
 
}, {
  headers: { Authorization: `Bearer ${token}` }
});

 


      if (res.status === 200) {
        alert('✅ Leave request submitted successfully');
        setStartDate('');
        setEndDate('');
        setReason('');
        fetchLeaveRequests(); 
      }
    }catch (err) {
  console.error(err.response?.data);
  alert(`❌ Failed: ${err.response?.data?.Message} ${err.response?.data?.Errors?.join(', ')}`);
}


   
  };

  const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this request?")) return;

  try {
    await axios.delete(`${API_BASE_URL}/Doctor/DeleteLeaveRequest/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    alert("✅ Leave request deleted.");
    fetchLeaveRequests();
  } catch (err) {
    console.error(err);
    alert("❌ Failed to delete leave request.");
  }
};


  return (
    <>
        <Navbar />
      
    <div className="LeaveRequestPage-container">
      
      <DoctorSidebar />
      <main className="LeaveRequestPage-main">
        <h1 className="LeaveRequestPage-title">Request Leave</h1>

        <div className="LeaveRequestPage-form">
          <label className="LeaveRequestPage-label">Start Date:</label>
          <input
            type="date"
            className="LeaveRequestPage-input"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <label className="LeaveRequestPage-label">End Date:</label>
          <input
            type="date"
            className="LeaveRequestPage-input"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />

          <label className="LeaveRequestPage-label">Reason:</label>
          <textarea
            className="LeaveRequestPage-textarea"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Write your reason..."
          />

          <button className="LeaveRequestPage-button" onClick={handleSubmit}>
            Submit Leave Request
          </button>
        </div>

        <h2 className="LeaveRequestPage-subtitle">Your Leave Requests</h2>
      <table className="LeaveRequestPage-table">
  <thead>
    <tr>
      <th>Start Date</th>
      <th>End Date</th>
      <th>Reason</th>
      <th>Status</th>
      <th>Submitted</th>
      <th>Action</th>
    </tr>
  </thead>
  <tbody>
    {leaveRequests.map((req, idx) => (
      <tr key={idx}>
        <td>{new Date(req.startDate).toLocaleDateString()}</td>
        <td>{new Date(req.endDate).toLocaleDateString()}</td>
        <td>{req.reason}</td>
        <td className={`LeaveRequestPage-status ${req.status.toLowerCase()}`}>{req.status}</td>
        <td>{new Date(req.submittedAt).toLocaleDateString()}</td>
        <td>
          <button
            className="LeaveRequestPage-delete"
            onClick={() => handleDelete(req.leaveRequestId)}
          >
            Delete
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

      </main>
    </div>  </>
  );
}
