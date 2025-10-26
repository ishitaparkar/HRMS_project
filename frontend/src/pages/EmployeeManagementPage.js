import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const EmployeeManagementPage = () => {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/employees/');
      setEmployees(response.data);
    } catch (error) {
      console.error("There was an error fetching the employee data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // --- 1. ADD THE NEW DELETE HANDLER FUNCTION ---
  const handleDelete = async (employeeId) => {
    // Show a confirmation dialog before proceeding
    const isConfirmed = window.confirm('Are you sure you want to delete this employee? This action cannot be undone.');

    if (isConfirmed) {
      try {
        // Send a DELETE request to the backend
        await axios.delete(`http://127.0.0.1:8000/api/employees/${employeeId}/`);
        
        alert('Employee deleted successfully.');
        
        // To show the change immediately, we can either re-fetch the data
        // or filter the deleted employee out of the current state. Re-fetching is simplest.
        fetchEmployees();

      } catch (error) {
        console.error('Error deleting employee:', error);
        alert('Failed to delete employee.');
      }
    }
  };

  return (
    <>
      <header className="bg-card-light dark:bg-card-dark p-4 flex justify-between items-center border-b border-border-light dark:border-border-dark sticky top-0">
        <h1 className="text-2xl font-semibold text-text-light dark:text-text-dark">Staff & Faculty Directory</h1>
        <Link 
          to="/add-employee" 
          className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center hover:bg-blue-600"
        >
          <span className="material-icons mr-2 text-base">add</span> Add New Staff
        </Link>
      </header>

      <div className="p-8">
        <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-md">
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-subtext-light dark:text-subtext-dark">Loading staff data from the server...</p>
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-subtext-light dark:text-subtext-dark uppercase bg-background-light dark:bg-background-dark">
                <tr>
                  <th className="px-6 py-3">Staff ID</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Designation</th>
                  <th className="px-6 py-3">Department</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee.id} className="border-b border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-6 py-4">{employee.employeeId}</td>
                    <td className="px-6 py-4 font-medium">
                      <Link to={`/employees/${employee.id}`} className="hover:text-primary text-text-light dark:text-text-dark">
                        {employee.firstName} {employee.lastName}
                      </Link>
                    </td>
                    <td className="px-6 py-4">{employee.designation}</td>
                    <td className="px-6 py-4">{employee.department}</td>
                    <td className="px-6 py-4">{employee.personalEmail}</td>
                    {/* --- 2. ADD THE DELETE BUTTON --- */}
                    <td className="px-6 py-4 text-center space-x-4">
                      <Link to={`/employees/edit/${employee.id}`} className="text-primary hover:underline text-xs font-medium">
                        Edit
                      </Link>
                      <button onClick={() => handleDelete(employee.id)} className="text-red-500 hover:underline text-xs font-medium">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default EmployeeManagementPage;