import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // <-- 1. IMPORT THE LINK COMPONENT
import axios from 'axios';

const LeaveTrackerPage = () => {
  // State to hold the list of leave requests, fetched from the API
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch all leave requests from the backend
  const fetchLeaveRequests = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/leave-requests/');
      console.log("Leave requests fetched from backend:", response.data);
      setLeaveRequests(response.data);
    } catch (error) {
      console.error("Error fetching leave requests:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect hook to call the fetch function once when the component first loads
  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  // This function is called when an "Approve" or "Deny" button is clicked
  const handleStatusUpdate = async (requestId, newStatus) => {
    console.log(`Sending update for request ${requestId} to set status to ${newStatus}`);
    try {
      await axios.patch(`http://127.0.0.1:8000/api/leave-requests/${requestId}/`, {
        status: newStatus
      });
      fetchLeaveRequests();
    } catch (error) {
      console.error(`Error updating status for request ${requestId}:`, error);
      alert('Failed to update the leave request status.');
    }
  };
  
  // Helper function to get the correct CSS class for the status badge
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Denied': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <header className="bg-card-light dark:bg-card-dark p-4 flex justify-between items-center border-b border-border-light dark:border-border-dark sticky top-0">
        <h1 className="text-2xl font-semibold text-text-light dark:text-text-dark">Leave Management</h1>
        {/* === 2. THIS BUTTON IS NOW A LINK === */}
        <Link 
          to="/request-leave"
          className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center hover:bg-blue-600"
        >
          <span className="material-icons mr-2 text-base">add</span> Request Leave
        </Link>
      </header>

      <main className="flex-1 p-8">
        <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-md">
          {isLoading ? (
            <div className="text-center py-8 text-subtext-light">Loading leave requests from the server...</div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-subtext-light dark:text-subtext-dark uppercase bg-background-light dark:bg-background-dark">
                <tr>
                  <th className="px-6 py-3">Employee Name</th>
                  <th className="px-6 py-3">Department</th>
                  <th className="px-6 py-3">Leave Type</th>
                  <th className="px-6 py-3">Start Date</th>
                  <th className="px-6 py-3">End Date</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leaveRequests.map((request) => (
                  <tr key={request.id} className="border-b border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-6 py-4 font-medium text-text-light dark:text-text-dark">
                      {request.employee.firstName} {request.employee.lastName}
                    </td>
                    <td className="px-6 py-4">{request.employee.department}</td>
                    <td className="px-6 py-4">{request.leave_type}</td>
                    <td className="px-6 py-4">{request.start_date}</td>
                    <td className="px-6 py-4">{request.end_date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center space-x-2">
                      {request.status === 'Pending' ? (
                        <>
                          <button 
                            onClick={() => handleStatusUpdate(request.id, 'Approved')}
                            className="text-green-600 hover:text-green-800 font-semibold"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(request.id, 'Denied')}
                            className="text-red-600 hover:text-red-800 font-semibold"
                          >
                            Deny
                          </button>
                        </>
                      ) : (
                        <span className="text-xs text-subtext-light">No actions available</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </>
  );
};

export default LeaveTrackerPage;