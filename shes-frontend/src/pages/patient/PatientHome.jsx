 
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config/apiConfig';
import './PatientDashboard.css'; 
import PatientNavbar from '../../components/PatientNavbar';
import PatientSidebar from '../../components/PatientSidebar';

export default function PatientHome() {
  const [fullName, setFullName] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [reports, setReports] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user.token;
        const decoded = JSON.parse(atob(token.split('.')[1]));
        const userId = parseInt(decoded.userId || decoded.sub);

        // get profile
        const profileRes = await axios.get(`${API_BASE_URL}/Patient/Profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFullName(profileRes.data.fullName);

        // get patientId
        const res1 = await axios.get(`${API_BASE_URL}/Patient/PatientIdByUserId/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const patientId = res1.data.patientId;

        // appointments
        const appointmentsRes = await axios.get(`${API_BASE_URL}/Appointment/Patient/${patientId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAppointments(appointmentsRes.data);

        // reports
        const reportsRes = await axios.get(`${API_BASE_URL}/ReportFile/Patient/${patientId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReports(reportsRes.data);

        // medical history
        const historyRes = await axios.get(`${API_BASE_URL}/Patient/MedicalHistory/${patientId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setHistory(historyRes.data);

      } catch (err) {
        console.error("Error fetching data", err);
      }
    };

    fetchData();
  }, []);

  const nextAppointment = appointments.length > 0
    ? [...appointments].sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))[0]
    : null;
const today = new Date();

const options = {
  weekday: 'long',    
  year: 'numeric',
  month: 'long',     
  day: 'numeric'
};

const formattedDate = today.toLocaleDateString('en-US', options);
  return (
    <div className=" patient-main1">
      <PatientNavbar />

      <div className="container-fluid ">
        <div className="row">
     

          <main className="col-md-10 patient-main ms-sm-auto px-md-4 py-5">
            <div className="d-flex justify-content-between align-items-center mb-5 mt-5">
              <h2 className="fw-bold text-primary">Welcome, {fullName}</h2>
              <p className="text-muted1 mb-0">  Today is {formattedDate}</p>
            </div>

            <div className="row g-4">
              {/* Next Appointment */}
              <div className="col-md-4">
                <div className="card shadow-sm border-left-primary h-100">
                  <div className="card-body">
                    <h5 className="card-title text-primary fw-semibold">Next Appointment</h5>
                    {nextAppointment ? (
                      <p className="card-text">{new Date(nextAppointment.appointmentDate).toLocaleString()}</p>
                    ) : (
                      <p className="text-muted">No upcoming appointments</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Medical Reports */}
              <div className="col-md-4">
                <div className="card shadow-sm border-left-success h-100">
                  <div className="card-body">
                    <h5 className="card-title text-success fw-semibold">Medical Reports</h5>
                    <p className="card-text">{reports.length} report(s)</p>
                  </div>
                </div>
              </div>

              {/* Recent Diagnosis */}
              <div className="col-md-4">
                <div className="card shadow-sm border-left-purple h-100">
                  <div className="card-body">
                    <h5 className="card-title text-purple fw-semibold">Recent Diagnosis</h5>
                    {history.length > 0 ? (
                      <p className="card-text">{history[0].diagnosis}</p>
                    ) : (
                      <p className="text-muted">No history available</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}