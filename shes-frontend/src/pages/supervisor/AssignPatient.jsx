// AssignPatient.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SupervisorSidebar from '../../components/SupervisorSidebar';
import 'bootstrap/dist/css/bootstrap.min.css';
import API_BASE_URL from '../../config/apiConfig';

export default function AssignPatient() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [appointmentDateTime, setAppointmentDateTime] = useState('');
    const token = JSON.parse(localStorage.getItem('user'))?.token;

    useEffect(() => {
        fetchPatients();
        fetchDoctors();
        fetchAssignments();
    }, []);

    const fetchPatients = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/Supervisor/Patients`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPatients(res.data);
        } catch (err) {
            console.error('Error fetching patients:', err);
        }
    };

    const fetchDoctors = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/Supervisor/Doctors`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setDoctors(res.data);
        } catch (err) {
            console.error('Error fetching doctors:', err);
        }
    };

    const fetchAssignments = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/Supervisor/Assignments`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAssignments(res.data);
        } catch (err) {
            console.error('Error fetching assignments:', err);
        }
    };

    const handleAssign = async () => {
        if (!selectedPatient || !selectedDoctor || !appointmentDateTime) return;
        try {
            await axios.post(
                `${API_BASE_URL}/Supervisor/AssignPatient`,
                {
                    patientId: parseInt(selectedPatient),
                    doctorId: parseInt(selectedDoctor),
                    dateTime: appointmentDateTime,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setSuccessMessage('✅ Patient assigned successfully!');
            setSelectedPatient('');
            setSelectedDoctor('');
            setAppointmentDateTime('');
            fetchAssignments();
        } catch (err) {
            console.error('Error assigning patient:', err);
        }
    };

    return (
        <div className={`d-flex ${sidebarOpen ? '' : 'sidebar-closed'}`}>
            <SupervisorSidebar isOpen={sidebarOpen} />

            <div className="flex-grow-1 aaaaaaaaaaaaa">
                <nav className="navbar navbar-light bg-white border-bottom px-4 py-3 shadow-sm">
                    <button className="btn btn-outline-primary me-3" onClick={() => setSidebarOpen(!sidebarOpen)}>
                        {sidebarOpen ? '❮' : '❯'}
                    </button>
                    <h4 className="mb-0">Assign Patient to Doctor</h4>
                </nav>

                <div className="container mt-4">
                    <div className="row justify-content-center">
                        <div className="col-lg-5">
                            <div className="card shadow p-4 border-0 rounded-4">
                                {successMessage && (
                                    <div className="alert alert-success text-center fw-semibold" role="alert">
                                        {successMessage}
                                    </div>
                                )}
                                <h5 className="mb-4 text-center fw-bold">New Assignment</h5>

                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Select Patient</label>
                                    <select
                                        className="form-select shadow-sm"
                                        value={selectedPatient}
                                        onChange={(e) => setSelectedPatient(e.target.value)}
                                    >
                                        <option value="">-- Choose Patient --</option>
                                        {patients.map((p) => (
                                            <option key={`patient-${p.patientId}`} value={p.patientId}>
                                                {p.fullName}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Select Doctor</label>
                                    <select
                                        className="form-select shadow-sm"
                                        value={selectedDoctor}
                                        onChange={(e) => setSelectedDoctor(e.target.value)}
                                    >
                                        <option value="">-- Choose Doctor --</option>
                                        {doctors.map((d, index) => (
                                            <option key={`doctor-${d.doctorId || index}`} value={d.doctorId}>
                                                {d.fullName} - {d.specialization ?? 'No specialty'} ({d.gender ?? 'Unknown'})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label fw-semibold">Appointment Date & Time</label>
                                    <input
                                        type="datetime-local"
                                        className="form-control shadow-sm"
                                        value={appointmentDateTime}
                                        onChange={(e) => setAppointmentDateTime(e.target.value)}
                                    />
                                </div>

                                <button className="btn btn-primary w-100 fw-semibold" onClick={handleAssign}>
                                    Assign
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="row mt-5">
                        <div className="col-md-10 offset-md-1">
                            <h5 className="mb-3 fw-bold">Previous Assignments</h5>
                            <table className="table table-bordered table-hover shadow-sm rounded">
                                <thead className="table-light">
                                    <tr>
                                        <th>#</th>
                                        <th>Patient</th>
                                        <th>Doctor</th>
                                        <th>Date Assigned</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {assignments.length > 0 ? (
                                        assignments.map((a, i) => (
                                            <tr key={i}>
                                                <td>{i + 1}</td>
                                                <td>{a.patientName}</td>
                                                <td>{a.doctorName}</td>
                                                <td>{a.assignedAt?.slice(0, 10)}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="text-center text-muted">No assignments yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
