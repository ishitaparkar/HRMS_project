import React from 'react';

const DashboardPage = () => {
  return (
    <>
      <header className="bg-card-light dark:bg-card-dark p-4 border-b border-border-light dark:border-border-dark sticky top-0">
        <h1 className="text-2xl font-semibold text-text-light dark:text-text-dark">Admin Dashboard</h1>
      </header>

      <div className="p-8">
        {/* Stat Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard icon="groups" title="Total Staff & Faculty" value="1,250" />
          <StatCard icon="work" title="Vacant Positions" value="15" />
          <StatCard icon="pending_actions" title="Pending Leave Requests" value="8" />
          <StatCard icon="event" title="Staff on Leave Today" value="12" />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <RecentActivity />
          </div>
          <div>
            <QuickActions />
          </div>
        </div>
      </div>
    </>
  );
};

// Helper components for the dashboard (can be moved to their own files later)
const StatCard = ({ icon, title, value }) => (
  <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-md flex items-center space-x-4">
    <div className="bg-primary/10 p-3 rounded-full">
      <span className="material-icons text-primary text-3xl">{icon}</span>
    </div>
    <div>
      <p className="text-sm font-medium text-subtext-light dark:text-subtext-dark">{title}</p>
      <p className="text-2xl font-bold text-text-light dark:text-text-dark">{value}</p>
    </div>
  </div>
);

const RecentActivity = () => (
  <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-md">
    <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-4">Recent Onboarding Activity</h3>
    <ul className="space-y-4">
      <li className="flex items-center space-x-3">
        <span className="material-icons text-green-500">check_circle</span>
        <p className="text-sm text-subtext-light dark:text-subtext-dark"><span className="font-semibold text-text-light dark:text-text-dark">Dr. Anjali Rao</span> has completed onboarding for the <span className="font-semibold text-text-light dark:text-text-dark">Computer Science</span> department.</p>
      </li>
      <li className="flex items-center space-x-3">
        <span className="material-icons text-green-500">check_circle</span>
        <p className="text-sm text-subtext-light dark:text-subtext-dark"><span className="font-semibold text-text-light dark:text-text-dark">Mr. Vikram Singh</span> has completed onboarding for the <span className="font-semibold text-text-light dark:text-text-dark">Library</span>.</p>
      </li>
      <li className="flex items-center space-x-3">
        <span className="material-icons text-orange-400">pending</span>
        <p className="text-sm text-subtext-light dark:text-subtext-dark"><span className="font-semibold text-text-light dark:text-text-dark">Mrs. Sunita Sharma's</span> document verification is pending.</p>
      </li>
    </ul>
  </div>
);

const QuickActions = () => (
    <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-4">Quick Actions</h3>
        <div className="space-y-3">
            <button className="w-full flex items-center justify-center p-3 text-sm font-medium text-white bg-primary rounded-lg hover:bg-blue-600">
                <span className="material-icons mr-2">post_add</span> Post a Vacancy
            </button>
            <button className="w-full flex items-center justify-center p-3 text-sm font-medium text-subtext-light dark:text-subtext-dark bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
                <span className="material-icons mr-2">event_available</span> Approve Leave
            </button>
            <button className="w-full flex items-center justify-center p-3 text-sm font-medium text-subtext-light dark:text-subtext-dark bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
                <span className="material-icons mr-2">assessment</span> Generate Payroll Report
            </button>
        </div>
    </div>
);


export default DashboardPage;