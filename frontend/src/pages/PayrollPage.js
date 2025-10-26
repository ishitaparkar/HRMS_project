import React, { useState } from 'react';

// Mock data for a payroll run for a specific month
const payrollData = [
  { id: 1, name: 'Dr. Anjali Rao', staffId: 'TCS101', department: 'Computer Science', grossSalary: '₹1,50,000', deductions: '₹25,000', netSalary: '₹1,25,000', status: 'Paid' },
  { id: 2, name: 'Prof. Vikram Kumar', staffId: 'MAT102', department: 'Mathematics', grossSalary: '₹1,20,000', deductions: '₹20,000', netSalary: '₹1,00,000', status: 'Paid' },
  { id: 3, name: 'Sunita Sharma', staffId: 'ADM003', department: 'Admissions Office', grossSalary: '₹60,000', deductions: '₹8,000', netSalary: '₹52,000', status: 'Paid' },
  { id: 4, name: 'Rajesh Singh', staffId: 'LIB004', department: 'Library', grossSalary: '₹75,000', deductions: '₹12,000', netSalary: '₹63,000', status: 'Pending' },
  { id: 5, name: 'Amit Desai', staffId: 'ENG205', department: 'Engineering', grossSalary: '₹90,000', deductions: '₹15,000', netSalary: '₹75,000', status: 'Paid' },
];

const PayrollPage = () => {
  // State to manage the active payroll period (month tab)
  const [activeTab, setActiveTab] = useState('October 2025');

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Paid': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Paid</span>;
      case 'Pending': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>;
      case 'Failed': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Failed</span>;
      default: return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark">
      <header className="bg-card-light dark:bg-card-dark p-4 border-b border-border-light dark:border-border-dark flex-shrink-0">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-text-light dark:text-text-dark">Employee Payroll</h1>
            <p className="text-sm text-subtext-light">Manage and process monthly salary payments.</p>
          </div>
          <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center hover:bg-blue-600">
            <span className="material-icons mr-2 text-base">play_arrow</span> Run New Payroll
          </button>
        </div>
      </header>

      <main className="flex-1 p-8">
        {/* Tab Navigation for Payroll Months */}
        <div className="border-b border-border-light dark:border-border-dark mb-6">
          <nav className="flex space-x-4">
            <TabButton title="October 2025" activeTab={activeTab} setActiveTab={setActiveTab} />
            <TabButton title="September 2025" activeTab={activeTab} setActiveTab={setActiveTab} />
            <TabButton title="August 2025" activeTab={activeTab} setActiveTab={setActiveTab} />
          </nav>
        </div>

        {/* Main Payroll Table */}
        <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm text-left text-subtext-light dark:text-gray-400">
            <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3">Employee Name</th>
                <th scope="col" className="px-6 py-3">Staff ID</th>
                <th scope="col" className="px-6 py-3">Department</th>
                <th scope="col" className="px-6 py-3">Gross Salary</th>
                <th scope="col" className="px-6 py-3">Deductions</th>
                <th scope="col" className="px-6 py-3">Net Salary</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {payrollData.map((employee) => (
                <tr key={employee.id} className="bg-white border-b dark:bg-card-dark dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{employee.name}</td>
                  <td className="px-6 py-4">{employee.staffId}</td>
                  <td className="px-6 py-4">{employee.department}</td>
                  <td className="px-6 py-4">{employee.grossSalary}</td>
                  <td className="px-6 py-4">{employee.deductions}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">{employee.netSalary}</td>
                  <td className="px-6 py-4">{getStatusBadge(employee.status)}</td>
                  <td className="px-6 py-4 text-center">
                    <button className="text-primary hover:underline text-xs font-medium">View Payslip</button>
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

// Helper component for Tab Buttons
const TabButton = ({ title, activeTab, setActiveTab }) => (
  <button 
    onClick={() => setActiveTab(title)}
    className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === title ? 'border-primary text-primary' : 'border-transparent text-subtext-light hover:border-gray-300'}`}
  >
    {title}
  </button>
);

export default PayrollPage;