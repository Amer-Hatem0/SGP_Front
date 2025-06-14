

import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import API_BASE_URL from '../../config/apiConfig';
import './admin-users.css';
import AdminNavbar from '../../components/AdminNavbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Modal } from 'bootstrap';
const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({
    fullName: '', email: '', phone: '', gender: '', age: '', role: '', password: ''
  });
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
  const [viewedUser, setViewedUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // حالة.drawer
  const [adminName, setAdminName] = useState('Admin');

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/Admin/GetAllUsers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch {
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
    } catch {
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
      role: selectedUser.role
    };
    try {
      await axios.put(`${API_BASE_URL}/Admin/UpdateUser/${selectedUser.id}`, dto, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
      alert("User updated successfully.");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Update failed.");
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
      password
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
      specialization: ""
    };
    try {
      await axios.post(`${API_BASE_URL}/Admin/CreateUser`, dto, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
      alert("User added.");
      setNewUser({
        fullName: '', email: '', phone: '', gender: '', age: '', role: '', password: ''
      });
    } catch (err) {
      console.error("Add failed:", err);
      alert("Add failed.");
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

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
        <main className="flex-grow-1 p-3 p-md-4 overflow-auto">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="admin-users-title text-primary">Manage Users</h2>
            <div className="d-flex gap-2">
              <input
                type="text"
                className="form-control"
                placeholder="Search by name or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
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
                            </ul>
                          </div>
                          <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setViewedUser(null)}>Close</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {filteredUsers.map((user, idx) => (
                    <tr key={user.id}>
                      <td>{idx + 1}</td>
                      <td>{user.fullName}</td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>{user.gender}</td>
                      <td>{user.age}</td>
                      <td><span className="badge bg-secondary">{user.roles?.[0]}</span></td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-outline-info me-2"
                          onClick={() => window.location.href = `/admin/user/${user.id}`}
                        >
                          View
                        </button>
                        <button
                          className="btn btn-sm btn-outline-warning me-2"
                          onClick={() => {
                            setSelectedUser({ ...user, role: user.roles?.[0] });
                            setTimeout(() => {
                          const modal = new Modal(editModalRef.current);

                              modal.show();
                            }, 100);
                          }}
                        >
                          Edit
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(user.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
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
                    <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                  </div>
                  <div className="modal-body">
                    <input className="form-control mb-2" value={selectedUser.fullName || ''}
                      onChange={e => setSelectedUser({ ...selectedUser, fullName: e.target.value })} />
                    <input className="form-control mb-2" value={selectedUser.email || ''}
                      onChange={e => setSelectedUser({ ...selectedUser, email: e.target.value })} />
                    <input className="form-control mb-2" value={selectedUser.phone || ''}
                      onChange={e => setSelectedUser({ ...selectedUser, phone: e.target.value })} />
                    <input className="form-control mb-2" value={selectedUser.gender || ''}
                      onChange={e => setSelectedUser({ ...selectedUser, gender: e.target.value })} />
                    <input className="form-control mb-2" type="number" value={selectedUser.age ?? ''}
                      onChange={e => setSelectedUser({ ...selectedUser, age: +e.target.value })} />
                    <select className="form-select mb-2" value={selectedUser.role || ''}
                      onChange={e => setSelectedUser({ ...selectedUser, role: e.target.value })}>
                      <option value="">Select Role</option>
                      <option value="Admin">Admin</option>
                      <option value="Doctor">Doctor</option>
                      <option value="Supervisor">Supervisor</option>
                    </select>
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button className="btn btn-primary" onClick={handleEditSave}>Save</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Add Modal */}
          <div className="modal fade" id="addUserModal" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header"><h5>Add New User</h5></div>
                <div className="modal-body">
                  <input className="form-control mb-2" placeholder="Full Name"
                    value={newUser.fullName || ''}
                    onChange={e => setNewUser({ ...newUser, fullName: e.target.value })} />
                  <input className="form-control mb-2" placeholder="Email" type="email"
                    value={newUser.email || ''}
                    onChange={e => setNewUser({ ...newUser, email: e.target.value })} />
                  <input className="form-control mb-2" placeholder="Phone"
                    value={newUser.phone || ''}
                    onChange={e => setNewUser({ ...newUser, phone: e.target.value })} />
                  <input className="form-control mb-2" placeholder="Gender"
                    value={newUser.gender || ''}
                    onChange={e => setNewUser({ ...newUser, gender: e.target.value })} />
                  <input className="form-control mb-2" type="number" placeholder="Age"
                    value={newUser.age ?? ''}
                    onChange={e => setNewUser({ ...newUser, age: +e.target.value })} />
                  <select className="form-select mb-2"
                    value={newUser.role || ''}
                    onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
                    <option value="">Select Role</option>
                    <option value="Admin">Admin</option>
                    <option value="Doctor">Doctor</option>
                    <option value="Supervisor">Supervisor</option>
                  </select>
                  <input className="form-control mb-2" placeholder="Password" type="password"
                    value={newUser.password || ''}
                    onChange={e => setNewUser({ ...newUser, password: e.target.value })} />
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                  <button className="btn btn-success" onClick={handleAddUser} data-bs-dismiss="modal">Add User</button>
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

export default Users;