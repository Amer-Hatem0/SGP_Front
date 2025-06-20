
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PatientSidebar from '../../components/PatientSidebar';
import API_BASE_URL from '../../config/apiConfig';
import ReactStars from "react-stars";
import './PatientDashboard.css';
import PatientNavbar from '../../components/PatientNavbar';

export default function MyAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [ratedAppointments, setRatedAppointments] = useState([]);

    useEffect(() => {
        const stored = localStorage.getItem('ratedAppointments');
        if (stored) setRatedAppointments(JSON.parse(stored));

        const fetchAppointments = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const token = user.token;
                const decoded = JSON.parse(atob(token.split('.')[1]));
                const userId = parseInt(decoded.userId || decoded.sub);

                const res1 = await axios.get(`${API_BASE_URL}/Patient/PatientIdByUserId/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const patientID = res1.data.patientId || res1.data.patientID;

                const res2 = await axios.get(`${API_BASE_URL}/Appointment/Patient/${patientID}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setAppointments(res2.data);
            } catch (error) {
                console.error("Failed to fetch appointments:", error);
            }
        };

        fetchAppointments();
    }, []);

    const hasRated = (apptId) => ratedAppointments.includes(apptId);

    const handleCancel = async (appointmentId) => {
        if (!window.confirm("Are you sure you want to cancel this appointment?")) return;

        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const token = user.token;
            await axios.delete(`${API_BASE_URL}/Appointment/Cancel/${appointmentId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setAppointments(prev =>
                prev.map(appt =>
                    appt.appointmentId === appointmentId
                        ? { ...appt, statusName: "Cancelled" }
                        : appt
                )
            );

            alert("Appointment cancelled.");
        } catch (err) {
            console.error("Failed to cancel appointment:", err);
            alert("Failed to cancel the appointment.");
        }
    };

    const handleOpenModal = (appointment) => {
        setSelectedAppointment(appointment);
        setRating(0);
        setComment('');
        setShowModal(true);
    };

    const handleSubmit = async () => {
        if (!rating) {
            alert("Please select a rating!");
            return;
        }

        setSubmitting(true);
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const token = user.token;

            const appointmentId = selectedAppointment.appointmentId || selectedAppointment.AppointmentId;

            const feedbackPayload = {
                DoctorID: selectedAppointment.DoctorID || selectedAppointment.doctorID,
                PatientID: selectedAppointment.PatientID || selectedAppointment.patientID,
                DoctorUserID: selectedAppointment.DoctorUserID || selectedAppointment.DoctorID || selectedAppointment.doctorId || selectedAppointment.doctorID,
                Rating: Math.round(rating),
                Comment: comment,
                Date: new Date().toISOString(),
                AppointmentID: appointmentId // optional for backend tracking
            };

            await axios.post(`${API_BASE_URL}/Feedback/Add`, feedbackPayload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // ✅ Store locally to prevent future rating of same appointment
            const updatedRated = [...ratedAppointments, appointmentId];
            localStorage.setItem('ratedAppointments', JSON.stringify(updatedRated));
            setRatedAppointments(updatedRated);

            setShowModal(false);
            alert("Feedback submitted successfully!");
        } catch (err) {
            console.error(err);
            alert("Failed to submit feedback.");
        }
        setSubmitting(false);
    };

    const showCancelButton = (statusName) =>
        ["Pending", "Confirmed", "Rescheduled"].includes(statusName);

    const showRateButton = (statusName) => statusName === "Completed";

    return (
        <>
            <PatientNavbar />
            <div className="patient-container-full">
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
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {appointments.map((appt, index) => {
                                        const apptId = appt.appointmentId || appt.AppointmentId;
                                        return (
                                            <tr key={index}>
                                                <td>{appt.doctorName || appt.DoctorName || "Unknown"}</td>
                                                <td>
                                                    {(() => {
                                                        const dateStr = appt.appointmentDate?.split('T')[0] || appt.AppointmentDate?.split('T')[0];
                                                        if (!dateStr) return '';

                                                        const date = new Date(dateStr);
                                                        date.setDate(date.getDate() + 1);

                                                        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                                                        const enLocale = 'en-US';
                                                        const formattedDate = date.toLocaleDateString(enLocale, options);

                                                        return formattedDate;
                                                    })()}
                                                </td>
                                                <td>
                                                    {(appt.appointmentDate || appt.AppointmentDate) &&
                                                        new Date(new Date(appt.appointmentDate || appt.AppointmentDate).getTime())
                                                            .toTimeString()
                                                            .substring(0, 5)}
                                                </td>
                                                <td>
                                                    {(() => {
                                                        const status = appt.statusName || appt.StatusName;
                                                        let display = status;
                                                        let badgeColor = 'bg-dark';

                                                        if (["Rescheduled", "Reschedule Rejected"].includes(status)) {
                                                            display = "Pending";
                                                            badgeColor = "bg-secondary";
                                                        } else if (status === "Completed") {
                                                            badgeColor = "bg-success";
                                                        } else if (status === "Canceled") {
                                                            badgeColor = "bg-danger";
                                                        } else if (status === "Pending") {
                                                            badgeColor = "bg-secondary";
                                                        }

                                                        return <span className={`badge ${badgeColor}`}>{display}</span>;
                                                    })()}
                                                </td>




                                                <td>{appt.notes || appt.Notes}</td>
                                                <td className="d-flex flex-wrap gap-2 justify-content-start align-items-center">
                                                    {showCancelButton(appt.statusName || appt.StatusName) && (
                                                        <button
                                                            className="btn btn-warning btn-sm"
                                                            onClick={() => handleCancel(apptId)}
                                                        >
                                                            Cancel
                                                        </button>
                                                    )}

                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={async () => {
                                                            if (window.confirm("Are you sure you want to permanently delete this appointment?")) {
                                                                try {
                                                                    const user = JSON.parse(localStorage.getItem('user'));
                                                                    const token = user.token;
                                                                    await axios.delete(`${API_BASE_URL}/Appointment/Delete/${apptId}`, {
                                                                        headers: { Authorization: `Bearer ${token}` }
                                                                    });

                                                                    setAppointments(prev => prev.filter(a => (a.appointmentId || a.AppointmentId) !== apptId));
                                                                    alert("Appointment deleted successfully.");
                                                                } catch (err) {
                                                                    console.error(err);
                                                                    alert("Failed to delete appointment.");
                                                                }
                                                            }
                                                        }}
                                                    >
                                                        Delete
                                                    </button>

                                                    {showRateButton(appt.statusName || appt.StatusName) &&
                                                        !hasRated(apptId) && (
                                                            <button
                                                                className="btn btn-success btn-sm"
                                                                onClick={() => handleOpenModal(appt)}
                                                            >
                                                                Rate Doctor
                                                            </button>
                                                        )}
                                                </td>

                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {showModal && (
                        <div className="modal-overlay">
                            <div className="modal-content">
                                <h3>Rate Doctor</h3>
                                <ReactStars
                                    count={5}
                                    value={rating}
                                    onChange={setRating}
                                    size={40}
                                    color2={'#ffd700'}
                                />
                                <textarea
                                    rows={4}
                                    className="feedback-comment"
                                    placeholder="Write your comment (optional)"
                                    value={comment}
                                    onChange={e => setComment(e.target.value)}
                                />
                                <div className="modal-actions">
                                    <button onClick={() => setShowModal(false)} disabled={submitting}>Cancel</button>
                                    <button onClick={handleSubmit} disabled={submitting}>Submit Rating</button>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}
