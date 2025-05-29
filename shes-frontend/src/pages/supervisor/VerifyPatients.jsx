// VerifyPatients.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SupervisorSidebar from '../../components/SupervisorSidebar';
import 'bootstrap/dist/css/bootstrap.min.css';
import API_BASE_URL from '../../config/apiConfig';

export default function VerifyPatients() {
    const [patients, setPatients] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const token = JSON.parse(localStorage.getItem('user'))?.token;

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/Supervisor/Patients`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const pending = res.data.filter(p => p.status?.toLowerCase() === 'pending');
            setPatients(pending);
        } catch (err) {
            console.error('Error fetching patients:', err);
        }
    };

    const verifyPatient = async (id) => {
        try {
            await axios.post(`${API_BASE_URL}/Supervisor/VerifyPatient/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPatients(prev => prev.filter(p => p.patientId !== id));
        } catch (err) {
            console.error('Error verifying patient:', err);
        }
    };

    return (
        <div className="d-flex">
            <SupervisorSidebar isOpen={sidebarOpen} />
            <div className="flex-grow-1">
                <nav className="navbar navbar-light bg-white border-bottom px-4 py-3 shadow-sm">
                    <button className="btn btn-outline-primary me-3" onClick={() => setSidebarOpen(!sidebarOpen)}>
                        {sidebarOpen ? '❮' : '❯'}
                    </button>
                    <h4 className="mb-0">Verify New Patients</h4>
                </nav>

                <div className="container mt-5">
                    <div className="card shadow border-0 p-4">
                        <h5 className="mb-4 fw-bold">Pending Verification</h5>
                        {patients.length === 0 ? (
                            <p className="text-muted text-center">No pending patients.</p>
                        ) : (
                            <table className="table table-bordered table-hover shadow-sm">
                                <thead className="table-light">
                                    <tr>
                                        <th>#</th>
                                        <th>Full Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {patients.map((p, index) => (
                                        <tr key={p.patientId}>
                                            <td>{index + 1}</td>
                                            <td>{p.fullName}</td>
                                            <td>{p.email}</td>
                                            <td>{p.phone}</td>
                                            <td><span className="badge bg-warning text-dark">{p.status}</span></td>
                                            <td>
                                                <button
                                                    className="btn btn-success btn-sm"
                                                    onClick={() => verifyPatient(p.patientId)}
                                                >
                                                    Verify
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
