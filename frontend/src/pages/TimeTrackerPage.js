import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const TimeTrackerPage = () => {
  const location = useLocation();
  const [allEmployees, setAllEmployees] = useState([]);
  const [employeesToDisplay, setEmployeesToDisplay] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // This useEffect hook handles fetching and filtering the data.
  useEffect(() => {
    const fetchAndFilterEmployees = async () => {
      setIsLoading(true);
      try {
        // 1. Always fetch the full list of employees from your live backend.
        const response = await axios.get('http://127.0.0.1:8000/api/employees/');
        let employeesData = [];
        if (response.data && Array.isArray(response.data.results)) {
          employeesData = response.data.results;
        } else if (Array.isArray(response.data)) {
          employeesData = response.data;
        }
        setAllEmployees(employeesData);

        // 2. Check if selected IDs were passed in the navigation state.
        const selectedIds = location.state?.selectedEmployeeIds;

        if (selectedIds && selectedIds.length > 0) {
          // If IDs were passed, filter the data for display.
          const filtered = employeesData.filter(employee => selectedIds.includes(employee.id));
          setEmployeesToDisplay(filtered);
        } else {
          // If no IDs were passed (direct navigation), display all employees.
          setEmployeesToDisplay(employeesData);
        }
      } catch (error) {
        console.error("Error fetching data for time tracker:", error);
        setEmployeesToDisplay([]); // Prevent crash on error.
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndFilterEmployees();
  }, [location.state]); // Re-run when navigation state changes.

  const handleDiscrepancy = (employeeId, action) => {
    console.log(`Action: ${action} for Employee ID: ${employeeId}`);
    alert(`Discrepancy for employee ${employeeId} has been marked as '${action}'. (Simulation)`);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Discrepancy': return 'bg-yellow-100 text-yellow-800';
      case 'On Leave': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-text-light dark:text-text-dark">Daily Time Tracker</h1>
          {location.state?.selectedEmployeeIds ? (
            <p className="text-sm text-primary font-semibold">Showing logs for {location.state.selectedEmployeeIds.length} selected employee(s)</p>
          ) : (
            <p className="text-sm text-subtext-light">Showing all entries for today</p>
          )}
        </div>
      </div>

      <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-sm overflow-x-auto">
        {isLoading ? (
          <div className="text-center py-8 text-subtext-light">Loading employee data...</div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-background-light">
              <tr>
                <th className="px-6 py-3">Employee Name</th>
                <th className="px-6 py-3">Department</th>
                <th className="px-6 py-3">Clock In</th>
                <th className="px-6 py-3">Clock Out</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employeesToDisplay.map((employee, index) => {
                // Simulating time and status data for each real employee
                const isDiscrepancy = index % 3 === 1;
                const isOnLeave = index % 4 === 2;
                const status = isOnLeave ? 'On Leave' : isDiscrepancy ? 'Discrepancy' : 'Completed';
                const clockIn = isOnLeave ? '--:--' : `09:${String(index).padStart(2, '0')} AM`;
                const clockOut = isOnLeave || status === 'Working' ? '--:--' : `05:${String(index * 2).padStart(2, '0')} PM`;

                return (
                  <tr key={employee.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-text-light dark:text-white">
                      {employee.firstName} {employee.lastName}
                    </td>
                    <td className="px-6 py-4">{employee.department}</td>
                    <td className={`px-6 py-4 ${isDiscrepancy ? 'text-red-500 font-semibold' : ''}`}>{clockIn}</td>
                    <td className={`px-6 py-4 ${isDiscrepancy ? 'text-red-500 font-semibold' : ''}`}>{clockOut}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(status)}`}>
                        {status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center space-x-2">
                      {isDiscrepancy ? (
                        <>
                          <button onClick={() => handleDiscrepancy(employee.id, 'Accepted')} className="text-green-600 hover:underline text-xs font-medium">Accept</button>
                          <button onClick={() => handleDiscrepancy(employee.id, 'Rejected')} className="text-red-600 hover:underline text-xs font-medium">Reject</button>
                        </>
                      ) : (
                        <span className="text-xs text-subtext-light">--</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TimeTrackerPage;