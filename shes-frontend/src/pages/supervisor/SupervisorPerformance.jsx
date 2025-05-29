// SupervisorPerformance.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SupervisorSidebar from '../../components/SupervisorSidebar';
import 'bootstrap/dist/css/bootstrap.min.css';
import API_BASE_URL from '../../config/apiConfig';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function SupervisorPerformance() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [performanceData, setPerformanceData] = useState([]);
    const token = JSON.parse(localStorage.getItem('user'))?.token;

    useEffect(() => {
        fetchPerformance();
    }, []);

    const fetchPerformance = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/Supervisor/DoctorsPerformance`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPerformanceData(res.data);
        } catch (err) {
            console.error('Error fetching performance:', err);
        }
    };

    const chartData = {
        labels: performanceData.map(d => d.doctorName),
        datasets: [
            {
                label: 'Performance Score',
                data: performanceData.map(d => d.performanceScore),
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
            },
            {
                label: 'Patients Count',
                data: performanceData.map(d => d.patientCount),
                backgroundColor: 'rgba(153, 102, 255, 0.5)',
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Doctors Performance Overview' },
        },
    };

    return (
        <div className={`d-flex ${sidebarOpen ? '' : 'sidebar-closed'}`}>
            <SupervisorSidebar isOpen={sidebarOpen} />
            <div className="flex-grow-1">
                <nav className="navbar navbar-light bg-white border-bottom px-4 py-3 shadow-sm">
                    <button className="btn btn-outline-primary me-3" onClick={() => setSidebarOpen(!sidebarOpen)}>
                        {sidebarOpen ? '❮' : '❯'}
                    </button>
                    <h4 className="mb-0">Performance Dashboard</h4>
                </nav>
                <div className="container mt-5">
                    <div className="card shadow p-4">
                        <Bar data={chartData} options={options} />
                    </div>

                    <div className="card shadow mt-4">
                        <table className="table table-striped">
                            <thead className="table-light">
                                <tr>
                                    <th>#</th>
                                    <th>Doctor Name</th>
                                    <th>Performance Score</th>
                                    <th>Patients</th>
                                    <th>Workload</th>
                                </tr>
                            </thead>
                            <tbody>
                                {performanceData.length > 0 ? (
                                    performanceData.map((doc, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{doc.doctorName}</td>
                                            <td>{doc.performanceScore.toFixed(2)}</td>
                                            <td>{doc.patientCount}</td>
                                            <td>{doc.workload}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center text-muted">No data available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
