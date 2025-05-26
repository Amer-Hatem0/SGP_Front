import React from 'react';
import { Link } from 'react-router-dom';

export default function PatientSidebar() {
  return (
    <aside className="patient-sidebar">
      <div className="patient-logo">➕ Hospital</div>
      <nav className="patient-nav">
        <Link to="/patient/home" className="patient-nav-title">Dashboard</Link>
        <Link to="/patient/profile" className="patient-nav-link">Profile</Link>
        <Link to="/patient/doctors" className="patient-nav-link">Doctors</Link>
        {/* <Link to="/patient/book" className="patient-nav-link">Book Appointment</Link> */}
        <Link to="/patient/appointments" className="patient-nav-link">My Appointments</Link>
        <Link to="/patient/upload-report" className="patient-nav-link">My Reports</Link>
        <Link to="/patient/history" className="patient-nav-link">Medical History</Link>
      </nav>
    </aside>
  );
}