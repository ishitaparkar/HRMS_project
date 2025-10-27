import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EmployeeManagementPage = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for selection
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  // This is the function that fetches ALL employees. No pagination for now.
  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      // We will fetch all employees at once for simplicity, as pagination was causing issues.
      // We will re-add pagination correctly later if needed.
      const response = await axios.get('http://127.0.0.1:8000/api/employees/');
      
      // Ensure the response is an array before setting it
      if (Array.isArray(response.data)) {
        setEmployees(response.data);
      } else if (response.data && Array.isArray(response.data.results)) {
        // Handle paginated response just in case the backend has it
        setEmployees(response.data.results);
      } else {
        setEmployees([]); // Default to empty array if data is not in expected format
      }

    } catch (error) {
      console.error("Error fetching employees:", error);
      setEmployees([]); // Set to empty array on error to prevent crashes
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Handlers for checkbox selection
  const handleSelectAll = (e) => {
    if (e.target.checked && Array.isArray(employees)) {
      setSelectedEmployees(employees.map(emp => emp.id));
    } else {
      setSelectedEmployees([]);
    }
  };

  const handleSelectOne = (e, id) => {
    if (e.target.checked) {
      setSelectedEmployees([...selectedEmployees, id]);
    } else {
      setSelectedEmployees(selectedEmployees.filter(empId => empId !== id));
    }
  };

  // Handler for the "Run Payroll" action
  const handleRunPayroll = () => {
    if (selectedEmployees.length === 0) {
      alert("Please select at least one employee to run payroll.");
      return;
    }
    console.log("Running payroll for employee IDs:", selectedEmployees);
    navigate('/run-payroll');
  };
  
  // Handler for deleting an employee
  const handleDelete = async (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/employees/${employeeId}/`);
            alert('Employee deleted successfully.');
            fetchEmployees(); // Re-fetch the list to show the change
        } catch (error) {
            console.error('Error deleting employee:', error);
            alert('Failed to delete employee.');
        }
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-text-light dark:text-text-dark">Staff & Faculty Directory</h1>
          <p className="text-sm text-subtext-light">{selectedEmployees.length} employee(s) selected</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleRunPayroll}
            disabled={selectedEmployees.length === 0}
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center hover:bg-blue-600 disabled:bg-gray-400"
          >
            <span className="material-icons mr-2 text-base">play_arrow</span> Run Payroll
          </button>
          <Link to="/add-employee" className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium">Add New Staff</Link>
        </div>
      </div>

      <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-sm overflow-x-auto">
        {isLoading ? (
          <div className="text-center py-8">Loading staff data from the server...</div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-background-light">
              <tr>
                <th className="p-4">
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    onChange={handleSelectAll}
                    checked={Array.isArray(employees) && employees.length > 0 && selectedEmployees.length === employees.length}
                  />
                </th>
                <th className="px-6 py-3">Staff ID</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Designation</th>
                <th className="px-6 py-3">Department</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(employees) && employees.map((employee) => (
                <tr key={employee.id} className="border-b hover:bg-gray-50">
                  <td className="w-4 p-4">
                    <input
                      type="checkbox"
                      className="form-checkbox"
                      onChange={(e) => handleSelectOne(e, employee.id)}
                      checked={selectedEmployees.includes(employee.id)}
                    />
                  </td>
                  <td className="px-6 py-4">{employee.employeeId}</td>
                  <td className="px-6 py-4 font-medium">
                    <Link to={`/employees/${employee.id}`} className="hover:text-primary">{employee.firstName} {employee.lastName}</Link>
                  </td>
                  <td className="px-6 py-4">{employee.designation}</td>
                  <td className="px-6 py-4">{employee.department}</td>
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
  );
};

export default EmployeeManagementPage;