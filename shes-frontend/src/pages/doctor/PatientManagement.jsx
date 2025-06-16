 
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config/apiConfig';
import DoctorSidebar from '../../components/DoctorSidebar';
import Navbar from '../../components/DrNavbar';
export default function PatientManagement() {
  const [note, setNote] = useState('');
  const [treatment, setTreatment] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [compliance, setCompliance] = useState('');
  const [patientId, setPatientId] = useState('');
  const [patients, setPatients] = useState([]);
  const [reportFile, setReportFile] = useState(null);
  const [reportDescription, setReportDescription] = useState('');
  const token = JSON.parse(localStorage.getItem('user'))?.token;

  const handleAddNote = async () => {
    try {
      await axios.post(`${API_BASE_URL}/Doctor/AddPatientNote`, {
        patientId: parseInt(patientId),
        note,
        treatment,
        diagnosis
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Note added successfully.');
    } catch (err) {
      console.error(err);
      alert('Error adding note.');
    }
  };

  const handleEvaluateCompliance = async () => {
    try {
      await axios.post(`${API_BASE_URL}/Doctor/EvaluateCompliance`, {
        patientId: parseInt(patientId),
        evaluation: compliance
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Compliance evaluation submitted.');
    } catch (err) {
      console.error(err);
      alert('Error submitting compliance.');
    }
  };

 const handleUploadReport = async () => {
  if (!reportFile || !patientId) {
    alert("Please select a patient and file.");
    return;
  }

  const formData = new FormData();
  formData.append("PatientId", patientId);
  formData.append("ReportFile", reportFile);

  try {
    await axios.post(`${API_BASE_URL}/Doctor/UploadReportFile`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    alert("✅ Report uploaded successfully.");
    setReportFile(null);
  } catch (err) {
    console.error(err);
    alert("❌ Failed to upload report.");
  }
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

return (
  <>
    <Navbar />
    <div className="PatientManagement-container">
      <DoctorSidebar />
      <main className="PatientManagement-main">
        <h1 className="PatientManagement-title">Patient Management</h1>

        <div className="PatientManagement-form">
          {/* Patient Selection */}
          <label className="PatientManagement-label">Select Patient</label>
          <select
            className="PatientManagement-input"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
          >
            <option value="">-- Choose Patient --</option>
            {patients.map(p => (
              <option key={p.patientId} value={p.patientId}>
                {p.fullName} ({p.gender})
              </option>
            ))}
          </select>

          {/* Note Selection */}
          <label className="PatientManagement-label">Select Note:</label>
          <select
            className="PatientManagement-input"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          >
            <option value="">-- Choose Note --</option>
            <option value="Follow-up Required">Follow-up Required</option>
            <option value="Patient is Stable">Patient is Stable</option>
            <option value="Needs Imaging">Needs Imaging</option>
            <option value="Medication Adjustment">Medication Adjustment</option>
          </select>

          {/* Diagnosis Input */}
          <input
            type="text"
            placeholder="Diagnosis"
            className="PatientManagement-input"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
          />

          {/* Horizontal Row for Report & Treatment */}
          <div className="horizontal-group">
            <input
              type="text"
              placeholder="Treatment"
              className="PatientManagement-input half-width"
              value={treatment}
              onChange={(e) => setTreatment(e.target.value)}
            />

            <input
              type="text"
              placeholder="Report Description"
              className="PatientManagement-input half-width"
              value={reportDescription}
              onChange={(e) => setReportDescription(e.target.value)}
            />
          </div>

          {/* Upload Section */}
          <label className="PatientManagement-label">Upload Report (PDF/Image)</label>
          <input
            type="file"
            className="PatientManagement-input"
            onChange={(e) => setReportFile(e.target.files[0])}
          />

          {/* Buttons */}
          <div className="button-group">
            <button
              className="PatientManagement-button btn-note"
              onClick={handleAddNote}
              disabled={!patientId}
            >
              Add Note
            </button>

            <button
              className="PatientManagement-button btn-upload"
              onClick={handleUploadReport}
              disabled={!patientId || !reportFile}
            >
              Upload Report
            </button>
          </div>
        </div>
      </main>
    </div>
  </>
);
}
