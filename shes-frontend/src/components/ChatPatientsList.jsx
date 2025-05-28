import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/apiConfig';

export default function ChatPatientsList({ onSelectPatient, selectedPatientId }) {
  const [patients, setPatients] = useState([]);
  const token = JSON.parse(localStorage.getItem('user'))?.token;

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/Doctor/GetMyChatPatients`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPatients(res.data);
      } catch (error) {
        console.error("Failed to fetch patients:", error);
      }
    };

    fetchPatients();
  }, []);

  return (
    <div className="doctor-list">
      {patients.map(patient => (
        <div
          key={patient.userID}
          className={`doctor-item ${selectedPatientId === patient.userID ? 'selected' : ''}`}
          onClick={() => onSelectPatient(patient.userID, patient.fullName)}
        >
          {patient.fullName}
        </div>
      ))}
    </div>
  );
}
