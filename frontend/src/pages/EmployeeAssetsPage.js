import React from 'react';

// Mock data for assets assigned to university staff, localized for context
const assetsData = [
  { id: 'LP-00123', type: 'Laptop', model: 'MacBook Pro 16"', status: 'Assigned', custodian: 'Dr. Anjali Rao', department: 'Computer Science', date: '2023-01-15' },
  { id: 'MN-00456', type: 'Monitor', model: 'Dell UltraSharp U27', status: 'In Stock', custodian: '-', department: 'IT Services', date: '2022-11-20' },
  { id: 'PH-00789', type: 'Phone', model: 'iPhone 14 Pro', status: 'In Repair', custodian: 'Vikram Singh', department: 'Library', date: '2022-09-01' },
  { id: 'LP-00124', type: 'Laptop', model: 'Dell XPS 15', status: 'Assigned', custodian: 'Sunita Sharma', department: 'Admissions Office', date: '2023-03-10' },
  { id: 'LP-00098', type: 'Laptop', model: 'Lenovo ThinkPad X1', status: 'Retired', custodian: '-', department: 'IT Services', date: '2020-05-20' },
];

const EmployeeAssetsPage = () => {
  
  // Helper function to render status badges with appropriate colors
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
    <div className="flex flex-col h-full">
        <header className="bg-card-light dark:bg-card-dark p-4 border-b border-border-light dark:border-border-dark flex-shrink-0">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-semibold text-text-light dark:text-text-dark">Asset Management</h1>
                    <p className="text-sm text-subtext-light">Overview of all university assets assigned to staff.</p>
                </div>
                <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center hover:bg-blue-600">
                    <span className="material-icons mr-2 text-base">add</span> Add New Asset
                </button>
            </div>
        </header>

        <div className="p-8">
            {/* Search and Filter Bar */}
            <div className="mb-6 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-grow w-full">
                    <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-subtext-light">search</span>
                    <input type="text" placeholder="Search by asset ID, type, or staff name..." className="w-full pl-10 pr-4 py-2 rounded-lg bg-card-light dark:bg-background-dark border border-border-light dark:border-border-dark" />
                </div>
                <div className="flex gap-2 flex-wrap">
                    <button className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg bg-card-light dark:bg-gray-800 border border-border-light dark:border-border-dark">Status <span className="material-icons text-base">expand_more</span></button>
                    <button className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg bg-card-light dark:bg-gray-800 border border-border-light dark:border-border-dark">Asset Type <span className="material-icons text-base">expand_more</span></button>
                    <button className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg bg-card-light dark:bg-gray-800 border border-border-light dark:border-border-dark">Department <span className="material-icons text-base">expand_more</span></button>
                </div>
            </div>

            {/* Main Asset Table */}
            <div className="overflow-x-auto rounded-lg border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark">
                <table className="w-full text-left text-sm text-text-light dark:text-gray-300">
                    <thead className="bg-gray-50 dark:bg-gray-900/50 text-xs uppercase text-gray-700 dark:text-gray-400">
                        <tr>
                            <th className="p-4"><input className="form-checkbox rounded text-primary focus:ring-primary/50" type="checkbox" /></th>
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
                        {assetsData.map(asset => (
                            <tr key={asset.id} className="border-b dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                <td className="w-4 p-4"><input className="form-checkbox rounded text-primary focus:ring-primary/50" type="checkbox" /></td>
                                <td className="px-6 py-4 font-medium">{asset.id}</td>
                                <td className="px-6 py-4">{asset.type}</td>
                                <td className="px-6 py-4">{asset.model}</td>
                                <td className="px-6 py-4">{getStatusBadge(asset.status)}</td>
                                <td className="px-6 py-4">{asset.custodian}</td>
                                <td className="px-6 py-4">{asset.department}</td>
                                <td className="px-6 py-4">{asset.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};

export default EmployeeAssetsPage;