import React from 'react';
import { NavLink } from 'react-router-dom'; // Use NavLink for active styles

const Navbar = () => {
  // Style for active NavLink
  const activeLinkStyle = {
    color: '#1173d4', // primary color
    fontWeight: '500',
  };

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-gray-700 px-10 py-3 bg-white dark:bg-background-dark">
      <div className="flex items-center gap-4 text-[#0d141b] dark:text-white">
        <div className="size-6 text-primary">
          <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7l10 5 10-5-10-5zm0 7.5L4.5 6.25 12 3l7.5 3.25L12 9.5zm-1 2.5v5.5l-8-4v-5l8 4zm2 5.5v-5.5l8-4v5l-8 4z"></path>
          </svg>
        </div>
        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">University HRMS</h2>
      </div>
      <div className="flex flex-1 justify-end gap-8">
        <div className="flex items-center gap-9 text-sm font-medium leading-normal">
          <NavLink to="/dashboard" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Dashboard</NavLink>
          <NavLink to="/employees" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Staff Directory</NavLink>
          <NavLink to="/" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Logout</NavLink>
        </div>
        <div 
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" 
          style={{ backgroundImage: 'url("https://randomuser.me/api/portraits/men/75.jpg")' }}
        ></div>
      </div>
    </header>
  );
};

export default Navbar;