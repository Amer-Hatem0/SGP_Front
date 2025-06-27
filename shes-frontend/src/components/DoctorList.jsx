import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/apiConfig';

export default function DoctorList({ onSelectDoctor, selectedDoctorId }) {
  const [doctors, setDoctors] = useState([]);
  const token = JSON.parse(localStorage.getItem('user'))?.token;

  useEffect(() => {
    const fetchDoctors = async () => {
      const res = await axios.get(`${API_BASE_URL}/Patient/GetAllDoctors`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDoctors(res.data);
    };
    fetchDoctors();
  }, []);

  return (
    <>
      <div className="doctor-list1 scrollable-doctor-list1">
        {doctors.map(doc => (
          <div
            key={doc.doctorID}
            className={`doctor-item ${selectedDoctorId === doc.userId ? 'selected' : ''}`}
            onClick={() => onSelectDoctor(doc.userId, doc.fullName)}
          >
            {doc.fullName}
          </div>
        ))}
      </div>
 
      <style>{`
        .scrollable-doctor-list1 {
          max-height: 600px;
          overflow-y: auto;
          padding-right: 10px;
          border: 1px solid #ccc;
          border-radius: 8px;
          background-color: #f9f9f9;
          margin-top: 10px;
        }

        .doctor-item {
          padding: 12px 15px;
          border-bottom: 1px solid #eee;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .doctor-item:hover {
          background-color: #f1f1f1;
        }

        .doctor-item.selected {
          background-color: #007bff;
          color: white;
          font-weight: 600;
        }
      `}</style>
    </>
  );
}
