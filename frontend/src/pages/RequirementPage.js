import React from 'react';

// Mock data for existing requirements
const existingRequirements = [
  { id: 'REQ-001', position: 'Assistant Professor', department: 'Computer Science', date: '2025-10-15', status: 'Approved' },
  { id: 'REQ-002', position: 'Lab Technician', department: 'Physics', date: '2025-10-18', status: 'Pending' },
  { id: 'REQ-003', position: 'Admissions Counselor', department: 'Admissions Office', date: '2025-10-20', status: 'Rejected' },
  { id: 'REQ-004', position: 'Junior Librarian', department: 'Library', date: '2025-10-21', status: 'Pending' },
];

const RequirementPage = () => {

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <header className="bg-card-light dark:bg-card-dark p-4 border-b border-border-light dark:border-border-dark sticky top-0">
        <h1 className="text-2xl font-semibold text-text-light dark:text-text-dark">Raise Hiring Requirement</h1>
      </header>

      {/* Main content grid. It's a 3-column grid, with the form taking 1 part and the table taking 2. */}
      <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Column 1: The Form */}
        <div className="lg:col-span-1 bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-6">New Position Request Form</h3>
          <form className="space-y-4">
            <div>
              <label htmlFor="position" className="block text-sm font-medium text-subtext-light dark:text-subtext-dark mb-1">Position / Title</label>
              <input type="text" id="position" name="position" className="w-full bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark rounded-md shadow-sm" placeholder="e.g., Assistant Professor" />
            </div>

            <div>
              <label htmlFor="department" className="block text-sm font-medium text-subtext-light dark:text-subtext-dark mb-1">Department / Faculty</label>
              <select id="department" name="department" className="w-full bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark rounded-md shadow-sm appearance-none pr-8">
                <option>-- Select Department --</option>
                <option>Faculty of Engineering</option>
                <option>Faculty of Arts & Commerce</option>
                <option>Administration</option>
              </select>
            </div>

            <div>
              <label htmlFor="positions-count" className="block text-sm font-medium text-subtext-light dark:text-subtext-dark mb-1">Number of Positions</label>
              <input type="number" id="positions-count" name="positions" defaultValue="1" className="w-full bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark rounded-md shadow-sm" />
            </div>

            <div>
              <label htmlFor="justification" className="block text-sm font-medium text-subtext-light dark:text-subtext-dark mb-1">Justification</label>
              <textarea id="justification" name="justification" rows="4" className="w-full bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark rounded-md shadow-sm" placeholder="Briefly explain why this position is needed..."></textarea>
            </div>

            <div className="pt-2">
              <button type="submit" className="w-full bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600">
                Submit Request
              </button>
            </div>
          </form>
        </div>

        {/* Column 2: The Table of existing requirements */}
        <div className="lg:col-span-2 bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-4">Submitted Requirements</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-subtext-light dark:text-subtext-dark uppercase bg-background-light dark:bg-background-dark">
                <tr>
                  <th className="px-6 py-3">Request ID</th>
                  <th className="px-6 py-3">Position</th>
                  <th className="px-6 py-3">Department</th>
                  <th className="px-6 py-3">Date Submitted</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {existingRequirements.map((req) => (
                  <tr key={req.id} className="border-b border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-6 py-4 font-medium">{req.id}</td>
                    <td className="px-6 py-4">{req.position}</td>
                    <td className="px-6 py-4">{req.department}</td>
                    <td className="px-6 py-4">{req.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(req.status)}`}>
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default RequirementPage;