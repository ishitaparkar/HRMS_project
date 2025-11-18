import React from 'react';
import { usePageTitle } from '../hooks/usePageTitle';

const MyAttendancePage = () => {
  usePageTitle('My Attendance');

  return (
    <div className="page-container">
      <h1>My Attendance</h1>
      <p>My Attendance page - To be implemented</p>
    </div>
  );
};

export default MyAttendancePage;
