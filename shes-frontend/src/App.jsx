import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Register from './pages/Register';
import PatientHome from './pages/patient/PatientHome';
import Profile from './pages/patient/Profile';
import Doctors from './pages/patient/Doctors';
import MyAppointments from './pages/patient/MyAppointments';
import DoctorHome from './pages/doctor/DoctorHome';
import AdminHome from './pages/admin/AdminHome';
import SupervisorHome from './pages/supervisor/SupervisorHome';
import { getUserFromLocalStorage } from './utils/auth';
import PatientSidebar from './components/PatientSidebar';

 
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/register" element={<Register />} />
      <Route path="/patient/home" element={<PatientHome />} />
       <Route path="/patient/Profile" element={<Profile />} />
       <Route path="/patient/Doctors" element={<Doctors />} />
         <Route path="/patient/appointments" element={<MyAppointments />} />
      <Route path="/doctor/home" element={<DoctorHome />} />
      <Route path="/admin/home" element={<AdminHome />} />
      <Route path="/supervisor/home" element={<SupervisorHome />} />
    </Routes>
  );
}