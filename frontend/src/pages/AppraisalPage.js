import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AppraisalPage = () => {
  const [allEmployees, setAllEmployees] = useState([]); // Will hold ALL employees from the API
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Upcoming');

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
        console.error("Error fetching employees for appraisals:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllEmployees();
  }, []);

  // 2. Simulate appraisal status for each real employee
  const appraisalData = allEmployees.map((employee, index) => {
    const statuses = ['Completed', 'In Progress', 'Not Started'];
    const lastReviewDates = ['2024-11-05', '2024-11-10', '2024-12-01'];
    return {
      ...employee, // Include all original employee data from the database
      status: statuses[index % statuses.length],
      lastReview: lastReviewDates[index % lastReviewDates.length],
    };
  });

  // 3. Filter the live, augmented data based on the active tab
  const filteredAppraisals = appraisalData.filter(employee => {
    if (activeTab === 'Upcoming') {
      return employee.status === 'In Progress' || employee.status === 'Not Started';
    }
    if (activeTab === 'Completed') {
      return employee.status === 'Completed';
    }
    return false;
  });

  // Helper function for status badges
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Completed</span>;
      case 'In Progress': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">In Progress</span>;
      case 'Not Started': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Not Started</span>;
      default: return null;
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold text-text-light dark:text-text-dark">Performance Appraisals</h1>
            <p className="text-sm text-subtext-light">Annual Review Cycle: 2025</p>
        </div>
        <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center hover:bg-blue-600">
          <span className="material-icons mr-2 text-base">add_circle</span> Start New Cycle
        </button>
      </div>

      <div className="border-b border-border-light dark:border-border-dark mb-6">
        <nav className="flex space-x-4">
          <button onClick={() => setActiveTab('Upcoming')} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'Upcoming' ? 'border-primary text-primary' : 'border-transparent text-subtext-light hover:border-gray-300'}`}>
            Upcoming Reviews
          </button>
          <button onClick={() => setActiveTab('Completed')} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'Completed' ? 'border-primary text-primary' : 'border-transparent text-subtext-light hover:border-gray-300'}`}>
            Completed Reviews
          </button>
        </nav>
      </div>

      <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-sm overflow-x-auto">
        {isLoading ? (
          <div className="text-center py-8 text-subtext-light">Loading employee data...</div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3">Employee</th>
                <th scope="col" className="px-6 py-3">Designation</th>
                <th scope="col" className="px-6 py-3">Department</th>
                <th scope="col" className="px-6 py-3">Last Review Date</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppraisals.map((employee) => (
                <tr key={employee.id} className="bg-white border-b dark:bg-card-dark dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {employee.firstName} {employee.lastName}
                  </td>
                  <td className="px-6 py-4">{employee.designation}</td>
                  <td className="px-6 py-4">{employee.department}</td>
                  <td className="px-6 py-4">{employee.lastReview}</td>
                  <td className="px-6 py-4">{getStatusBadge(employee.status)}</td>
                  <td className="px-6 py-4 text-center">
                    {employee.status === 'Completed' ? (
                      <Link to={`/appraisal/report/${employee.id}`} className="text-primary hover:underline text-xs font-medium">
                        View Report
                      </Link>
                    ) : (
                      <Link to={`/appraisal/start/${employee.id}`} className="text-primary hover:underline text-xs font-medium">
                        Start Review
                      </Link>
                    )}
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

export default AppraisalPage;