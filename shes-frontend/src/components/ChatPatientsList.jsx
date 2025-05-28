// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import API_BASE_URL from '../config/apiConfig';

// export default function ChatPatientsList({ onSelectPatient, selectedPatientId }) {
//   const [patients, setPatients] = useState([]);
//   const token = JSON.parse(localStorage.getItem('user'))?.token;

//   useEffect(() => {
//     const fetchPatients = async () => {
//       try {
//         const res = await axios.get(`${API_BASE_URL}/Doctor/GetMyChatPatients`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         setPatients(res.data);
//       } catch (error) {
//         console.error("Failed to fetch patients:", error);
//       }
//     };

//     fetchPatients();
//   }, []);

//   return (
//     <div className="doctor-list">
//       {patients.map(patient => (
//         <div
//           key={patient.userID}
//           className={`doctor-item ${selectedPatientId === patient.userID ? 'selected' : ''}`}
//           onClick={() => onSelectPatient(patient.userID, patient.fullName)}
//         >
//           {patient.fullName}
//         </div>
//       ))}
//     </div>
//   );
// }
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
    <div className="doctor-list">
      {patients.map(patient => {
        const unread = unreadCounts[patient.userID] || 0;
        const isSelected = selectedPatientId === patient.userID;

        return (
          <div
            key={patient.userID}
            className={`doctor-item ${isSelected ? 'selected' : ''}`}
            onClick={() => onSelectPatient(patient.userID, patient.fullName)}
            style={{ backgroundColor: unread > 0 ? '#fff' : '#eee' }}
          >
            {patient.fullName}
            {unread > 0 && <span className="unread-count">({unread})</span>}
          </div>
        );
      })}
    </div>
  );
}
