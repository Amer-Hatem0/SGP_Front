import React, { useState } from 'react';
import DoctorList from '../components/DoctorList';
import ChatBox from '../components/ChatBox';
import PatientSidebar from '../components/PatientSidebar';
import axios from 'axios';
import API_BASE_URL from '../config/apiConfig';
import '../style/ChatPage.css'; // Ensure this CSS file exists and is correctly linked

export default function ChatPage() {
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [selectedDoctorName, setSelectedDoctorName] = useState('');

  const markAllAsReadFromDoctor = async (doctorId) => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const token = currentUser?.token;

    try {
      await axios.put(`${API_BASE_URL}/Chat/MarkAllFromSenderAsRead/${doctorId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error("Failed to mark all messages as read from this doctor", err);
    }
  };

  const handleDoctorSelect = (id, name) => {
    setSelectedDoctorId(id);
    setSelectedDoctorName(name);
    markAllAsReadFromDoctor(id);
  };

  return (
    <div className="chat-full-layout chatpatient">
      <PatientSidebar />
      <div className="chat-page-wrapper chattting">
        <div className="doctor-list-panel">
          <h3 className="sidebar-title"> The doctor 🩺</h3>
          <DoctorList onSelectDoctor={handleDoctorSelect} selectedDoctorId={selectedDoctorId} />
        </div>
        <div className="chat-main-panel chattting">
          {/* Fixed Header for Chat */}
          <div className="chat-box-fixed-header">
            Chatting with: {selectedDoctorName || 'Select a doctor'}
          </div>
          {/* Scrollable Chat Content */}
          <div className="chat-box-scrollable-content">
            {selectedDoctorId ? (
              <ChatBox receiverId={selectedDoctorId} receiverName={selectedDoctorName} />
            ) : (
              <div className="select-doctor-placeholder">
                <p>Choose a doctor to start the conversation</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}