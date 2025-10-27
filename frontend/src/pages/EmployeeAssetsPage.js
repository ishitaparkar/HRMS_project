import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmployeeAssetsPage = () => {
  const [allAssets, setAllAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for the status filter, defaulting to 'All'
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    const fetchAndPrepareAssets = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/employees/');
        let employeesData = response.data.results || response.data || [];

        const simulatedAssets = employeesData.map((employee, index) => ({
          id: `ASSET-${employee.id}`,
          assetId: `LP-00${123 + employee.id}`,
          type: ['Laptop', 'Monitor', 'Phone', 'ID Card'][index % 4],
          model: ['MacBook Pro 16"', 'Dell UltraSharp U27', 'iPhone 14 Pro', 'Faculty Access Card'][index % 4],
          status: ['Assigned', 'In Repair', 'In Stock', 'Retired'][index % 4],
          custodian: `${employee.firstName} ${employee.lastName}`,
          department: employee.department,
          date: employee.joiningDate,
        }));

        setAllAssets(simulatedAssets);
      } catch (error) {
        console.error("Error fetching data for assets:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAndPrepareAssets();
  }, []);

  // Filtered assets are now derived from the status filter state
  const filteredAssets = allAssets.filter(asset => {
    if (statusFilter === 'All') {
      return true; // Show all assets
    }
    return asset.status === statusFilter; // Show only assets with the selected status
  });

  const getStatusBadge = (status) => {
    const baseClasses = "px-2.5 py-0.5 text-xs font-medium rounded-full";
    switch (status) {
      case 'Assigned': return <span className={`${baseClasses} bg-green-100 text-green-800`}>Assigned</span>;
      case 'In Stock': return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>In Stock</span>;
      case 'In Repair': return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>In Repair</span>;
      case 'Retired': return <span className={`${baseClasses} bg-red-100 text-red-800`}>Retired</span>;
      default: return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{status}</span>;
    }
  };

  return (
    <div className="p-8">
      {/* === UPDATED HEADER SECTION === */}
      <div className="flex justify-between items-center mb-6">
          <div>
              <h1 className="text-3xl font-bold text-text-light dark:text-text-dark">Asset Management</h1>
              <p className="text-sm text-subtext-light">Filter and view all university assets.</p>
          </div>
          {/* The Status filter dropdown is now in the header */}
          <div className="w-full max-w-xs">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-card-light dark:bg-gray-800 border border-border-light dark:border-border-dark text-sm"
            >
              <option value="All">Filter by Status</option>
              <option value="Assigned">Assigned</option>
              <option value="In Stock">In Stock</option>
              <option value="In Repair">In Repair</option>
              <option value="Retired">Retired</option>
            </select>
          </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark">
        {isLoading ? (
            <div className="text-center py-10 text-subtext-light">Loading asset data...</div>
        ) : (
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase">
                    <tr>
                        <th className="px-6 py-3">Asset ID</th>
                        <th className="px-6 py-3">Type</th>
                        <th className="px-6 py-3">Model/Name</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">Current Custodian</th>
                        <th className="px-6 py-3">Department</th>
                        <th className="px-6 py-3">Purchase Date</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredAssets.map(asset => (
                        <tr key={asset.id} className="border-b hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium">{asset.id}</td>
                            <td className="px-6 py-4">{asset.type}</td>
                            <td className="px-6 py-4">{asset.model}</td>
                            <td className="px-6 py-4">{getStatusBadge(asset.status)}</td>
                            <td className="px-6 py-4 font-semibold text-text-light dark:text-white">{asset.custodian}</td>
                            <td className="px-6 py-4">{asset.department}</td>
                            <td className="px-6 py-4">{asset.date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )}
      </div>
    </div>
  );
};

export default EmployeeAssetsPage;