import React, { useState } from 'react';

// Mock data for resignation requests
const resignationRequests = [
  { id: 1, name: 'Amit Desai', title: 'Lecturer', department: 'Engineering', resignationDate: '2025-10-20', lastWorkingDay: '2025-11-20', status: 'Pending' },
  { id: 2, name: 'Neha Gupta', title: 'Assistant Professor', department: 'Commerce', resignationDate: '2025-09-15', lastWorkingDay: '2025-10-15', status: 'Approved' },
  { id: 3, name: 'Dr. Michael Chen', title: 'Associate Professor', department: 'Physics', resignationDate: '2025-10-18', lastWorkingDay: '2025-11-18', status: 'Pending' },
];

const ResignationPage = () => {
  // State to manage the active tab ('Pending', 'Approved', 'All')
  const [activeTab, setActiveTab] = useState('Pending');

  // Filter the data based on the active tab
  const filteredRequests = resignationRequests.filter(req => {
    if (activeTab === 'All') return true;
    return req.status === activeTab;
  });

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark">
      <header className="bg-card-light dark:bg-card-dark p-4 border-b border-border-light dark:border-border-dark flex-shrink-0">
        <h1 className="text-2xl font-semibold text-text-light dark:text-text-dark">Resignation Management</h1>
      </header>

      <main className="flex-1 p-8">
        {/* Tab Navigation */}
        <div className="border-b border-border-light dark:border-border-dark mb-6">
          <nav className="flex space-x-4">
            <TabButton title="Pending" activeTab={activeTab} setActiveTab={setActiveTab} />
            <TabButton title="Approved" activeTab={activeTab} setActiveTab={setActiveTab} />
            <TabButton title="All" activeTab={activeTab} setActiveTab={setActiveTab} />
          </nav>
        </div>

        {/* Resignation Cards Grid */}
        {filteredRequests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRequests.map((request) => (
              <ResignationCard key={request.id} request={request} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-subtext-light">No resignation requests in this category.</p>
          </div>
        )}
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

// Helper component for a single Resignation Card
const ResignationCard = ({ request }) => (
  <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-md flex flex-col">
    <div className="flex-grow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="font-bold text-lg text-text-light dark:text-text-dark">{request.name}</p>
          <p className="text-sm text-subtext-light">{request.title}, {request.department}</p>
        </div>
        {request.status === 'Pending' && <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>}
        {request.status === 'Approved' && <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Approved</span>}
      </div>
      <div className="space-y-2 text-sm">
        <InfoRow icon="calendar_today" label="Resignation Date" value={request.resignationDate} />
        <InfoRow icon="event_busy" label="Last Working Day" value={request.lastWorkingDay} />
      </div>
    </div>
    <div className="border-t border-border-light dark:border-border-dark mt-4 pt-4 flex justify-end space-x-2">
      <button className="text-primary hover:underline text-xs font-medium">View Details</button>
      {request.status === 'Pending' && (
        <button className="bg-primary text-white px-3 py-1 rounded-md text-xs font-medium hover:bg-blue-600">
          Approve
        </button>
      )}
    </div>
  </div>
);

// Helper component for information rows in the card
const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center">
    <span className="material-icons text-subtext-light text-base mr-2">{icon}</span>
    <span className="text-subtext-light mr-2">{label}:</span>
    <span className="font-medium text-text-light dark:text-text-dark">{value}</span>
  </div>
);

export default ResignationPage;