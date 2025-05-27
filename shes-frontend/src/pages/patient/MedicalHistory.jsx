import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PatientSidebar from '../../components/PatientSidebar';
import API_BASE_URL from '../../config/apiConfig';
import './PatientDashboard.css';

export default function MedicalHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('user')).token;
        const decoded = JSON.parse(atob(token.split('.')[1]));
        const userId = parseInt(decoded.userId || decoded.sub);

        const res1 = await axios.get(`${API_BASE_URL}/Patient/PatientIdByUserId/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const patientId = res1.data.patientId;

        const res2 = await axios.get(`${API_BASE_URL}/Patient/MedicalHistory/${patientId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setHistory(res2.data);
      } catch (error) {
        console.error("Failed to fetch medical history:", error);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="patient-container-full">
      <PatientSidebar />
      <main className="MedicalHistory-container">
        <h2 className="MedicalHistory-title">Medical History</h2>

        <div className="MedicalHistory-grid">
          {history.length === 0 ? (
            <p className="MedicalHistory-empty">No medical history found.</p>
          ) : (
            history.map((entry, index) => (
              <div key={index} className="MedicalHistory-card">
                <h3 className="MedicalHistory-card-title">Diagnosis: <span>{entry.diagnosis}</span></h3>
                <p><strong>Treatment:</strong> {entry.treatment}</p>
                <p><strong>Visit Date:</strong> {new Date(entry.visitDate).toLocaleDateString()}</p>
                <p><strong>Doctor:</strong> {entry.doctorName}</p>
                <p><strong>Note:</strong> {entry.note || 'No notes'}</p>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
