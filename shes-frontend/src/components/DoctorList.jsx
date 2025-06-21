// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import API_BASE_URL from '../config/apiConfig';

// export default function DoctorList({ onSelectDoctor }) {
//   const [doctors, setDoctors] = useState([]);
//   const token = JSON.parse(localStorage.getItem('user'))?.token;



  
//   useEffect(() => {
//     const fetchDoctors = async () => {
//     const res = await axios.get(`${API_BASE_URL}/Patient/GetAllDoctors`, {
//   headers: { Authorization: `Bearer ${token}` }
// });
// setDoctors(res.data);
//     };
//     fetchDoctors();
//   }, []);

//   return (
    
    
//     <div className="doctor-list">
//       {doctors.map(doc => (
//        <div className="doctor-item"  key={doc.doctorID}  onClick={() => {
//   console.log("Selected doctor:", doc);  
//  onSelectDoctor(doc.userId);

// }}
// >
        
//   {doc.fullName}
// </div>

//       ))}
//     </div>
//   );
// }
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
    <div className="doctor-list">
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
  );
}