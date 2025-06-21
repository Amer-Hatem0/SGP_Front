import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import RoleProtectedRoute from './pages/RoleProtectedRoute';

// Guest Pages
import HealthCareTemplate from './pages/Guest/HealthCareTemplate';
import About from './pages/Guest/About';
import ServicesPage from './pages/Guest/ServicesPage';
import DoctorsPage from './pages/Guest/DoctorsPage';
import ContactPage from './pages/Guest/ContactPage';

// Auth Pages
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Register from './pages/Register';
import ChatPage from './pages/ChatPage';
import VerifyEmail from './pages/VerifyEmail';
import NotFound from './pages/NotFound';

// Patient Pages
import PatientHome from './pages/patient/PatientHome';
import Profile from './pages/patient/Profile';
import Doctors from './pages/patient/Doctors';
import MyAppointments from './pages/patient/MyAppointments';
import UploadReport from './pages/patient/UploadReport';
import MedicalHistory from './pages/patient/MedicalHistory';

// Doctor Pages
import DoctorHome from './pages/doctor/DoctorHome';
import TasksAndHistory from './pages/doctor/TasksAndHistory';
import PatientManagement from './pages/doctor/PatientManagement';
import PatientDetails from './pages/doctor/PatientDetails';
import LeaveAndSchedule from './pages/doctor/LeaveAndSchedule';
import RescheduleAppointments from './pages/doctor/RescheduleAppointments';
import DoctorChatPage from './pages/doctor/DoctorChatPage';
import Notifications from './pages/doctor/Notifications';

// Supervisor Pages
import SupervisorDashboard from './pages/supervisor/SupervisorDashboard';
import LeaveRequest from './pages/supervisor/LeaveRequests';
import AssignPatient from './pages/supervisor/AssignPatient';
import VerifyPatients from './pages/supervisor/VerifyPatients';
import SupervisorPerformance from './pages/supervisor/SupervisorPerformance';
import SupervisorProfile from './pages/supervisor/SupervisorProfile';

// Admin Pages
import AdminHome from './pages/admin/AdminHome';
import Users from './pages/admin/Users';
import AdminAppointments from './pages/admin/AdminAppointments';
import LeaveRequestsAdmin from './pages/admin/LeaveRequestsAdmin';
import AdminReports from './pages/admin/AdminReports';
import AdminFeedbacks from './pages/admin/AdminFeedbacks';
import UserDetails from './pages/admin/UserDetails';

export default function App() {
  return (
    <Routes>
      {/* Guest & Auth Routes */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/chatpage" element={<ChatPage />} />
      <Route path="/home" element={<HealthCareTemplate />} />
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/doctors" element={<DoctorsPage />} />
      <Route path="/contact" element={<ContactPage />} />

      {/* Patient Routes */}
      <Route path="/patient/home" element={<RoleProtectedRoute allowedRole="Patient"><PatientHome /></RoleProtectedRoute>} />
      <Route path="/patient/profile" element={<RoleProtectedRoute allowedRole="Patient"><Profile /></RoleProtectedRoute>} />
      <Route path="/patient/doctors" element={<RoleProtectedRoute allowedRole="Patient"><Doctors /></RoleProtectedRoute>} />
      <Route path="/patient/appointments" element={<RoleProtectedRoute allowedRole="Patient"><MyAppointments /></RoleProtectedRoute>} />
      <Route path="/patient/upload-report" element={<RoleProtectedRoute allowedRole="Patient"><UploadReport /></RoleProtectedRoute>} />
      <Route path="/patient/medicalhistory" element={<RoleProtectedRoute allowedRole="Patient"><MedicalHistory /></RoleProtectedRoute>} />

      {/* Doctor Routes */}
      <Route path="/doctor/home" element={<RoleProtectedRoute allowedRole="Doctor"><DoctorHome /></RoleProtectedRoute>} />
      <Route path="/doctor/tasks-history" element={<RoleProtectedRoute allowedRole="Doctor"><TasksAndHistory /></RoleProtectedRoute>} />
      <Route path="/doctor/patient-management" element={<RoleProtectedRoute allowedRole="Doctor"><PatientManagement /></RoleProtectedRoute>} />
      <Route path="/doctor/patient-details" element={<RoleProtectedRoute allowedRole="Doctor"><PatientDetails /></RoleProtectedRoute>} />
      <Route path="/doctor/leave-schedule" element={<RoleProtectedRoute allowedRole="Doctor"><LeaveAndSchedule /></RoleProtectedRoute>} />
      <Route path="/doctor/reschedule-appointments" element={<RoleProtectedRoute allowedRole="Doctor"><RescheduleAppointments /></RoleProtectedRoute>} />
      <Route path="/doctor/notifications" element={<RoleProtectedRoute allowedRole="Doctor"><Notifications /></RoleProtectedRoute>} />
      <Route path="/doctor/chat" element={<RoleProtectedRoute allowedRole="Doctor"><DoctorChatPage /></RoleProtectedRoute>} />

      {/* Supervisor Routes */}
      <Route path="/supervisor/home" element={<RoleProtectedRoute allowedRole="Supervisor"><SupervisorDashboard /></RoleProtectedRoute>} />
      <Route path="/supervisor/leave-requests" element={<RoleProtectedRoute allowedRole="Supervisor"><LeaveRequest /></RoleProtectedRoute>} />
      <Route path="/supervisor/assign-patient" element={<RoleProtectedRoute allowedRole="Supervisor"><AssignPatient /></RoleProtectedRoute>} />
      <Route path="/supervisor/verify-patients" element={<RoleProtectedRoute allowedRole="Supervisor"><VerifyPatients /></RoleProtectedRoute>} />
      <Route path="/supervisor/performance" element={<RoleProtectedRoute allowedRole="Supervisor"><SupervisorPerformance /></RoleProtectedRoute>} />
      <Route path="/supervisor/profile" element={<RoleProtectedRoute allowedRole="Supervisor"><SupervisorProfile /></RoleProtectedRoute>} />

      {/* Admin Routes */}
      <Route path="/admin/home" element={<RoleProtectedRoute allowedRole="Admin"><AdminHome /></RoleProtectedRoute>} />
      <Route path="/admin/users" element={<RoleProtectedRoute allowedRole="Admin"><Users /></RoleProtectedRoute>} />
      <Route path="/admin/appointments" element={<RoleProtectedRoute allowedRole="Admin"><AdminAppointments /></RoleProtectedRoute>} />
      <Route path="/admin/leave-requests" element={<RoleProtectedRoute allowedRole="Admin"><LeaveRequestsAdmin /></RoleProtectedRoute>} />
      <Route path="/admin/reports" element={<RoleProtectedRoute allowedRole="Admin"><AdminReports /></RoleProtectedRoute>} />
      <Route path="/admin/feedbacks" element={<RoleProtectedRoute allowedRole="Admin"><AdminFeedbacks /></RoleProtectedRoute>} />
      <Route path="/admin/user/:userId" element={<RoleProtectedRoute allowedRole="Admin"><UserDetails /></RoleProtectedRoute>} />

      {/* 404 Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
