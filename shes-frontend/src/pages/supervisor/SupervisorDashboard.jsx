import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config/apiConfig';
import SupervisorSidebar from '../../components/SupervisorSidebar';
import { FaClipboardCheck, FaUserCheck, FaChartBar } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import './SupervisorDashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'chart.js/auto';
import Spinner from '../../components/Spinner';

export default function SupervisorDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [overview, setOverview] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [unverifiedPatients, setUnverifiedPatients] = useState([]);
  const [topDoctor, setTopDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem('user'))?.token;

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const overviewRes = await axios.get(`${API_BASE_URL}/Supervisor/DailyOverview`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const assignmentRes = await axios.get(`${API_BASE_URL}/Supervisor/Assignments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const patientsRes = await axios.get(`${API_BASE_URL}/Supervisor/Patient`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const topDoctorRes = await axios.get(`${API_BASE_URL}/Supervisor/TopDoctor`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOverview(overviewRes.data);
      setAssignments(assignmentRes.data.slice(-7));
      setUnverifiedPatients(patientsRes.data.filter(p => p.isVerified === false).slice(0, 3));
      setTopDoctor(topDoctorRes.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
       setTimeout(() => setLoading(false), 1000);    }
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const navigateTo = (type) => {
    if (type === 'leave') navigate('/supervisor/leave-requests');
    else if (type === 'verify') navigate('/supervisor/verify-patients');
    else if (type === 'profile') navigate('/supervisor/profile');
    else if (type === 'logout') {
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  const chartData = {
    labels: assignments.map((a) => a.assignedAt?.slice(0, 10)),
    datasets: [
      {
        label: 'Patient Assignments',
        data: assignments.map((_, i) => i + 1),
        fill: false,
        borderColor: '#0d6efd',
        tension: 0.3,
      },
    ],
  };

  if (loading) return <Spinner />;

  return (
    <>
      <SupervisorSidebar isOpen={sidebarOpen} />
      <div className="d-flex">
        <div className="flex-grow-1 container-fluid mt-4 px-4">
          <div className="row g-4">

            {/* 🟦 Quick Actions */}
            <div className="col-md-12">
              <div className="card shadow-sm p-3 d-flex gap-3 flex-wrap flex-md-nowrap align-items-center justify-content-between">
                <h5 className="mb-0">Quick Actions</h5>
                <div className="d-flex gap-3">
                  <button className="btn btn-outline-info" onClick={() => navigateTo('verify')}>
                    <FaUserCheck /> Verify Patients
                  </button>
                  <button className="btn btn-outline-warning" onClick={() => navigateTo('leave')}>
                    <FaClipboardCheck /> Process Leave
                  </button>
                </div>
              </div>
            </div>

            {/* 🔵 Unverified Patients */}
            <div className="col-md-6">
              <div className="card shadow-sm p-3">
                <h5>Unverified Patients</h5>
                <ul className="mb-0">
                  {unverifiedPatients.length ? (
                    unverifiedPatients.map((p, i) => (
                      <li key={i}>
                        {p.fullName} - {p.email}
                      </li>
                    ))
                  ) : (
                    <li className="text-muted">No unverified patients</li>
                  )}
                </ul>
              </div>
            </div>

            {/* 🔵 Pending Leaves */}
            <div className="col-md-6">
              <div className="card shadow-sm p-3">
                <h5>Pending Leave Requests</h5>
                <p className="fs-4">{overview?.pendingLeaveRequests ?? 0}</p>
              </div>
            </div>

            {/* 🔵 Top Doctor */}
            <div className="col-md-6">
              <div className="card shadow-sm p-3">
                <h5>Top Performing Doctor</h5>
                <p className="fs-5">{topDoctor?.name || 'No data available'}</p>
                <p className="text-muted">Score: {topDoctor?.score || '-'}</p>
              </div>
            </div>

            {/* 🔵 Chart: Assignments */}
            <div className="col-md-6">
              <div className="card shadow-sm p-3">
                <h5>
                  <FaChartBar /> Patient Assignment Trend
                </h5>
                <Line data={chartData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
