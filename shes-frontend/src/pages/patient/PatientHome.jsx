import React from 'react';
import './PatientDashboard.css';
import PatientSidebar from '../../components/PatientSidebar';
import { FaUserMd, FaUserNurse, FaWheelchair, FaPrescriptionBottleAlt } from 'react-icons/fa';

export default function PatientHome() {
  return (
   
    <div className="patient-container-full">
      <PatientSidebar />

      <main className="patient-main">
        <header className="patient-header">
          <input type="text" placeholder="Search here..." className="patient-search" />
          <div className="patient-icons">
            <span>🔔</span>
            <span>💬</span>
            <img src="https://i.pravatar.cc/40" alt="profile" className="patient-avatar" />
          </div>
        </header>

        <section className="patient-stats">
          <div className="patient-card">
            <FaUserMd size={28} className="text-[#25a6e9]" />
            <div>
              <div className="patient-stat-number">520</div>
              <div className="patient-stat-label">Doctors</div>
            </div>
          </div>

          <div className="patient-card">
            <FaUserNurse size={28} className="text-[#ef5350]" />
            <div>
              <div className="patient-stat-number">6969</div>
              <div className="patient-stat-label">Nurses</div>
            </div>
          </div>

          <div className="patient-card">
            <FaWheelchair size={28} className="text-[#ffa726]" />
            <div>
              <div className="patient-stat-number">7509</div>
              <div className="patient-stat-label">Patients</div>
            </div>
          </div>

          <div className="patient-card">
            <FaPrescriptionBottleAlt size={28} className="text-[#26c6da]" />
            <div>
              <div className="patient-stat-number">2110</div>
              <div className="patient-stat-label">Pharmacists</div>
            </div>
          </div>
        </section>
      </main>
    </div>
 
  );
}

