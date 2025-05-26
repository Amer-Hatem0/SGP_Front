import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PatientSidebar from '../../components/PatientSidebar';
import API_BASE_URL from '../../config/apiConfig';
import './PatientDashboard.css';

export default function MyAppointments() {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const token = user.token;

                const decoded = JSON.parse(atob(token.split('.')[1]));
                const userId = parseInt(decoded.userId || decoded.sub);


                const res1 = await axios.get(`${API_BASE_URL}/Patient/PatientIdByUserId/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const patientId = res1.data.patientId;

                // جلب المواعيد
                const res2 = await axios.get(`${API_BASE_URL}/Appointment/Patient/${patientId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setAppointments(res2.data);
            } catch (error) {
                console.error("Failed to fetch appointments:", error);
            }
        };

        fetchAppointments();
    }, []);

    const handleCancel = async (appointmentId) => {
        const confirm = window.confirm("Are you sure you want to cancel this appointment?");
        if (!confirm) return;

        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const token = user.token;

            await axios.delete(`${API_BASE_URL}/Appointment/Cancel/${appointmentId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setAppointments(prev => prev.filter(appt => appt.appointmentId !== appointmentId));

            alert("Appointment cancelled.");
        } catch (err) {
            console.error("Failed to cancel appointment:", err);
            alert("Failed to cancel the appointment.");
        }
    };


    return (
        <div className="patient-container-full">
            <PatientSidebar />
            <main className="doctor-main">
                <h2 className="doctor-title">My Appointments</h2>
                <div className="appointments-table">
                    {appointments.length === 0 ? (
                        <p>No appointments found.</p>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Doctor</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Status</th>
                                    <th>Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.map((appt, index) => (
                                    <tr key={index}>
                                        <td>{appt.doctorName || "Unknown"}</td>
                                        <td>{appt.appointmentDate?.split('T')[0]}</td>
                                        <td>
                                            {appt.appointmentDate &&
                                                new Date(new Date(appt.appointmentDate).getTime() + 2 * 60 * 60 * 1000)
                                                    .toTimeString()
                                                    .substring(0, 5)}
                                        </td>

                                        <td>{appt.statusName}</td>
                                        <td>
                                            <button
                                                className="cancel-btn"
                                                onClick={() => handleCancel(appt.appointmentId)}
                                            >
                                                Cancel
                                            </button>
                                        </td>


                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </main>
        </div>
    );
}
