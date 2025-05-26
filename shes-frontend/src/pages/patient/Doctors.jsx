import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PatientDashboard.css';
import PatientSidebar from '../../components/PatientSidebar';
import API_BASE_URL from '../../config/apiConfig';
export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [bookingDoctorId, setBookingDoctorId] = useState(null);
  const [appointmentData, setAppointmentData] = useState({ date: '', time: '' });

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const res = await axios.get(`${API_BASE_URL}/Patient/Doctors`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setDoctors(res.data);
      } catch (err) {
        console.error('Failed to fetch doctors:', err);
      }
    };

    fetchDoctors();
  }, []);

  const handleBookClick = (doctorId) => {
    setBookingDoctorId(doctorId === bookingDoctorId ? null : doctorId);
    setAppointmentData({ date: '', time: '' });
  };

const handleSubmit = async (e, doctorId) => {
  e.preventDefault();
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user.token;

    const decoded = JSON.parse(atob(token.split('.')[1]));
    const userIdFromToken = parseInt(decoded.userId || decoded.sub);

   
    const patientRes = await axios.get(`${API_BASE_URL}/Patient/PatientIdByUserId/${userIdFromToken}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const actualPatientId = patientRes.data.patientId;

   
    const formattedDateTime = new Date(`${appointmentData.date}T${appointmentData.time}`);

     console.log({
      doctorId,
      patientId: actualPatientId,
      dateTime: formattedDateTime,
      status: "Pending",
      notes: "Booked from patient panel"
    });

    await axios.post(`${API_BASE_URL}/Appointment/Book`, {
      doctorId,
      patientId: actualPatientId,
      dateTime: formattedDateTime,
      status: "Pending",
      notes: "Booked from patient panel"
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    alert("Appointment booked successfully!");
    setBookingDoctorId(null);

  } catch (error) {
    console.error("Booking failed:", error);
    alert("Booking failed. Please try again.\n" + (error.response?.data?.message || error.message));
  }
 

};



  return (
    <div className="patient-container-full">
      <PatientSidebar />
      
      <main className="doctor-main">
        <h2 className="doctor-title">Available Doctors</h2>
        <div className="doctor-grid">
          {doctors.map((doc, index) => (
            <div key={index} className="doctor-card">
              <img
                src={`https://i.pravatar.cc/150?img=${index + 10}`}
                alt="doctor"
                className="doctor-avatar"
              />
              <div className="doctor-info">
                <h3>{doc.fullName}</h3>
                
          <p><strong>Specialization:</strong> {doc.specialization || "N/A"}</p>

<p><strong>Gender:</strong> {doc.gender || "Not specified"}</p>

                <p><strong>Email:</strong> {doc.email}</p>
              </div>
              <button className="doctor-book-btn" onClick={() => handleBookClick(doc.doctorId)}>
                {bookingDoctorId === doc.doctorId ? 'Cancel' : 'Book Appointment'}
              </button>

              {bookingDoctorId === doc.doctorId && (
                <form className="doctor-book-form" onSubmit={(e) => handleSubmit(e, doc.doctorId)}>
                  <input
                    type="date"
                    required
                    value={appointmentData.date}
                    onChange={(e) => setAppointmentData({ ...appointmentData, date: e.target.value })}
                  />
                  <input
                    type="time"
                    required
                    value={appointmentData.time}
                    onChange={(e) => setAppointmentData({ ...appointmentData, time: e.target.value })}
                  />
                  <button type="submit" className="doctor-book-submit">Confirm</button>
                </form>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}