
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config/apiConfig';
import './PatientDashboard.css';
import PatientNavbar from '../../components/PatientNavbar';
import PatientSidebar from '../../components/PatientSidebar';
import Spinner from '../../components/Spinner';
import { useNavigate } from 'react-router-dom';

export default function PatientHome() {
  const [fullName, setFullName] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [reports, setReports] = useState([]);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const getStatusLabel = (statusId) => {
    switch (statusId) {
      case 1: return "Pending";
      case 2: return "Scheduled";
      case 3: return "Completed";
      case 4: return "Canceled";
      case 5: return "Rescheduled";
      default: return "Unknown";
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user.token;
        const decoded = JSON.parse(atob(token.split('.')[1]));
        const userId = parseInt(decoded.userId || decoded.sub);

        const profileRes = await axios.get(`${API_BASE_URL}/Patient/Profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFullName(profileRes.data.fullName);

        const res1 = await axios.get(`${API_BASE_URL}/Patient/PatientIdByUserId/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const patientId = res1.data.patientId;

        const appointmentsRes = await axios.get(`${API_BASE_URL}/Appointment/Patient/${patientId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAppointments(appointmentsRes.data);

        const reportsRes = await axios.get(`${API_BASE_URL}/ReportFile/Patient/${patientId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReports(reportsRes.data);

        const historyRes = await axios.get(`${API_BASE_URL}/Patient/MedicalHistory/${patientId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setHistory(historyRes.data);

      } catch (err) {
        console.error("Error fetching data", err);
      } finally {
        setIsLoading(false);  // <-- stop loading
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
  if (isLoading) {
    return <Spinner message="Loading your data..." />;
  }
  const canceledCount = appointments.filter(a => a.statusID === 4).length;


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
                      <>
                        <p className="card-text">{new Date(nextAppointment.appointmentDate).toLocaleString()}</p>
                        <p className="text-muted">Status: <strong>{getStatusLabel(nextAppointment.statusID)}</strong></p>
                      </>
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
              {/* Canceled Appointments */}
              <div className="col-md-4">
                <div className="card shadow-sm border-left-danger h-100">
                  <div className="card-body">
                    <h5 className="card-title text-danger fw-semibold">Canceled Appointments</h5>
                    <p className="card-text">{canceledCount} canceled</p>
                  </div>
                </div>
              </div>
              {/* Last Canceled Appointment with Redirect */}
              {canceledCount > 0 && (
                <div className="col-md-8">
                  <div
                    className="card shadow-sm border-left-warning h-100 hoverable"
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate('/patient/appointments')}
                  >
                    <div className="card-body">
                      <h5 className="card-title text-warning fw-semibold">Last Canceled Appointment</h5>
                      {appointments
                        .filter(a => a.statusID === 4)
                        .sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate))
                        .slice(0, 1)
                        .map((appt, idx) => (
                          <div key={idx}>
                            <p className="mb-1">Date: <strong>{new Date(appt.appointmentDate).toLocaleString()}</strong></p>
                            <p className="mb-2">Doctor: <strong>{appt.doctorName}</strong></p>
                            <p className="text-muted">⚠️ Your previous appointment was canceled. Please book a new one.</p>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}


            </div>
          </main>
        </div>
      </div>
    </div>
  );
}