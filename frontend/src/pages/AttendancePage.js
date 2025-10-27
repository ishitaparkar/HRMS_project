import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AttendancePage = () => {
  const [allEmployees, setAllEmployees] = useState([]); // Will hold ALL employees from the API
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  // 1. Fetch ALL employees from the backend when the page loads
  useEffect(() => {
    const fetchAllEmployees = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/employees/');
        let employeesData = [];
        if (response.data && Array.isArray(response.data.results)) {
          employeesData = response.data.results;
        } else if (Array.isArray(response.data)) {
          employeesData = response.data;
        }
        setAllEmployees(employeesData);
      } catch (error) {
        console.error("Error fetching employees for attendance:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllEmployees();
  }, []); // Runs once on page load

  // 2. Simulate attendance status for each real employee
  // In a real app, this data would come from a dedicated '/api/attendance/' endpoint
  const attendanceData = allEmployees.map((employee, index) => {
    const statuses = ['Present', 'Absent', 'On Leave'];
    return {
      ...employee, // Include all original employee data
      status: statuses[index % statuses.length], // Assign a simulated status
    };
  });

  // 3. Filter the live, augmented data based on the active tab
  const filteredAttendance = attendanceData.filter(staff => {
    if (activeFilter === 'All') {
      return true;
    }
    return staff.status === activeFilter;
  });

  // Helper functions (remain the same)
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Present': return 'bg-green-100 text-green-800';
      case 'Absent': return 'bg-red-100 text-red-800';
      case 'On Leave': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFilterButtonClass = (filter) => {
    return activeFilter === filter
      ? 'bg-primary text-white'
      : 'bg-gray-200 text-gray-700 hover:bg-gray-300';
  };

  return (
    <div className="p-8">
      <div className="mb-6">
          <h1 className="text-3xl font-bold text-text-light dark:text-text-dark">Today's Attendance</h1>
          <p className="text-sm text-subtext-light">A summary of staff and faculty attendance for today.</p>
      </div>

      <div className="mb-6 flex space-x-2">
        <button onClick={() => setActiveFilter('All')} className={`px-4 py-2 rounded-lg text-sm font-medium ${getFilterButtonClass('All')}`}>All ({attendanceData.length})</button>
        <button onClick={() => setActiveFilter('Present')} className={`px-4 py-2 rounded-lg text-sm font-medium ${getFilterButtonClass('Present')}`}>Present</button>
        <button onClick={() => setActiveFilter('Absent')} className={`px-4 py-2 rounded-lg text-sm font-medium ${getFilterButtonClass('Absent')}`}>Absent</button>
        <button onClick={() => setActiveFilter('On Leave')} className={`px-4 py-2 rounded-lg text-sm font-medium ${getFilterButtonClass('On Leave')}`}>On Leave</button>
      </div>

      <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-md">
        {isLoading ? (
          <div className="text-center py-8 text-subtext-light">Loading employee data...</div>
        ) : (
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
                  <td className="px-6 py-4 font-medium text-text-light dark:text-text-dark">
                    {staff.firstName} {staff.lastName}
                  </td>
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
        )}
      </div>
    </div>
  );
};

export default AttendancePage;