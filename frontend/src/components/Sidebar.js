import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logoImage from '../assets/logo.png'; 

const Sidebar = () => {
  const [isEmployeeOpen, setIsEmployeeOpen] = useState(true);
  const navigate = useNavigate();

  const activeStyle = {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    color: '#3B82F6',
    fontWeight: '500',
  };

  const navLinkClass = "flex items-center px-4 py-2 text-sm font-medium text-subtext-light dark:text-subtext-dark rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700";
  const subNavLinkClass = "block px-4 py-2 text-sm font-medium text-subtext-light dark:text-subtext-dark hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg";

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    console.log("Logged out and token cleared.");
    navigate('/');
  };

  return (
    <aside className="w-64 bg-card-light dark:bg-card-dark flex-col hidden lg:flex shadow-lg overflow-y-auto">
      <div className="p-6 flex items-center space-x-3 border-b border-border-light dark:border-border-dark">
        <img 
          src={logoImage} 
          alt="University HRMS Logo" 
          className="w-10 h-10"
        />
        <h1 className="text-xl font-bold text-text-light dark:text-text-dark">University HRMS</h1>
      </div>

      <nav className="flex-1 px-4 py-2 space-y-1">
        <NavLink to="/dashboard" className={navLinkClass} style={({ isActive }) => isActive ? activeStyle : undefined}>
          <span className="material-icons mr-3">dashboard</span> Admin Dashboard
        </NavLink>
        <NavLink to="/profile" className={navLinkClass} style={({ isActive }) => isActive ? activeStyle : undefined}>
          <span className="material-icons mr-3">admin_panel_settings</span> Admin Account
        </NavLink>
        <NavLink to="/requirement-raising" className={navLinkClass} style={({ isActive }) => isActive ? activeStyle : undefined}>
          <span className="material-icons mr-3">trending_up</span> Requirement Raising
        </NavLink>
        <NavLink to="/recruitment" className={navLinkClass} style={({ isActive }) => isActive ? activeStyle : undefined}>
          <span className="material-icons mr-3">group_add</span> Recruitment
        </NavLink>

        {/* --- ADDED "NOTES & APPROVALS" LINK HERE --- */}
        <NavLink to="/notes-approvals" className={navLinkClass} style={({ isActive }) => isActive ? activeStyle : undefined}>
          <span className="material-icons mr-3">approval</span> Notes & Approvals
        </NavLink>

        <div>
          <button 
            onClick={() => setIsEmployeeOpen(!isEmployeeOpen)} 
            className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium text-subtext-light dark:text-subtext-dark rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <div className="flex items-center">
              <span className="material-icons mr-3">people</span> Employee
            </div>
            <span className="material-icons transition-transform duration-200" style={{ transform: isEmployeeOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>expand_more</span>
          </button>
          {isEmployeeOpen && (
            <div className="pl-7 mt-1 space-y-1">
              <NavLink to="/employees" className={subNavLinkClass} style={({ isActive }) => isActive ? activeStyle : undefined}>
                Staff Directory
              </NavLink>
              <NavLink to="/add-employee" className={subNavLinkClass} style={({ isActive }) => isActive ? activeStyle : undefined}>
                Add New Staff
              </NavLink>
              <NavLink to="/payroll" className={subNavLinkClass} style={({ isActive }) => isActive ? activeStyle : undefined}>
                Payroll
              </NavLink>
              <NavLink to="/my-profile" className={subNavLinkClass} style={({ isActive }) => isActive ? activeStyle : undefined}>
                My Profile
              </NavLink>
              <NavLink to="/employee-assets" className={subNavLinkClass} style={({ isActive }) => isActive ? activeStyle : undefined}>
                Employee Assets
              </NavLink>
            </div>
          )}
        </div>

        <NavLink to="/attendance" className={navLinkClass} style={({ isActive }) => isActive ? activeStyle : undefined}>
          <span className="material-icons mr-3">event_available</span> Attendance
        </NavLink>
        
        <NavLink to="/leave-tracker" className={navLinkClass} style={({ isActive }) => isActive ? activeStyle : undefined}>
          <span className="material-icons mr-3">calendar_today</span> Leave Tracker
        </NavLink>
        <NavLink to="/time-tracker" className={navLinkClass} style={({ isActive }) => isActive ? activeStyle : undefined}>
          <span className="material-icons mr-3">schedule</span> Time Tracker
        </NavLink>
        <NavLink to="/appraisal" className={navLinkClass} style={({ isActive }) => isActive ? activeStyle : undefined}>
          <span className="material-icons mr-3">grade</span> Appraisal
        </NavLink>
        <NavLink to="/announcement" className={navLinkClass} style={({ isActive }) => isActive ? activeStyle : undefined}>
          <span className="material-icons mr-3">campaign</span> Announcement
        </NavLink>
        <NavLink to="/resignation" className={navLinkClass} style={({ isActive }) => isActive ? activeStyle : undefined}>
          <span className="material-icons mr-3">assignment_return</span> Resignation
        </NavLink>
      </nav>

      <div className="p-4 mt-auto border-t border-border-light dark:border-border-dark space-y-1">
        <NavLink to="/settings" className={navLinkClass} style={({ isActive }) => isActive ? activeStyle : undefined}>
          <span className="material-icons mr-3">settings</span> Settings
        </NavLink>
        <button 
          onClick={handleLogout}
          className={`${navLinkClass} w-full text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20`}
        >
          <span className="material-icons mr-3">logout</span> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;