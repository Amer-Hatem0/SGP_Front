import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import API_BASE_URL from '../../config/apiConfig';
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminNavbar from '../../components/AdminNavbar';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const AdminFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // حالة.drawer
  const [adminName, setAdminName] = useState('Admin');

  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/Feedback/All`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFeedbacks(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load feedbacks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedName = localStorage.getItem('adminName');
    if (storedName) {
      setAdminName(storedName);
    }
    fetchFeedbacks();
  }, []);

  // تحضير بيانات الرسم البياني: متوسط التقييم لكل طبيب
  const averageRatings = Object.values(
    feedbacks.reduce((acc, fb) => {
      if (!acc[fb.doctorName]) acc[fb.doctorName] = { doctor: fb.doctorName, total: 0, count: 0 };
      acc[fb.doctorName].total += fb.rating;
      acc[fb.doctorName].count += 1;
      return acc;
    }, {})
  ).map(entry => ({ doctor: entry.doctor, avgRating: (entry.total / entry.count).toFixed(1) }));

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
          <h2 className="mb-4 text-primary fw-bold">Doctor Feedback & Ratings</h2>

          {loading ? (
            <div className="text-center py-4">Loading feedbacks...</div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : (
            <>
              {/* Table of Feedbacks */}
              <div className="table-responsive">
                <table className="table table-bordered table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Patient</th>
                      <th>Doctor</th>
                      <th>Rating</th>
                      <th>Message</th>
                      <th>Submitted At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feedbacks.map((fb, index) => (
                      <tr key={fb.id}>
                        <td>{index + 1}</td>
                        <td>{fb.patientName || 'Anonymous'}</td>
                        <td>{fb.doctorName}</td>
                        <td>{'⭐'.repeat(fb.rating)}</td>
                        <td>{fb.message.length > 50 ? fb.message.slice(0, 50) + '...' : fb.message}</td>
                        <td>{new Date(fb.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Chart Section */}
              <div className="mt-5 mb-5 col-md-9 m-auto pt-4">
                <h5 className="text-secondary mb-3">Average Ratings Per Doctor</h5>
                <div style={{ height: 300, width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={averageRatings}>
                      <XAxis dataKey="doctor" />
                      <YAxis domain={[0, 5]} />
                      <Tooltip />
                      <Bar dataKey="avgRating" fill="#007bff" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
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

export default AdminFeedbacks;