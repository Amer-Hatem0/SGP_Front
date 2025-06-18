import React, { useState } from 'react';
import ChatPatientsList from '../../components/ChatPatientsList';
import ChatBox from '../../components/ChatBox';
import DoctorSidebar from '../../components/DoctorSidebar';
 import axios from 'axios';
import API_BASE_URL from '../../config/apiConfig';
import Navbar from '../../components/DrNavbar';
export default function DoctorChatPage() {
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [selectedPatientName, setSelectedPatientName] = useState('');

  const handleSelect = (id, name) => {
    setSelectedPatientId(id);
    setSelectedPatientName(name);
     markAllAsReadFromPatient(id);
  };
const markAllAsReadFromPatient = async (patientId) => {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const token = currentUser?.token;

  try {
    await axios.put(`${API_BASE_URL}/Chat/MarkAllFromSenderAsRead/${patientId}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (err) {
    console.error("Failed to mark all messages as read from this patient", err);
  }
};

  return (
    <div className="chat-sidbar"> 
      <Navbar />
    <div className=" chatdr">
      {/* <DoctorSidebar /> */}
   
      <div className="chat-page-wrapper">  
        <div className="doctor-list-panel mt-5 pt-5">
          
        
          <h3 className="sidebar-title">Connected Patients</h3>
          <ChatPatientsList
            onSelectPatient={handleSelect}
            selectedPatientId={selectedPatientId}
          />
        </div>
        <div className="chat-main-panel  ">
          {selectedPatientId ? (
            <ChatBox className="drchattting" receiverId={selectedPatientId} receiverName={selectedPatientName} />
          ) : (
            <div className="placeholde">
              <p>Select a patient to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div></div>
  );
}
