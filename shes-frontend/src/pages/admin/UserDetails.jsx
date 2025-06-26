 

import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import 'bootstrap/dist/css/bootstrap.min.css';
import API_BASE_URL from '../../config/apiConfig';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './admin-users.css'; 
import AdminNavbar from '../../components/AdminNavbar';
import { Modal } from 'bootstrap';

const UserDetails = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const editModalRef = useRef();
  const token = localStorage.getItem('token');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // حالة.drawer
  const [adminName, setAdminName] = useState('Admin');

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/Admin/GetUser/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      if (res.data.roles?.includes('Doctor')) {
        const historyRes = await axios.get(`${API_BASE_URL}/Admin/GetDoctorHistory/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHistory(historyRes.data);
      } else if (res.data.roles?.includes('Patient')) {
        const historyRes = await axios.get(`${API_BASE_URL}/Admin/GetPatientHistory/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHistory(historyRes.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load user details.');
    }
  };

const handleSave = async () => {
  try {
    await axios.put(`${API_BASE_URL}/Admin/UpdateUser/${editUser.id}`, {
      fullName: editUser.fullName,
      email: editUser.email,
      phoneNumber: editUser.phone,
      gender: editUser.gender,
      age: editUser.age,
      role: editUser.roles[0],
      profileImage: editUser.profileImage ,
      specialization: editUser.specialization || null
    }, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });
    
    // إعادة جلب بيانات المستخدم المحدثة
    fetchUser();
    
    // إخفاء المودال بعد الحفظ الناجح
    const modalInstance = Modal.getInstance(editModalRef.current);
    if (modalInstance) {
      modalInstance.hide();
    }

    setEditUser(null); // إعادة تعيين editUser لإزالة المودال من الـ DOM بعد إخفائه
    alert('User updated successfully.'); // رسالة تأكيد (اختياري)
  } catch (err) {
    console.error(err);
    alert('Failed to update user.');
  }
};

  useEffect(() => {
    const storedName = localStorage.getItem('adminName');
    if (storedName) {
      setAdminName(storedName);
    }
    fetchUser();
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      {/* Navbar */}
      <AdminNavbar 
        onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
        isSidebarOpen={isSidebarOpen} 
      />

      {/* Main Content with Responsive Sidebar */}
      <div className="d-flex flex-grow-1 overflow-hidden position-relative pt-5">
        {/* Sidebar for large screens */}
        <div className="d-none d-lg-block fixed-sidebar-container">
          <Sidebar />
        </div>

        {/* Main Page Content */}
        <main className=" www p-3 p-md-4 overflow-auto">
          <h2 className="mb-4 text-primary fw-bold">
            {user?.roles?.includes('Patient') ? 'Patient Profile' : 'User Details'}
          </h2>
          {error && <div className="alert alert-danger">{error}</div>}
          {!user ? (
            <div className="text-center">Loading...</div>
          ) : (
            <div className="row g-4">
              <div className="col-md-4">
                <div className="card carduser shadow-sm text-center">
                  <div className="card-body">
                    <img
                      src={user.profileImage || "https://bootdey.com/img/Content/avatar/avatar7.png"}  
                      alt="avatar"
                      className="prfile-patient-avatar rounded-circle mb-3"
                      style={{ width: '100px', height: '100px' }}
                    />
                    <h5 className="card-title fw-bold">{user.fullName}</h5>
                    <p className="text-muted">{user.roles?.[0]}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-8">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item"><strong>Full Name:</strong> {user.fullName}</li>
                      <li className="list-group-item"><strong>Email:</strong> {user.email}</li>
                      <li className="list-group-item"><strong>Phone:</strong> {user.phone}</li>
                      <li className="list-group-item"><strong>Gender:</strong> {user.gender}</li>
                      <li className="list-group-item">
                        <strong>Date of Birth:</strong> {user.dateOfBirth?.slice(0, 10) || 'N/A'}
                      </li>
                       <li className="list-group-item"><strong>Age:</strong> {user.age || ' '}</li>
                      <li className="list-group-item"><strong>Status:</strong> {user.status || 'active'}</li>
          {user.roles?.includes('Doctor') && (
  <li className="list-group-item">
    <strong>Specialization:</strong> {user.specialization || 'N/A'}
  </li>
)}

                    </ul>
                    <div className="text-end mt-3">
                      <button
                        className="btn btn-success"
                        onClick={() => {
                          setEditUser(user);
                          setTimeout(() => {
                            const modal = new Modal(editModalRef.current);
                            modal.show();
                          }, 100);
                        }}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Edit Modal */}
          {editUser && (
            <div className="modal fade" tabIndex="-1" ref={editModalRef}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Edit User</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                  </div>
                  <div className="modal-body">
                    <input
                      className="form-control mb-2"
                      value={editUser.fullName}
                      onChange={(e) =>
                        setEditUser({ ...editUser, fullName: e.target.value })
                      }
                    />
                    <input
                      className="form-control mb-2"
                      value={editUser.email}
                      onChange={(e) =>
                        setEditUser({ ...editUser, email: e.target.value })
                      }
                    />
                    <input
                      className="form-control mb-2"
                      value={editUser.phone}
                      onChange={(e) =>
                        setEditUser({ ...editUser, phone: e.target.value })
                      }
                    />
                    <input
                      className="form-control mb-2"
                      value={editUser.gender}
                      onChange={(e) =>
                        setEditUser({ ...editUser, gender: e.target.value })
                      }
                    />
                    <input
                      className="form-control mb-2"
                      type="number"
                      value={editUser.age}
                      onChange={(e) =>
                        setEditUser({ ...editUser, age: +e.target.value })
                      }
                    />
                    {editUser.roles[0] === 'Doctor' && (
  <input
    type="text"
    className="form-control mb-2"
    placeholder="Specialization"
    value={editUser.specialization || ''}
    onChange={(e) =>
      setEditUser({ ...editUser, specialization: e.target.value })
    }
  />
)}

                    {/* رفع الصورة */}
                    <input
                      type="file"
                      className="form-control mb-2"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = () => {
                            setEditUser({ ...editUser, profileImage: reader.result }); // تخزين base64
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <small className="text-muted d-block mb-2">Leave empty to keep current image</small>

                    <select
                      className="form-select mb-2"
                      value={editUser.roles[0]}
                      onChange={(e) =>
                        setEditUser({ ...editUser, roles: [e.target.value] })
                      }
                    >
                      <option value="Admin">Admin</option>
                      <option value="Doctor">Doctor</option>
                      <option value="Supervisor">Supervisor</option>
                      <option value="Patient">Patient</option>
                    </select>
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button className="btn btn-success" onClick={handleSave}>Save</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {user?.roles?.includes('Doctor') || user?.roles?.includes('Patient') ? (
            <>
              <h4 className="mt-5 mb-3">
                {user.roles.includes('Doctor') ? 'Work History' : 'Medical History'}
              </h4>
              {history.length === 0 ? (
                <p className="text-muted">No history available.</p>
              ) : (
                <div className="row g-3">
                  {history.map((item, index) => (
                    <div key={index} className="col-md-6">
                      <div className="card shadow-sm">
                        <div className="card-body">
                          {user.roles.includes('Doctor') ? (
                            <>
                              <p><strong>Date:</strong> {item.date?.slice(0, 10)}</p>
                              <p><strong>Specialty:</strong> {item.specialty}</p>
                              <p><strong>Notes:</strong> {item.notes || 'N/A'}</p>
                            </>
                          ) : (
                            <>
                              <p><strong>Date:</strong> {item.visitDate?.slice(0, 10)}</p>
                              <p><strong>Diagnosis:</strong> {item.diagnosis}</p>
                              <p><strong>Treatment:</strong> {item.treatment}</p>
                              <p><strong>Doctor:</strong> {item.doctorName || 'N/A'}</p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : null}
        </main>
      </div>

      {/* Responsive Drawer Sidebar */}
      {isSidebarOpen && <div className="drawer-overlay" onClick={() => setIsSidebarOpen(false)}></div>}
      <div className={`drawer-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="drawer-header d-flex justify-content-end p-3">
          <button className="btn btn-close" onClick={() => setIsSidebarOpen(false)}></button>
        </div>
        {/* Mobile User Info */}
        <div className="d-flex flex-column align-items-center mb-4 px-3">
          <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mb-2"
               style={{ width: '50px', height: '50px', fontSize: '1.5rem' }}>
            {adminName.charAt(0).toUpperCase()}
          </div>
          <strong>{adminName}</strong>
          <small className="text-muted">Logged in as Admin</small>
        </div>
        <Sidebar />
        {/* Mobile Logout Button inside drawer */}
        <div className="mt-auto px-3 pb-4">
          <button
            className="btn btn-danger w-100"
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('adminName');
              window.location.href = '/login';
            }}
          >
            <i className="bi bi-box-arrow-right me-1"></i>Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;