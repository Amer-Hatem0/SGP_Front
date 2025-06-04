import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Register from './pages/Register';

import PatientHome from './pages/patient/PatientHome';
import Profile from './pages/patient/Profile';
import Doctors from './pages/patient/Doctors';
import MyAppointments from './pages/patient/MyAppointments';
import UploadReport from './pages/patient/UploadReport';
import MedicalHistory from './pages/patient/MedicalHistory';


import DoctorHome from './pages/doctor/DoctorHome';
import TasksAndHistory from './pages/doctor/TasksAndHistory';
import PatientManagement from './pages/doctor/PatientManagement';
import PatientDetails from './pages/doctor/PatientDetails';
import LeaveAndSchedule from './pages/doctor/LeaveAndSchedule';
import RescheduleAppointments from './pages/doctor/RescheduleAppointments';
import DoctorChatPage from './pages/doctor/DoctorChatPage';
import Notifications from './pages/doctor/Notifications';


import SupervisorDashboard from './pages/supervisor/SupervisorDashboard';
import LeaveRequest from './pages/supervisor/LeaveRequests';
import AssignPatient from './pages/supervisor/AssignPatient';
import VerifyPatients from './pages/supervisor/VerifyPatients';
import SupervisorPerformance from './pages/supervisor/SupervisorPerformance';
import SupervisorProfile from './pages/supervisor/SupervisorProfile';



import AdminHome from './pages/admin/AdminHome';
import Users from './pages/admin/Users';
import AdminAppointments from './pages/admin/AdminAppointments';
import LeaveRequestsAdmin from './pages/admin/LeaveRequestsAdmin';
import AdminReports from './pages/admin/AdminReports';
import AdminFeedbacks from './pages/admin/AdminFeedbacks';
import UserDetails from './pages/admin/UserDetails';






import SupervisorHome from './pages/supervisor/SupervisorHome';
import { getUserFromLocalStorage } from './utils/auth';
import PatientSidebar from './components/PatientSidebar';
import ChatPage from './pages/ChatPage';
import VerifyEmail from './pages/VerifyEmail';


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/register" element={<Register />} />
      <Route path="/ChatPage" element={<ChatPage />} />
      <Route path="/verify-email" element={<VerifyEmail />} />



      <Route path="/patient/home" element={<PatientHome />} />
      <Route path="/patient/Profile" element={<Profile />} />
      <Route path="/patient/Doctors" element={<Doctors />} />
      <Route path="/patient/appointments" element={<MyAppointments />} />
      <Route path="/patient/upload-report" element={<UploadReport />} />
      <Route path="/patient/MedicalHistory" element={<MedicalHistory />} />


      <Route path="/doctor/home" element={<DoctorHome />} />
      <Route path="/doctor/tasks-history" element={< TasksAndHistory />} />
      <Route path="/doctor/patient-management" element={< PatientManagement />} />
      <Route path="/doctor/patient-details" element={< PatientDetails />} />
      <Route path="/doctor/leave-schedule" element={< LeaveAndSchedule />} />
      <Route path="/doctor/RescheduleAppointments" element={< RescheduleAppointments />} />
      <Route path="/doctor/Notifications" element={<Notifications />} />
      <Route path="/doctor/chat" element={<DoctorChatPage />} />



      <Route path="/admin/home" element={<AdminHome />} />
      <Route path="/admin/users" element={<Users />} />
      <Route path="/admin/appointments" element={<AdminAppointments />} />
      <Route path="/admin/leave-requests" element={<LeaveRequestsAdmin />} />
      <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/admin/feedbacks" element={<AdminFeedbacks />} />
              <Route path="/admin/user/:userId" element={<UserDetails />} />


      <Route path="/supervisor/home" element={<SupervisorDashboard />} />
      <Route path="/supervisor/leave-requests" element={<LeaveRequest />} />
      <Route path="/supervisor/assign-patient" element={<AssignPatient />} />
      <Route path="/supervisor/verify-patients" element={<VerifyPatients />} />
      <Route path="/supervisor/performance" element={<SupervisorPerformance />} />
      <Route path="/supervisor/profile" element={<SupervisorProfile />} />

    </Routes>
  );
}