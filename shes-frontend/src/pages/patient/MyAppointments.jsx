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

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const token = user.token;
                const decoded = JSON.parse(atob(token.split('.')[1]));
                const userId = parseInt(decoded.userId || decoded.sub);

                // Get patientID from userID
                const res1 = await axios.get(`${API_BASE_URL}/Patient/PatientIdByUserId/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const patientID = res1.data.patientId || res1.data.patientID;

                // Fetch appointments (make sure backend returns DoctorID in each appointment!)
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

    // Cancel appointment handler
    const handleCancel = async (appointmentId) => {
        if (!window.confirm("Are you sure you want to cancel this appointment?")) return;

        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const token = user.token;
            await axios.delete(`${API_BASE_URL}/Appointment/Cancel/${appointmentId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setAppointments(prev => prev.map(appt => 
                appt.appointmentId === appointmentId 
                ? { ...appt, statusName: "Cancelled" } : appt
            ));

            alert("Appointment cancelled.");
        } catch (err) {
            console.error("Failed to cancel appointment:", err);
            alert("Failed to cancel the appointment.");
        }
    };

    // Open rate modal
    const handleOpenModal = (appointment) => {
        setSelectedAppointment(appointment);
        setRating(0);
        setComment('');
        setShowModal(true);
    };

    // Submit feedback
const handleSubmit = async () => {
    if (!rating) {
        alert("Please select a rating!");
        return;
    }
    setSubmitting(true);
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user.token;

   const feedbackPayload = {
 
  DoctorID: selectedAppointment.DoctorID || selectedAppointment.doctorID,
  PatientID: selectedAppointment.PatientID || selectedAppointment.patientID,
  DoctorUserID: selectedAppointment.DoctorUserID || selectedAppointment.DoctorID || selectedAppointment.doctorId || selectedAppointment.doctorID,
  Rating: Math.round(rating),
  Comment: comment,           
  Date: new Date().toISOString()  
};

 


        console.log('Payload:', feedbackPayload);

        await axios.post(`${API_BASE_URL}/Feedback/Add`, feedbackPayload, {
            headers: { Authorization: `Bearer ${token}` }
        });

        setShowModal(false);
        alert("Feedback submitted successfully!");
    } catch (err) {
        console.error(err);
        alert("Failed to submit feedback.");
    }
    setSubmitting(false);
};




    // Show Cancel button only for non-cancelled & non-completed
    const showCancelButton = (statusName) =>
        ["Pending", "Confirmed", "Rescheduled"].includes(statusName);

    // Show Rate Doctor only if Completed
    const showRateButton = (statusName) => statusName === "Completed";

    return (
        <> <PatientNavbar />
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
                                {appointments.map((appt, index) => (
                                    <tr key={index}>
                                        <td>{appt.doctorName || appt.DoctorName || "Unknown"}</td>
                                        <td>{appt.appointmentDate?.split('T')[0] || appt.AppointmentDate?.split('T')[0]}</td>
                                        <td>
                                            {(appt.appointmentDate || appt.AppointmentDate) &&
                                                new Date(new Date(appt.appointmentDate || appt.AppointmentDate).getTime() + 2 * 60 * 60 * 1000)
                                                    .toTimeString()
                                                    .substring(0, 5)}
                                        </td>
                                        <td>{appt.statusName || appt.StatusName}</td>
                                        <td>{appt.notes || appt.Notes}</td>
                                        <td>
                                            {showCancelButton(appt.statusName || appt.StatusName) && (
                                                <button
                                                    className="cancel-btn"
                                                    onClick={() => handleCancel(appt.appointmentId || appt.AppointmentId)}
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                            {showRateButton(appt.statusName || appt.StatusName) && (
                                                <button
                                                    className="rate-btn"
                                                    onClick={() => handleOpenModal(appt)}
                                                >
                                                    Rate Doctor
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
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
        </div></>
    );
}

