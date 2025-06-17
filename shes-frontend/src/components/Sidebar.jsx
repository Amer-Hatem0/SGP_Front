import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home, Users, Calendar, FileText, Bell, Settings, LogOut
} from 'lucide-react';

const navItems = [
  { to: "/admin/home", label: "Home", icon: Home },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/appointments", label: "Appointments", icon: Calendar },
  { to: "/admin/reports", label: "Reports", icon: FileText },
  { to: "/admin/leave-requests", label: "Leave Requests", icon: Bell },
  { to: "/admin/feedbacks", label: "Feedbacks", icon: Settings },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="admin-side-wrapper asw d-flex flex-column p-4 shadow vh-100 bg-white">
      <h2 className="admin-side-title mb-4 text-primary fw-bold fs-4">SHES Admin</h2>
      <ul className="admin-side-nav list-unstyled flex-grow-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <li key={to} className="admin-side-nav-item mb-2">
            <Link
              to={to}
              className={`admin-side-link d-flex align-items-center gap-2 px-3 py-2 rounded text-decoration-none 
                ${location.pathname === to
                  ? 'bg-primary text-white fw-semibold'
                  : 'text-dark hover-bg-light'}`
              }
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          </li>
        ))}
        <li className="admin-side-nav-item mt-4 pt-3 border-top">
          <Link to="/logout" className="admin-side-link d-flex align-items-center gap-2 text-danger text-decoration-none px-3 py-2">
    
            
          
               {/* <button className="admin-side-link d-flex align-items-center gap-2 text-danger text-decoration-none px-3 py-2 bg-white b-none"
         
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('adminName');
              window.location.href = '/login';
            }}
          >        <LogOut size={18} />
             <span>Logout</span>
          </button> */}
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
