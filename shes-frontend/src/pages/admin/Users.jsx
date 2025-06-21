import React, { useEffect, useState, useRef, useMemo } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import API_BASE_URL from '../../config/apiConfig';
import './admin-users.css';
import AdminNavbar from '../../components/AdminNavbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Modal } from 'bootstrap';
import { useNavigate } from 'react-router-dom'; // <--- تم إضافة هذا الاستيراد

const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [sortRole, setSortRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({
    fullName: '', email: '', phone: '', gender: '', age: '', role: '', password: '', specialization: '', profileImage: ''
  });
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
  const [viewedUser, setViewedUser] = useState(null); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [adminName, setAdminName] = useState('Admin');

  const navigate = useNavigate(); // <--- تم إضافة هذا السطر

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/Admin/GetAllUsers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const usersData = Array.isArray(res.data) 
        ? res.data.map(user => ({ 
            ...user, 
            roles: user.roles || [], 
            profileImage: user.profileImage || '' 
          }))
        : [];
      setUsers(usersData);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError('Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedName = localStorage.getItem('adminName');
    if (storedName) {
      setAdminName(storedName);
    }
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/Admin/DeleteUser/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((user) => user.id !== id));
      alert('User deleted successfully.');
    } catch (err) {
      console.error("Delete failed:", err);
      alert('Failed to delete user.');
    }
  };

  const handleEditSave = async () => {
    if (!selectedUser.fullName || !selectedUser.email || !selectedUser.role) {
      alert("Please fill in required fields");
      return;
    }

    const dto = {
      fullName: selectedUser.fullName,
      email: selectedUser.email,
      phoneNumber: selectedUser.phone,
      gender: selectedUser.gender,
      age: selectedUser.age,
      role: selectedUser.role,
      specialization: selectedUser.role === "Doctor" ? (selectedUser.specialization || "") : null,
      profileImage: selectedUser.profileImage || null
    };

    try {
      await axios.put(`${API_BASE_URL}/Admin/UpdateUser/${selectedUser.id}`, dto, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
      alert("User updated successfully.");
      const modalInstance = Modal.getInstance(editModalRef.current);
      if (modalInstance) modalInstance.hide();
    } catch (err) {
      console.error("Update failed:", err);
      if (err.response && err.response.data) {
        console.error("Backend Validation Errors:", err.response.data.errors);
        let errorMessage = "Update failed.";
        if (err.response.data.errors) {
            const validationErrors = Object.values(err.response.data.errors).flat();
            errorMessage += "\n" + validationErrors.join("\n");
        } else if (err.response.data.title) {
            errorMessage += ` ${err.response.data.title}`;
        } else {
            errorMessage += ` ${err.response.data.message || 'Please check console for more details.'}`;
        }
        alert(errorMessage);
      } else {
        alert("Update failed. Please check console for more details.");
      }
    }
  };

  const handleAddUser = async () => {
    const {
      fullName,
      email,
      phone,
      gender,
      age,
      role,
      password,
      specialization,
      profileImage
    } = newUser;
    if (!fullName || !email || !phone || role === '' || !password) {
      alert("Please fill all required fields.");
      return;
    }
    const dto = {
      userName: email,
      email,
      fullName,
      password,
      role,
      phoneNumber: phone,
      gender,
      dateOfBirth: "2000-01-01", 
      age,
      specialization: role === "Doctor" ? (specialization || "") : null,
      profileImage: profileImage || null
    };
    try {
      await axios.post(`${API_BASE_URL}/Admin/CreateUser`, dto, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
      alert("User added successfully.");
      setNewUser({
        fullName: '', email: '', phone: '', gender: '', age: '', role: '', password: '', specialization: '', profileImage: ''
      });
      const modalInstance = Modal.getInstance(document.getElementById('addUserModal'));
      if (modalInstance) modalInstance.hide();
    } catch (err) {
      console.error("Add failed:", err);
      if (err.response && err.response.data) {
        console.error("Backend Validation Errors:", err.response.data.errors);
        let errorMessage = "Add failed.";
        if (err.response.data.errors) {
            const validationErrors = Object.values(err.response.data.errors).flat();
            errorMessage += "\n" + validationErrors.join("\n");
        } else if (err.response.data.title) {
            errorMessage += ` ${err.response.data.title}`;
        } else {
            errorMessage += ` ${err.response.data.message || 'Please check console for more details.'}`;
        }
        alert(errorMessage);
      } else {
        alert("Add failed. Please check console for more details.");
      }
    }
  };

  const displayedUsers = useMemo(() => {
    let currentUsers = users;

    if (search) {
      currentUsers = currentUsers.filter(u =>
        u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sortRole) {
      currentUsers = currentUsers.filter(u =>
        u.roles?.[0]?.toLowerCase() === sortRole.toLowerCase()
      );
    }
    
    currentUsers.sort((a, b) => {
        const nameA = a.fullName || '';
        const nameB = b.fullName || '';
        return nameA.localeCompare(nameB);
    });

    return currentUsers;
  }, [users, search, sortRole]);

  const editModalRef = useRef();

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
        <main className="flex-grow-1 ma p-3 p-md-4 overflow-auto">
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
            <h2 className="admin-users-title text-primary mb-0">Manage Users</h2>
            <div className="d-flex flex-grow-1 justify-content-end gap-2 flex-wrap">
              {/* Search Input */}
              <input
                type="text"
                className="form-control flex-grow-1"
                placeholder="Search by name or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ maxWidth: '300px' }}
              />
              {/* Filter by Role Select */}
              <select
                className="form-select flex-grow-1"
                value={sortRole}
                onChange={(e) => setSortRole(e.target.value)}
                style={{ maxWidth: '200px' }}
              >
                <option value="">Filter by Role</option>
                <option value="Admin">Admin</option>
                <option value="Doctor">Doctor</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Patient">Patient</option>
              </select>
              <button className="btn btn-success" data-bs-toggle="modal" data-bs-target="#addUserModal">
                + Add User
              </button>
            </div>
          </div>
          {loading ? (
            <div className="text-center">Loading users...</div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover align-middle admin-users-table">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Gender</th>
                    <th>Age</th>
                    <th>Role</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {viewedUser && (
                    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                      <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title">User Details</h5>
                            <button className="btn-close" onClick={() => setViewedUser(null)}></button>
                          </div>
                          <div className="modal-body">
                            <ul className="list-group">
                              <li className="list-group-item"><strong>Full Name:</strong> {viewedUser.fullName}</li>
                              <li className="list-group-item"><strong>Email:</strong> {viewedUser.email}</li>
                              <li className="list-group-item"><strong>Phone:</strong> {viewedUser.phone}</li>
                              <li className="list-group-item"><strong>Gender:</strong> {viewedUser.gender}</li>
                              <li className="list-group-item"><strong>Age:</strong> {viewedUser.age}</li>
                              <li className="list-group-item"><strong>Role:</strong> {viewedUser.roles?.[0]}</li>
                              {viewedUser.roles?.[0] === 'Doctor' && (
                                <li className="list-group-item"><strong>Specialization:</strong> {viewedUser.specialization || 'N/A'}</li>
                              )}
                              {viewedUser.profileImage && (
                                <li className="list-group-item">
                                  <strong>Profile Image:</strong> <img src={viewedUser.profileImage} alt="Profile" style={{ maxWidth: '100px', maxHeight: '100px' }} />
                                </li>
                              )}
                            </ul>
                          </div>
                          <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setViewedUser(null)}>Close</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {displayedUsers.length > 0 ? (
                    displayedUsers.map((user, idx) => (
                      <tr key={user.id}>
                        <td>{idx + 1}</td>
                        <td>{user.fullName}</td>
                        <td>{user.email}</td>
                        <td>{user.phone}</td>
                        <td>{user.gender}</td>
                        <td>{user.age}</td>
                        <td><span className="badge bg-secondary">{user.roles?.[0] || 'N/A'}</span></td>
                        <td className="text-center">
                          <button
                            className="btn btn-sm btn-outline-warning me-2"
                            onClick={() => navigate(`/admin/user/${user.id}`)} // <--- تم تغيير هذا السطر
                          >
                            View
                          </button>
                          {/* <button
                            className="btn btn-sm btn-outline-warning me-2"
                            onClick={() => {
                              setSelectedUser({ 
                                ...user, 
                                role: user.roles?.[0], 
                                specialization: user.specialization || '',
                                profileImage: user.profileImage || '' 
                              });
                              setTimeout(() => {
                                const modal = new Modal(editModalRef.current);
                                modal.show();
                              }, 100);
                            }}
                          >
                            Edit
                          </button> */}
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(user.id)}>Delete</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center">No users found matching your criteria.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Modals */}

          {/* Edit Modal */}
          {selectedUser && (
            <div className="modal fade" tabIndex="-1" ref={editModalRef}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Edit User</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={() => setSelectedUser(null)}></button>
                  </div>
                  <div className="modal-body">
                    <div className="mb-2">
                        <label htmlFor="editFullName" className="form-label visually-hidden">Full Name</label>
                        <input id="editFullName" className="form-control" placeholder="Full Name" value={selectedUser.fullName || ''}
                            onChange={e => setSelectedUser({ ...selectedUser, fullName: e.target.value })} />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="editEmail" className="form-label visually-hidden">Email</label>
                        <input id="editEmail" className="form-control" placeholder="Email" value={selectedUser.email || ''}
                            onChange={e => setSelectedUser({ ...selectedUser, email: e.target.value })} />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="editPhone" className="form-label visually-hidden">Phone</label>
                        <input id="editPhone" className="form-control" placeholder="Phone" value={selectedUser.phone || ''}
                            onChange={e => setSelectedUser({ ...selectedUser, phone: e.target.value })} />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="editGender" className="form-label visually-hidden">Gender</label>
                        <input id="editGender" className="form-control" placeholder="Gender" value={selectedUser.gender || ''}
                            onChange={e => setSelectedUser({ ...selectedUser, gender: e.target.value })} />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="editAge" className="form-label visually-hidden">Age</label>
                        <input id="editAge" className="form-control" type="number" placeholder="Age" value={selectedUser.age ?? ''}
                            onChange={e => setSelectedUser({ ...selectedUser, age: +e.target.value })} />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="editRole" className="form-label visually-hidden">Role</label>
                        <select id="editRole" className="form-select" value={selectedUser.role || ''}
                            onChange={e => setSelectedUser({ ...selectedUser, role: e.target.value })}>
                            <option value="">Select Role</option>
                            <option value="Admin">Admin</option>
                            <option value="Doctor">Doctor</option>
                            <option value="Supervisor">Supervisor</option>
                            <option value="Patient">Patient</option>
                        </select>
                    </div>
                    {selectedUser.role === 'Doctor' && (
                        <div className="mb-2">
                            <label htmlFor="editSpecialization" className="form-label visually-hidden">Specialization</label>
                            <input id="editSpecialization" className="form-control" placeholder="Specialization"
                                value={selectedUser.specialization || ''}
                                onChange={e => setSelectedUser({ ...selectedUser, specialization: e.target.value })} />
                        </div>
                    )}
                    {/* Input for Profile Image (assuming it's a URL or base64 string) */}
                    <div className="mb-2">
                        <label htmlFor="editProfileImage" className="form-label visually-hidden">Profile Image URL</label>
                        <input id="editProfileImage" className="form-control" placeholder="Profile Image URL (optional)"
                            value={selectedUser.profileImage || ''}
                            onChange={e => setSelectedUser({ ...selectedUser, profileImage: e.target.value })} />
                        {selectedUser.profileImage && (
                            <img src={selectedUser.profileImage} alt="Current Profile" style={{ maxWidth: '100px', maxHeight: '100px', marginTop: '10px' }} />
                        )}
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setSelectedUser(null)}>Close</button>
                    <button className="btn btn-primary" onClick={handleEditSave}>Save changes</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Add User Modal */}
          <div className="modal fade" id="addUserModal" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add New User</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <div className="mb-2">
                    <input className="form-control" placeholder="Full Name"
                      value={newUser.fullName || ''}
                      onChange={e => setNewUser({ ...newUser, fullName: e.target.value })} />
                  </div>
                  <div className="mb-2">
                    <input className="form-control" placeholder="Email" type="email"
                      value={newUser.email || ''}
                      onChange={e => setNewUser({ ...newUser, email: e.target.value })} />
                  </div>
                  <div className="mb-2">
                    <input className="form-control" placeholder="Phone"
                      value={newUser.phone || ''}
                      onChange={e => setNewUser({ ...newUser, phone: e.target.value })} />
                  </div>
                  <div className="mb-2">
                    <input className="form-control" placeholder="Gender"
                      value={newUser.gender || ''}
                      onChange={e => setNewUser({ ...newUser, gender: e.target.value })} />
                  </div>
                  <div className="mb-2">
                    <input className="form-control" type="number" placeholder="Age"
                      value={newUser.age ?? ''}
                      onChange={e => setNewUser({ ...newUser, age: +e.target.value })} />
                  </div>
                  <div className="mb-2">
                    <select className="form-select"
                      value={newUser.role || ''}
                      onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
                      <option value="">Select Role</option>
                      <option value="Admin">Admin</option>
                      <option value="Doctor">Doctor</option>
                      <option value="Supervisor">Supervisor</option>
                      <option value="Patient">Patient</option>
                    </select>
                  </div>
                  {newUser.role === 'Doctor' && (
                    <div className="mb-2">
                      <input className="form-control" placeholder="Specialization"
                        value={newUser.specialization || ''}
                        onChange={e => setNewUser({ ...newUser, specialization: e.target.value })} />
                    </div>
                  )}
                  {/* Input for Profile Image when adding a new user */}
                  <div className="mb-2">
                    <input className="form-control" placeholder="Profile Image URL (optional)"
                      value={newUser.profileImage || ''}
                      onChange={e => setNewUser({ ...newUser, profileImage: e.target.value })} />
                  </div>
                  <div className="mb-2">
                    <input className="form-control" placeholder="Password" type="password"
                      value={newUser.password || ''}
                      onChange={e => setNewUser({ ...newUser, password: e.target.value })} />
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                  <button className="btn btn-success" onClick={handleAddUser}>Add User</button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Responsive Drawer Sidebar */}
      {isSidebarOpen && <div className="drawer-overlay" onClick={() => setIsSidebarOpen(false)}></div>}
      <div className={`drawer-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="drawer-header d-flex justify-content-end p-3">
          <button className="btn btn-close" onClick={() => setIsSidebarOpen(false)}></button>
        </div>
        <div className="d-flex flex-column align-items-center mb-4 px-3">
          <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mb-2"
               style={{ width: '50px', height: '50px', fontSize: '1.5rem' }}>
            {adminName.charAt(0).toUpperCase()}
          </div>
          <strong>{adminName}</strong>
          <small className="text-muted">Logged in as Admin</small>
        </div>
        <Sidebar />
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

export default Users;