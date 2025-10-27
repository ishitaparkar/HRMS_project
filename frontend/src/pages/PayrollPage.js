import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const PayrollPage = () => {
  const [payrollData, setPayrollData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('October 2025');

  // 1. Fetch ALL employees from the backend to use as the base for the payroll
  useEffect(() => {
    const fetchAndPreparePayroll = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/employees/');
        let employeesData = response.data.results || response.data || [];

        // 2. Simulate payroll data for each real employee
        const simulatedPayroll = employeesData.map((employee, index) => {
          const grossSalary = employee.basicSalary ? parseFloat(employee.basicSalary) : 80000 + (employee.id * 5000);
          const deductions = grossSalary * 0.15; // Simulate 15% deductions
          const netSalary = grossSalary - deductions;
          const statuses = ['Paid', 'Paid', 'Paid', 'Pending'];
          
          return {
            ...employee, // Include all original employee data
            grossSalary: `₹${grossSalary.toLocaleString('en-IN')}`,
            deductions: `₹${deductions.toLocaleString('en-IN')}`,
            netSalary: `₹${netSalary.toLocaleString('en-IN')}`,
            status: statuses[index % statuses.length],
          };
        });

        setPayrollData(simulatedPayroll);
      } catch (error) {
        console.error("Error fetching data for payroll:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAndPreparePayroll();
  }, []); // Runs once on page load

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Paid': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Paid</span>;
      case 'Pending': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>;
      case 'Failed': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Failed</span>;
      default: return null;
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-text-light dark:text-text-dark">Employee Payroll</h1>
            <p className="text-sm text-subtext-light">Manage and process monthly salary payments.</p>
          </div>
          <Link 
            to="/run-payroll"
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center hover:bg-blue-600"
          >
            <span className="material-icons mr-2 text-base">play_arrow</span> Run New Payroll
          </Link>
      </div>

      <div className="border-b border-border-light dark:border-border-dark mb-6">
        <nav className="flex space-x-4">
          <TabButton title="October 2025" activeTab={activeTab} setActiveTab={setActiveTab} />
          <TabButton title="September 2025" activeTab={activeTab} setActiveTab={setActiveTab} />
          <TabButton title="August 2025" activeTab={activeTab} setActiveTab={setActiveTab} />
        </nav>
      </div>

      <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-sm overflow-x-auto">
        {isLoading ? (
          <div className="text-center py-8 text-subtext-light">Loading payroll data...</div>
        ) : (
          <table className="w-full text-sm text-left">
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
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {employee.firstName} {employee.lastName}
                  </td>
                  <td className="px-6 py-4">{employee.employeeId}</td>
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
        )}
      </div>
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