import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DoctorSidebar from '../../components/DoctorSidebar';
import API_BASE_URL from '../../config/apiConfig';

export default function PatientDetails() {
  const [patientId, setPatientId] = useState('');
  const [patients, setPatients] = useState([]);
  const [history, setHistory] = useState(null);
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const token = JSON.parse(localStorage.getItem('user'))?.token;

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/Doctor/PatientFullHistory/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(res.data);
    } catch (err) {
      console.error(err);
      alert('Patient not found or error fetching data.');
    }
  };

  const fetchReports = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/Doctor/PatientReports/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReports(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePatientChange = (e) => {
    setPatientId(e.target.value);
    setHistory(null);
    setReports([]);
  };

  useEffect(() => {
    const fetchPatients = async () => {
      const res = await axios.get(`${API_BASE_URL}/Doctor/GetMyPatients`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPatients(res.data);
    };
    fetchPatients();
  }, []);

  const showReport = (url) => {
    setSelectedReport(url);
  };

  const closeModal = () => {
    setSelectedReport(null);
  };

  return (
    <div className="PatientDetails-container">
      <DoctorSidebar />
      <main className="PatientDetails-main">
        <h1 className="PatientDetails-title">Patient Full Details</h1>

        <div className="PatientDetails-form">
          <label className="PatientDetails-label">Select Patient</label>
          <select
            className="PatientDetails-input"
            value={patientId}
            onChange={handlePatientChange}
          >
            <option value="">-- Choose Patient --</option>
            {patients.map(p => (
              <option key={p.patientId} value={p.patientId}>
                {p.fullName} ({p.gender})
              </option>
            ))}
          </select>

          <button className="PatientDetails-button" onClick={() => { fetchHistory(); fetchReports(); }}>
            Show History
          </button>
        </div>

        {history && (
          <div className="PatientDetails-content">
            <div className="PatientDetails-infoCard">
              <h2 className="PatientDetails-subtitle">🧑‍⚕️ {history.fullName}</h2>
              <p><strong>Age:</strong> {history.age}</p>
              <p><strong>Gender:</strong> {history.gender}</p>
            </div>

            <div className="PatientDetails-section">
              <h2 className="PatientDetails-subtitle">📅 Appointments</h2>
              <ul className="PatientDetails-list">
                {history.visits?.map((visit, idx) => (
                  <li key={idx} className="PatientDetails-item">
                    🗓️ <strong>{new Date(visit.appointmentDate).toLocaleDateString()}</strong><br />
                    Doctor: {visit.doctorName}<br />
                    Status: <strong>{visit.status}</strong>
                  </li>
                ))}
              </ul>
            </div>

            <div className="PatientDetails-section">
              <h2 className="PatientDetails-subtitle">📄 Medical History</h2>
              <ul className="PatientDetails-list">
                {history.medicalHistories?.map((record, idx) => (
                  <li key={idx} className="PatientDetails-item">
                    <p><strong>Diagnosis:</strong> {record.disease}</p>
                    <p><strong>Treatment:</strong> {record.treatment}</p>
                    <p><strong>Note:</strong> {record.notes}</p>
                    <small>{new Date(record.recordedAt).toLocaleDateString()}</small>
                  </li>
                ))}
              </ul>
            </div>

            <div className="PatientDetails-section">
              <h2 className="PatientDetails-subtitle">📁 Uploaded Reports</h2>
              {reports.length === 0 ? (
                <p>No reports found.</p>
              ) : (
                <ul className="PatientDetails-list">
                  {reports.map((rpt, idx) => (
                    <li key={idx} className="PatientDetails-item">
                      <button
                        onClick={() => showReport(rpt.fileUrl)}
                        className="PatientDetails-downloadLink"
                      >
                        📎 {rpt.fileName}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* Modal for showing report */}
        {selectedReport && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <iframe
                src={selectedReport}
                title="Report Viewer"
                style={{ width: '100%', height: '80vh' }}
              />
              <button onClick={closeModal} className="PatientDetails-button">Close</button>
            </div>
          </div>
        )}
      </main>

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: rgba(0,0,0,0.6);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .modal-content {
          background: white;
          padding: 1rem;
          border-radius: 8px;
          width: 80%;
          max-width: 900px;
          box-shadow: 0 0 20px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
}
