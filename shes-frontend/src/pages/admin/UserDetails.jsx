 
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import API_BASE_URL from '../../config/apiConfig';
 
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';

const UserDetails = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const editModalRef = useRef();
  const token = localStorage.getItem('token');

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
        role: editUser.roles[0]
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUser();
      setEditUser(null);
    } catch (err) {
      console.error(err);
      alert('Failed to update user.');
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="d-flex min-vh-100" style={{ backgroundColor: '#f1f3f6' }}>
      <Sidebar />
      <main className="flex-grow-1 p-5">
        <h2 className="mb-4 text-primary">{user?.roles?.includes('Patient') ? 'Patient Profile' : 'User Details'}</h2>

        {error && <div className="alert alert-danger">{error}</div>}
        {!user ? (
          <div>Loading...</div>
        ) : (
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card shadow-sm text-center">
                <div className="card-body">
                    <img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="avatar" className="prfile-patient-avatar" />
                  <h5 className="card-title fw-bold">{user.fullName}</h5>
                  <p className="text-muted">{user.roles?.[0]}</p>
                  {/* <p className="text-muted">Virtua Hospital, NJ</p>
                  <div className="d-flex justify-content-center gap-2">
                    <button className="btn btn-primary btn-sm">Chat</button>
                    <button className="btn btn-outline-primary btn-sm">Message</button>
                  </div> */}
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
                    <li className="list-group-item"><strong>Date of Birth:</strong> {user.dateOfBirth?.slice(0, 10)}</li>
                    <li className="list-group-item"><strong>Status:</strong> {user.status || 'active'}</li>
                  </ul>
                  <div className="text-end mt-3">
                    <button
                      className="btn btn-success"
                      onClick={() => {
                        setEditUser(user);
                        setTimeout(() => new bootstrap.Modal(editModalRef.current).show(), 100);
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
                  <button className="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div className="modal-body">
                  <input className="form-control mb-2" value={editUser.fullName} onChange={e => setEditUser({ ...editUser, fullName: e.target.value })} />
                  <input className="form-control mb-2" value={editUser.email} onChange={e => setEditUser({ ...editUser, email: e.target.value })} />
                  <input className="form-control mb-2" value={editUser.phone} onChange={e => setEditUser({ ...editUser, phone: e.target.value })} />
                  <input className="form-control mb-2" value={editUser.gender} onChange={e => setEditUser({ ...editUser, gender: e.target.value })} />
                  <input className="form-control mb-2" type="number" value={editUser.age} onChange={e => setEditUser({ ...editUser, age: +e.target.value })} />
                  <select className="form-select mb-2" value={editUser.roles[0]} onChange={e => setEditUser({ ...editUser, roles: [e.target.value] })}>
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
            <h4 className="mt-5 mb-3">{user.roles?.includes('Doctor') ? 'Work History' : 'Medical History'}</h4>
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
  );
};

export default UserDetails;
