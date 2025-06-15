import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PatientSidebar from '../../components/PatientSidebar';
import './PatientDashboard.css';
import PatientNavbar from '../../components/PatientNavbar';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

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

      const formData = new FormData();
      formData.append("FullName", form.fullName);
      formData.append("Email", form.email);
      formData.append("Phone", form.phone);
      formData.append("Gender", form.gender);
      formData.append("DateOfBirth", form.dateOfBirth);
      formData.append("ComplianceLevel", form.complianceLevel || "");
      formData.append("CurrentStatus", form.currentStatus);

      if (profileImage) {
        formData.append("ProfileImage", profileImage);
      }

      const res = await axios.put(`http://localhost:5014/api/Patient/Profile/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      // تحديث حالة الصورة مباشرة بعد الحفظ
      setProfile(prev => ({
        ...form,
        imageUrl: profileImage 
          ? URL.createObjectURL(profileImage) // استخدام الصورة المحملة مؤقتًا
          : prev.imageUrl // أو البقاء على الصورة القديمة إذا لم يتم تغييرها
      }));

      setEditing(false);
      setPreviewUrl(null);
      setProfileImage(null);

    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };
  return (
    <>
      <PatientNavbar />
      <div className="patient-container-full">
        <main className="patient-main">
          <h2 className="text-2xl font-bold mb-6">Patient Profile</h2>
          {profile ? (
            <div className="prfile-patient-profile-container">
              <div className="prfile-patient-left-card">
       <img
                  src={
                    previewUrl || // إذا كان هناك صورة معاينة
                    (profile.imageUrl && !profileImage) // أو إذا كانت هناك صورة ملف تعريف ولم يتم تغييرها
                      ? profile.imageUrl.startsWith('blob:') 
                        ? profile.imageUrl 
                        : `http://localhost:5014${profile.imageUrl}`
                      : 'https://bootdey.com/img/Content/avatar/avatar7.png' // صورة افتراضية
                  }
                  alt="avatar"
                  className="prfile-patient-avatar"
                />
                 {editing && (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setProfileImage(file);
                      setPreviewUrl(URL.createObjectURL(file));
                    }}
                    className="prfile-patient-input mt-2"
                  />
                )}
                <h3 className="prfile-patient-name">{profile.fullName}</h3>
                <p className="prfile-patient-role">Patient</p>
                <p className="prfile-patient-location">WELLNESS HOSPITAL</p>
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
                  <button onClick={() => setEditing(true)} className="prfile-patient-edit-btn" style={{ backgroundColor: '#0d6efd' }}>Edit</button>
                )}
              </div>
            </div>
          ) : (
            <p>Loading profile...</p>
          )}
        </main>
      </div>
    </>
  );
}
