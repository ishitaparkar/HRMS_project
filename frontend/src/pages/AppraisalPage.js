import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // <-- 1. IMPORT THE LINK COMPONENT

// Mock data for employee appraisals
const appraisalData = [
  { id: 1, name: 'Dr. Anjali Rao', title: 'Professor', department: 'Computer Science', lastReview: '2024-11-05', status: 'Completed' },
  { id: 2, name: 'Prof. Vikram Kumar', title: 'Associate Professor', department: 'Mathematics', lastReview: '2024-11-10', status: 'In Progress' },
  { id: 3, name: 'Sunita Sharma', title: 'Admissions Coordinator', department: 'Admissions Office', lastReview: '2024-12-01', status: 'Not Started' },
  { id: 4, name: 'Rajesh Singh', title: 'Head Librarian', department: 'Library', lastReview: '2024-11-15', status: 'Completed' },
  { id: 5, name: 'Dr. Priya Mehta', title: 'Dean of Arts & Commerce', department: 'Administration', lastReview: '2024-12-05', status: 'Not Started' },
];

const AppraisalPage = () => {
  // State to manage the active tab ('Upcoming' or 'Completed')
  const [activeTab, setActiveTab] = useState('Upcoming');

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Completed</span>;
      case 'In Progress': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">In Progress</span>;
      case 'Not Started': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Not Started</span>;
      default: return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark">
      <header className="bg-card-light dark:bg-card-dark p-4 border-b border-border-light dark:border-border-dark flex-shrink-0">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-text-light dark:text-text-dark">Performance Appraisals</h1>
            <p className="text-sm text-subtext-light">Annual Review Cycle: 2025</p>
          </div>
          <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center hover:bg-blue-600">
            <span className="material-icons mr-2 text-base">add_circle</span> Start New Cycle
          </button>
        </div>
      </header>

      <main className="flex-1 p-8">
        {/* Tab Navigation */}
        <div className="border-b border-border-light dark:border-border-dark mb-6">
          <nav className="flex space-x-4">
            <button 
              onClick={() => setActiveTab('Upcoming')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'Upcoming' ? 'border-primary text-primary' : 'border-transparent text-subtext-light hover:border-gray-300'}`}
            >
              Upcoming Reviews
            </button>
            <button 
              onClick={() => setActiveTab('Completed')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'Completed' ? 'border-primary text-primary' : 'border-transparent text-subtext-light hover:border-gray-300'}`}
            >
              Completed Reviews
            </button>
          </nav>
        </div>

        {/* Main Data Table */}
        <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm text-left text-subtext-light dark:text-gray-400">
            <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3">Employee</th>
                <th scope="col" className="px-6 py-3">Title</th>
                <th scope="col" className="px-6 py-3">Department</th>
                <th scope="col" className="px-6 py-3">Last Review Date</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {appraisalData.map((employee) => (
                <tr key={employee.id} className="bg-white border-b dark:bg-card-dark dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{employee.name}</td>
                  <td className="px-6 py-4">{employee.title}</td>
                  <td className="px-6 py-4">{employee.department}</td>
                  <td className="px-6 py-4">{employee.lastReview}</td>
                  <td className="px-6 py-4">{getStatusBadge(employee.status)}</td>
                  {/* === 2. THIS SECTION IS UPDATED === */}
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
        </div>
      </main>
    </div>
  );
};

export default AppraisalPage;