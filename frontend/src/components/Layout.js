import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet /> {/* The page content (e.g., DashboardPage) will be rendered here */}
      </main>
    </div>
  );
};

export default Layout;