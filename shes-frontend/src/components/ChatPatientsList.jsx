import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/apiConfig';

export default function ChatPatientsList({ onSelectPatient, selectedPatientId }) {
  const [patients, setPatients] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const token = JSON.parse(localStorage.getItem('user'))?.token;

  useEffect(() => {
    fetchPatients();
    fetchUnreadCounts();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/Doctor/GetMyChatPatients`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatients(res.data);
    } catch (error) {
      console.error("Failed to fetch patients:", error);
    }
  };

  const fetchUnreadCounts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/Chat/UnreadCountPerSender`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUnreadCounts(res.data);
    } catch (error) {
      console.error("Failed to fetch unread message counts:", error);
    }
  };

  return (
    <>
      {/* CSS animation داخل HTML */}
      <style>
        {`
          @keyframes pulseGreen {
            0% { transform: scale(0.95); opacity: 0.7; }
            70% { transform: scale(1.3); opacity: 0.3; }
            100% { transform: scale(1); opacity: 0.7; }
          }
        `}
      </style>

      <div className="doctor-list">
        {patients.map((patient) => {
          const unread = unreadCounts[patient.userID] || 0;
          const isSelected = selectedPatientId === patient.userID;
console.log('Patient:', patient.fullName, 'Unread:', unread);

          return (
            <div
              key={patient.userID}
              className={`doctor-item ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelectPatient(patient.userID, patient.fullName)}
              style={{
                backgroundColor: unread > 0 ? '#fff' : '#eee',
                padding: '10px',
                marginBottom: '6px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span>{patient.fullName}</span>

              {unread > 0 && (
                <span
                  style={{
                    width: '10px',
                    height: '10px',
                    backgroundColor: '#28a745',
                    borderRadius: '50%',
                    border: '2px solid white',
                    animation: 'pulseGreen 1.2s infinite',
                  }}
                ></span>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
