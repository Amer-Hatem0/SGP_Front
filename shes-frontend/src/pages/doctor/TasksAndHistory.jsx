import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DoctorSidebar from '../../components/DoctorSidebar';
import API_BASE_URL from '../../config/apiConfig';
 
export default function TasksAndHistory() {
  const [workHistory, setWorkHistory] = useState([]);
  const [dailyTasks, setDailyTasks] = useState(null);
  const token = JSON.parse(localStorage.getItem('user'))?.token;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [historyRes, tasksRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/Doctor/WorkHistory`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${API_BASE_URL}/Doctor/DailyTasks`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        setWorkHistory(historyRes.data);
        setDailyTasks(tasksRes.data);
      } catch (err) {
        console.error(err);
        alert('Error loading data.');
      }
    };

    fetchData();
  }, []);

  return (
    <div className="TasksAndHistory-container">
      <DoctorSidebar />
      <main className="TasksAndHistory-main">
        <h1 className="TasksAndHistory-title">Daily Overview</h1>

        {dailyTasks && (
          <div className="TasksAndHistory-section">
            <h2>📋 Today's Summary</h2>
            <ul className="TasksAndHistory-cards">
              <li className="card">Appointments Today: <strong>{dailyTasks.appointmentsToday}</strong></li>
              <li className="card">Pending Reschedules: <strong>{dailyTasks.pendingReschedules}</strong></li>
              <li className="card">Follow-ups Needed: <strong>{dailyTasks.patientsNeedingFollowUp}</strong></li>
            </ul>

            <div className="TasksAndHistory-subsection">
              <h3>Today's Appointments</h3>
              <ul>
                {dailyTasks.todayAppointmentsDetails.map((a, idx) => (
                  <li key={idx}>🩺 {a.patientName} at {new Date(a.appointmentDate).toLocaleTimeString()}</li>
                ))}
              </ul>
            </div>

            <div className="TasksAndHistory-subsection">
              <h3>Pending Reschedule Requests</h3>
              <ul>
                {dailyTasks.pendingReschedulesDetails.map((r, idx) => (
                  <li key={idx}>📅 {r.patientName} - New Date: {new Date(r.requestedNewDate).toLocaleDateString()} – {r.reason}</li>
                ))}
              </ul>
            </div>

            <div className="TasksAndHistory-subsection">
              <h3>Follow-Up Patients</h3>
              <ul>
                {dailyTasks.patientsNeedingFollowUpDetails.map((f, idx) => (
                  <li key={idx}>🔁 {f.patientName} – Diagnosis: {f.diagnosisSummary}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="TasksAndHistory-section">
          <h2>🕓 Work History</h2>
          <table className="TasksAndHistory-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {workHistory.map((w, idx) => (
                <tr key={idx}>
                  <td>{w.patientName}</td>
                  <td>{new Date(w.appointmentDate).toLocaleDateString()}</td>
                  <td>{w.statusName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
