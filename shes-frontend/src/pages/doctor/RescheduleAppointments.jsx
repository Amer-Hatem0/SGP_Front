import { useNavigate } from 'react-router-dom'; 
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DoctorSidebar from '../../components/DoctorSidebar';
import Navbar from '../../components/DrNavbar';
import API_BASE_URL from '../../config/apiConfig';

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [rescheduleData, setRescheduleData] = useState({});
  const token = JSON.parse(localStorage.getItem('user'))?.token;
  const navigate = useNavigate(); 

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/Doctor/MyAppointments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(res.data);
    } catch (err) {
      console.error('Error fetching appointments:', err);
    }
  };

  const getStatusInfo = (statusID) => {
    switch (statusID) {
      case 1: return { label: 'Pending', color: 'secondary' };
      case 2: return { label: 'Scheduled', color: 'info' };
      case 3: return { label: 'Completed', color: 'success' };
      case 4: return { label: 'Canceled', color: 'danger' };
      case 5: return { label: 'Rescheduled', color: 'warning text-dark' };
          case 7: return { label: 'Reschedule Rejected', color: 'danger' };
      default: return { label: 'Unknown', color: 'dark' };
    }
  };

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
      alert('✅ Reschedule request sent.');
      fetchAppointments();
    } catch (err) {
      console.error(err);
      alert('❌ Failed to submit request.');
    }
  };

  const markAsCompleted = async (id) => {
    try {
      await axios.put(`${API_BASE_URL}/Doctor/MarkAppointmentCompleted/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('✅ Appointment marked as completed.');
      fetchAppointments();
      navigate('/doctor/patient-management');
    } catch (err) {
      console.error(err);
      alert('❌ Failed to mark as completed.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="d-flex">
        <DoctorSidebar />
        <div className="container myappoint">
          <h4 className="fw-bold mb-4">My Appointments</h4>

          {appointments.length === 0 ? (
            <p className="text-muted">No appointments found.</p>
          ) : (
            <table className="table table-bordered table-hover shadow-sm">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Patient</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                  <th>Reschedule</th>
                  <th>Complete</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((app, i) => {
                  const { label, color } = getStatusInfo(app.statusID);
                  const disabled = app.statusID === 3;
                  return (
                    <tr key={app.appointmentId}>
                      <td>{i + 1}</td>
                      <td>{app.patientName}</td>
                    <td>
  {(() => {
    const date = new Date(app.appointmentDate);
    date.setDate(date.getDate() + 1);  

    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };

    return date.toLocaleString('en-US', options);
  })()}
</td>
                      <td>
                        <span className={`badge bg-${color}`}>{label}</span>
                      </td>
                      <td>
                        <input
                          type="datetime-local"
                          value={rescheduleData[app.appointmentId]?.newDate || ''}
                          onChange={(e) => handleChange(app.appointmentId, 'newDate', e.target.value)}
                          className="form-control form-control-sm mb-1"
                          disabled={disabled}
                        />
                        <input
                          type="text"
                          placeholder="Reason"
                          value={rescheduleData[app.appointmentId]?.reason || ''}
                          onChange={(e) => handleChange(app.appointmentId, 'reason', e.target.value)}
                          className="form-control form-control-sm mb-1"
                          disabled={disabled}
                        />
                        <button
                          className="btn btn-sm btn-primary"
                          disabled={disabled}
                          onClick={() => submitReschedule(app.appointmentId)}
                        >
                          Submit
                        </button>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => markAsCompleted(app.appointmentId)}
                          disabled={disabled}
                        >
                          Mark Done
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
