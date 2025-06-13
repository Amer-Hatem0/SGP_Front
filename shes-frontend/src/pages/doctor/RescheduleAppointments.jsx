import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DoctorSidebar from '../../components/DoctorSidebar';
import API_BASE_URL from '../../config/apiConfig';
 
export default function RescheduleAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [rescheduleData, setRescheduleData] = useState({});
  const token = JSON.parse(localStorage.getItem('user'))?.token;

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/Doctor/MyAppointments`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAppointments(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAppointments();
  }, []);

  const handleChange = (id, field, value) => {
    setRescheduleData(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }));
  };

  const submitReschedule = async (id) => {
    const data = rescheduleData[id];
    if (!data?.newDate || !data?.reason) {
      alert('Please provide both date and reason.');
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/Doctor/RequestReschedule`, {
        appointmentId: id,
        newDate: data.newDate,
        reason: data.reason
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Reschedule request submitted.');
    } catch (err) {
      console.error(err);
      alert('Error submitting request.');
    }
  };

  return (
    <div className="Reschedule-container">
      <DoctorSidebar />
      <main className="Reschedule-main">
        <h2 className="Reschedule-title">Request Appointment Reschedule</h2>

        {appointments.length === 0 && <p>No appointments found.</p>}

        <ul className="Reschedule-list">
          {appointments.map(app => (
            <li key={app.appointmentId} className="Reschedule-item">
              <strong>Patient:</strong> {app.patientName}<br />
              <strong>Date:</strong> {new Date(app.appointmentDate).toLocaleString()}<br />
              <strong>Status:</strong> {app.statusName}<br />

              <div className="Reschedule-form">
                <input
                  type="datetime-local"
                  value={rescheduleData[app.appointmentId]?.newDate || ''}
                  onChange={(e) =>
                    handleChange(app.appointmentId, 'newDate', e.target.value)
                  }
                  className="Reschedule-input"
                />
                <input
                  type="text"
                  placeholder="Reason for reschedule"
                  value={rescheduleData[app.appointmentId]?.reason || ''}
                  onChange={(e) =>
                    handleChange(app.appointmentId, 'reason', e.target.value)
                  }
                  className="Reschedule-input"
                />
                <button
                  className="Reschedule-button"
                  onClick={() => submitReschedule(app.appointmentId)}
                >
                  Submit Reschedule
                </button>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
