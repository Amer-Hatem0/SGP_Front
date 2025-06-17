// // AssignPatient.jsx
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import SupervisorSidebar from '../../components/SupervisorSidebar';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import API_BASE_URL from '../../config/apiConfig';

// export default function AssignPatient() {
//     const [sidebarOpen, setSidebarOpen] = useState(true);
//     const [patients, setPatients] = useState([]);
//     const [doctors, setDoctors] = useState([]);
//     const [assignments, setAssignments] = useState([]);
//     const [selectedPatient, setSelectedPatient] = useState('');
//     const [selectedDoctor, setSelectedDoctor] = useState('');
//     const [successMessage, setSuccessMessage] = useState('');
//     const [appointmentDateTime, setAppointmentDateTime] = useState('');
//     const token = JSON.parse(localStorage.getItem('user'))?.token;

//     useEffect(() => {
//         fetchPatients();
//         fetchDoctors();
//         fetchAssignments();
//     }, []);

//     const fetchPatients = async () => {
//         try {
//             const res = await axios.get(`${API_BASE_URL}/Supervisor/Patients`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             setPatients(res.data);
//         } catch (err) {
//             console.error('Error fetching patients:', err);
//         }
//     };

//     const fetchDoctors = async () => {
//         try {
//             const res = await axios.get(`${API_BASE_URL}/Supervisor/Doctors`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             setDoctors(res.data);
//         } catch (err) {
//             console.error('Error fetching doctors:', err);
//         }
//     };

//     const fetchAssignments = async () => {
//         try {
//             const res = await axios.get(`${API_BASE_URL}/Supervisor/Assignments`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             setAssignments(res.data);
//         } catch (err) {
//             console.error('Error fetching assignments:', err);
//         }
//     };

//     const handleAssign = async () => {
//         if (!selectedPatient || !selectedDoctor || !appointmentDateTime) return;
//         try {
//             await axios.post(
//                 `${API_BASE_URL}/Supervisor/AssignPatient`,
//                 {
//                     patientId: parseInt(selectedPatient),
//                     doctorId: parseInt(selectedDoctor),
//                     dateTime: appointmentDateTime,
//                 },
//                 {
//                     headers: { Authorization: `Bearer ${token}` },
//                 }
//             );

//             setSuccessMessage('✅ Patient assigned successfully!');
//             setSelectedPatient('');
//             setSelectedDoctor('');
//             setAppointmentDateTime('');
//             fetchAssignments();
//         } catch (err) {
//             console.error('Error assigning patient:', err);
//         }
//     };

//     return (
//             <>   <SupervisorSidebar isOpen={sidebarOpen} />
               
//         <div className={`d-flex ${sidebarOpen ? '' : 'sidebar-closed'}`}>
           
//             <div className="flex-grow-1 aaaaaaaaaaaaa">
           

//                 <div className="container mt-5 pt-5">
//                     <div className="row justify-content-center">
//                         <div className="col-lg-5">
//                             <div className="card shadow p-4 border-0 rounded-4">
//                                 {successMessage && (
//                                     <div className="alert alert-success text-center fw-semibold" role="alert">
//                                         {successMessage}
//                                     </div>
//                                 )}
//                                 <h5 className="mb-4 text-center fw-bold">New Assignment</h5>

//                                 <div className="mb-3">
//                                     <label className="form-label fw-semibold">Select Patient</label>
//                                     <select
//                                         className="form-select shadow-sm"
//                                         value={selectedPatient}
//                                         onChange={(e) => setSelectedPatient(e.target.value)}
//                                     >
//                                         <option value="">-- Choose Patient --</option>
//                                         {patients.map((p) => (
//                                             <option key={`patient-${p.patientId}`} value={p.patientId}>
//                                                 {p.fullName}
//                                             </option>
//                                         ))}
//                                     </select>
//                                 </div>

//                                 <div className="mb-3">
//                                     <label className="form-label fw-semibold">Select Doctor</label>
//                                     <select
//                                         className="form-select shadow-sm"
//                                         value={selectedDoctor}
//                                         onChange={(e) => setSelectedDoctor(e.target.value)}
//                                     >
//                                         <option value="">-- Choose Doctor --</option>
//                                         {doctors.map((d, index) => (
//                                             <option key={`doctor-${d.doctorId || index}`} value={d.doctorId}>
//                                                 {d.fullName} - {d.specialization ?? 'No specialty'} ({d.gender ?? 'Unknown'})
//                                             </option>
//                                         ))}
//                                     </select>
//                                 </div>

//                                 <div className="mb-4">
//                                     <label className="form-label fw-semibold">Appointment Date & Time</label>
//                                     <input
//                                         type="datetime-local"
//                                         className="form-control shadow-sm"
//                                         value={appointmentDateTime}
//                                         onChange={(e) => setAppointmentDateTime(e.target.value)}
//                                     />
//                                 </div>

//                                 <button className="btn btn-primary w-100 fw-semibold" onClick={handleAssign}>
//                                     Assign
//                                 </button>
//                             </div>
//                         </div>
//                     <div className="col-lg-7 mt-5">
//                         <div className="col-md-10 offset-md-1">
//                             <h5 className="mb-3 fw-bold">Previous Assignments</h5>
//                             <table className="table table-bordered table-hover shadow-sm rounded">
//                                 <thead className="table-light">
//                                     <tr>
//                                         <th>#</th>
//                                         <th>Patient</th>
//                                         <th>Doctor</th>
//                                         <th>Date Assigned</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {assignments.length > 0 ? (
//                                         assignments.map((a, i) => (
//                                             <tr key={i}>
//                                                 <td>{i + 1}</td>
//                                                 <td>{a.patientName}</td>
//                                                 <td>{a.doctorName}</td>
//                                                 <td>{a.assignedAt?.slice(0, 10)}</td>
//                                             </tr>
//                                         ))
//                                     ) : (
//                                         <tr>
//                                             <td colSpan="4" className="text-center text-muted">No assignments yet.</td>
//                                         </tr>
//                                     )}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//  </div>
                   
//                 </div>
//             </div>
//         </div>  </>
//     );
// }
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SupervisorSidebar from '../../components/SupervisorSidebar';
import API_BASE_URL from '../../config/apiConfig';

export default function ManageAppointments() {
  const token = JSON.parse(localStorage.getItem('user'))?.token;
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [rescheduleRequests, setRescheduleRequests] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [appointmentDateTime, setAppointmentDateTime] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [p, d, a, r] = await Promise.all([
        axios.get(`${API_BASE_URL}/Supervisor/Patients`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE_URL}/Supervisor/Doctors`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE_URL}/Supervisor/Appointments`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE_URL}/Supervisor/RescheduleRequests`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setPatients(p.data.filter(p => p.isVerified === true));
      setDoctors(d.data);
      setAppointments(a.data);
      setRescheduleRequests(r.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const handleAssign = async () => {
    if (!selectedPatient || !selectedDoctor || !appointmentDateTime) return;
    try {
      await axios.post(`${API_BASE_URL}/Supervisor/AssignPatient`, {
        patientId: parseInt(selectedPatient),
        doctorId: parseInt(selectedDoctor),
        dateTime: appointmentDateTime,
      }, { headers: { Authorization: `Bearer ${token}` } });

      setMessage('✅ Patient assigned successfully!');
      setSelectedPatient('');
      setSelectedDoctor('');
      setAppointmentDateTime('');
      fetchAllData();
    } catch (err) {
      console.error('Error assigning patient:', err);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.post(`${API_BASE_URL}/Supervisor/ApproveReschedule/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAllData();
    } catch (err) {
      console.error(err);
      alert('Failed to approve request.');
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.post(`${API_BASE_URL}/Supervisor/RejectReschedule/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAllData();
    } catch (err) {
      console.error(err);
      alert('Failed to reject request.');
    }
  };

  return (
    <>
      <SupervisorSidebar isOpen={true} />
      <div className="container mt-5">
        <div className="row">

          {/* Add Appointment Section */}
          <div className="col-md-5">
            <div className="card shadow p-4 mb-4">
              <h5 className="fw-bold mb-3">New Appointment</h5>
              {message && <div className="alert alert-success">{message}</div>}

              <div className="mb-3">
                <label className="form-label">Patient</label>
                <select className="form-select" value={selectedPatient} onChange={e => setSelectedPatient(e.target.value)}>
                  <option value="">-- Choose Patient --</option>
                  {patients.map(p => (
                    <option key={p.patientId} value={p.patientId}>{p.fullName}</option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Doctor</label>
                <select className="form-select" value={selectedDoctor} onChange={e => setSelectedDoctor(e.target.value)}>
                  <option value="">-- Choose Doctor --</option>
                  {doctors.map(d => (
                    <option key={d.doctorId} value={d.doctorId}>{d.fullName} - {d.specialization}</option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Date & Time</label>
                <input type="datetime-local" className="form-control" value={appointmentDateTime}
                  onChange={e => setAppointmentDateTime(e.target.value)} />
              </div>

              <button className="btn btn-primary w-100" onClick={handleAssign}>Add Appointment</button>
            </div>
          </div>

          {/* Appointments Table */}
          <div className="col-md-7">
            <div className="card shadow p-4 mb-4">
              <h5 className="fw-bold mb-3">All Appointments</h5>
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((a, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{a.patientName}</td>
                      <td>{a.doctorName}</td>
                      <td>{new Date(a.appointmentDate).toLocaleString()}</td>
                      <td><span className={`badge bg-${a.status === 'Rescheduled' ? 'warning text-dark' : a.status === 'Completed' ? 'success' : 'secondary'}`}>{a.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Reschedule Requests */}
          <div className="col-md-12">
            <div className="card shadow p-4">
              <h5 className="fw-bold mb-3">Pending Reschedule Requests</h5>
              {rescheduleRequests.length === 0 ? (
                <p className="text-muted">No pending requests.</p>
              ) : (
                <table className="table table-bordered">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Doctor</th>
                      <th>Appointment ID</th>
                      <th>New Date</th>
                      <th>Reason</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rescheduleRequests.map((r, i) => (
                      <tr key={r.id}>
                        <td>{i + 1}</td>
                        <td>{r.doctorName}</td>
                        <td>{r.appointmentId}</td>
                        <td>{new Date(r.requestedDateTime).toLocaleString()}</td>
                        <td>{r.reason}</td>
                        <td>
                          <button className="btn btn-sm btn-success me-2" onClick={() => handleApprove(r.id)}>Approve</button>
                          <button className="btn btn-sm btn-danger" onClick={() => handleReject(r.id)}>Reject</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
