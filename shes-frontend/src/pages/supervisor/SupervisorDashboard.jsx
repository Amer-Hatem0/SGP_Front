 
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import API_BASE_URL from '../../config/apiConfig';
// import Navbar from '../../components/SupervisorSidebar';
// import './SupervisorDashboard.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { useNavigate } from 'react-router-dom';
 

// export default function SupervisorDashboard() {
//   const [overview, setOverview] = useState(null);
//   const [assignments, setAssignments] = useState([]);
//   const [unverifiedPatients, setUnverifiedPatients] = useState([]);
//   const [lowInventoryItems, setLowInventoryItems] = useState([]);
//   const [doctorsOnShift, setDoctorsOnShift] = useState([]);
//   const token = JSON.parse(localStorage.getItem('user'))?.token;
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       const overviewRes = await axios.get(`${API_BASE_URL}/Supervisor/DailyOverview`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const assignmentRes = await axios.get(`${API_BASE_URL}/Supervisor/Assignments`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const patientsRes = await axios.get(`${API_BASE_URL}/Supervisor/Patients`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const inventoryRes = await axios.get(`${API_BASE_URL}/Supervisor/Inventory`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setOverview(overviewRes.data);
//       setAssignments(assignmentRes.data.slice(-5).reverse());
//       setUnverifiedPatients(patientsRes.data.filter(p => p.status !== 'Verified').slice(0, 3));
//       setLowInventoryItems(inventoryRes.data.filter(i => i.quantity < 5));
//       setDoctorsOnShift(overviewRes.data.doctorsOnShift || []);
//     } catch (err) {
//       console.error('Error fetching dashboard data:', err);
//     }
//   };

//   const navigateTo = (type) => {
//     if (type === 'leave') navigate('/supervisor/leave-requests');
//     else if (type === 'verify') navigate('/supervisor/verify-patients');
//     else if (type === 'inventory') navigate('/supervisor/inventory');
//     else if (type === 'profile') navigate('/supervisor/profile');
//     else if (type === 'logout') {
//       localStorage.removeItem('user');
//       navigate('/login');
//     }
//   };

//   return (
//     <>
//       {/* Navbar */}
//       <Navbar />

//       {/* Main Content */}
//       <main className="supervisor-main pt-5 px-4">
//         <div className="container-fluid">
//           <div className="row g-4">

//             {/* Doctors On Shift Today */}
//             <div className="col-12 col-md-6">
//               <div className="card shadow-sm border-start border-primary border-5 h-100 transition-hover">
//                 <div className="card-body">
//                   <h5 className="card-title text-primary mb-3">Doctors On Shift Today</h5>
//                   <ul className="list-group list-group-flush">
//                     {doctorsOnShift.length ? (
//                       doctorsOnShift.map((d, i) => (
//                         <li key={i} className="list-group-item">{d}</li>
//                       ))
//                     ) : (
//                       <li className="list-group-item text-muted">No shift data</li>
//                     )}
//                   </ul>
//                 </div>
//               </div>
//             </div>

//             {/* Quick Actions */}
//             <div className="col-12 col-md-6">
//               <div className="card shadow-sm border-start border-success border-5 h-100">
//                 <div className="card-body">
//                   <h5 className="card-title text-success mb-3">Quick Actions</h5>
//                   <div className="d-flex flex-wrap gap-2">
//                     <button
//                       className="btn btn-outline-info d-flex align-items-center gap-2"
//                       onClick={() => navigateTo('verify')}
//                     >
//                       <span>✅ Verify Patient</span>
//                     </button>
//                     <button
//                       className="btn btn-outline-warning d-flex align-items-center gap-2"
//                       onClick={() => navigateTo('leave')}
//                     >
//                       <span>📝 Process Leave</span>
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Pending Leave Requests */}
//             <div className="col-12 col-md-6">
//               <div className="card shadow-sm border-start border-danger border-5 h-100">
//                 <div className="card-body">
//                   <h5 className="card-title text-danger mb-3">Pending Leave Requests</h5>
//                   <p className="fs-4 fw-bold text-danger">{overview?.pendingLeaveRequests ?? 0}</p>
//                 </div>
//               </div>
//             </div>

        

//             {/* Recent Assignments */}
//             <div className="col-12 col-md-6">
//               <div className="card shadow-sm border-start border-info border-5 h-100">
//                 <div className="card-body">
//                   <h5 className="card-title text-info mb-3">Recent Patient Assignments</h5>
//                   <ul className="list-group list-group-flush">
//                     {assignments.length ? (
//                       assignments.map((a, i) => (
//                         <li key={i} className="list-group-item">
//                           {a.patientName} → {a.doctorName} ({a.assignedAt?.slice(0, 10)})
//                         </li>
//                       ))
//                     ) : (
//                       <li className="list-group-item text-muted">No recent assignments</li>
//                     )}
//                   </ul>
//                 </div>
//               </div>
//             </div>

//             {/* Unverified Patients */}
//             <div className="col-12 col-md-6">
//               <div className="card shadow-sm border-start border-secondary border-5 h-100">
//                 <div className="card-body">
//                   <h5 className="card-title text-secondary mb-3">Unverified Patients</h5>
//                   <ul className="list-group list-group-flush">
//                     {unverifiedPatients.length ? (
//                       unverifiedPatients.map((p, i) => (
//                         <li key={i} className="list-group-item">
//                           {p.fullName} - {p.email}
//                         </li>
//                       ))
//                     ) : (
//                       <li className="list-group-item text-muted">No unverified patients</li>
//                     )}
//                   </ul>
//                 </div>
//               </div>
//             </div>

//           </div>
//         </div>
//       </main>
//     </>
//   );
// }

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import API_BASE_URL from '../../config/apiConfig';
// import SupervisorSidebar from '../../components/SupervisorSidebar';
// import './SupervisorDashboard.css'; // ملف CSS الخاص بك
// import { useNavigate } from 'react-router-dom';
// import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// export default function SupervisorDashboard() {
//   const [overview, setOverview] = useState(null);
//   const [recentAssignments, setRecentAssignments] = useState([]);
//   const [pendingRequests, setPendingRequests] = useState([]);
//   const token = localStorage.getItem('token');
//   const navigate = useNavigate();

//   const fetchDashboardData = async () => {
//     try {
//       const overviewRes = await axios.get(`${API_BASE_URL}/Supervisor/DashboardOverview`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const assignmentsRes = await axios.get(`${API_BASE_URL}/Supervisor/RecentAssignments`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const leaveRequestsRes = await axios.get(`${API_BASE_URL}/Supervisor/PendingLeaveRequests`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setOverview(overviewRes.data);
//       setRecentAssignments(assignmentsRes.data.slice(0, 5));
//       setPendingRequests(leaveRequestsRes.data.slice(0, 4));
//     } catch (err) {
//       console.error("Error fetching dashboard data:", err);
//     }
//   };

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   return (
//     <>    <SupervisorSidebar />
//     <div className="d-flex min-vh-100 bg-light">
  

//       <main className="flex-grow-1 p-4 overflow-auto">
//         <h2 className="mb-4 text-primary fw-bold">Supervisor Dashboard</h2>

//         {/* Cards Row */}
//         <div className="row g-4 mb-4">
//           <div className="col-md-3">
//             <div className="card border-start border-primary border-5 shadow-sm h-100 transition-hover">
//               <div className="card-body">
//                 <h6 className="card-title text-uppercase text-muted small">Patients Today</h6>
//                 <p className="card-text fs-4 fw-bold text-primary">{overview?.patientsToday ?? 0}</p>
//               </div>
//             </div>
//           </div>
//           <div className="col-md-3">
//             <div className="card border-start border-success border-5 shadow-sm h-100 transition-hover">
//               <div className="card-body">
//                 <h6 className="card-title text-uppercase text-muted small">Doctors On Shift</h6>
//                 <p className="card-text fs-4 fw-bold text-success">{overview?.doctorsOnShift ?? 0}</p>
//               </div>
//             </div>
//           </div>
//           <div className="col-md-3">
//             <div className="card border-start border-warning border-5 shadow-sm h-100 transition-hover">
//               <div className="card-body">
//                 <h6 className="card-title text-uppercase text-muted small">Pending Leaves</h6>
//                 <p className="card-text fs-4 fw-bold text-warning">{overview?.pendingLeaves ?? 0}</p>
//               </div>
//             </div>
//           </div>
//           <div className="col-md-3">
//             <div className="card border-start border-danger border-5 shadow-sm h-100 transition-hover">
//               <div className="card-body">
//                 <h6 className="card-title text-uppercase text-muted small">Low Stock Items</h6>
//                 <p className="card-text fs-4 fw-bold text-danger">{overview?.lowStockItems ?? 0}</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Quick Actions */}
//         <div className="row g-4 mb-4">
//           <div className="col-md-12">
//             <div className="card shadow-sm">
//               <div className="card-body">
//                 <h6 className="card-title text-center mb-3">Quick Actions</h6>
//                 <div className="d-flex flex-wrap justify-content-center gap-3">
//                   <button className="btn btn-outline-primary btn-lg" onClick={() => navigate('/supervisor/patients')}>
//                     ✅ Verify Patient
//                   </button>
//                   <button className="btn btn-outline-info btn-lg" onClick={() => navigate('/supervisor/leave-requests')}>
//                     📝 Process Leave Request
//                   </button>
//                   <button className="btn btn-outline-success btn-lg" onClick={() => navigate('/supervisor/users')}>
//                     👥 Add New User
//                   </button>
//                   <button className="btn btn-outline-warning btn-lg" onClick={() => navigate('/supervisor/inventory')}>
//                     📦 Check Inventory
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Recent Assignments + Pending Requests */}
//         <div className="row g-4">
//           <div className="col-md-6">
//             <div className="card shadow-sm border-0 h-100">
//               <div className="card-body">
//                 <h6 className="card-title text-center mb-3">Recent Patient Assignments</h6>
//                 <ul className="list-group list-group-flush">
//                   {recentAssignments.length ? (
//                     recentAssignments.map((a, i) => (
//                       <li key={i} className="list-group-item d-flex justify-content-between align-items-center">
//                         <span>{a.patientName}</span>
//                         <small className="text-muted">{new Date(a.date).toLocaleDateString()}</small>
//                       </li>
//                     ))
//                   ) : (
//                     <li className="list-group-item text-muted text-center">No recent assignments</li>
//                   )}
//                 </ul>
//               </div>
//             </div>
//           </div>
//           <div className="col-md-6">
//             <div className="card shadow-sm border-0 h-100">
//               <div className="card-body">
//                 <h6 className="card-title text-center mb-3">Pending Leave Requests</h6>
//                 <ul className="list-group list-group-flush">
//                   {pendingRequests.length ? (
//                     pendingRequests.map((r, i) => (
//                       <li key={i} className="list-group-item d-flex justify-content-between align-items-center">
//                         <span>{r.doctorName}</span>
//                         <span className="badge bg-warning text-dark rounded-pill">{r.days} days</span>
//                       </li>
//                     ))
//                   ) : (
//                     <li className="list-group-item text-muted text-center">No pending requests</li>
//                   )}
//                 </ul>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Chart Section */}
//         <div className="row mt-4">
//           <div className="col-md-12">
//             <div className="card shadow-sm border-0">
//               <div className="card-body">
//                 <h6 className="card-title text-center mb-3">Weekly Activity Overview</h6>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <BarChart data={[
//                     { name: 'Mon', patients: 8, leaves: 2 },
//                     { name: 'Tue', patients: 10, leaves: 1 },
//                     { name: 'Wed', patients: 6, leaves: 3 },
//                     { name: 'Thu', patients: 12, leaves: 0 },
//                     { name: 'Fri', patients: 7, leaves: 2 },
//                   ]}>
//                     <XAxis dataKey="name" />
//                     <YAxis />
//                     <Tooltip />
//                     <Legend />
//                     <Bar dataKey="patients" fill="#0d6efd" name="New Patients" />
//                     <Bar dataKey="leaves" fill="#ffc107" name="Leave Requests" />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div></>
//   );
// }

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config/apiConfig';
import SupervisorSidebar from '../../components/SupervisorSidebar';
import { FaClipboardCheck, FaUserCheck, FaChartBar } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import './SupervisorDashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'chart.js/auto';

export default function SupervisorDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [overview, setOverview] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [unverifiedPatients, setUnverifiedPatients] = useState([]);
  const [topDoctor, setTopDoctor] = useState(null);
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem('user'))?.token;

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const overviewRes = await axios.get(`${API_BASE_URL}/Supervisor/DailyOverview`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const assignmentRes = await axios.get(`${API_BASE_URL}/Supervisor/Assignments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const patientsRes = await axios.get(`${API_BASE_URL}/Supervisor/Patient`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const topDoctorRes = await axios.get(`${API_BASE_URL}/Supervisor/TopDoctor`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      

      setOverview(overviewRes.data);
      setAssignments(assignmentRes.data.slice(-7)); 
   setUnverifiedPatients(patientsRes.data.filter(p => p.isVerified === false).slice(0, 3));


      setTopDoctor(topDoctorRes.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    }
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const navigateTo = (type) => {
    if (type === 'leave') navigate('/supervisor/leave-requests');
    else if (type === 'verify') navigate('/supervisor/verify-patients');
    else if (type === 'profile') navigate('/supervisor/profile');
    else if (type === 'logout') {
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  // بيانات الرسم البياني لتعيينات المرضى
  const chartData = {
    labels: assignments.map((a) => a.assignedAt?.slice(0, 10)),
    datasets: [
      {
        label: 'Patient Assignments',
        data: assignments.map((_, i) => i + 1), // أي عدد وهمي قابل للتعديل حسب الـ API
        fill: false,
        borderColor: '#0d6efd',
        tension: 0.3,
      },
    ],
  };

  return (
    <>
      <SupervisorSidebar isOpen={sidebarOpen} />
      <div className="d-flex">
        <div className="flex-grow-1 container-fluid mt-4 px-4">
          <div className="row g-4">

            {/* 🟦 Quick Actions */}
            <div className="col-md-12">
              <div className="card shadow-sm p-3 d-flex gap-3 flex-wrap flex-md-nowrap align-items-center justify-content-between">
                <h5 className="mb-0">Quick Actions</h5>
                <div className="d-flex gap-3">
                  <button className="btn btn-outline-info" onClick={() => navigateTo('verify')}>
                    <FaUserCheck /> Verify Patients
                  </button>
                  <button className="btn btn-outline-warning" onClick={() => navigateTo('leave')}>
                    <FaClipboardCheck /> Process Leave
                  </button>
                </div>
              </div>
            </div>

            {/* 🔵 Unverified Patients */}
            <div className="col-md-6">
              <div className="card shadow-sm p-3">
                <h5>Unverified Patients</h5>
                <ul className="mb-0">
                  {unverifiedPatients.length ? (
                    unverifiedPatients.map((p, i) => (
                      <li key={i}>
                        {p.fullName} - {p.email}
                      </li>
                    ))
                  ) : (
                    <li className="text-muted">No unverified patients</li>
                  )}
                </ul>
              </div>
            </div>

            {/* 🔵 Pending Leaves */}
            <div className="col-md-6">
              <div className="card shadow-sm p-3">
                <h5>Pending Leave Requests</h5>
                <p className="fs-4">{overview?.pendingLeaveRequests ?? 0}</p>
              </div>
            </div>

            {/* 🔵 Top Doctor */}
            <div className="col-md-6">
              <div className="card shadow-sm p-3">
                <h5>Top Performing Doctor</h5>
                <p className="fs-5">{topDoctor?.name || 'No data available'}</p>
                <p className="text-muted">Score: {topDoctor?.score || '-'}</p>
              </div>
            </div>

            {/* 🔵 Chart: Assignments */}
            <div className="col-md-6">
              <div className="card shadow-sm p-3">
                <h5>
                  <FaChartBar /> Patient Assignment Trend
                </h5>
                <Line data={chartData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
