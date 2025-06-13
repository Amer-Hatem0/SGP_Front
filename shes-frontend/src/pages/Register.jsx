
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const [form, setForm] = useState({
    userName: '',
    email: '',
    fullName: '',
    phoneNumber: '',
    gender: '',
    dateOfBirth: '',
    age: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleRegister = async (e) => {
  e.preventDefault();
  try {
    await axios.post('http://localhost:5014/api/Account/Register', form);
    alert('Registered successfully. Check your email for OTP code.');
    navigate('/verify-email', { state: { email: form.email } });
  } catch (err) {
  if (err.response) {
    alert('Registration failed: ' + err.response.data.message);
  } else {
    alert('Registration failed: ' + err.message);
  }
}

};


  return (
    <div className="flex justify-center items-center min-h-screen bg-green-50">
      <form onSubmit={handleRegister} className="bg-white shadow-lg rounded-xl p-10 w-full max-w-lg">
        <h2 className="text-3xl font-extrabold text-center text-green-800 mb-6">Create Account</h2>
        <div className="grid grid-cols-2 gap-4">
          <input name="userName" type="text" required placeholder="Username" className="p-2 border border-green-300 rounded" onChange={handleChange} />
          <input name="fullName" type="text" required placeholder="Full Name" className="p-2 border border-green-300 rounded" onChange={handleChange} />
          <input name="email" type="email" required placeholder="Email" className="p-2 border border-green-300 rounded" onChange={handleChange} />
          <input name="phoneNumber" type="text" required placeholder="Phone" className="p-2 border border-green-300 rounded" onChange={handleChange} />
          <input name="gender" type="text" required placeholder="Gender" className="p-2 border border-green-300 rounded" onChange={handleChange} />
          <input name="dateOfBirth" type="date" required className="p-2 border border-green-300 rounded" onChange={handleChange} />
          <input name="age" type="number" required placeholder="Age" className="p-2 border border-green-300 rounded" onChange={handleChange} />
          <input name="password" type="password" required placeholder="Password" className="p-2 border border-green-300 rounded" onChange={handleChange} />
        </div>
        <button type="submit" className="mt-6 w-full bg-green-700 text-white py-3 rounded hover:bg-green-800 transition">Sign up</button>
        <div className="text-center mt-4 text-sm">
          <Link to="/login" className="text-green-700 hover:underline">Already have an account? Login</Link>
        </div>
      </form>
    </div>
  );
}
