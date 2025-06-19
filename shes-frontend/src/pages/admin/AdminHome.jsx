import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config/apiConfig';
import Sidebar from '../../components/Sidebar';
import AdminNavbar from '../../components/AdminNavbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import Spinner from '../../components/Spinner';

import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

import './admin-users.css'; 
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const token = localStorage.getItem('token');
  const [adminName, setAdminName] = useState('Admin');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
const [isLoading, setIsLoading] = useState(true);

 const fetchStats = async () => {
  setIsLoading(true); // Start spinner
  try {
    const res = await axios.get(`${API_BASE_URL}/Admin/GetHospitalStatistics`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setStats(res.data);
  } catch (err) {
    console.error('Error fetching dashboard data:', err);
  } finally {
    setIsLoading(false); // Stop spinner
  }
};


  useEffect(() => {
    const storedName = localStorage.getItem('adminName'); 
    if (storedName) {
      setAdminName(storedName);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, []);

 if (isLoading) {
  return <Spinner message="Loading dashboard..." />;
}


  const barData = {
    labels: ['Patients', 'Doctors', 'Supervisors', 'Appointments', 'Feedbacks'],
    datasets: [
      {
        label: 'Count',
        data: [
          stats.totalPatients,
          stats.totalDoctors,
          stats.totalSupervisors,
          stats.totalAppointments,
          stats.totalFeedbacks
        ],
        backgroundColor: '#0d6efd'
      }
    ]
  };

  const doughnutData = {
    labels: ['Appointments', 'Feedbacks'],
    datasets: [
      {
        data: [stats.totalAppointments, stats.totalFeedbacks],
        backgroundColor: ['#198754', '#ffc107']
      }
    ]
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      {/* Fixed Navbar */}
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
        <div className="mainAdmin ma flex-grow-1 p-3 p-md-4 overflow-auto">
          <div className="container-fluid px-4 py-3 mb-4 bg-white rounded shadow-sm">
            <h2 className="mb-1 text-primary fw-bold display-6">Admin Dashboard</h2>
            <p className="text-muted">Welcome back, {adminName} 👋 Here's what's happening today.</p>
          </div>

          {/* Cards Row */}
          <div className="row g-4 mb-4">
            <div className="col-12 col-sm-6 col-md-3">
              <div className="card border-start border-primary border-5 shadow h-100 hover-card">
                <div className="card-body">
                  <h6 className="card-title text-uppercase text-muted small">Appointments</h6>
                  <p className="card-text fs-3 fw-bold text-primary">{stats.totalAppointments}</p>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-3">
              <div className="card border-start border-success border-5 shadow h-100 hover-card">
                <div className="card-body">
                  <h6 className="card-title text-uppercase text-muted small">Patients</h6>
                  <p className="card-text fs-3 fw-bold text-success">{stats.totalPatients}</p>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-3">
              <div className="card border-start border-info border-5 shadow h-100 hover-card">
                <div className="card-body">
                  <h6 className="card-title text-uppercase text-muted small">Doctors</h6>
                  <p className="card-text fs-3 fw-bold text-info">{stats.totalDoctors}</p>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-3">
              <div className="card border-start border-warning border-5 shadow h-100 hover-card">
                <div className="card-body">
                  <h6 className="card-title text-uppercase text-muted small">Supervisors</h6>
                  <p className="card-text fs-3 fw-bold text-warning">{stats.totalSupervisors}</p>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="card border-start border-danger border-5 shadow h-100 hover-card">
                <div className="card-body">
                  <h6 className="card-title text-uppercase text-muted small">Feedbacks</h6>
                  <p className="card-text fs-3 fw-bold text-danger">{stats.totalFeedbacks}</p>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="card border-start border-primary border-5 shadow h-100 hover-card">
                <div className="card-body d-flex align-items-center justify-content-center h-100">
                  <div className="text-center w-100">
                    <h6 className="opacity-75 text-black">Total Users</h6>
                    <h3 className="fw-bold text-black">{stats.totalPatients + stats.totalDoctors + stats.totalSupervisors}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="row g-4">
            <div className="col-12 col-md-8">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body">
                  <h6 className="card-title text-center mb-4 text-uppercase fw-semibold">Hospital Overview</h6>
                  <Bar data={barData} options={{ responsive: true }} />
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body">
                  <h6 className="card-title text-center mb-4 text-uppercase fw-semibold">Appointments vs Feedbacks</h6>
                  <Doughnut data={doughnutData} options={{ responsive: true }} />
                </div>
              </div>
            </div>
          </div>
        </div>
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
            className="btn btn-outline-danger w-100 py-2 d-flex align-items-center justify-content-center gap-2"
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('adminName');
              window.location.href = '/login';
            }}
          >
            <i className="bi bi-box-arrow-right"></i> Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;