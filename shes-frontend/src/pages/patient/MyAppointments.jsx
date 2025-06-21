import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config/apiConfig';
import PatientNavbar from '../../components/PatientNavbar';
import ReactStars from "react-stars";
import './PatientDashboard.css';

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
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
          appt.appointmentId === appointmentId || appt.AppointmentId === appointmentId
            ? { ...appt, statusName: "Canceled", StatusName: "Canceled", statusID: 4 }
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
        DoctorUserID: selectedAppointment.DoctorUserID || selectedAppointment.DoctorID || selectedAppointment.doctorId,
        Rating: Math.round(rating),
        Comment: comment,
        Date: new Date().toISOString(),
        AppointmentID: appointmentId
      };

      await axios.post(`${API_BASE_URL}/Feedback/Add`, feedbackPayload, {
        headers: { Authorization: `Bearer ${token}` }
      });

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

          <div className="mb-3 d-flex align-items-center gap-2">
            <label className="form-label fw-semibold mb-0">Filter by Status:</label>
            <select
              className="form-select form-select-sm"
              style={{ maxWidth: '200px' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Canceled">Canceled</option>
              <option value="Rescheduled">Rescheduled</option>
            </select>
          </div>

          <div className="appointments-table">
            {appointments.length === 0 ? (
              <p>No appointments found.</p>
            ) : (
              <table className="table table-bordered">
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
                  {appointments
                    .filter(appt => {
                      const status = appt.statusName || appt.StatusName;
                      if (["Rescheduled", "Reschedule Rejected"].includes(status)) {
                        return statusFilter === 'Pending' || statusFilter === 'All';
                      }
                      return statusFilter === 'All' || status === statusFilter;
                    })
                    .map((appt, index) => {
                      const apptId = appt.appointmentId || appt.AppointmentId;
                      return (
                        <tr key={index}>
                          <td>{appt.doctorName || "Unknown"}</td>
                          <td>{new Date(appt.appointmentDate).toLocaleDateString()}</td>
                          <td>{new Date(appt.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
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
                          <td>{appt.notes}</td>
                          <td className="d-flex flex-wrap gap-2">
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
                                if (window.confirm("Are you sure you want to delete this appointment?")) {
                                  try {
                                    const user = JSON.parse(localStorage.getItem('user'));
                                    const token = user.token;
                                    await axios.delete(`${API_BASE_URL}/Appointment/Delete/${apptId}`, {
                                      headers: { Authorization: `Bearer ${token}` }
                                    });
                                    setAppointments(prev => prev.filter(a => (a.appointmentId || a.AppointmentId) !== apptId));
                                    alert("Deleted successfully.");
                                  } catch (err) {
                                    console.error(err);
                                    alert("Failed to delete.");
                                  }
                                }
                              }}
                            >
                              Delete
                            </button>
                            {showRateButton(appt.statusName || appt.StatusName) && !hasRated(apptId) && (
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
                <div className="modal-actions mt-3">
                  <button className="btn btn-secondary" onClick={() => setShowModal(false)} disabled={submitting}>Cancel</button>
                  <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>Submit Rating</button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
