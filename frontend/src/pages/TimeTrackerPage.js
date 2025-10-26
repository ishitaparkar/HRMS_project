import React from 'react';

// Mock data for the time tracker
const timeTrackerData = [
  { id: 1, name: 'Dr. Anjali Rao', department: 'Computer Science', date: '2025-10-22', inTime: '09:05 AM', outTime: '05:00 PM', status: 'Present', discrepancy: false },
  { id: 2, name: 'Prof. Vikram Kumar', department: 'Mathematics', date: '2025-10-22', inTime: '09:35 AM', outTime: '05:10 PM', status: 'Discrepancy', discrepancy: true },
  { id: 3, name: 'Dr. Priya Mehta', department: 'Physics', date: '2025-10-22', inTime: '--:--', outTime: '--:--', status: 'Absent', discrepancy: false },
  { id: 4, name: 'Rajesh Singh', department: 'Administration', date: '2025-10-22', inTime: '08:50 AM', outTime: '04:55 PM', status: 'Present', discrepancy: false },
  { id: 5, name: 'Sunita Sharma', department: 'Administration', date: '2025-10-22', inTime: '09:02 AM', outTime: '04:30 PM', status: 'Discrepancy', discrepancy: true },
];

const TimeTrackerPage = () => {
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Present': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Present</span>;
      case 'Absent': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Absent</span>;
      case 'Discrepancy': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Discrepancy</span>;
      default: return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark">
      <main className="flex-1 p-8">
        <div className="max-w-full mx-auto">
          {/* Page Header */}
          <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
            <div>
              <h1 className="text-text-light dark:text-white text-3xl font-bold tracking-tight">Employee Time Management</h1>
              <p className="text-subtext-light dark:text-gray-400">View and manage staff in/out times across the university.</p>
            </div>
          </div>

          {/* === UPDATED FILTER BAR === */}
          <div className="bg-white dark:bg-card-dark p-4 rounded-xl shadow-sm mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search by Name */}
              <div className="relative">
                <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                <input className="form-input w-full pl-10 pr-4 py-2 border rounded-lg text-text-light dark:text-white bg-white dark:bg-gray-800 border-border-light dark:border-border-dark focus:ring-primary focus:border-primary" placeholder="Search by staff name..." type="text"/>
              </div>
              {/* Filter by Department */}
              <select className="form-select w-full px-4 py-2 border rounded-lg text-text-light dark:text-white bg-white dark:bg-gray-800 border-border-light dark:border-border-dark focus:ring-primary focus:border-primary">
                <option>Filter by Department</option>
                <option>Computer Science</option>
                <option>Mathematics</option>
              </select>
              {/* Filter by Date */}
              <input className="form-input w-full px-4 py-2 border rounded-lg text-text-light dark:text-white bg-white dark:bg-gray-800 border-border-light dark:border-border-dark focus:ring-primary focus:border-primary" type="date"/>
            </div>
          </div>

          {/* Main Data Table */}
          <div className="bg-white dark:bg-card-dark p-6 rounded-xl shadow-sm overflow-x-auto">
            <table className="w-full text-sm text-left text-subtext-light dark:text-gray-400">
              <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3">Employee</th>
                  <th scope="col" className="px-6 py-3">Department</th>
                  <th scope="col" className="px-6 py-3">Date</th>
                  <th scope="col" className="px-6 py-3 text-center">In Time</th>
                  <th scope="col" className="px-6 py-3 text-center">Out Time</th>
                  <th scope="col" className="px-6 py-3 text-center">Status</th>
                  <th scope="col" className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {timeTrackerData.map((entry) => (
                  <tr key={entry.id} className="bg-white border-b dark:bg-card-dark dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{entry.name}</td>
                    <td className="px-6 py-4">{entry.department}</td>
                    <td className="px-6 py-4">{entry.date}</td>
                    <td className={`px-6 py-4 text-center ${entry.discrepancy ? 'text-red-600 font-semibold' : ''}`}>{entry.inTime}</td>
                    <td className={`px-6 py-4 text-center ${entry.discrepancy ? 'text-red-600 font-semibold' : ''}`}>{entry.outTime}</td>
                    <td className="px-6 py-4 text-center">{getStatusBadge(entry.status)}</td>
                    <td className="px-6 py-4 text-center space-x-2">
                      <button className="text-primary hover:underline text-xs font-medium">Adjust Time</button>
                      {entry.status !== 'Absent' && <button className="text-red-600 hover:underline text-xs font-medium">Mark Absent</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TimeTrackerPage;