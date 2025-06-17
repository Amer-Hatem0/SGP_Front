// SupervisorProfile.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config/apiConfig';
import SupervisorSidebar from '../../components/SupervisorSidebar';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function SupervisorProfile() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const token = JSON.parse(localStorage.getItem('user'))?.token;

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/Supervisor/Profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
      setFormData(res.data);
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await axios.put(`${API_BASE_URL}/Supervisor/UpdateProfile`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditMode(false);
      fetchProfile();
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  return (
        <>   <SupervisorSidebar isOpen={sidebarOpen} />
         
    <div className={`d-flex ${sidebarOpen ? '' : 'sidebar-closed'}`} style={{ minHeight: '100vh' }}>
     
      <div className="flex-grow-1 bg-light">
     

        <div className="container-fluid py-5">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-md-10">
              <div className="card shadow p-4">
                <h5 className="mb-4">Your Information</h5>
                {profile ? (
                  <>
                    {['fullName', 'email', 'phoneNumber', 'gender', 'dateOfBirth'].map((field, i) => (
                      <div className="row mb-3" key={i}>
                        <div className="col-md-4 fw-bold text-capitalize">{field.replace(/([A-Z])/g, ' $1')}:</div>
                        <div className="col-md-8">
                          {editMode ? (
                            <input
                              type={field === 'dateOfBirth' ? 'date' : 'text'}
                              name={field}
                              value={formData[field] || ''}
                              className="form-control"
                              onChange={handleChange}
                            />
                          ) : (
                            <div className="form-control-plaintext">
                              {field === 'dateOfBirth'
                                ? profile[field]?.slice(0, 10)
                                : profile[field]}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    <div className="text-end">
                      {editMode ? (
                        <>
                          <button className="btn btn-success me-2" onClick={handleSave}>Save</button>
                          <button className="btn btn-secondary" onClick={() => setEditMode(false)}>Cancel</button>
                        </>
                      ) : (
                        <button className="btn btn-primary" onClick={() => setEditMode(true)}>Edit</button>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-center text-muted">Loading profile...</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>    </>
  );
}
