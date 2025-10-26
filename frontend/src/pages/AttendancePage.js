import React, { useState } from 'react';

// Mock data for today's attendance
const allStaffAttendance = [
  { id: 'TCS101', name: 'Dr. Anjali Rao', department: 'Computer Science', status: 'Present' },
  { id: 'PHY102', name: 'Dr. Vikram Kumar', department: 'Physics', status: 'Present' },
  { id: 'ADM003', name: 'Sunita Sharma', department: 'Admissions Office', status: 'Absent' },
  { id: 'LIB004', name: 'Rajesh Singh', department: 'Library', status: 'On Leave' },
  { id: 'MGT001', name: 'Dr. Priya Mehta', department: 'Administration', status: 'Present' },
  { id: 'ENG205', name: 'Amit Desai', department: 'Engineering', status: 'Present' },
  { id: 'COM301', name: 'Neha Gupta', department: 'Commerce', status: 'Absent' },
];

const AttendancePage = () => {
  // 1. State to hold the currently selected filter. 'All' is the default.
  const [activeFilter, setActiveFilter] = useState('All');

  // 2. This is a derived state. We don't need a separate state for the filtered list.
  // Instead, we calculate it on every render based on the full list and the active filter.
  const filteredAttendance = allStaffAttendance.filter(staff => {
    if (activeFilter === 'All') {
      return true; // Show all staff
    }
    return staff.status === activeFilter; // Show only staff whose status matches the filter
  });
  
  // Helper function to get styling for status badges
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Present': return 'bg-green-100 text-green-800';
      case 'Absent': return 'bg-red-100 text-red-800';
      case 'On Leave': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper function for styling the active filter button
  const getFilterButtonClass = (filter) => {
    return activeFilter === filter
      ? 'bg-primary text-white'
      : 'bg-gray-200 text-gray-700 hover:bg-gray-300';
  };

  return (
    <>
      <header className="bg-card-light dark:bg-card-dark p-4 flex justify-between items-center border-b border-border-light dark:border-border-dark sticky top-0">
        <div>
          <h1 className="text-2xl font-semibold text-text-light dark:text-text-dark">Today's Attendance</h1>
          <p className="text-sm text-subtext-light">October 22, 2025</p>
        </div>
      </header>

      <div className="p-8">
        {/* Filter Buttons */}
        <div className="mb-6 flex space-x-2">
          <button onClick={() => setActiveFilter('All')} className={`px-4 py-2 rounded-lg text-sm font-medium ${getFilterButtonClass('All')}`}>All ({allStaffAttendance.length})</button>
          <button onClick={() => setActiveFilter('Present')} className={`px-4 py-2 rounded-lg text-sm font-medium ${getFilterButtonClass('Present')}`}>Present</button>
          <button onClick={() => setActiveFilter('Absent')} className={`px-4 py-2 rounded-lg text-sm font-medium ${getFilterButtonClass('Absent')}`}>Absent</button>
          <button onClick={() => setActiveFilter('On Leave')} className={`px-4 py-2 rounded-lg text-sm font-medium ${getFilterButtonClass('On Leave')}`}>On Leave</button>
        </div>

        {/* Attendance Table */}
        <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-md">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-subtext-light dark:text-subtext-dark uppercase bg-background-light dark:bg-background-dark">
              <tr>
                <th className="px-6 py-3">Staff Name</th>
                <th className="px-6 py-3">Department</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendance.map((staff) => (
                <tr key={staff.id} className="border-b border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-6 py-4 font-medium text-text-light dark:text-text-dark">{staff.name}</td>
                  <td className="px-6 py-4">{staff.department}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(staff.status)}`}>
                      {staff.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AttendancePage;