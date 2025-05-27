// import React from 'react';
// import './PatientDashboard.css';
// import PatientSidebar from '../../components/PatientSidebar';
// import { FaUserMd, FaUserNurse, FaWheelchair, FaPrescriptionBottleAlt } from 'react-icons/fa';

// export default function PatientHome() {
//   return (

//     <div className="patient-container-full">
//       <PatientSidebar />

//       <main className="patient-main">
//         <header className="patient-header">
//           <input type="text" placeholder="Search here..." className="patient-search" />
//           <div className="patient-icons">
//             <span>🔔</span>
//             <span>💬</span>
//             <img src="https://i.pravatar.cc/40" alt="profile" className="patient-avatar" />
//           </div>
//         </header>

//         <section className="patient-stats">
//           <div className="patient-card">
//             <FaUserMd size={28} className="text-[#25a6e9]" />
//             <div>
//               <div className="patient-stat-number">520</div>
//               <div className="patient-stat-label">Doctors</div>
//             </div>
//           </div>

//           <div className="patient-card">
//             <FaUserNurse size={28} className="text-[#ef5350]" />
//             <div>
//               <div className="patient-stat-number">6969</div>
//               <div className="patient-stat-label">Nurses</div>
//             </div>
//           </div>

//           <div className="patient-card">
//             <FaWheelchair size={28} className="text-[#ffa726]" />
//             <div>
//               <div className="patient-stat-number">7509</div>
//               <div className="patient-stat-label">Patients</div>
//             </div>
//           </div>

//           <div className="patient-card">
//             <FaPrescriptionBottleAlt size={28} className="text-[#26c6da]" />
//             <div>
//               <div className="patient-stat-number">2110</div>
//               <div className="patient-stat-label">Pharmacists</div>
//             </div>
//           </div>
//         </section>
//       </main>
//     </div>

//   );
// }
import React, { useEffect, useState } from 'react';
import PatientSidebar from '../../components/PatientSidebar';
import axios from 'axios';
import API_BASE_URL from '../../config/apiConfig';
import './PatientDashboard.css';
import PatientNavbar from '../../components/PatientNavbar';

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
    ? appointments.sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))[0]
    : null;

  return (
    <div className="patient-container-full">
      <PatientSidebar />


      <main className="PatientHome-main p-8">

        <h1 className="PatientHome-title text-2xl font-bold mb-4">Welcome, {fullName}</h1>
        <p className="PatientHome-date text-gray-600 mb-8">Today is {new Date().toLocaleDateString()}</p>

        <div className="PatientHome-cards grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="PatientHome-card bg-white shadow rounded p-5 border">
            <h3 className="text-lg font-semibold text-blue-600 mb-2">Next Appointment</h3>
            {nextAppointment ? (
              <p className="text-gray-700">{new Date(nextAppointment.appointmentDate).toLocaleString()}</p>
            ) : (
              <p className="text-gray-500">No upcoming appointments</p>
            )}
          </div>

          <div className="PatientHome-card bg-white shadow rounded p-5 border">
            <h3 className="text-lg font-semibold text-green-600 mb-2">Medical Reports</h3>
            <p className="text-gray-700">{reports.length} report(s)</p>
          </div>

          <div className="PatientHome-card bg-white shadow rounded p-5 border">
            <h3 className="text-lg font-semibold text-purple-600 mb-2">Recent Diagnosis</h3>
            {history.length > 0 ? (
              <p className="text-gray-700">{history[0].diagnosis}</p>
            ) : (
              <p className="text-gray-500">No history available</p>
            )}
          </div>



        </div>
      </main>
    </div>
  );
}
