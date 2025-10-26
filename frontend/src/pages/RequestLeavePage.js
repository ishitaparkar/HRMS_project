import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RequestLeavePage = () => {
  const navigate = useNavigate();

  // State for the form data
  const [formData, setFormData] = useState({
    employee_id: '', // This will hold the NUMERIC database ID (e.g., 1, 2)
    leave_type: 'Casual Leave',
    start_date: '',
    end_date: '',
    reason: '',
  });
  
  // NEW: State to manage the user-typed Staff ID (e.g., 'CS101')
  const [staffIdInput, setStaffIdInput] = useState('');
  // NEW: State to display the fetched employee's name for confirmation
  const [fetchedEmployeeName, setFetchedEmployeeName] = useState('');
  const [isFetching, setIsFetching] = useState(false);

  // This function is called when the "Fetch Details" button is clicked
  const handleFetchEmployee = async () => {
    if (!staffIdInput) {
      alert('Please enter a Staff ID.');
      return;
    }
    setIsFetching(true);
    setFetchedEmployeeName(''); // Clear previous results
    setFormData(prev => ({ ...prev, employee_id: '' })); // Clear the stored numeric ID

    try {
      // We make an API call to a special endpoint to find the employee by their staffId
      // (Your friend will need to build this on the backend)
      // For now, we simulate by fetching the whole list and finding the match.
      const response = await axios.get(`http://127.0.0.1:8000/api/employees/`);
      const employee = response.data.find(emp => emp.employeeId === staffIdInput);

      if (employee) {
        setFetchedEmployeeName(`${employee.firstName} ${employee.lastName} - ${employee.department}`);
        // CRUCIAL: Store the numeric database ID for submission
        setFormData(prev => ({ ...prev, employee_id: employee.id }));
      } else {
        setFetchedEmployeeName('Employee not found.');
      }
    } catch (error) {
      console.error("Failed to fetch employee details:", error);
      setFetchedEmployeeName('Error fetching data.');
    } finally {
      setIsFetching(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.employee_id) {
      alert('Please fetch and confirm employee details before submitting.');
      return;
    }
    try {
      await axios.post('http://127.0.0.1:8000/api/leave-requests/', formData);
      alert('Leave request submitted successfully!');
      navigate('/leave-tracker');
    } catch (error) {
      console.error('Error submitting leave request:', error.response.data);
      alert(`Failed to submit request: ${JSON.stringify(error.response.data)}`);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <header className="bg-card-light dark:bg-card-dark p-4 border-b border-border-light"><h1 className="text-2xl font-semibold">Submit a New Leave Request</h1></header>
      <main className="flex-1 p-8">
        <div className="max-w-2xl mx-auto bg-card-light p-8 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* --- NEW, IMPROVED EMPLOYEE INPUT --- */}
            <div>
              <label htmlFor="staffIdInput" className="block text-sm font-medium text-subtext-light">Employee Staff ID</label>
              <div className="flex items-center space-x-2 mt-1">
                <input 
                  type="text" 
                  id="staffIdInput" 
                  value={staffIdInput} 
                  onChange={(e) => setStaffIdInput(e.target.value)} 
                  required 
                  className="w-full bg-background-light dark:bg-gray-800 border-border-light rounded-md" 
                  placeholder="e.g., CS101"
                />
                <button 
                  type="button" 
                  onClick={handleFetchEmployee}
                  disabled={isFetching}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 disabled:opacity-50"
                >
                  {isFetching ? 'Fetching...' : 'Fetch Details'}
                </button>
              </div>
              {/* This area will display the autofilled name */}
              {fetchedEmployeeName && (
                <div className="mt-2 p-2 bg-green-50 text-green-800 rounded-md text-sm">
                  {fetchedEmployeeName}
                </div>
              )}
            </div>

            {/* Rest of the form remains the same */}
            <div>
              <label htmlFor="leave_type" className="block text-sm font-medium text-subtext-light">Leave Type</label>
              <select name="leave_type" id="leave_type" value={formData.leave_type} onChange={handleChange} className="w-full bg-background-light dark:bg-gray-800 border-border-light rounded-md">
                <option>Casual Leave</option><option>Sick Leave</option><option>Earned Leave</option>
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="start_date">Start Date</label>
                <input type="date" name="start_date" id="start_date" value={formData.start_date} onChange={handleChange} required className="w-full bg-background-light dark:bg-gray-800 border-border-light rounded-md" />
              </div>
              <div>
                <label htmlFor="end_date">End Date</label>
                <input type="date" name="end_date" id="end_date" value={formData.end_date} onChange={handleChange} required className="w-full bg-background-light dark:bg-gray-800 border-border-light rounded-md" />
              </div>
            </div>
            <div>
              <label htmlFor="reason">Reason for Leave</label>
              <textarea name="reason" id="reason" rows="4" value={formData.reason} onChange={handleChange} className="w-full bg-background-light dark:bg-gray-800 border-border-light rounded-md" placeholder="Briefly explain..."></textarea>
            </div>
            <div className="flex justify-end gap-4 border-t border-border-light pt-6">
              <button type="button" onClick={() => navigate('/leave-tracker')}>Cancel</button>
              <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-600">Submit Request</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};
export default RequestLeavePage;