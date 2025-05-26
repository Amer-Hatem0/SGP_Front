// pages/patient/Profile.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PatientSidebar from '../../components/PatientSidebar';
import './PatientDashboard.css';
 

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user?.token;
        const decoded = JSON.parse(atob(token.split('.')[1]));
        const id = decoded?.userId || decoded?.sub;

        const res = await axios.get(`http://localhost:5014/api/Patient/Profile/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setProfile(res.data);
        setForm(res.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user?.token;
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const id = decoded?.userId || decoded?.sub;

      await axios.put(`http://localhost:5014/api/Patient/Profile/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setProfile(form);
      setEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  return (
    <div className="patient-container-full">
      <PatientSidebar />
      <main className="patient-main">
        <h2 className="text-2xl font-bold mb-6">Patient Profile</h2>
        {profile ? (
          <div className="prfile-patient-profile-container">
            <div className="prfile-patient-left-card">
              <img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="avatar" className="prfile-patient-avatar" />
              <h3 className="prfile-patient-name">{profile.fullName}</h3>
              <p className="prfile-patient-role">Patient</p>
              <p className="prfile-patient-location">Virtua Hospital, NJ</p>
              <div className="prfile-patient-buttons">
                <button className="prfile-patient-btn-primary">Chat</button>
                <button className="prfile-patient-btn-outline">Message</button>
              </div>
            </div>

            <div className="prfile-patient-right-info">
              <div className="prfile-patient-section">
                <div className="prfile-patient-field">
                  <strong>Full Name:</strong>
                  {editing ? <input name="fullName" value={form.fullName} onChange={handleChange} className="prfile-patient-input" /> : ` ${profile.fullName}`}
                </div>
                <div className="prfile-patient-field">
                  <strong>Email:</strong>
                  {editing ? <input name="email" value={form.email} onChange={handleChange} className="prfile-patient-input" /> : ` ${profile.email}`}
                </div>
                <div className="prfile-patient-field">
                  <strong>Phone:</strong>
                  {editing ? <input name="phone" value={form.phone} onChange={handleChange} className="prfile-patient-input" /> : ` ${profile.phone}`}
                </div>
                <div className="prfile-patient-field">
                  <strong>Gender:</strong>
                  {editing ? <input name="gender" value={form.gender} onChange={handleChange} className="prfile-patient-input" /> : ` ${profile.gender}`}
                </div>
                <div className="prfile-patient-field">
                  <strong>Date of Birth:</strong>
                  {editing ? <input type="date" name="dateOfBirth" value={form.dateOfBirth?.split('T')[0]} onChange={handleChange} className="prfile-patient-input" /> : ` ${profile.dateOfBirth?.split('T')[0]}`}
                </div>
                <div className="prfile-patient-field">
                  <strong>Status:</strong>
                  {editing ? <input name="currentStatus" value={form.currentStatus} onChange={handleChange} className="prfile-patient-input" /> : ` ${profile.currentStatus}`}
                </div>
              </div>
              {editing ? (
                <button onClick={handleSave} className="prfile-patient-edit-btn bg-green-600">Save</button>
              ) : (
                <button onClick={() => setEditing(true)} className="prfile-patient-edit-btn">Edit</button>
              )}
            </div>
          </div>
        ) : (
          <p>Loading profile...</p>
        )}
      </main>
    </div>
  );
}
