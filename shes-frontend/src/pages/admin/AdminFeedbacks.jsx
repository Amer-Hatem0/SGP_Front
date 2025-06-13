import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import API_BASE_URL from '../../config/apiConfig';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const AdminFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

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
    fetchFeedbacks();
  }, []);

  // Prepare chart data: average rating per doctor
  const averageRatings = Object.values(
    feedbacks.reduce((acc, fb) => {
      if (!acc[fb.doctorName]) acc[fb.doctorName] = { doctor: fb.doctorName, total: 0, count: 0 };
      acc[fb.doctorName].total += fb.rating;
      acc[fb.doctorName].count += 1;
      return acc;
    }, {})
  ).map(entry => ({ doctor: entry.doctor, avgRating: (entry.total / entry.count).toFixed(1) }));

  return (
    <div className="d-flex min-vh-100 bg-light">
      <Sidebar />
      <main className="flex-grow-1 p-4">
        <h2 className="mb-4 text-primary">Doctor Feedback & Ratings</h2>

        {loading ? (
          <div className="text-center">Loading feedbacks...</div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <>
             <div className="table-responsive">
              <table className="table table-bordered table-hover">
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
                      <td>{fb.patientName}</td>
                      <td>{fb.doctorName}</td>
                      <td>{'⭐'.repeat(fb.rating)}</td>
                      <td>{fb.message}</td>
                      <td>{new Date(fb.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-5 col-md-9 m-auto pt-5 mb-5">
              <h5 className="text-secondary">Average Ratings Per Doctor</h5>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={averageRatings}>
                  <XAxis dataKey="doctor" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Bar dataKey="avgRating" fill="#007bff" />
                </BarChart>
              </ResponsiveContainer>
            </div>

           
          </>
        )}
      </main>
    </div>
  );
};

export default AdminFeedbacks;
