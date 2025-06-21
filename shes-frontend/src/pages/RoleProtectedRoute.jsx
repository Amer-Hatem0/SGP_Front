import React from 'react';
import { Navigate } from 'react-router-dom';

export default function RoleProtectedRoute({ children, allowedRole }) {
  const user = JSON.parse(localStorage.getItem('user'));

 
  if (!user) return <Navigate to="/login" />;
  
  const role = user.role;  

  return role === allowedRole ? children : <Navigate to="/NotFound" />;
}
