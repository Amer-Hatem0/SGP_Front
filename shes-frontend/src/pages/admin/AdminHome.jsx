import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config/apiConfig';
import Sidebar from '../../components/Sidebar';
import 'bootstrap/dist/css/bootstrap.min.css';
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

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const token = localStorage.getItem('token');

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/Admin/GetHospitalStatistics`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (!stats) {
    return <div className="text-center mt-4">Loading dashboard...</div>;
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
    <div className="d-flex min-vh-100 bg-light">
      <Sidebar />
      <main className="flex-grow-1 p-4">
        <h2 className="mb-4 text-primary">Admin Dashboard</h2>

        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <div className="card shadow-sm border-start border-primary border-4">
              <div className="card-body">
                <h5 className="card-title">Appointments</h5>
                <p className="card-text fs-4 fw-bold text-primary">{stats.totalAppointments}</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm border-start border-success border-4">
              <div className="card-body">
                <h5 className="card-title">Patients</h5>
                <p className="card-text fs-4 fw-bold text-success">{stats.totalPatients}</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm border-start border-info border-4">
              <div className="card-body">
                <h5 className="card-title">Doctors</h5>
                <p className="card-text fs-4 fw-bold text-info">{stats.totalDoctors}</p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card shadow-sm border-start border-warning border-4">
              <div className="card-body">
                <h5 className="card-title">Supervisors</h5>
                <p className="card-text fs-4 fw-bold text-warning">{stats.totalSupervisors}</p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card shadow-sm border-start border-danger border-4">
              <div className="card-body">
                <h5 className="card-title">Feedbacks</h5>
                <p className="card-text fs-4 fw-bold text-danger">{stats.totalFeedbacks}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h6 className="card-title text-center mb-3">Hospital Overview</h6>
                <Bar data={barData} />
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h6 className="card-title text-center mb-3">Appointments vs Feedbacks</h6>
                <Doughnut data={doughnutData} />
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default AdminDashboard;
