// import React, { useState } from 'react';
// import DoctorList from '../components/DoctorList';
// import ChatBox from '../components/ChatBox';
// import '../style/ChatPage.css';
// import PatientSidebar from '../components/PatientSidebar';

// export default function ChatPage() {
//   const [selectedDoctorId, setSelectedDoctorId] = useState(null);

//   return (
//     <div className="chat-full-layout">
//       <PatientSidebar />
//       <div className="chat-page-wrapper">
//         <div className="doctor-list-panel">
//           <h3 className="sidebar-title"> Doctors 🩺</h3>
//           <DoctorList onSelectDoctor={setSelectedDoctorId} />
//         </div>
//         <div className="chat-main-panel">
//           {selectedDoctorId ? (
//             <ChatBox receiverId={selectedDoctorId} />
//           ) : (
//             <div className="placeholder">
//       <p>Choose a doctor to start the conversation</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState } from 'react';
import DoctorList from '../components/DoctorList';
import ChatBox from '../components/ChatBox';
import PatientSidebar from '../components/PatientSidebar';
import '../style/ChatPage.css';

export default function ChatPage() {
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [selectedDoctorName, setSelectedDoctorName] = useState('');

  const handleDoctorSelect = (id, name) => {
    setSelectedDoctorId(id);
    setSelectedDoctorName(name);
  };

  return (
    <div className="chat-full-layout">
      <PatientSidebar />
      <div className="chat-page-wrapper">
        <div className="doctor-list-panel">
          <h3 className="sidebar-title"> The doctor  🩺</h3>
          <DoctorList onSelectDoctor={handleDoctorSelect} selectedDoctorId={selectedDoctorId} />
        </div>
        <div className="chat-main-panel">
          {selectedDoctorId ? (
            <ChatBox receiverId={selectedDoctorId} receiverName={selectedDoctorName} />
          ) : (
            <div className="placeholder">
           <p>Choose a doctor to start the conversation</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
